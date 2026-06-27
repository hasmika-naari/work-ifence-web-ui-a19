# Implementation Guide — Tier A (Core Jobseeker Loop)

> **Audience: a coding agent (Claude Code).** This is a build-ready, ordered plan to
> implement Tier A of `PRODUCT-REQUIREMENTS.md`. Work top-to-bottom; each task lists exactly
> what to create, the acceptance criteria, and how to verify. Companion file:
> `workifence-tierA.jdl`.
>
> **Hard constraints (do not violate):**
> - Toolchain pinned: **JHipster 8.1.0, Node 18.19.1, Java 17/21**. Use `npx jhipster` (local).
> - **Do not** hand-edit generated `domain/`, base `repository/`, base `service/`, or base
>   `web/rest/*Resource.java`. All custom logic goes in the `*/ext/` packages.
> - Backend is authoritative for access; frontend gating must **fail closed**.
> - Schema changes = JDL import + **new** Liquibase `addColumn`/`createTable` changeset.
>   Never edit existing changesets or tables directly. (See repo `README.md`.)
> - Run `./mvnw verify` before considering any backend task done.

## 0. Scope of Tier A

Five features, in order: (1) resume visibility + share links, (2) AI resume flows,
(3) application communication log + offers + detail aggregate, (4) browser extension capture,
(5) entitlement + nav/route gating for all of the above. Entities/enums are defined in
`workifence-tierA.jdl`.

---

## 1. Pre-flight

1. Confirm clean baseline: `./mvnw -Pdev` starts, Liquibase runs with no errors,
   `GET /api/access/me` returns 200 for an authenticated user.
2. Create a branch: `feat/tier-a`.
3. Read `workifence-tierA.jdl` and this guide fully before generating code.

---

## 2. Import the JDL (schema generation)

```bash
cd work-ifence-web-ws
npx jhipster import-jdl ./workifence-tierA.jdl     # NO --force
```

When prompted for the **existing** entities `JobResume` and `JobApplication`:
- Accept regeneration of Java (domain/repo/service/resource/criteria).
- **Decline / do not overwrite** their existing Liquibase changesets (keep history intact).

For the **new** entities (`ResumeShareLink`, `AiResumeJob`, `ApplicationCommunication`,
`Offer`) JHipster will generate `added_entity_*` changelogs — keep those.

Verify generation: new files appear under `domain/`, `repository/`, `service/`,
`service/criteria/`, `web/rest/`, plus enums under `domain/enumeration/`.

---

## 3. Liquibase: additive changeset for modified tables

JHipster will not safely diff new columns onto existing tables. Author **one new** changeset
file (timestamp > newest existing, e.g. `src/main/resources/config/liquibase/changelog/
20260701120000_tier_a_additive_columns.xml`) and include it in `master.xml`.

Add columns:
- `job_resume`: `visibility VARCHAR`, `parent_resume_id BIGINT`, `version_no INT`,
  `share_token VARCHAR`, `last_ai_model_used VARCHAR`.
- `job_application`: `jd_text` (CLOB/LONGTEXT), `captured_via VARCHAR`, `final_result VARCHAR`.

Use `<addColumn>` change types only. Then add a data-migration `<update>` to backfill
`job_resume.visibility` from the legacy `access_type` (map: `public→PUBLIC`,
`private/empty→PRIVATE`, else `PRIVATE`). Keep `access_type` for now (deprecate later).

Verify: restart app, Liquibase applies cleanly, and
`SELECT visibility FROM job_resume LIMIT 1;` works (no "Unknown column").

---

## 4. Feature 1 — Resume visibility + share links

**Backend (`web/rest/ext`, `service/ext`, `service/dto/ext`):**

- `ResumeVisibilityServiceExt` — central method `canView(resumeId, principal)` enforcing:
  `PRIVATE` → owner only; `PUBLIC` → anyone authenticated + public endpoint; `UNLISTED` →
  only via valid share token; `EMPLOYER_ONLY` → owner's enterprise recruiters
  (reuse `EnterpriseProfileRelation` + `EnterpriseRole` like `AccessResourceExt`).
