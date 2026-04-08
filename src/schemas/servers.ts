import { z } from "zod/v4";

/** Chat server. */
export const server = z
    .object({
        icon: z.string().optional().describe("Server icon file ID"),
        name: z.string().describe("Server display name"),
        serverID: z.string().describe("Unique server identifier"),
    })
    .describe("Chat server");
export type IServer = z.infer<typeof server>;

/** Server channel. */
export const channel = z
    .object({
        channelID: z.string().describe("Unique channel identifier"),
        name: z.string().describe("Channel display name"),
        serverID: z.string().describe("Parent server ID"),
    })
    .describe("Server channel");
export type IChannel = z.infer<typeof channel>;

/** Permission grant. */
export const permission = z
    .object({
        permissionID: z.string().describe("Unique permission identifier"),
        powerLevel: z.number().describe("Permission level (0-100)"),
        resourceID: z.string().describe("Resource being accessed"),
        resourceType: z.string().describe("Resource type (e.g. server)"),
        userID: z.string().describe("Grantee user ID"),
    })
    .describe("Permission grant");
export type IPermission = z.infer<typeof permission>;

/** Server invitation. */
export const invite = z
    .object({
        expiration: z.string().describe("Expiration datetime"),
        inviteID: z.string().describe("Unique invite identifier"),
        owner: z.string().describe("Inviter user ID"),
        serverID: z.string().describe("Target server ID"),
    })
    .describe("Server invitation");
export type IInvite = z.infer<typeof invite>;
