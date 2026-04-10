# @vex-chat/types

## 2.0.0

### Major Changes

- Wire protocol is now defined by Zod schemas, with OpenAPI 3.1 and AsyncAPI 3.0 documents generated from them and shipped as subpath exports. Every exported type gains a runtime validator, and interfaces are the source of truth.

    ### New features
    - **Runtime-validated schemas**. Every type is paired with an `XSchema` that validates at runtime: `UserSchema.parse(data)`, `KeyBundleSchema.safeParse(data)`, etc. Backed by Zod 4.x (new production dependency). The old compile-time-only interfaces remain exported for consumers that don't need validation.
    - **OpenAPI 3.1 spec** shipped as `./openapi.json` subpath export, generated from the Zod schemas. 17 REST paths covering auth, registration, users, servers, channels, invites, tokens, and health. Import with `import openapi from "@vex-chat/types/openapi.json" with { type: "json" }`.
    - **AsyncAPI 3.0 spec** shipped as `./asyncapi.json` subpath export. 11 WebSocket message types (5 client→server, 6 server→client).
    - **`WSMessage` discriminated union** covering all 11 WS message variants. `switch (msg.type)` narrows automatically, and TypeScript will flag non-exhaustive handlers.
    - **Literal `type` fields** on all WS message schemas (`z.literal("success")`, `z.literal("error")`, etc.), enabling the discriminated union.

    ### Breaking changes
    - **`I` prefix dropped from all interfaces.** `IUser` → `User`, `IDevice` → `Device`, `IKeyBundle` → `KeyBundle`, `IMailWS` → `MailWS`, and so on. Schemas use the `XSchema` suffix instead (e.g. `UserSchema`, `DeviceSchema`).
    - **Date fields migrate from `Date` objects to ISO 8601 strings** on the wire. Timestamp fields on all messages, records, and tokens are now `string`. Apps convert to `Date` at the display layer.
    - **`ISucessMsg` typo fixed** → `SuccessMsg` (type) / `SuccessMsgSchema` (schema).
    - **`KeyStore` and `StoredCredentials` removed** — these were platform-storage concerns, not wire types. They have moved to `@vex-chat/libvex-js`. Consumers that imported them from `@vex-chat/types` should update their import.
    - **`zod` is now a required production dependency.** Consumers on package managers that don't auto-install `dependencies` need to add it explicitly. No other peer dependencies beyond the existing optional `tweetnacl`.
    - **`PreKeysWS` is now an alias for `KeyBundleEntry`** (was a duplicated shape).
    - **Package description changed** from "Types for vex" to "Wire protocol types for the Vex encrypted chat platform" (metadata only; not an API change but visible in `npm view`).

    ### Non-breaking changes
    - **Node engine floor is `>=18.0.0`** (previously `>=24` briefly, now relaxed). `npm >=10` required.
    - **Type coverage is 100%**, enforced in CI via `type-coverage --strict --at-least 99`.
    - **Type-boundary enforcement**: committed `api-extractor` report at `api/types.api.md`, plus `publint`, `@arethetypeswrong/cli`, and `tsd` type-level tests in CI.
    - **Spectral linting** of both specs in CI, plus a drift-detection check that regenerates specs and fails on uncommitted diffs.
    - **Every schema has `.describe()` metadata** so generated OpenAPI/AsyncAPI docs carry useful descriptions.
    - **Supply-chain hardening**: all GitHub Actions pinned to SHA, dependency licenses validated, Socket.dev scan, CodeQL, OSSF Scorecard.

    ### Migration notes

    For consumers upgrading from `1.0.1`:
    1. Rename imports: `import type { IUser } from "@vex-chat/types"` → `import type { User } from "@vex-chat/types"`.
    2. Replace uses of `Date` in message/record fields with ISO 8601 strings (zod will reject `new Date()` at parse time).
    3. If you were importing `KeyStore` or `StoredCredentials`, switch the import to `@vex-chat/libvex-js`.
    4. If you want runtime validation, start using the paired `XSchema` exports: `const user = UserSchema.parse(untrustedInput)`.
    5. Add `zod` to your lockfile if your package manager doesn't resolve it automatically.

## 1.0.0-rc.1

### Minor Changes

- ce0dbb0: Modernize package toolchain and shape.

    **Breaking for consumers on CJS**: types-js is now pure ESM (`"type": "module"` + `"exports"` with import conditional). CJS consumers must use dynamic `import()`.

    **Breaking transitive**: `tweetnacl` moved from `dependencies` to optional `peerDependencies`. Consumers that use `IXKeyRing`, `IPreKeysCrypto`, or any type referencing `nacl.BoxKeyPair` must declare their own tweetnacl dependency. All current downstream consumers (crypto-js, libvex, spire) already do.

    **Non-breaking**:
    - `"sideEffects": false` added — bundlers can tree-shake unused type exports
    - `import type` used for the tweetnacl reference — elided at runtime, no emitted import

    **Internal**:
    - Pinned to Node 24.14.0 via mise
    - Migrated from yarn to npm (yarn.lock removed, package-lock.json committed)
    - Upgraded TypeScript 5.7 → 6.0.2, `@types/node` → 24.12.2
    - Rewrote tsconfig: `NodeNext`, `verbatimModuleSyntax: true`, `types: ["node"]`
    - Dropped deprecated `esModuleInterop: false` (removed in TS 7.0)
    - GitHub Actions workflows migrated to npm

## 1.0.0-rc.0

### Major Changes

- Flatten XTypes namespace into top-level exports. All types are now exported directly instead of nested under XTypes.CRYPTO, XTypes.HTTP, XTypes.WS, and XTypes.SQL namespaces. Types with naming conflicts have been suffixed (e.g. IMailWS, IMailSQL, IPreKeysWS, IPreKeysSQL, ISessionCrypto, ISessionSQL).
