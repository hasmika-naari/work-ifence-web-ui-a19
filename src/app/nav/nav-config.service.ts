import { Injectable } from '@angular/core';
import { NavSection } from './nav.model';
import { PlanTier } from './nav.model';
import { FEATURE_FLAGS } from '../config/feature-flags';
import { ENTITLEMENT_KEYS } from '../entitlements/entitlement-keys';

/**
 * @deprecated Replaced by BE-driven nav (/api/nav/menu) via NavStore.
 * Kept temporarily for backward compatibility; scheduled for cleanup.
 */
@Injectable({ providedIn: 'root' })
export class NavConfigService {

  getSectionsForRole(role: string): NavSection[] {
    console.log('[NavConfigService] getSectionsForRole called with role:', role);

    if (role === 'ROLE_ADMIN') {
      const adminMenu: NavSection[] = [
        // ADMIN HOME
        {
          id: 'admin-home',
          title: 'Admin',
          items: [
            {
              id: 'admin-dashboard',
              title: 'Admin Dashboard',
              icon: 'grid',
              route: '/user/dashboard-admin',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.ADMIN_CONSOLE
            },
          ]
        },

        // OPERATIONS
        {
          id: 'admin-ops',
          title: 'Operations',
          items: [
            {
              id: 'requests',
              title: 'Requests',
              icon: 'inbox',
              route: '/user/requests',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.ADMIN_REQUESTS
            },
            {
              id: 'enterprise-onboarding',
              title: 'Onboarding Requests',
              icon: 'file-text',
              route: '/user/admin/onboarding-requests',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.ADMIN_ENTERPRISE_ONBOARDING
            },
            {
              id: 'support-tickets',
              title: 'Support Tickets',
              icon: 'help-circle',
              route: '/user/admin/support-tickets',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.ADMIN_SUPPORT_TICKETS
            },
            {
              id: 'feedback',
              title: 'Feedback & Requests',
              icon: 'message-square',
              route: '/user/admin/feedback',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.ADMIN_FEEDBACK
            },
          ]
        },

        // ORG & USERS
        {
          id: 'admin-directory',
          title: 'Directory',
          items: [
            {
              id: 'orgs',
              title: 'Organizations',
              icon: 'briefcase',
              route: '/user/org-list',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.ADMIN_ORGANIZATIONS
            },
            {
              id: 'users',
              title: 'Users',
              icon: 'users',
              route: '/user/user-list',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.ADMIN_USERS
            },
            {
              id: 'roles',
              title: 'Roles & Permissions',
              icon: 'shield',
              route: '/user/admin/rbac',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.ADMIN_RBAC
            },
          ]
        },

        // BILLING / SUBSCRIPTIONS
        {
          id: 'admin-billing',
          title: 'Billing',
          items: [
            {
              id: 'plans',
              title: 'Plans',
              icon: 'layers',
              route: '/user/admin/plans',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.ADMIN_BILLING_PLANS
            },
            {
              id: 'subscriptions',
              title: 'User Subscriptions',
              icon: 'credit-card',
              route: '/user/admin/subscriptions',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.ADMIN_BILLING_SUBSCRIPTIONS
            },
            {
              id: 'payments',
              title: 'Invoices & Payments',
              icon: 'dollar-sign',
              route: '/user/admin/payments',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.ADMIN_BILLING_PAYMENTS
            },
            {
              id: 'coupons',
              title: 'Coupons / Promos',
              icon: 'tag',
              route: '/user/admin/coupons',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.ADMIN_BILLING_COUPONS
            }
          ]
        },

        // CONTENT MANAGEMENT
        {
          id: 'admin-content',
          title: 'Content',
          items: [
            {
              id: 'feature-flags',
              title: 'Feature Flags',
              icon: 'settings',
              route: '/user/admin/feature-flags',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.ADMIN_FEATUREFLAGS
            },
            {
              id: 'menu-management',
              title: 'Menu Management',
              icon: 'menu',
              route: '/user/admin/menu-management',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.ADMIN_CONSOLE
            },
            {
              id: 'resume-templates',
              title: 'Resume Templates',
              icon: 'layout',
              route: '/user/admin/resume-templates',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.ADMIN_RESUME_TEMPLATES
            },
            {
              id: 'resume-sections',
              title: 'Resume Blocks / Sections',
              icon: 'grid',
              route: '/user/admin/resume-blocks',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.ADMIN_RESUME_BLOCKS
            },
            {
              id: 'courses',
              title: 'Courses Catalog',
              icon: 'book-open',
              route: '/user/admin/courses',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.ADMIN_LEARN_COURSES
            },
            {
              id: 'learning-paths',
              title: 'Learning Paths',
              icon: 'map',
              route: '/user/admin/learning-paths',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.ADMIN_LEARN_PATHS
            },
            {
              id: 'announcements',
              title: 'Announcements',
              icon: 'bell',
              route: '/user/admin/announcements',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.ADMIN_ANNOUNCEMENTS
            },
          ]
        },

        // SYSTEM / MONITORING
        {
          id: 'admin-system',
          title: 'System',
          items: [
            {
              id: 'audit-logs',
              title: 'Audit Logs',
              icon: 'file',
              route: '/user/admin/audit-logs',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.ADMIN_AUDIT_LOGS
            },
            {
              id: 'error-logs',
              title: 'Errors & Logs',
              icon: 'alert-triangle',
              route: '/user/admin/errors',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.ADMIN_ERROR_MONITORING
            },
            {
              id: 'jobs',
              title: 'Background Jobs',
              icon: 'activity',
              route: '/user/admin/jobs',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.ADMIN_JOBS
            },
            {
              id: 'integrations',
              title: 'Integrations',
              icon: 'link',
              route: '/user/admin/integrations',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.ADMIN_INTEGRATIONS
            },
          ]
        },
      ];

      console.log('[NavConfigService] Returning admin menu config:', adminMenu);
      return adminMenu;
    }

    // ROLE_USER (default)
    const userMenu: NavSection[] = [
      // DASHBOARD
      {
        id: 'dashboard',
        items: [
          { id: 'dashboard', title: 'Dashboard', icon: 'grid', route: '/user/dashboard', entitlementKey: ENTITLEMENT_KEYS.USER_DASHBOARD },
          {
            id: 'activity',
            title: 'Activity',
            icon: 'activity',
            route: '/user/activity',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.USER_ACTIVITY,
            showWhenLocked: true,
            minPlan: PlanTier.PRO
          }
        ]
      },

      // RESUME PORTAL
      {
        id: 'resume-portal',
        title: 'Resume Portal',
        items: [
          { id: 'my-resumes', title: 'My Resumes', icon: 'file-text', route: '/user/resumes', featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER, entitlementKey: ENTITLEMENT_KEYS.RESUME_PORTAL },

          // Future core page (builder)
          {
            id: 'resume-builder',
            title: 'Resume Builder',
            icon: 'edit',
            route: '/user/resume-builder',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.RESUME_BUILDER
          },

          // Premium features shown but locked
          {
            id: 'templates',
            title: 'Templates',
            icon: 'layout',
            route: '/user/resume-templates',
            featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
            entitlementKey: ENTITLEMENT_KEYS.RESUME_TEMPLATES_PREMIUM,
            showWhenLocked: true,
            minPlan: PlanTier.PRO
          },
          {
            id: 'cover-letters',
            title: 'Cover Letters',
            icon: 'file',
            route: '/user/cover-letters',
            featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
            entitlementKey: ENTITLEMENT_KEYS.RESUME_COVERLETTERS,
            showWhenLocked: true,
            minPlan: PlanTier.PRO
          },
          {
            id: 'ai-improve',
            title: 'ATS / AI Improve',
            icon: 'zap',
            route: '/user/ai-improve',
            featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
            entitlementKey: ENTITLEMENT_KEYS.RESUME_AI_OPTIMIZE,
            showWhenLocked: true,
            minPlan: PlanTier.PRO
          },
          {
            id: 'export',
            title: 'Export (PDF/DOCX)',
            icon: 'download',
            route: '/user/resume-export',
            featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
            entitlementKey: ENTITLEMENT_KEYS.RESUME_EXPORT,
            showWhenLocked: true,
            minPlan: PlanTier.PRO
          },
          {
            id: 'share',
            title: 'Share Links',
            icon: 'share-2',
            route: '/user/resume-share',
            featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
            entitlementKey: ENTITLEMENT_KEYS.RESUME_SHARE,
            showWhenLocked: true,
            minPlan: PlanTier.PRO
          },
          {
            id: 'versions',
            title: 'Version History',
            icon: 'clock',
            route: '/user/resume-versions',
            featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
            entitlementKey: ENTITLEMENT_KEYS.RESUME_VERSIONS,
            showWhenLocked: true,
            minPlan: PlanTier.PREMIUM
          }
        ]
      },

      // JOB APPLICATIONS
      {
        id: 'job-apps',
        title: 'Job Tracking',
        items: [
          {
            id: 'applications',
            title: 'Applications',
            icon: 'file',
            route: '/user/job-applications',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.JOB_TRACKING
          },
          {
            id: 'pipeline',
            title: 'Pipeline',
            icon: 'git-branch',
            route: '/user/job-pipeline',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.JOB_PIPELINE
          },

          // Future modules
          {
            id: 'interviews',
            title: 'Interviews',
            icon: 'calendar',
            route: '/user/interviews',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.JOB_INTERVIEWS,
            showWhenLocked: true,
            minPlan: PlanTier.PRO
          },
          {
            id: 'contacts',
            title: 'Contacts',
            icon: 'user-plus',
            route: '/user/contacts',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.JOB_CONTACTS,
            showWhenLocked: true,
            minPlan: PlanTier.PRO
          },
          {
            id: 'saved-jobs',
            title: 'Saved Jobs',
            icon: 'bookmark',
            route: '/user/saved-jobs',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.JOB_SAVED,
            showWhenLocked: true,
            minPlan: PlanTier.PRO
          },

          // Premium analytics + reminders
          {
            id: 'analytics',
            title: 'Analytics',
            icon: 'bar-chart-2',
            route: '/user/job-analytics',
            entitlementKey: ENTITLEMENT_KEYS.JOB_ANALYTICS,
            showWhenLocked: true,
            minPlan: PlanTier.PRO
          },
          {
            id: 'reminders',
            title: 'Reminders',
            icon: 'clock',
            route: '/user/job-reminders',
            featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
            entitlementKey: ENTITLEMENT_KEYS.JOB_REMINDERS,
            showWhenLocked: true,
            minPlan: PlanTier.PRO
          },
          {
            id: 'integrations',
            title: 'Email / Calendar Sync',
            icon: 'link',
            route: '/user/job-integrations',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.JOB_INTEGRATIONS,
            showWhenLocked: true,
            minPlan: PlanTier.PREMIUM
          }
        ]
      },

      // LEARN
      {
        id: 'learn',
        title: 'Learn',
        items: [
          { id: 'course-central', title: 'Course Central', icon: 'book-open', route: '/user/user-learn', featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER, entitlementKey: ENTITLEMENT_KEYS.LEARN_PORTAL },
          { id: 'saved', title: 'Saved', icon: 'bookmark', route: '/user/learn-saved', featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER, entitlementKey: ENTITLEMENT_KEYS.LEARN_SAVED },

          // Future modules (locked but visible)
          {
            id: 'paths',
            title: 'Paths',
            icon: 'map',
            route: '/user/learn-paths',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.LEARN_PATHS_PREMIUM,
            showWhenLocked: true,
            minPlan: PlanTier.PRO
          },
          {
            id: 'plan',
            title: 'My Learning Plan',
            icon: 'target',
            route: '/user/learn-plan',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.LEARN_PLAN,
            showWhenLocked: true,
            minPlan: PlanTier.PRO
          },
          {
            id: 'certificates',
            title: 'Certificates',
            icon: 'award',
            route: '/user/learn-certificates',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.LEARN_CERTIFICATES,
            showWhenLocked: true,
            minPlan: PlanTier.PRO
          }
        ]
      },

      // DOCUMENTS (future useful module)
      {
        id: 'documents',
        title: 'Documents',
        items: [
          {
            id: 'my-docs',
            title: 'My Documents',
            icon: 'folder',
            route: '/user/documents',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.DOCS_STORAGE,
            showWhenLocked: true,
            minPlan: PlanTier.PRO
          },
          {
            id: 'import-export',
            title: 'Import / Export',
            icon: 'repeat',
            route: '/user/import-export',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.DOCS_IMPORTEXPORT,
            showWhenLocked: true,
            minPlan: PlanTier.PRO
          }
        ]
      },

      // NOTIFICATIONS
      {
        id: 'notifications',
        items: [
          { id: 'notifications', title: 'Notifications', icon: 'bell', route: '/notifications', featureFlag: FEATURE_FLAGS.JOB_ALERTS, entitlementKey: ENTITLEMENT_KEYS.JOB_ALERTS }
        ]
      },

      // BILLING
      {
        id: 'billing',
        title: 'Billing',
        items: [
          { id: 'billing-home', title: 'My Plan', icon: 'credit-card', route: '/user/billing', featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER, entitlementKey: ENTITLEMENT_KEYS.BILLING },
          { id: 'upgrade', title: 'Upgrade', icon: 'arrow-up-circle', route: '/user/billing/upgrade', entitlementKey: ENTITLEMENT_KEYS.BILLING_UPGRADE },
          { id: 'invoices', title: 'Invoices', icon: 'file', route: '/user/billing/invoices', featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER, entitlementKey: ENTITLEMENT_KEYS.BILLING_INVOICES },
          {
            id: 'payment-methods',
            title: 'Payment Methods',
            icon: 'wallet',
            route: '/user/billing/payment-methods',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.BILLING_PAYMENTMETHODS,
            showWhenLocked: true,
            minPlan: PlanTier.PRO
          }
        ]
      },

      // SUPPORT
      {
        id: 'support',
        title: 'Support',
        items: [
          { id: 'help', title: 'Help Center', icon: 'help-circle', route: '/user/support', featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER, entitlementKey: ENTITLEMENT_KEYS.SUPPORT },
          {
            id: 'tickets',
            title: 'My Tickets',
            icon: 'inbox',
            route: '/user/support/tickets',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.SUPPORT_TICKETS
          },
          {
            id: 'feature-requests',
            title: 'Feature Requests',
            icon: 'message-square',
            route: '/user/support/requests',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.SUPPORT_FEATURE_REQUESTS
          }
        ]
      },

      // PROFILE
      {
        id: 'profile',
        items: [
          { id: 'profile', title: 'My Profile', icon: 'user', route: '/user/profile', entitlementKey: ENTITLEMENT_KEYS.PROFILE },
          {
            id: 'public-profile',
            title: 'Public Profile',
            icon: 'globe',
            route: '/user/public-profile',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.PROFILE_PUBLIC,
            showWhenLocked: true,
            minPlan: PlanTier.PRO
          }
        ]
      },

      // SETTINGS
      {
        id: 'settings',
        title: 'Settings',
        items: [
          { id: 'account-settings', title: 'Account Settings', icon: 'settings', route: '/user/settings', featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER, entitlementKey: ENTITLEMENT_KEYS.SETTINGS_ACCOUNT },
          { id: 'change-password', title: 'Change Password', icon: 'lock', route: '/user/change-password', featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER, entitlementKey: ENTITLEMENT_KEYS.SETTINGS_PASSWORD },

          // Future settings (premium/enterprise)
          {
            id: 'security',
            title: 'Security (2FA)',
            icon: 'shield',
            route: '/user/settings/security',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.SETTINGS_SECURITY_2FA,
            showWhenLocked: true,
            minPlan: PlanTier.PREMIUM
          },
          {
            id: 'integrations',
            title: 'Connected Apps',
            icon: 'link',
            route: '/user/settings/integrations',
              featureFlag: FEATURE_FLAGS.NAV_PLACEHOLDER,
              entitlementKey: ENTITLEMENT_KEYS.SETTINGS_INTEGRATIONS,
            showWhenLocked: true,
            minPlan: PlanTier.PREMIUM
          }
        ]
      },

      // LOGOUT
      {
        id: 'logout',
        items: [
          { id: 'logout', title: 'Logout', icon: 'log-out', route: '/authentication/logout' }
        ]
      }
    ];

    console.log('[NavConfigService] Returning user menu config:', userMenu);
    return userMenu;
  }
}
