import { z } from "zod/v4";

import { uint8 } from "./common.js";

/** WebSocket authentication error codes. */
export const SocketAuthErrors = {
    BadSignature: 0,
    InvalidToken: 1,
    UserNotRegistered: 2,
} as const;
export type SocketAuthErrors =
    (typeof SocketAuthErrors)[keyof typeof SocketAuthErrors];

/** Mail type: initial (X3DH) or subsequent (ratchet). */
export const MailType = {
    initial: 0,
    subsequent: 1,
} as const;
export type MailType = (typeof MailType)[keyof typeof MailType];

/** Base WebSocket message. */
export const baseMsg = z
    .object({
        transmissionID: z.string().describe("Unique transmission identifier"),
        type: z.string().describe("Message type discriminator"),
    })
    .describe("Base WebSocket message");
export type BaseMsg = z.infer<typeof baseMsg>;

/** Success response. */
export const successMsg = baseMsg
    .extend({
        data: z.unknown().describe("Response payload"),
        timestamp: z.string().optional().describe("Server timestamp"),
    })
    .describe("Success response message");
export type SuccessMsg = z.infer<typeof successMsg>;

/** Error response. */
export const errMsg = baseMsg
    .extend({
        data: z.unknown().optional().describe("Error context"),
        error: z.string().describe("Error message"),
    })
    .describe("Error response message");
export type ErrMsg = z.infer<typeof errMsg>;

/** Auth challenge. */
export const challMsg = baseMsg
    .extend({
        challenge: uint8.describe("Challenge nonce bytes"),
        type: z.literal("challenge"),
    })
    .describe("Authentication challenge");
export type ChallMsg = z.infer<typeof challMsg>;

/** Auth response. */
export const respMsg = baseMsg
    .extend({
        signed: uint8.describe("Signed response bytes"),
        type: z.literal("response"),
    })
    .describe("Authentication response");
export type RespMsg = z.infer<typeof respMsg>;

/** Mail receipt acknowledgment. */
export const receiptMsg = baseMsg
    .extend({
        nonce: uint8.describe("Mail nonce being acknowledged"),
    })
    .describe("Mail receipt");
export type ReceiptMsg = z.infer<typeof receiptMsg>;

/** Resource CRUD message. */
export const resourceMsg = baseMsg
    .extend({
        action: z.string().describe("CRUD action"),
        data: z.unknown().optional().describe("Resource payload"),
        resourceType: z.string().describe("Resource type"),
    })
    .describe("Resource operation message");
export type ResourceMsg = z.infer<typeof resourceMsg>;

/** Server notification. */
export const notifyMsg = baseMsg
    .extend({
        data: z.unknown().optional().describe("Event payload"),
        event: z.string().describe("Notification event type"),
    })
    .describe("Server notification");
export type NotifyMsg = z.infer<typeof notifyMsg>;
