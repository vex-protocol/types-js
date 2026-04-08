/**
 * Generates asyncapi.json from Zod schemas for the WebSocket protocol.
 *
 * Run: npx tsx scripts/generate-asyncapi.ts
 */
import { writeFileSync } from "node:fs";

import { z } from "zod/v4";

// Import WS message schemas
const {
    baseMsg,
    challMsg,
    errMsg,
    mailWS,
    notifyMsg,
    receiptMsg,
    resourceMsg,
    respMsg,
    successMsg,
} = await import("../src/schemas/index.js");

// ── Convert each schema to JSON Schema ──────────────────────────────────────

function toJsonSchema(schema: z.ZodType, description?: string) {
    const result = z.toJSONSchema(schema, {
        unrepresentable: "any",
    });
    if (description) {
        (result as Record<string, unknown>).description = description;
    }
    return result;
}

// ── Define message types ────────────────────────────────────────────────────

interface MsgDef {
    name: string;
    title: string;
    direction: "receive" | "send";
    schema: z.ZodType;
    description: string;
}

const messages: MsgDef[] = [
    // Client → Server
    {
        name: "auth",
        title: "Authentication",
        direction: "send",
        schema: z.object({
            token: z.string().describe("JWT Bearer token"),
            type: z.literal("auth"),
        }),
        description: "Initial authentication message with JWT token",
    },
    {
        name: "response",
        title: "Auth response",
        direction: "send",
        schema: respMsg,
        description: "Signed challenge response for device authentication",
    },
    {
        name: "resource",
        title: "Resource operation",
        direction: "send",
        schema: resourceMsg,
        description: "CRUD operation on a resource (mail, preKeys, etc.)",
    },
    {
        name: "receipt",
        title: "Mail receipt",
        direction: "send",
        schema: receiptMsg,
        description: "Acknowledge receipt of a mail message",
    },
    {
        name: "ping",
        title: "Keepalive ping",
        direction: "send",
        schema: z.object({ type: z.literal("ping") }),
        description: "Client keepalive ping",
    },

    // Server → Client
    {
        name: "challenge",
        title: "Auth challenge",
        direction: "receive",
        schema: challMsg,
        description: "Server sends a challenge nonce for device authentication",
    },
    {
        name: "authorized",
        title: "Auth success",
        direction: "receive",
        schema: z.object({ type: z.literal("authorized") }),
        description: "Server confirms authentication succeeded",
    },
    {
        name: "success",
        title: "Operation success",
        direction: "receive",
        schema: successMsg,
        description: "Server response to a successful resource operation",
    },
    {
        name: "error",
        title: "Operation error",
        direction: "receive",
        schema: errMsg,
        description: "Server response to a failed operation",
    },
    {
        name: "notify",
        title: "Server notification",
        direction: "receive",
        schema: notifyMsg,
        description:
            "Server push notification (new mail, server change, permission update)",
    },
    {
        name: "pong",
        title: "Keepalive pong",
        direction: "receive",
        schema: z.object({ type: z.literal("pong") }),
        description: "Server keepalive pong response",
    },
];

// ── Build AsyncAPI 3.0 document ─────────────────────────────────────────────

const messageComponents: Record<string, object> = {};
const channelMessages: Record<string, { $ref: string }> = {};
const operations: Record<string, object> = {};

for (const msg of messages) {
    const key = msg.name.charAt(0).toUpperCase() + msg.name.slice(1);

    messageComponents[key] = {
        name: msg.name,
        title: msg.title,
        contentType: "application/msgpack",
        payload: toJsonSchema(msg.schema, msg.description),
    };

    channelMessages[msg.name] = {
        $ref: `#/components/messages/${key}`,
    };

    const opName =
        msg.direction === "send" ? msg.name : `receive${key}`;
    operations[opName] = {
        action: msg.direction,
        channel: { $ref: "#/channels/chat" },
        summary: msg.title,
        messages: [{ $ref: `#/channels/chat/messages/${msg.name}` }],
    };
}

const doc = {
    asyncapi: "3.0.0",
    info: {
        title: "Vex Protocol",
        version: "1.0.0",
        description:
            "Real-time encrypted chat protocol for vex.wtf.\nMessages are serialized using msgpack over WebSocket.",
        license: { name: "AGPL-3.0-or-later" },
    },
    servers: {
        production: {
            host: "api.vex.wtf",
            protocol: "wss",
            description: "Production WebSocket endpoint",
            security: [{ $ref: "#/components/securitySchemes/bearerAuth" }],
        },
    },
    channels: {
        chat: {
            address: "/ws",
            title: "Main WebSocket channel",
            description:
                "Bidirectional channel for all real-time communication.\nMessages are encoded as msgpack binary frames.",
            messages: channelMessages,
            bindings: {
                ws: {
                    method: "GET",
                    headers: {
                        type: "object",
                        properties: {
                            Authorization: {
                                type: "string",
                                description: "Bearer token",
                            },
                        },
                    },
                },
            },
        },
    },
    operations,
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        messages: messageComponents,
    },
};

writeFileSync("asyncapi.json", JSON.stringify(doc, null, 2));
console.log(
    `Generated asyncapi.json with ${messages.length} message types (${messages.filter((m) => m.direction === "send").length} send, ${messages.filter((m) => m.direction === "receive").length} receive)`,
);
