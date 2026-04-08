import { z } from "zod/v4";

/** X3DH key bundle for session establishment. */
export const keyBundle = z
    .object({
        otk: z
            .object({
                deviceID: z.string().describe("Device identifier"),
                index: z.number().describe("OTK index"),
                publicKey: z
                    .instanceof(Uint8Array)
                    .describe("X25519 OTK (bytes)"),
                signature: z
                    .instanceof(Uint8Array)
                    .describe("OTK signature (bytes)"),
            })
            .optional()
            .describe("One-time key (consumed after use)"),
        preKey: z
            .object({
                deviceID: z.string().describe("Device identifier"),
                index: z.number().describe("Pre-key index"),
                publicKey: z
                    .instanceof(Uint8Array)
                    .describe("X25519 pre-key (bytes)"),
                signature: z
                    .instanceof(Uint8Array)
                    .describe("Pre-key signature (bytes)"),
            })
            .describe("Signed pre-key"),
        signKey: z
            .instanceof(Uint8Array)
            .describe("Ed25519 signing public key"),
    })
    .describe("X3DH key bundle for session establishment");
export type IKeyBundle = z.infer<typeof keyBundle>;

/** WebSocket pre-key payload. */
export const preKeysWS = z
    .object({
        deviceID: z.string().describe("Device identifier"),
        index: z.number().describe("Pre-key index"),
        publicKey: z
            .instanceof(Uint8Array)
            .describe("Pre-key public key (bytes)"),
        signature: z
            .instanceof(Uint8Array)
            .describe("Pre-key signature (bytes)"),
    })
    .describe("WebSocket pre-key payload");
export type IPreKeysWS = z.infer<typeof preKeysWS>;

/** Pre-key database record (shared — used by both spire and libvex). */
export const preKeysSQL = z
    .object({
        deviceID: z.string().describe("Device identifier"),
        index: z.number().describe("Key index"),
        keyID: z.string().describe("Key record identifier"),
        privateKey: z.string().optional().describe("Private key (hex)"),
        publicKey: z.string().describe("Public key (hex)"),
        signature: z.string().describe("Signature (hex)"),
        userID: z.string().describe("Owner user ID"),
    })
    .describe("Pre-key database record");
export type IPreKeysSQL = z.infer<typeof preKeysSQL>;

/** Encrypted mail message (WebSocket format). */
export const mailWS = z
    .object({
        authorID: z.string().describe("Original author user ID"),
        cipher: z.instanceof(Uint8Array).describe("Encrypted message content"),
        extra: z.instanceof(Uint8Array).describe("Extra metadata"),
        forward: z.boolean().describe("Whether this is a multi-device forward"),
        group: z
            .instanceof(Uint8Array)
            .nullable()
            .describe("Channel ID for group messages"),
        mailID: z.string().describe("Unique mail identifier"),
        mailType: z.number().describe("Mail type (0=initial, 1=subsequent)"),
        nonce: z.instanceof(Uint8Array).describe("Encryption nonce"),
        readerID: z.string().describe("Intended reader user ID"),
        recipient: z.string().describe("Recipient device ID"),
        sender: z.string().describe("Sender device ID"),
    })
    .describe("Encrypted mail message");
export type IMailWS = z.infer<typeof mailWS>;

/** Mail message (SQL/database format). */
export const mailSQL = z
    .object({
        authorID: z.string().describe("Original author user ID"),
        cipher: z.string().describe("Encrypted content (hex)"),
        extra: z.string().describe("Extra metadata (hex)"),
        forward: z.boolean().describe("Multi-device forward flag"),
        group: z.string().nullable().describe("Channel ID for group messages"),
        header: z.string().describe("Message header (hex)"),
        mailID: z.string().describe("Mail identifier"),
        mailType: z.number().describe("Mail type"),
        nonce: z.string().describe("Encryption nonce (hex)"),
        readerID: z.string().describe("Intended reader user ID"),
        recipient: z.string().describe("Recipient device ID"),
        sender: z.string().describe("Sender device ID"),
        time: z.date().describe("Server timestamp"),
    })
    .describe("Mail database record");
export type IMailSQL = z.infer<typeof mailSQL>;
