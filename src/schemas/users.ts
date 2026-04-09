import { z } from "zod/v4";

import { datetime } from "./common.js";

/** Public user profile. */
export const user = z
    .object({
        lastSeen: datetime.describe("Last activity timestamp"),
        userID: z.string().describe("Unique user identifier"),
        username: z.string().describe("Display username"),
    })
    .describe("Public user profile");
export type User = z.infer<typeof user>;

/** Database user record with auth fields. */
export const userRecord = user
    .extend({
        passwordHash: z.string().describe("PBKDF2-SHA512 password hash"),
        passwordSalt: z.string().describe("Password salt"),
    })
    .describe("Database user record with password hash");
export type UserRecord = z.infer<typeof userRecord>;

/** Device record for multi-device support. */
export const device = z
    .object({
        deleted: z.boolean().describe("Soft-delete flag"),
        deviceID: z.string().describe("Unique device identifier"),
        lastLogin: z.string().describe("Last login timestamp"),
        name: z.string().describe("Device display name"),
        owner: z.string().describe("Owner user ID"),
        signKey: z.string().describe("Ed25519 signing public key (hex)"),
    })
    .describe("Device registration record");
export type Device = z.infer<typeof device>;

/** Device registration payload (HTTP). */
export const devicePayload = z
    .object({
        deviceName: z.string().describe("Device display name"),
        preKey: z.string().describe("Pre-key public key (hex)"),
        preKeyIndex: z.number().describe("Pre-key index"),
        preKeySignature: z.string().describe("Pre-key signature (hex)"),
        signed: z.string().describe("Signed registration data"),
        signKey: z.string().describe("Ed25519 public signing key (hex)"),
        username: z.string().describe("Account username"),
    })
    .describe("Device registration payload");
export type DevicePayload = z.infer<typeof devicePayload>;

/** User registration payload (HTTP). */
export const registrationPayload = devicePayload
    .extend({
        password: z.string().describe("Account password"),
    })
    .describe("User registration payload");
export type RegistrationPayload = z.infer<typeof registrationPayload>;