- `JobResumeExtResource` (`@RequestMapping("/api/ext/job-resumes")`):
  - `POST /{id}/duplicate` → copies `resumeJson`, sets `parentResumeId`, `versionNo+1`,
    `status=DRAFT`.
  - `POST /{id}/share` → creates `ResumeShareLink` (random token), returns `{ token, url }`.
  - `DELETE /{id}/share/{token}` → sets `revoked=true`.
- `PublicResumeResource` (`@RequestMapping("/api/public/resumes")`, permit-all in
  `SecurityConfig` for this path):
  - `GET /{token}` → resolves share link; 410 if revoked/expired; renders read-only resume;
    only `PUBLIC`/`UNLISTED` resolvable.
- Enforce `canView` in the existing read paths too (filter list results; 403 on direct get).

**Frontend (`work-ifence-web-ui`):**
- Resume editor: visibility selector (enum), "Share" action → calls share API, shows
  copyable URL with revoke.
- Public resume view route (no auth) for `/r/:token`.

**Acceptance:** FR-RES-1/2/3 in the PRD. Unauthorized reads → 403; revoked token → 410;
duplicate produces an independent copy.

**Verify:** integration tests `JobResumeExtResourceIT`, `PublicResumeResourceIT`
(owner vs non-owner vs token vs revoked). `./mvnw verify`.

---

## 5. Feature 2 — AI resume flows (server-side)

**Important:** call the AI provider **server-side** (key safety). The UI bundles
`@google/generative-ai`, but production flows go through these endpoints.

**Backend:**
- `AiProviderClient` (in `service/ext`) — thin wrapper over the configured provider
  (Gemini by default; provider + key from `application*.yml` /
  `WORKIFENCE_AI_API_KEY` env). Must be mockable in tests.
- `AiResumeServiceExt` — orchestrates jobs, persists `AiResumeJob`, runs async
  (`@Async` + a task executor), updates status `QUEUED→RUNNING→SUCCEEDED/FAILED`.
- `AiResumeResourceExt` (`@RequestMapping("/api/ext/ai")`):
  - `POST /resume/draft` `{ resumeId, sections[] }`
  - `POST /resume/improve` `{ resumeId, instructions }`
  - `POST /resume/from-upload` `{ fileKey }` → structured `resumeJson`
  - `POST /resume/from-jd` `{ jobDescription | jobUrl }` → `{ resumeJson, matchScore, missingKeywords[] }`
  - `POST /cover-letter` `{ resumeId, jobDescription }`
  - `GET /jobs/{id}` → poll job status/result
- For `from-upload`: read the uploaded file from S3 (reuse `service/storage` /
  `AWSS3Resource`), extract text (PDF/DOCX), prompt the model to return the structured
  resume JSON schema. If a parser library is added, document it.

**Frontend:**
- AI actions in the editor with accept/reject **per section**; only accepted content writes
  to `resumeJson`. Show match score + missing keywords for JD tailoring. Poll `GET /jobs/{id}`.

**Acceptance:** FR-AI-1..4. Nothing auto-saves; model used is recorded
(`AiResumeJob.modelUsed`, `JobResume.lastAiModelUsed`).

**Verify:** unit tests with a mocked `AiProviderClient`; `AiResumeResourceExt` returns job
ids and results; failures set `status=FAILED` with `errorMessage`.

> **Decision needed before coding:** confirm AI provider + data-retention terms (PRD §12).

---

## 6. Feature 3 — Application context (comms, offers, detail aggregate)

**Backend:**
- Generated CRUD for `ApplicationCommunication` and `Offer` (from JDL) — keep base
  resources; add an `ext` aggregate:
- `ApplicationDetailServiceExt` + `JobApplicationDetailResourceExt`
  (`@RequestMapping("/api/ext/applications")`):
  - `GET /{id}/detail` → one payload: application, resume (link + `versionNo`), `jdText`,
    interview rounds (`JobInterviewRound(s)`) + feedback (`JobInterviewFeedback`),
    communications (ordered), offer.
  - `POST /{id}/status` `{ statusId }` → updates status **and** appends `ApplicationHistory`
    (actor + timestamp). All status changes must go through here.
  - `POST /{id}/capture-comm` (or use base CRUD) for log entries.
- When status becomes `OFFER`, require an `Offer` record (validation).

