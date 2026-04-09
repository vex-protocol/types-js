/**
 * Type-level tests for @vex-chat/types public API.
 * Verifies exported types and const values are correct.
 * Run with: npx tsd
 */
import { expectAssignable, expectType } from "tsd";

import {
    type BaseMsg,
    type Device,
    type SuccessMsg,
    type User,
    MailType,
    SocketAuthErrors,
    TokenScopes,
} from "./index.js";

// ── Const values have correct literal types ─────────────────────────────────

expectType<0>(TokenScopes.Register);
expectType<1>(TokenScopes.File);
expectType<6>(TokenScopes.Connect);

expectType<0>(MailType.initial);
expectType<1>(MailType.subsequent);

expectType<0>(SocketAuthErrors.BadSignature);
expectType<1>(SocketAuthErrors.InvalidToken);

// ── Types have correct field types ──────────────────────────────────────────

expectAssignable<User>({ lastSeen: new Date().toISOString(), userID: "a", username: "b" });
expectAssignable<Device>({
    deleted: false,
    deviceID: "a",
    lastLogin: "e",
    name: "d",
    owner: "b",
    signKey: "c",
});
expectAssignable<BaseMsg>({ transmissionID: "x", type: "y" });
expectAssignable<SuccessMsg>({ data: null, transmissionID: "x", type: "y" });
