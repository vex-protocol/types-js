---
"@vex-chat/types": major
---

Runtime-validated Zod schemas ship as the primary API, with OpenAPI 3.1 and AsyncAPI 3.0 documents generated from them and exported as `./openapi.json` and `./asyncapi.json` subpaths. Breaking: interfaces are the source of truth with schemas renamed to `XSchema` (e.g. `user` → `UserSchema`), the `I` prefix is dropped from interface names, and date fields migrate from `Date` objects to ISO 8601 strings on the wire. WebSocket messages gain literal `type` fields and a `wsMessage` discriminated union for exhaustive narrowing.
