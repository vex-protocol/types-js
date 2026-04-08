// ==========================================
// HTTP API TYPES
// ==========================================

export const TokenScopes = {
    Avatar: 2,
    Connect: 6,
    Device: 3,
    Emoji: 5,
    File: 1,
    Invite: 4,
    Register: 0,
} as const;
export interface IActionToken {
    key: string;
    scope: TokenScopes;
    time: Date;
}

export interface IDevicePayload {
    deviceName: string;
    preKey: string;
    preKeyIndex: number;
    preKeySignature: string;
    signed: string;
    signKey: string;
    username: string;
}

export interface IFilePayload {
    file?: string;
    nonce: string;
    owner: string;
    signed: string;
}

export interface IFileResponse {
    data: Uint8Array;
    details: IFileSQL;
}

export interface IRegistrationPayload extends IDevicePayload {
    password: string;
}

export type TokenScopes = (typeof TokenScopes)[keyof typeof TokenScopes];

// ==========================================
// WEBSOCKET TYPES (Network Layer)
// ==========================================

export const SocketAuthErrors = {
    BadSignature: 0,
    InvalidToken: 1,
    UserNotRegistered: 2,
} as const;
export type SocketAuthErrors =
    (typeof SocketAuthErrors)[keyof typeof SocketAuthErrors];

export const MailType = {
    initial: 0,
    subsequent: 1,
} as const;
export interface IBaseMsg {
    transmissionID: string;
    type: string;
}

export interface IChallMsg extends IBaseMsg {
    challenge: Uint8Array;
    type: "challenge";
}

export interface IChannel {
    channelID: string;
    name: string;
    serverID: string;
}

export interface IDevice {
    deleted: boolean;
    deviceID: string;
    lastLogin: string;
    name: string;
    owner: string;
    signKey: string;
}

export interface IEmoji {
    emojiID: string;
    name: string;
    owner: string;
}

export interface IErrMsg extends IBaseMsg {
    data?: unknown;
    error: string;
}

export interface IFileSQL {
    fileID: string;
    nonce: string;
    owner: string;
}

export interface IIdentityKeys {
    deviceID: string;
    keyID: string;
    privateKey?: string;
    publicKey: string;
    userID: string;
}

export interface IInvite {
    expiration: string;
    inviteID: string;
    owner: string;
    serverID: string;
}

// Resources attached to success messages

export interface IKeyBundle {
    otk?: IPreKeysWS;
    preKey: IPreKeysWS;
    signKey: Uint8Array;
}

export interface IMailSQL {
    authorID: string;
    cipher: string;
    extra: string;
    forward: boolean;
    group: null | string;
    header: string;
    mailID: string;
    mailType: MailType;
    nonce: string;
    readerID: string;
    recipient: string;
    sender: string;
    time: Date;
}

export interface IMailWS {
    authorID: string;
    cipher: Uint8Array;
    extra: Uint8Array;
    forward: boolean;
    group: null | Uint8Array;
    mailID: string;
    mailType: MailType;
    nonce: Uint8Array;
    readerID: string;
    recipient: string;
    sender: string;
}

// ==========================================
// IDENTITY PERSISTENCE (App-level)
// ==========================================

export interface INotifyMsg extends IBaseMsg {
    data?: unknown;
    event: string;
}

export interface IPermission {
    permissionID: string;
    powerLevel: number;
    resourceID: string;
    resourceType: string;
    userID: string;
}

// ==========================================
// PUBLIC API TYPES (returned to clients)
// ==========================================

export interface IPreKeysSQL {
    deviceID: string;
    index: number;
    keyID: string;
    privateKey?: string;
    publicKey: string;
    signature: string;
    userID: string;
}

// ==========================================
// DATABASE TYPES (SQL / Knex — server only)
// ==========================================

export interface IPreKeysWS {
    deviceID: string;
    index: number;
    publicKey: Uint8Array;
    signature: Uint8Array;
}

export interface IReceiptMsg extends IBaseMsg {
    nonce: Uint8Array;
}

export interface IResourceMsg extends IBaseMsg {
    action: string;
    data?: unknown;
    resourceType: string;
}

export interface IRespMsg extends IBaseMsg {
    signed: Uint8Array;
    type: "response";
}

export interface IServer {
    icon?: string;
    name: string;
    serverID: string;
}

export interface ISessionSQL {
    deviceID: string;
    fingerprint: string;
    lastUsed: Date;
    mode: "initiator" | "receiver";
    publicKey: string;
    sessionID: string;
    SK: string;
    userID: string;
    verified: boolean;
}

export interface ISucessMsg extends IBaseMsg {
    data: unknown;
    timestamp?: string;
}

export interface IUser {
    lastSeen: Date;
    userID: string;
    username: string;
}

export interface IUserRecord extends IUser {
    passwordHash: string;
    passwordSalt: string;
}

export interface KeyStore {
    clear(username: string): Promise<void>;
    load(username?: string): Promise<null | StoredCredentials>;
    save(creds: StoredCredentials): Promise<void>;
}

export type MailType = (typeof MailType)[keyof typeof MailType];

export interface StoredCredentials {
    deviceID: string;
    deviceKey: string; // hex Ed25519 secret key
    preKey?: string;
    token?: string;
    username: string;
}
