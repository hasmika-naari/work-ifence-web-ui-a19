# WorkIfence — Roadmap

> A phased roadmap inferred from the current state of the codebase (implemented entities,
> REST resources, existing "Phase-1" notes in the backend README, and the
> entitlement/menu-gating work in progress). An identical copy lives at the root of both
> repos. Treat this as a living document — confirm priorities with product owners.

## Where we are today (baseline)

Implemented and in the codebase:

- JWT auth, account/profile management, and an `access/me` entitlement payload.
- Full individual journey scaffolding: profiles, resumes (+ PDF export), job applications,
  interview rounds/feedback, courses.
- Enterprise foundation: onboarding requests, enterprise profiles/relations, contacts, and
  **App-Admin enterprise lifecycle (Phase 1)** — activate / suspend / archive with paged,
  filterable read APIs.
- Subscription & entitlement model: plans, plan entitlements, entitlement catalog, feature
  types, subscriptions, add-ons, invoices, payments, upgrade requests.
- Data-driven navigation with per-tenant/per-user menu config and audit logging.
- Defense-in-depth nav/route gating on the frontend with an automated audit
  (`npm run audit:nav`).
- Angular 21 SSR frontend; Spring Boot 3.2 / Java 21 backend on MySQL with Liquibase.

## Phase 1 — Harden the foundation (near term)

Goal: make what exists production-trustworthy.

- Finish and verify **entitlement enforcement end to end** — every gated feature has a
  backend entitlement, a gated route, and a gated nav item; audit passes in CI
  (`audit:nav:ci`) and gates fail closed in prod.
- Complete **enterprise lifecycle** beyond Phase 1: member invitation/acceptance flows,
  role assignment UI for `EnterpriseRole`, and membership state transitions.
- Confirm and document **billing integration**: wire a real `PaymentProvider`, exercise the
  invoice → payment → subscription-status lifecycle, and handle PAST_DUE/dunning.
- **Schema drift cleanup**: ensure all JDL → Liquibase changesets are `addColumn`-based and
  startup is clean; remove stray build logs and one-off patches from the repo.
- Establish **CI gates**: backend `verify`, frontend unit tests, nav audit, and e2e smoke.

## Phase 2 — Enterprise experience & self-service

Goal: let enterprises operate with minimal App-Admin involvement.

- Self-service **enterprise onboarding** wizard (UI) feeding `EnterpriseOnboardingRequest`,
  with App-Admin review queue (UNDER_REVIEW / NEED_MORE_INFO).
- **Subscription self-management**: plan comparison, upgrade/downgrade via
  `SubscriptionUpgradeRequest`, add-on purchase, and invoice/payment history views.
- **Tenant menu configuration UI** built on `TenantMenuConfig` / `NavMenuSection` /
  `NavMenuItem`, with `MenuAuditLog`-backed change history.
- Recruiter/HR tooling: job posting management, candidate pipeline views built on
  `JobApplication` + `ApplicationStatus` + interview entities.

## Phase 3 — Candidate & jobs depth

Goal: deepen the core jobseeker value.

- Richer **job discovery**: search, filtering, and recommendations over `CollegeJobs` /
  `Category`; saved searches and `NEW_JOB_POSTED` notifications.
- **Application tracking** UX: timeline from `ApplicationHistory`, status nudges, and
  interview scheduling tied to `INTERVIEW_SCHEDULE` notifications.
- **Resume builder** enhancements: more `ResumeTemplate`s, AI-assisted content via the
  existing Google Generative AI integration, and one-click export.
- **Courses**: progress tracking and provider integrations on top of `CourseInfo` /
  `CourseProvider`.

## Phase 4 — Scale, observability & platform quality

Goal: prepare for growth.

- Introduce a **caching strategy** (currently none) for hot reads, with explicit
  invalidation.
- Expand **observability**: dashboards on the existing Prometheus/Grafana stack, SLOs, and
  alerting on subscription/payment failures.
- **Performance**: query/index review on high-traffic list endpoints; pagination defaults.
- **Security review**: periodic auth/entitlement audit, dependency upgrades, secret
  rotation; keep JHipster/Angular/Spring on supported versions.
- **Test depth**: raise backend integration and frontend e2e coverage on critical paths
  (auth, entitlements, billing, onboarding).

## Phase 5 — Extensibility (longer term, exploratory)

- Public/partner **API** surface with API keys/OAuth for vendor integrations
  (building on `VendorJobApplication` / `WifenceService`).
- **Analytics**: reporting on applications, hiring funnels, and subscription metrics.
- **Notifications**: broaden channels (email/in-app/push) and templating.
- Evaluate **modularization** if the monolith's bounded contexts (jobs, enterprise,
  billing) warrant separate deployables.

## Cross-cutting principles (apply every phase)

- Backend remains the source of truth for access; frontend stays defense-in-depth and
  fail-closed.
- Schema changes go through JDL + new Liquibase `addColumn` changesets, never direct edits.
- Keep the toolchain on the pinned versions (JHipster 8.1.0, Node 18.19.1, Java 17/21).
- Keep `docs/` (REST inventory, API contracts) and these root docs in sync with changes.

> Sequencing and scope are estimates based on the current code; validate against business
> priorities before committing dates.
