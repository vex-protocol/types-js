import { z } from "zod/v4";

/** File upload payload (HTTP). */
export const filePayload = z
    .object({
        file: z.string().optional().describe("Optional file ID for updates"),
        nonce: z.string().describe("Encryption nonce (hex)"),
        owner: z.string().describe("File owner user ID"),
        signed: z.string().describe("Signed file data"),
    })
    .describe("File upload payload");
export type IFilePayload = z.infer<typeof filePayload>;

/** File database record. */
export const fileSQL = z
    .object({
        fileID: z.string().describe("File identifier"),
        nonce: z.string().describe("Unique nonce identifier"),
        owner: z.string().describe("File owner user ID"),
    })
    .describe("File database record");
export type IFileSQL = z.infer<typeof fileSQL>;

/** File response with metadata and data. */
export const fileResponse = z
    .object({
        data: z.instanceof(Uint8Array).describe("File binary data"),
        details: fileSQL.describe("File metadata"),
    })
    .describe("File response with metadata");
export type IFileResponse = z.infer<typeof fileResponse>;

/** Custom server emoji. */
export const emoji = z
    .object({
        emojiID: z.string().describe("Emoji identifier"),
        name: z.string().describe("Emoji display name"),
        owner: z.string().describe("Server ID that owns this emoji"),
    })
    .describe("Custom server emoji");
export type IEmoji = z.infer<typeof emoji>;
