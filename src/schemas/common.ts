import { z } from "zod/v4";

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
        time: z.date().describe("Token creation time"),
    })
    .describe("Scoped action token with TTL");
export type IActionToken = z.infer<typeof actionToken>;
