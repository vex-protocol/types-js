/**
 * Type-level tests for @vex-chat/types public API.
 * Verifies exported types and const values are correct.
 * Run with: npx tsd
 */
import { expectType, expectAssignable } from "tsd";
import {
    type IUser,
    type IDevice,
    type IBaseMsg,
    type ISuccessMsg,
    TokenScopes,
    MailType,
    SocketAuthErrors,
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

expectAssignable<IUser>({ userID: "a", username: "b", lastSeen: new Date() });
expectAssignable<IDevice>({
    deviceID: "a",
    owner: "b",
    signKey: "c",
    name: "d",
    lastLogin: "e",
    deleted: false,
});
expectAssignable<IBaseMsg>({ transmissionID: "x", type: "y" });
expectAssignable<ISuccessMsg>({ transmissionID: "x", type: "y", data: null });
