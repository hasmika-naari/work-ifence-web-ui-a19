# Nav/Route Gating Audit

Summary: {"total":62,"pass":1,"fail":14,"hidden":47,"group":0}

| role | section | parent | title | route | navFlag | navEnt | routeFlag | routeEnt | status | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| admin | Admin |  | Admin Dashboard | /user/dashboard-admin | ADMIN_CONSOLE | admin.console |  |  | FAIL (no route) |  |
| admin | Operations |  | Requests | /user/requests |  | admin.requests |  |  | FAIL (no route) |  |
| admin | Operations |  | Onboarding Requests | /user/admin/onboarding-requests | NAV_PLACEHOLDER | admin.enterprise.onboarding |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Operations |  | Support Tickets | /user/admin/support-tickets | NAV_PLACEHOLDER | admin.support.tickets |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Operations |  | Feedback & Requests | /user/admin/feedback | NAV_PLACEHOLDER | admin.feedback |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Directory |  | Organizations | /user/org-list | NAV_PLACEHOLDER | admin.organizations |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Directory |  | Users | /user/user-list | NAV_PLACEHOLDER | admin.users |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Directory |  | Roles & Permissions | /user/admin/rbac | NAV_PLACEHOLDER | admin.rbac |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Billing |  | Plans | /user/admin/plans | SUBSCRIPTIONS | admin.billing.plans |  |  | FAIL (no route) |  |
| admin | Billing |  | User Subscriptions | /user/admin/subscriptions | NAV_PLACEHOLDER | admin.billing.subscriptions |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Billing |  | Invoices & Payments | /user/admin/payments | NAV_PLACEHOLDER | admin.billing.payments |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Billing |  | Coupons / Promos | /user/admin/coupons | NAV_PLACEHOLDER | admin.billing.coupons |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Content |  | Feature Flags | /user/admin/feature-flags | ADMIN_CONSOLE | admin.featureflags |  |  | FAIL (no route) |  |
| admin | Content |  | Resume Templates | /user/admin/resume-templates | ADMIN_CONSOLE | admin.resume.templates |  |  | FAIL (no route) |  |
| admin | Content |  | Resume Blocks / Sections | /user/admin/resume-blocks | NAV_PLACEHOLDER | admin.resume.blocks |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Content |  | Courses Catalog | /user/admin/courses | NAV_PLACEHOLDER | admin.learn.courses |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Content |  | Learning Paths | /user/admin/learning-paths | NAV_PLACEHOLDER | admin.learn.paths |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Content |  | Announcements | /user/admin/announcements | NAV_PLACEHOLDER | admin.announcements |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | System |  | Audit Logs | /user/admin/audit-logs | NAV_PLACEHOLDER | admin.audit.logs |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | System |  | Errors & Logs | /user/admin/errors | NAV_PLACEHOLDER | admin.error.monitoring |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | System |  | Background Jobs | /user/admin/jobs | NAV_PLACEHOLDER | admin.jobs |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | System |  | Integrations | /user/admin/integrations | NAV_PLACEHOLDER | admin.integrations |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user |  |  | Dashboard | /user/dashboard |  | user.dashboard |  |  | FAIL (no route) |  |
| user |  |  | Activity | /user/activity | NAV_PLACEHOLDER | user.activity |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Resume Portal |  | My Resumes | /user/resumes | RESUME_PORTAL | resume.portal |  |  | FAIL (no route) |  |
| user | Resume Portal |  | Resume Builder | /user/resume-builder | NAV_PLACEHOLDER | resume.builder |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Resume Portal |  | Templates | /user/resume-templates | NAV_PLACEHOLDER | resume.templates.premium |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Resume Portal |  | Cover Letters | /user/cover-letters | NAV_PLACEHOLDER | resume.coverletters |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Resume Portal |  | ATS / AI Improve | /user/ai-improve | NAV_PLACEHOLDER | resume.ai.optimize |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Resume Portal |  | Export (PDF/DOCX) | /user/resume-export | NAV_PLACEHOLDER | resume.export |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Resume Portal |  | Share Links | /user/resume-share | NAV_PLACEHOLDER | resume.share |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Resume Portal |  | Version History | /user/resume-versions | NAV_PLACEHOLDER | resume.versions |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Job Tracking |  | Applications | /user/job-applications | JOB_TRACKING | job.tracking |  |  | FAIL (no route) |  |
| user | Job Tracking |  | Pipeline | /user/job-pipeline | NAV_PLACEHOLDER | job.pipeline |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Job Tracking |  | Interviews | /user/interviews | NAV_PLACEHOLDER | job.interviews |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Job Tracking |  | Contacts | /user/contacts | NAV_PLACEHOLDER | job.contacts |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Job Tracking |  | Saved Jobs | /user/saved-jobs | NAV_PLACEHOLDER | job.saved |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Job Tracking |  | Analytics | /user/job-analytics |  | job.analytics |  |  | FAIL (no route) |  |
| user | Job Tracking |  | Reminders | /user/job-reminders | NAV_PLACEHOLDER | job.reminders |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Job Tracking |  | Email / Calendar Sync | /user/job-integrations | NAV_PLACEHOLDER | job.integrations |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Learn |  | Course Central | /user/user-learn | COURSE_CENTRAL | learn.portal |  |  | FAIL (no route) |  |
| user | Learn |  | Saved | /user/learn-saved |  | learn.saved |  |  | FAIL (no route) |  |
| user | Learn |  | Paths | /user/learn-paths | NAV_PLACEHOLDER | learn.paths.premium |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Learn |  | My Learning Plan | /user/learn-plan | NAV_PLACEHOLDER | learn.plan |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Learn |  | Certificates | /user/learn-certificates | NAV_PLACEHOLDER | learn.certificates |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Documents |  | My Documents | /user/documents | NAV_PLACEHOLDER | docs.storage |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Documents |  | Import / Export | /user/import-export | NAV_PLACEHOLDER | docs.importexport |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user |  |  | Notifications | /notifications | ALERTS | job.alerts |  |  | FAIL (no route) |  |
| user | Billing |  | My Plan | /user/billing | NAV_PLACEHOLDER | billing |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Billing |  | Upgrade | /user/billing/upgrade |  | billing.upgrade |  |  | FAIL (no route) |  |
| user | Billing |  | Invoices | /user/billing/invoices | NAV_PLACEHOLDER | billing.invoices |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Billing |  | Payment Methods | /user/billing/payment-methods | NAV_PLACEHOLDER | billing.paymentmethods |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Support |  | Help Center | /user/support | NAV_PLACEHOLDER | support |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Support |  | My Tickets | /user/support/tickets | NAV_PLACEHOLDER | support.tickets |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Support |  | Feature Requests | /user/support/requests | NAV_PLACEHOLDER | support.feature.requests |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user |  |  | My Profile | /user/profile |  | profile |  |  | FAIL (no route) |  |
| user |  |  | Public Profile | /user/public-profile | NAV_PLACEHOLDER | profile.public |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Settings |  | Account Settings | /user/settings | NAV_PLACEHOLDER | settings.account |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Settings |  | Change Password | /user/change-password | NAV_PLACEHOLDER | settings.password |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Settings |  | Security (2FA) | /user/settings/security | NAV_PLACEHOLDER | settings.security.2fa |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Settings |  | Connected Apps | /user/settings/integrations | NAV_PLACEHOLDER | settings.integrations |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user |  |  | Logout | /authentication/logout |  |  |  |  | PASS |  |

## Lint

- nav raw featureFlag strings: 0
- nav raw entitlementKey strings: 0
- nav unknown featureFlag values: 0
- nav unknown entitlementKey values: 0
