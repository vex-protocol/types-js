/**
 * Generates openapi.json from Zod schemas.
 *
 * Run: tsx scripts/generate-openapi.ts
 */
import { writeFileSync } from "node:fs";

import { z } from "zod/v4";
import {
    extendZodWithOpenApi,
    OpenAPIRegistry,
    OpenApiGeneratorV31,
} from "@asteasolutions/zod-to-openapi";

// Must extend BEFORE schema modules are loaded — patches ZodType.prototype
extendZodWithOpenApi(z);

// Dynamic import so the schemas pick up the patched prototype
const {
    actionToken,
    channel,
    device,
    devicePayload,
    emoji,
    fileSQL,
    invite,
    permission,
    registrationPayload,
    server,
    user,
    userRecord,
} = await import("../src/schemas/index.js");

const registry = new OpenAPIRegistry();

// ── Register schemas ────────────────────────────────────────────────────────

registry.register("User", user);
registry.register("Device", device);
registry.register("Server", server);
registry.register("Channel", channel);
registry.register("Permission", permission);
registry.register("Invite", invite);
registry.register("Emoji", emoji);
registry.register("FileSQL", fileSQL);
registry.register("ActionToken", actionToken);
registry.register("DevicePayload", devicePayload);
registry.register("RegistrationPayload", registrationPayload);

// ── Common parameters ───────────────────────────────────────────────────────

const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
});

const idParam = (name: string, description: string) =>
    ({
        in: "path" as const,
        name,
        required: true,
        schema: { type: "string" as const },
        description,
    });

// ── Auth endpoints ──────────────────────────────────────────────────────────

registry.registerPath({
    method: "post",
    path: "/auth",
    summary: "Login with username and password",
    request: {
        body: {
            content: {
                "application/msgpack": {
                    schema: z.object({
                        username: z.string(),
                        password: z.string(),
                    }),
                },
            },
        },
    },
    responses: {
        200: {
            description: "Login successful",
            content: {
                "application/msgpack": {
                    schema: z.object({
                        token: z.string(),
                        user,
                    }),
                },
            },
        },
        401: { description: "Invalid credentials" },
    },
});

registry.registerPath({
    method: "post",
    path: "/auth/device",
    summary: "Request device auth challenge",
    request: {
        body: {
            content: {
                "application/msgpack": {
                    schema: z.object({
                        deviceID: z.string(),
                        signKey: z.string(),
                    }),
                },
            },
        },
    },
    responses: {
        200: {
            description: "Challenge issued",
            content: {
                "application/msgpack": {
                    schema: z.object({
                        challenge: z.string(),
                        challengeID: z.string(),
                    }),
                },
            },
        },
    },
});

registry.registerPath({
    method: "post",
    path: "/auth/device/verify",
    summary: "Verify device auth challenge",
    request: {
        body: {
            content: {
                "application/msgpack": {
                    schema: z.object({
                        challengeID: z.string(),
                        signed: z.string(),
                    }),
                },
            },
        },
    },
    responses: {
        200: {
            description: "Device authenticated",
            content: {
                "application/msgpack": {
                    schema: z.object({
                        token: z.string(),
                        user,
                    }),
                },
            },
        },
    },
});

registry.registerPath({
    method: "post",
    path: "/register",
    summary: "Register a new user account",
    request: {
        body: {
            content: {
                "application/msgpack": { schema: registrationPayload },
            },
        },
    },
    responses: {
        200: {
            description: "Registration successful",
            content: {
                "application/msgpack": { schema: user },
            },
        },
    },
});

registry.registerPath({
    method: "post",
    path: "/whoami",
    summary: "Get current session info",
    security: [{ [bearerAuth.name]: [] }],
    responses: {
        200: {
            description: "Current session",
            content: {
                "application/msgpack": {
                    schema: z.object({
                        exp: z.number(),
                        token: z.string(),
                        user,
                    }),
                },
            },
        },
    },
});

registry.registerPath({
    method: "post",
    path: "/goodbye",
    summary: "Logout (invalidate token)",
    security: [{ [bearerAuth.name]: [] }],
    responses: { 200: { description: "Logged out" } },
});

// ── Token ───────────────────────────────────────────────────────────────────

registry.registerPath({
    method: "get",
    path: "/token/{tokenType}",
    summary: "Request an action token",
    request: {
        params: z.object({
            tokenType: z.enum([
                "register",
                "file",
                "avatar",
                "device",
                "invite",
                "emoji",
                "connect",
            ]),
        }),
    },
    responses: {
        200: {
            description: "Token issued",
            content: { "application/msgpack": { schema: actionToken } },
        },
    },
});

// ── Users ───────────────────────────────────────────────────────────────────

registry.registerPath({
    method: "get",
    path: "/user/{id}",
    summary: "Get user profile",
    security: [{ [bearerAuth.name]: [] }],
    request: { params: z.object({ id: z.string() }) },
    responses: {
        200: {
            description: "User profile",
            content: { "application/msgpack": { schema: user } },
        },
        404: { description: "User not found" },
    },
});

registry.registerPath({
    method: "get",
    path: "/user/{id}/devices",
    summary: "List devices for a user",
    security: [{ [bearerAuth.name]: [] }],
    request: { params: z.object({ id: z.string() }) },
    responses: {
        200: {
            description: "Device list",
            content: {
                "application/msgpack": { schema: z.array(device) },
            },
        },
    },
});

