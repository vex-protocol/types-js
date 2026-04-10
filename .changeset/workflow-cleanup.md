---
"@vex-chat/types": patch
---

The release pipeline now validates that generated OpenAPI and AsyncAPI spec files are up-to-date before publishing, preventing stale specs from shipping. Dependabot dependency-bump PRs are exempted from the changeset requirement and will be bundled into the next human-authored release automatically.
