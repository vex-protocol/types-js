import { z } from "zod/v4";

/**
 * Uint8Array schema. Uses `z.custom` instead of `z.instanceof` to avoid
 * the `Uint8Array<ArrayBuffer>` vs `Uint8Array<ArrayBufferLike>` generic
 * mismatch between TS 6.x's strict generic inference and tweetnacl/nacl.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const uint8 = z.custom<Uint8Array<any>>(
    (val) => val instanceof Uint8Array,
);

/**
 * ISO 8601 datetime string. Used for all timestamp fields on the wire.
 * No Date objects — strings everywhere, apps convert for display.
 */
export const datetime = z.string().describe("ISO 8601 datetime");

/** Scoped token types for action tokens. */
export const TokenScopes = {
    Avatar: 2,
    Connect: 6,
    Device: 3,
    Emoji: 5,
    File: 1,
    Invite: 4,
    Register: 0,
} as const;
export type TokenScopes = (typeof TokenScopes)[keyof typeof TokenScopes];

/** Action token for scoped operations with TTL. */
export const actionToken = z
    .object({
        key: z.string().describe("Token value"),
        scope: z.number().describe("Token scope"),
        time: datetime.describe("Token creation time"),
    })
    .describe("Scoped action token with TTL");
export type ActionToken = z.infer<typeof actionToken>;