**Frontend:**
- Application detail screen rendering the aggregate: resume used, JD, interview timeline,
  communication log (add entry), offer panel. Status changes via the ext endpoint.

**Acceptance:** FR-APP-1..5. Every status change appends history; detail resolves all related
records from one id.

**Verify:** `JobApplicationDetailResourceIT` (aggregate shape; history append on status
change). `./mvnw verify`.

---

## 7. Feature 4 — Browser extension (apply & auto-track)

**Backend:**
- `ApplicationCaptureResourceExt` (`@RequestMapping("/api/ext/applications")`):
  - `POST /capture` `{ jobTitle, company, location, jobUrl, jdText, resumeId, source }`
    → creates a `JobApplication` with `capturedVia=EXTENSION`, default status `SAVED/APPLIED`,
    stores `jdText`. Returns the created application id.
- `ExtensionTokenResourceExt`:
  - `POST /api/ext/extension/token` → issues a **scoped, revocable** token for the extension
    (short-lived access + refresh). Reuse the JWT infra; add a token scope/claim.
  - Ensure logging out / revoking invalidates the extension token.

**Extension package (new):** create `work-ifence-web-ui/browser-extension/` (MV3) — or a
sibling package — with: content script that detects job postings + scrapes JD, a popup to
pick the resume and confirm, a background service worker calling `/api/ext/applications/capture`.
Target Chrome/Edge first (confirm scope — PRD §12). **Never auto-submit** external forms;
require explicit user click.

**Acceptance:** FR-EXT-1..3. Clicking "Track in WorkIfence" on any job page creates a fully
contextual application (resume used, JD, source, url). Revoking the session kills the extension.

**Verify:** API test `ApplicationCaptureResourceIT`; manual extension smoke test against a
sample job page.

---

## 8. Feature 5 — Entitlements + nav/route gating (cross-cutting)

For every new feature area, do all of:
1. **Backend entitlement:** add/confirm a `FeatureType` + `PlanEntitlement` row and include
   the entitlement key in the `/api/access/me` payload. Enforce server-side (fail closed).
2. **Frontend nav gating:** gate the nav item with the matching `entitlementKey`/`requireFlag`.
3. **Frontend route gating:** gate the route identically — `entitlementRouteGuard` requires
   `data.entitlementKey`; `accessGuard` reads `data.requireFlag`.
4. Run `npm run audit:nav:ci` — must pass (no nav↔route drift).

Suggested entitlement keys: `resume.share`, `resume.ai`, `application.tracking`,
`extension.capture`. Map each to a `FeatureType` and gate per plan/scope (INDIVIDUAL vs
ENTERPRISE).

**Acceptance:** AC-1..4 in PRD §6.5 / §3; gated routes fail closed in a prod build.

---

## 9. Definition of done (Tier A)

- `npx jhipster import-jdl` applied; new + additive Liquibase changesets run cleanly.
- All five feature areas implemented in `ext/` packages with the endpoints above.
- Resume visibility enforced server-side; share links revocable; public endpoint safe.
- AI flows run server-side, async, review-before-save, model recorded.
- Application detail aggregate + history-on-status-change working.
- Extension captures a contextual application; extension token revocable.
- Every feature entitlement-gated with matching nav + route gating; `audit:nav:ci` passes.
- Tests: `./mvnw verify` green; `npm test` green; `npm run audit:nav:ci` green.
- `docs/rest-endpoint-inventory.md` updated with the new `ext` endpoints.

---

## 10. Suggested task order for Claude Code

```
1. Import JDL + write additive Liquibase changeset (+ visibility backfill)   [§2–3]
2. Resume visibility service + enforcement + share links + public endpoint    [§4]
3. Application comms + offers + /applications/{id}/detail + status-history     [§6]
4. AI provider client + async AiResumeJob + /api/ext/ai/* endpoints           [§5]
5. Extension capture endpoint + scoped token, then the MV3 extension package  [§7]
6. Entitlements + nav/route gating for all of the above; run audits           [§8]
7. Tests + endpoint-inventory doc + DoD checklist                             [§9]
```

> When Tier A lands, reconcile the implemented behavior into the as-built `REQUIREMENTS.md`,
> then proceed to Tier B (placement → timesheets → work billing) using the same recipe.
