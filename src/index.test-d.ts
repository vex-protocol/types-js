/**
 * Type-level tests for @vex-chat/types public API.
 * Verifies exported types and const values are correct.
 * Run with: npx tsd
 */
import { expectAssignable, expectType } from "tsd";

import {
    type IBaseMsg,
    type IDevice,
    type ISuccessMsg,
    type IUser,
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

expectAssignable<IUser>({ lastSeen: new Date(), userID: "a", username: "b" });
expectAssignable<IDevice>({
    deleted: false,
    deviceID: "a",
    lastLogin: "e",
    name: "d",
    owner: "b",
    signKey: "c",
});
expectAssignable<IBaseMsg>({ transmissionID: "x", type: "y" });
expectAssignable<ISuccessMsg>({ data: null, transmissionID: "x", type: "y" });
