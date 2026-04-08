import { z } from "zod/v4";

/**
 * Stored login credentials for auto-login.
 *
 * @remarks Will move to libvex-js in a future release (SDK-internal type).
 */
export const storedCredentials = z
    .object({
        deviceID: z.string().describe("Device identifier"),
        deviceKey: z.string().describe("Ed25519 private key (hex)"),
        preKey: z.string().optional().describe("Pre-key data"),
        token: z.string().optional().describe("Cached auth token"),
        username: z.string().describe("Account username"),
    })
    .describe("Stored device credentials for auto-login");
/**
 * Platform-agnostic credential storage interface.
 *
 * @remarks Will move to libvex-js in a future release (SDK-internal contract).
 */
export interface KeyStore {
    clear(username: string): Promise<void>;
    load(username?: string): Promise<null | StoredCredentials>;
    save(creds: StoredCredentials): Promise<void>;
}

export type StoredCredentials = z.infer<typeof storedCredentials>;

/**
 * Session database record.
 *
 * @remarks Will move to libvex-js in a future release (SDK-only persistence).
 */
export const sessionSQL = z
    .object({
        deviceID: z.string().describe("Device identifier"),
        fingerprint: z.string().describe("Session fingerprint"),
        lastUsed: z.date().describe("Last activity timestamp"),
        mode: z.enum(["initiator", "receiver"]).describe("Session role"),
        publicKey: z.string().describe("Remote public key (hex)"),
        sessionID: z.string().describe("Session identifier"),
        SK: z.string().describe("Shared secret key (hex)"),
        userID: z.string().describe("User identifier"),
        verified: z.boolean().describe("Verification status"),
    })
    .describe("Session database record");
export type ISessionSQL = z.infer<typeof sessionSQL>;

/**
 * Identity key database record.
 *
 * @remarks Will move to libvex-js in a future release (SDK-only persistence).
 */
export const identityKeys = z
    .object({
        deviceID: z.string().describe("Device identifier"),
        keyID: z.string().describe("Key record identifier"),
        privateKey: z.string().optional().describe("Private key (hex)"),
        publicKey: z.string().describe("Public key (hex)"),
        userID: z.string().describe("User identifier"),
    })
    .describe("Identity key database record");
export type IIdentityKeys = z.infer<typeof identityKeys>;
