# Nav/Route Gating Audit

Summary: {"total":64,"pass":1,"fail":5,"hidden":58,"group":0}

| role | section | parent | title | route | navFlag | navEnt | routeFlag | routeEnt | status | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| admin | Admin |  | Admin Dashboard | /user/dashboard-admin | NAV_PLACEHOLDER | ADMIN_CONSOLE |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Operations |  | Requests | /user/requests | NAV_PLACEHOLDER | ADMIN_REQUESTS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Operations |  | Onboarding Requests | /user/admin/onboarding-requests | NAV_PLACEHOLDER | ADMIN_ENTERPRISE_ONBOARDING |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Operations |  | Support Tickets | /user/admin/support-tickets | NAV_PLACEHOLDER | ADMIN_SUPPORT_TICKETS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Operations |  | Feedback & Requests | /user/admin/feedback | NAV_PLACEHOLDER | ADMIN_FEEDBACK |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Directory |  | Organizations | /user/org-list | NAV_PLACEHOLDER | ADMIN_ORGANIZATIONS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Directory |  | Users | /user/user-list | NAV_PLACEHOLDER | ADMIN_USERS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Directory |  | Roles & Permissions | /user/admin/rbac | NAV_PLACEHOLDER | ADMIN_RBAC |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Billing |  | Plans | /user/admin/plans | NAV_PLACEHOLDER | ADMIN_BILLING_PLANS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Billing |  | User Subscriptions | /user/admin/subscriptions | NAV_PLACEHOLDER | ADMIN_BILLING_SUBSCRIPTIONS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Billing |  | Upgrade Requests | /user/admin/upgrade-requests | NAV_PLACEHOLDER | ADMIN_BILLING_SUBSCRIPTIONS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Billing |  | Invoices & Payments | /user/admin/payments | NAV_PLACEHOLDER | ADMIN_BILLING_PAYMENTS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Billing |  | Coupons / Promos | /user/admin/coupons | NAV_PLACEHOLDER | ADMIN_BILLING_COUPONS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Content |  | Feature Flags | /user/admin/feature-flags | NAV_PLACEHOLDER | ADMIN_FEATUREFLAGS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Content |  | Menu Management | /user/admin/menu-management | NAV_PLACEHOLDER | ADMIN_CONSOLE |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Content |  | Resume Templates | /user/admin/resume-templates | NAV_PLACEHOLDER | ADMIN_RESUME_TEMPLATES |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Content |  | Resume Blocks / Sections | /user/admin/resume-blocks | NAV_PLACEHOLDER | ADMIN_RESUME_BLOCKS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Content |  | Courses Catalog | /user/admin/courses | NAV_PLACEHOLDER | ADMIN_LEARN_COURSES |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Content |  | Learning Paths | /user/admin/learning-paths | NAV_PLACEHOLDER | ADMIN_LEARN_PATHS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | Content |  | Announcements | /user/admin/announcements | NAV_PLACEHOLDER | ADMIN_ANNOUNCEMENTS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | System |  | Audit Logs | /user/admin/audit-logs | NAV_PLACEHOLDER | ADMIN_AUDIT_LOGS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | System |  | Errors & Logs | /user/admin/errors | NAV_PLACEHOLDER | ADMIN_ERROR_MONITORING |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | System |  | Background Jobs | /user/admin/jobs | NAV_PLACEHOLDER | ADMIN_JOBS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| admin | System |  | Integrations | /user/admin/integrations | NAV_PLACEHOLDER | ADMIN_INTEGRATIONS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user |  |  | Dashboard | /user/dashboard |  | USER_DASHBOARD |  |  | FAIL (no route) |  |
| user |  |  | Activity | /user/activity | NAV_PLACEHOLDER | USER_ACTIVITY |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Resume Portal |  | My Resumes | /user/resumes | NAV_PLACEHOLDER | RESUME_PORTAL |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Resume Portal |  | Resume Builder | /user/resume-builder | NAV_PLACEHOLDER | RESUME_BUILDER |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Resume Portal |  | Templates | /user/resume-templates | NAV_PLACEHOLDER | RESUME_TEMPLATES_PREMIUM |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Resume Portal |  | Cover Letters | /user/cover-letters | NAV_PLACEHOLDER | RESUME_COVERLETTERS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Resume Portal |  | ATS / AI Improve | /user/ai-improve | NAV_PLACEHOLDER | RESUME_AI_OPTIMIZE |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Resume Portal |  | Export (PDF/DOCX) | /user/resume-export | NAV_PLACEHOLDER | RESUME_EXPORT |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Resume Portal |  | Share Links | /user/resume-share | NAV_PLACEHOLDER | RESUME_SHARE |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Resume Portal |  | Version History | /user/resume-versions | NAV_PLACEHOLDER | RESUME_VERSIONS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Job Tracking |  | Applications | /user/job-applications | NAV_PLACEHOLDER | JOB_TRACKING |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Job Tracking |  | Pipeline | /user/job-pipeline | NAV_PLACEHOLDER | JOB_PIPELINE |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Job Tracking |  | Interviews | /user/interviews | NAV_PLACEHOLDER | JOB_INTERVIEWS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Job Tracking |  | Contacts | /user/contacts | NAV_PLACEHOLDER | JOB_CONTACTS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Job Tracking |  | Saved Jobs | /user/saved-jobs | NAV_PLACEHOLDER | JOB_SAVED |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Job Tracking |  | Analytics | /user/job-analytics |  | JOB_ANALYTICS |  |  | FAIL (no route) |  |
| user | Job Tracking |  | Reminders | /user/job-reminders | NAV_PLACEHOLDER | JOB_REMINDERS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Job Tracking |  | Email / Calendar Sync | /user/job-integrations | NAV_PLACEHOLDER | JOB_INTEGRATIONS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Learn |  | Course Central | /user/user-learn | NAV_PLACEHOLDER | LEARN_PORTAL |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Learn |  | Saved | /user/learn-saved | NAV_PLACEHOLDER | LEARN_SAVED |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Learn |  | Paths | /user/learn-paths | NAV_PLACEHOLDER | LEARN_PATHS_PREMIUM |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Learn |  | My Learning Plan | /user/learn-plan | NAV_PLACEHOLDER | LEARN_PLAN |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Learn |  | Certificates | /user/learn-certificates | NAV_PLACEHOLDER | LEARN_CERTIFICATES |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Documents |  | My Documents | /user/documents | NAV_PLACEHOLDER | DOCS_STORAGE |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Documents |  | Import / Export | /user/import-export | NAV_PLACEHOLDER | DOCS_IMPORTEXPORT |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user |  |  | Notifications | /notifications | ALERTS | JOB_ALERTS |  |  | FAIL (no route) |  |
| user | Billing |  | My Plan | /user/billing | NAV_PLACEHOLDER | BILLING |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Billing |  | Upgrade | /user/billing/upgrade |  | BILLING_UPGRADE |  |  | FAIL (no route) |  |
| user | Billing |  | Invoices | /user/billing/invoices | NAV_PLACEHOLDER | BILLING_INVOICES |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Billing |  | Payment Methods | /user/billing/payment-methods | NAV_PLACEHOLDER | BILLING_PAYMENTMETHODS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Support |  | Help Center | /user/support | NAV_PLACEHOLDER | SUPPORT |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Support |  | My Tickets | /user/support/tickets | NAV_PLACEHOLDER | SUPPORT_TICKETS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Support |  | Feature Requests | /user/support/requests | NAV_PLACEHOLDER | SUPPORT_FEATURE_REQUESTS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user |  |  | My Profile | /user/profile |  | PROFILE |  |  | FAIL (no route) |  |
| user |  |  | Public Profile | /user/public-profile | NAV_PLACEHOLDER | PROFILE_PUBLIC |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Settings |  | Account Settings | /user/settings | NAV_PLACEHOLDER | SETTINGS_ACCOUNT |  |  | HIDDEN (route exists) | Nav hidden via NAV_PLACEHOLDER; route still present |
| user | Settings |  | Change Password | /user/change-password | NAV_PLACEHOLDER | SETTINGS_PASSWORD |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Settings |  | Security (2FA) | /user/settings/security | NAV_PLACEHOLDER | SETTINGS_SECURITY_2FA |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user | Settings |  | Connected Apps | /user/settings/integrations | NAV_PLACEHOLDER | SETTINGS_INTEGRATIONS |  |  | HIDDEN (no route) | Nav hidden via NAV_PLACEHOLDER; prevents dead link |
| user |  |  | Logout | /authentication/logout |  |  |  |  | PASS |  |

## Lint

- nav raw featureFlag strings: 0
- nav raw entitlementKey strings: 0
- nav unknown featureFlag values: 0
- nav unknown entitlementKey values: 0