registry.registerPath({
    method: "get",
    path: "/user/{id}/servers",
    summary: "List servers for a user",
    security: [{ [bearerAuth.name]: [] }],
    request: { params: z.object({ id: z.string() }) },
    responses: {
        200: {
            description: "Server list",
            content: {
                "application/msgpack": { schema: z.array(server) },
            },
        },
    },
});

registry.registerPath({
    method: "get",
    path: "/user/{id}/permissions",
    summary: "Get permissions for a user",
    security: [{ [bearerAuth.name]: [] }],
    request: { params: z.object({ id: z.string() }) },
    responses: {
        200: {
            description: "Permission list",
            content: {
                "application/msgpack": { schema: z.array(permission) },
            },
        },
    },
});

// ── Servers ──────────────────────────────────────────────────────────────────

registry.registerPath({
    method: "get",
    path: "/server/{id}",
    summary: "Get a server",
    security: [{ [bearerAuth.name]: [] }],
    request: { params: z.object({ id: z.string() }) },
    responses: {
        200: {
            description: "Server details",
            content: { "application/msgpack": { schema: server } },
        },
    },
});

registry.registerPath({
    method: "post",
    path: "/server/{name}",
    summary: "Create a server",
    security: [{ [bearerAuth.name]: [] }],
    request: { params: z.object({ name: z.string() }) },
    responses: {
        200: {
            description: "Server created",
            content: { "application/msgpack": { schema: server } },
        },
    },
});

registry.registerPath({
    method: "delete",
    path: "/server/{id}",
    summary: "Delete a server",
    security: [{ [bearerAuth.name]: [] }],
    request: { params: z.object({ id: z.string() }) },
    responses: {
        200: { description: "Server deleted" },
        401: { description: "Insufficient permissions" },
    },
});

registry.registerPath({
    method: "get",
    path: "/server/{id}/channels",
    summary: "List channels in a server",
    security: [{ [bearerAuth.name]: [] }],
    request: { params: z.object({ id: z.string() }) },
    responses: {
        200: {
            description: "Channel list",
            content: {
                "application/msgpack": { schema: z.array(channel) },
            },
        },
    },
});

registry.registerPath({
    method: "post",
    path: "/server/{id}/channels",
    summary: "Create a channel",
    security: [{ [bearerAuth.name]: [] }],
    request: {
        params: z.object({ id: z.string() }),
        body: {
            content: {
                "application/msgpack": {
                    schema: z.object({ name: z.string() }),
                },
            },
        },
    },
    responses: {
        200: {
            description: "Channel created",
            content: { "application/msgpack": { schema: channel } },
        },
    },
});

// ── Channels ────────────────────────────────────────────────────────────────

registry.registerPath({
    method: "get",
    path: "/channel/{id}",
    summary: "Get a channel",
    security: [{ [bearerAuth.name]: [] }],
    request: { params: z.object({ id: z.string() }) },
    responses: {
        200: {
            description: "Channel details",
            content: { "application/msgpack": { schema: channel } },
        },
    },
});

registry.registerPath({
    method: "delete",
    path: "/channel/{id}",
    summary: "Delete a channel",
    security: [{ [bearerAuth.name]: [] }],
    request: { params: z.object({ id: z.string() }) },
    responses: {
        200: { description: "Channel deleted" },
        401: { description: "Insufficient permissions" },
    },
});

// ── Invites ─────────────────────────────────────────────────────────────────

registry.registerPath({
    method: "get",
    path: "/invite/{inviteID}",
    summary: "Get invite details",
    security: [{ [bearerAuth.name]: [] }],
    request: { params: z.object({ inviteID: z.string() }) },
    responses: {
        200: {
            description: "Invite details",
            content: { "application/msgpack": { schema: invite } },
        },
        404: { description: "Invite not found or expired" },
    },
});

registry.registerPath({
    method: "patch",
    path: "/invite/{inviteID}",
    summary: "Accept an invite",
    security: [{ [bearerAuth.name]: [] }],
    request: { params: z.object({ inviteID: z.string() }) },
    responses: {
        200: {
            description: "Invite accepted",
            content: { "application/msgpack": { schema: permission } },
        },
    },
});

// ── Health ───────────────────────────────────────────────────────────────────

registry.registerPath({
    method: "get",
    path: "/healthz",
    summary: "Health check",
    responses: {
        200: {
            description: "Server health",
            content: {
                "application/json": {
                    schema: z.object({
                        dbReady: z.boolean(),
                        ok: z.boolean(),
                    }),
                },
            },
        },
    },
});

// ── Generate ────────────────────────────────────────────────────────────────

const generator = new OpenApiGeneratorV31(registry.definitions);
const doc = generator.generateDocument({
    openapi: "3.1.0",
    info: {
        title: "Vex Protocol API",
        version: "1.0.0",
        description:
            "REST API for the Vex encrypted chat platform. Messages are serialized using msgpack.",
        license: { name: "AGPL-3.0-or-later" },
    },
    servers: [
        {
            url: "https://api.vex.wtf",
            description: "Production",
        },
        {
            url: "http://localhost:16777",
            description: "Local development",
        },
    ],
});

writeFileSync("openapi.json", JSON.stringify(doc, null, 2));
console.log(
    `Generated openapi.json with ${Object.keys(doc.paths ?? {}).length} paths`,
);
