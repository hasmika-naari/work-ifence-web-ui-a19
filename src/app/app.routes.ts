import { Routes } from '@angular/router';
import { EcommerceComponent } from './dashboard/ecommerce/ecommerce.component';
import { CrmComponent } from './dashboard/crm/crm.component';
import { ProjectManagementComponent } from './dashboard/project-management/project-management.component';
import { LmsComponent } from './dashboard/lms/lms.component';
import { HelpDeskComponent } from './dashboard/help-desk/help-desk.component';
import { AppsComponent } from './apps/apps.component';
import { ToDoListComponent } from './apps/to-do-list/to-do-list.component';
import { CalendarComponent } from './apps/calendar/calendar.component';
import { ContactsComponent } from './apps/contacts/contacts.component';
import { ChatComponent } from './apps/chat/chat.component';
import { EmailComponent } from './apps/email/email.component';
import { InboxComponent } from './apps/email/inbox/inbox.component';
import { ComposeComponent } from './apps/email/compose/compose.component';
import { ReadComponent } from './apps/email/read/read.component';
import { KanbanBoardComponent } from './apps/kanban-board/kanban-board.component';
import { FileManagerComponent } from './apps/file-manager/file-manager.component';
import { EcommercePageComponent } from './pages/ecommerce-page/ecommerce-page.component';
import { EProductsGridComponent } from './pages/ecommerce-page/e-products-grid/e-products-grid.component';
import { EProductsListComponent } from './pages/ecommerce-page/e-products-list/e-products-list.component';
import { EProductDetailsComponent } from './pages/ecommerce-page/e-product-details/e-product-details.component';
import { ECreateProductComponent } from './pages/ecommerce-page/e-create-product/e-create-product.component';
import { ECartComponent } from './pages/ecommerce-page/e-cart/e-cart.component';
import { ECheckoutComponent } from './pages/ecommerce-page/e-checkout/e-checkout.component';
import { EOrdersListComponent } from './pages/ecommerce-page/e-orders-list/e-orders-list.component';
import { EOrderDetailsComponent } from './pages/ecommerce-page/e-order-details/e-order-details.component';
import { ECustomersListComponent } from './pages/ecommerce-page/e-customers-list/e-customers-list.component';
import { ESellersComponent } from './pages/ecommerce-page/e-sellers/e-sellers.component';
import { ESellerDetailsComponent } from './pages/ecommerce-page/e-seller-details/e-seller-details.component';
import { CrmPageComponent } from './pages/crm-page/crm-page.component';
import { CContactsComponent } from './pages/crm-page/c-contacts/c-contacts.component';
import { CCustomersComponent } from './pages/crm-page/c-customers/c-customers.component';
import { COpportunitiesComponent } from './pages/crm-page/c-opportunities/c-opportunities.component';
import { CLeadsComponent } from './pages/crm-page/c-leads/c-leads.component';
import { ProjectManagementPageComponent } from './pages/project-management-page/project-management-page.component';
import { PmProjectsListComponent } from './pages/project-management-page/pm-projects-list/pm-projects-list.component';
import { PmProjectDetailsComponent } from './pages/project-management-page/pm-project-details/pm-project-details.component';
import { PmCreateProjectComponent } from './pages/project-management-page/pm-create-project/pm-create-project.component';
import { PmClientsComponent } from './pages/project-management-page/pm-clients/pm-clients.component';
import { PmTeamsComponent } from './pages/project-management-page/pm-teams/pm-teams.component';
import { PmTasksComponent } from './pages/project-management-page/pm-tasks/pm-tasks.component';
import { PmUsersComponent } from './pages/project-management-page/pm-users/pm-users.component';
import { PmKanbanBoardComponent } from './pages/project-management-page/pm-kanban-board/pm-kanban-board.component';
import { LmsPageComponent } from './pages/lms-page/lms-page.component';
import { LCoursesListComponent } from './pages/lms-page/l-courses-list/l-courses-list.component';
import { LCourseDetailsComponent } from './pages/lms-page/l-course-details/l-course-details.component';
import { LLessonPreviewComponent } from './pages/lms-page/l-lesson-preview/l-lesson-preview.component';
import { LCreateCourseComponent } from './pages/lms-page/l-create-course/l-create-course.component';
import { HelpDeskPageComponent } from './pages/help-desk-page/help-desk-page.component';
import { HdTicketsComponent } from './pages/help-desk-page/hd-tickets/hd-tickets.component';
import { HdReportsComponent } from './pages/help-desk-page/hd-reports/hd-reports.component';
import { HdAgentsComponent } from './pages/help-desk-page/hd-agents/hd-agents.component';
import { EventsPageComponent } from './pages/events-page/events-page.component';
import { EventsListComponent } from './pages/events-page/events-list/events-list.component';
import { EventDetailsComponent } from './pages/events-page/event-details/event-details.component';
import { CreateAnEventComponent } from './pages/events-page/create-an-event/create-an-event.component';
import { SocialFeedPageComponent } from './pages/social-feed-page/social-feed-page.component';
import { InvoicesPageComponent } from './pages/invoices-page/invoices-page.component';
import { InvoicesComponent } from './pages/invoices-page/invoices/invoices.component';
import { InvoiceDetailsComponent } from './pages/invoices-page/invoice-details/invoice-details.component';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { TeamMembersComponent } from './pages/users-page/team-members/team-members.component';
import { UsersListComponent } from './pages/users-page/users-list/users-list.component';
import { AddUserComponent } from './pages/users-page/add-user/add-user.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { PUserProfileComponent } from './pages/profile-page/p-user-profile/p-user-profile.component';
import { PTeamsComponent } from './pages/profile-page/p-teams/p-teams.component';
import { PProjectsComponent } from './pages/profile-page/p-projects/p-projects.component';
import { StarterComponent } from './starter/starter.component';
import { IconsComponent } from './icons/icons.component';
import { MaterialSymbolsComponent } from './icons/material-symbols/material-symbols.component';
import { FeathericonsComponent } from './icons/feathericons/feathericons.component';
import { RemixiconComponent } from './icons/remixicon/remixicon.component';
import { UiElementsComponent } from './ui-elements/ui-elements.component';
import { AlertsComponent } from './ui-elements/alerts/alerts.component';
import { AutocompleteComponent } from './ui-elements/autocomplete/autocomplete.component';
import { AvatarsComponent } from './ui-elements/avatars/avatars.component';
import { AccordionComponent } from './ui-elements/accordion/accordion.component';
import { BadgesComponent } from './ui-elements/badges/badges.component';
import { BreadcrumbComponent } from './ui-elements/breadcrumb/breadcrumb.component';
import { ButtonToggleComponent } from './ui-elements/button-toggle/button-toggle.component';
import { BottomSheetComponent } from './ui-elements/bottom-sheet/bottom-sheet.component';
import { ButtonsComponent } from './ui-elements/buttons/buttons.component';
import { CardsComponent } from './ui-elements/cards/cards.component';
import { CarouselsComponent } from './ui-elements/carousels/carousels.component';
import { CheckboxComponent } from './ui-elements/checkbox/checkbox.component';
import { ChipsComponent } from './ui-elements/chips/chips.component';
import { ClipboardComponent } from './ui-elements/clipboard/clipboard.component';
import { ColorPickerComponent } from './ui-elements/color-picker/color-picker.component';
import { DatepickerComponent } from './ui-elements/datepicker/datepicker.component';
import { DialogComponent } from './ui-elements/dialog/dialog.component';
import { DividerComponent } from './ui-elements/divider/divider.component';
import { DragDropComponent } from './ui-elements/drag-drop/drag-drop.component';
import { ExpansionComponent } from './ui-elements/expansion/expansion.component';
import { FormFieldComponent } from './ui-elements/form-field/form-field.component';
import { GridListComponent } from './ui-elements/grid-list/grid-list.component';
import { IconComponent } from './ui-elements/icon/icon.component';
import { InputComponent } from './ui-elements/input/input.component';
import { ListComponent } from './ui-elements/list/list.component';
import { ListboxComponent } from './ui-elements/listbox/listbox.component';
import { MenusComponent } from './ui-elements/menus/menus.component';
import { PaginationComponent } from './ui-elements/pagination/pagination.component';
import { ProgressBarComponent } from './ui-elements/progress-bar/progress-bar.component';
import { RadioComponent } from './ui-elements/radio/radio.component';
import { RatioComponent } from './ui-elements/ratio/ratio.component';
import { SelectComponent } from './ui-elements/select/select.component';
import { SidenavComponent } from './ui-elements/sidenav/sidenav.component';
import { SlideToggleComponent } from './ui-elements/slide-toggle/slide-toggle.component';
import { SliderComponent } from './ui-elements/slider/slider.component';
import { SnackbarComponent } from './ui-elements/snackbar/snackbar.component';
import { StepperComponent } from './ui-elements/stepper/stepper.component';
import { TypographyComponent } from './ui-elements/typography/typography.component';
import { UtilitiesComponent } from './ui-elements/utilities/utilities.component';
import { VideosComponent } from './ui-elements/videos/videos.component';
import { TreeComponent } from './ui-elements/tree/tree.component';
import { TooltipComponent } from './ui-elements/tooltip/tooltip.component';
import { ToolbarComponent } from './ui-elements/toolbar/toolbar.component';
import { TabsComponent } from './ui-elements/tabs/tabs.component';
import { TableComponent } from './ui-elements/table/table.component';
import { TablesComponent } from './tables/tables.component';
import { FormsComponent } from './forms/forms.component';
import { BasicElementsComponent } from './forms/basic-elements/basic-elements.component';
import { AdvancedElementsComponent } from './forms/advanced-elements/advanced-elements.component';
import { WizardComponent } from './forms/wizard/wizard.component';
import { EditorsComponent } from './forms/editors/editors.component';
import { FileUploaderComponent } from './forms/file-uploader/file-uploader.component';
import { PricingPageComponent } from './pages/pricing-page/pricing-page.component';
import { TimelinePageComponent } from './pages/timeline-page/timeline-page.component';
import { FaqPageComponent } from './pages/faq-page/faq-page.component';
import { GalleryPageComponent } from './pages/gallery-page/gallery-page.component';
import { TestimonialsPageComponent } from './pages/testimonials-page/testimonials-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { BlankPageComponent } from './blank-page/blank-page.component';
import { InternalErrorComponent } from './common/internal-error/internal-error.component';
import { WidgetsComponent } from './widgets/widgets.component';
import { MapsPageComponent } from './pages/maps-page/maps-page.component';
import { NotificationsPageComponent } from './pages/notifications-page/notifications-page.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountSettingsComponent } from './settings/account-settings/account-settings.component';
import { ChangePasswordComponent } from './settings/change-password/change-password.component';
import { ConnectionsComponent } from './settings/connections/connections.component';
import { PrivacyPolicyComponent } from './settings/privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './settings/terms-conditions/terms-conditions.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './authentication/reset-password/reset-password.component';
import { LockScreenComponent } from './authentication/lock-screen/lock-screen.component';
import { ConfirmEmailComponent } from './authentication/confirm-email/confirm-email.component';
import { LogoutComponent } from './authentication/logout/logout.component';
import { ApexchartsComponent } from './apexcharts/apexcharts.component';
import { LineChartsComponent } from './apexcharts/line-charts/line-charts.component';
import { AreaChartsComponent } from './apexcharts/area-charts/area-charts.component';
import { ColumnChartsComponent } from './apexcharts/column-charts/column-charts.component';
import { MixedChartsComponent } from './apexcharts/mixed-charts/mixed-charts.component';
import { RadialbarChartsComponent } from './apexcharts/radialbar-charts/radialbar-charts.component';
import { RadarChartsComponent } from './apexcharts/radar-charts/radar-charts.component';
import { PieChartsComponent } from './apexcharts/pie-charts/pie-charts.component';
import { PolarChartsComponent } from './apexcharts/polar-charts/polar-charts.component';
import { MoreChartsComponent } from './apexcharts/more-charts/more-charts.component';
import { AuthGuardService } from './services/auth-guard.service';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => 
            import('./pages/landing/landing.component')
                .then(m => m.LandingComponent), data: {reuseComponent: true, breadcrumb: 'Opening Details'}
    },
    {
        path: 'opening/:id',
        loadComponent: () => 
            import('./pages/openings/opening-details-page/opening-details-page.component')
                .then(m => m.OpeningDetailsPageComponent), data: {reuseComponent: true, breadcrumb: 'Opening Details'}
    },
    {
        path: 'opening-list',
        loadComponent: () => 
            import('./pages/openings/list-page/list-page.component')
                .then(m => m.ListPageComponent), data: {reuseComponent: true, breadcrumb: 'Compations By Category' }
    },
    {
        path: 'college-jobs-list',
        loadComponent: () => 
            import('./pages/college-jobs-list-page/college-jobs-list-page.component')
                .then(m => m.CollegeJobsListPageComponent), data: {reuseComponent: true, breadcrumb: 'College Jobs List' }
    },
    {
        path: 'resume-opti-intro',
        loadComponent: () => 
            import('./pages/intro/resume-optimizer-intro/resume-optimizer-intro.component')
                .then(m => m.ResumeOptimizerIntroComponent), data: {reuseComponent: true, breadcrumb: 'Resume Optimizer' }
    },
    {
        path: 'resume-manager-intro',
        loadComponent: () => 
            import('./pages/intro/resume-manager-intro/resume-manager-intro.component')
                .then(m => m.ResumeManagerIntroComponent), data: {reuseComponent: true, breadcrumb: 'Resume Manager' }
    },
    {
        path: 'job-app-manager-intro',
        loadComponent: () => 
            import('./pages/intro/job-app-manager-intro/job-app-manager-intro.component')
                .then(m => m.JobAppManagerIntroComponent), data: {reuseComponent: true, breadcrumb: 'Job Application Optimizer' }
    },
    {
        path: 'dashboard-intro',
        loadComponent: () => 
            import('./pages/intro/dashboard-intro/dashboard-intro.component')
                .then(m => m.DashboardIntroComponent), data: {reuseComponent: true, breadcrumb: 'Dashboard Intro' }
    },
    {
        path: 'activate',
        loadComponent: () => 
            import('./pages/authentication/activate-page/activate-page.component')
                .then(m => m.ActivatePageComponent), data: {reuseComponent: true, breadcrumb: 'Activate' }
    },
    {
        path: 'reset-finish',
        loadComponent: () => 
            import('./pages/authentication/reset-password-page/reset-password-page.component')
                .then(m => m.ResetPasswordPageComponent), data: {reuseComponent: true, breadcrumb: 'Change Password' },
    },
    {
        path: 'bio-profile',
        loadComponent: () => 
            import('./pages/authentication/bio-profile-page/bio-profile-page.component')
                .then(m => m.BioProfilePageComponent), data: {reuseComponent: true, breadcrumb: 'Bio Profile' }
    },
    {
        path: 'contact-us',
        loadComponent: () => 
            import('./pages/static/contact-page/contact-page.component')
                .then(m => m.ContactComponent), data: {reuseComponent: true, breadcrumb: 'Contact Us' }
    },
    {
        path: 'faq',
        loadComponent: () => 
            import('./pages/static/faq-page/faq-page.component')
                .then(m => m.FaqPageComponent), data: {reuseComponent: true, breadcrumb: 'FAQ' }
    },
    {
        path: 'resources',
        loadComponent: () => 
            import('./pages/resources/resources-list/resources-list.component')
                .then(m => m.ResourcesComponent), data: {reuseComponent: true, breadcrumb: 'Resources' }
    },
    {
        path: 'sign-in',
        loadComponent: () => 
            import('./pages/authentication/login-page/login-page.component')
                .then(m => m.LoginPageComponent), data: {reuseComponent: true, breadcrumb: 'Sign In' }
    },
    {
        path: 'sign-up',
        loadComponent: () => 
            import('./pages/authentication/register-page/register-page.component')
                .then(m => m.RegisterPageComponent), data: {reuseComponent: true, breadcrumb: 'Sign Up' }
    },
    {
        path: 'terms',
        loadComponent: () => 
            import('./pages/static/terms-page/terms-page.component')
                .then(m => m.TermsPageComponent), data: {reuseComponent: true, breadcrumb: 'Terms' }
    },
    {
        path: 'privacy',
        loadComponent: () => 
            import('./pages/static/privacy-page/privacy-page.component')
                .then(m => m.PrivacyPageComponent), data: {reuseComponent: true, breadcrumb: 'Pricacy' }
    },
    {
        path: 'terms',
        loadComponent: () => 
            import('./pages/static/terms-page/terms-page.component')
                .then(m => m.TermsPageComponent), data: {reuseComponent: true, breadcrumb: 'Terms' }
    },
    {
        path: 'privacy',
        loadComponent: () => 
            import('./pages/static/privacy-page/privacy-page.component')
                .then(m => m.PrivacyPageComponent), data: {reuseComponent: true, breadcrumb: 'Pricacy' }
    },
    {
        path: 'resources',
        loadComponent: () => 
            import('./pages/static/resources-page/resources-page.component')
                .then(m => m.ResourcesPageComponent), data: {reuseComponent: true, breadcrumb: 'Resources' }
    },
    {
        path: 'job-openings',
        loadComponent: () => 
            import('./pages/useful-links/latest-openings-page/latest-openings-page.component')
                .then(m => m.LatestJobOpeningsPageComponent), data: {reuseComponent: true, breadcrumb: 'Job Openings' }
    },
    {
        path: 'job-market',
        loadComponent: () => 
            import('./pages/useful-links/Job-market-blog-page/Job-market-blog-page.component')
                .then(m => m.JobMarketBlogPageComponent), data: {reuseComponent: true, breadcrumb: 'Job Market' }
    },
    {
        path: 'tech-talks',
        loadComponent: () => 
            import('./pages/useful-links/tech-talks-page/tech-talks-page.component')
                .then(m => m.TechTalksPageComponent), data: {reuseComponent: true, breadcrumb: 'Tech Talks' }
    },
    {
        path: 'training-options',
        loadComponent: () => 
            import('./pages/useful-links/training-options-page/training-options-page.component')
                .then(m => m.TrainingOptionsPageComponent), data: {reuseComponent: true, breadcrumb: 'Training Options' }
    },
    {
        path: 'user', 
        canActivate: [AuthGuardService],
        loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'resumes',
                loadComponent: () => 
                    import('./pages/dashboard-resume/dashboard-resume.component').then(m => m.DashboardResumeComponent),
                data: { breadcrumb: 'Resumes' } 
            },
            {
                path: 'resumes/resume',
                loadComponent: () => 
                    import('./pages/resume-form3/resume-form3.component')
                        .then(m => m.ResumeForm3Component), 
                        data: {reuseComponent: true, breadcrumb: 'Resume' },
            },
            {   
                path: 'job-applications', 
                loadComponent: () => import('./pages/dashboard-job-application/dashboard-job-application.component').then(m => m.DashboardJobApplicationComponent), 
                data: { breadcrumb: 'Job Applications' } 
            },
            {
                path: 'job-applications/application',
                loadComponent: () => 
                    import('./pages/dashboard-job-application/application-form/application-form3.component')
                        .then(m => m.ApplicationForm3Component), data: {reuseComponent: true, breadcrumb: 'Application' },
            },
            // {   
            //     path: 'account', 
            //     loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule), 
            //     data: { breadcrumb: 'Account Settings' } 
            // },
            {   
                path: 'mail-box', 
                loadComponent: () => import('./pages/email-box/email.component').then(m => m.EmailComponent), 
                data: { breadcrumb: 'Account Settings' } 
            },
            {   
                path: 'user-contacts', 
                loadComponent: () => import('./pages/user-contacts/user-contacts.component').then(m => m.UserContactsComponent), 
                data: { breadcrumb: 'Account Settings' } 
            },
            {   
                path: 'user-learn', 
                loadComponent: () => import('./pages/user-learn/user-learn.component').then(m => m.UserLearnComponent), 
                data: { breadcrumb: 'Account Settings' } 
            },
            {   
                path: 'dashboard', 
                loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent), 
                data: { breadcrumb: 'Account Settings' } 
            },
            {   
                path: 'profile', 
                loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), 
                data: { breadcrumb: 'Account Settings' } 
            }
         
        ]
    },

    {path: 'eocmm', component: EcommerceComponent},
    {path: 'crm', component: CrmComponent},
    {path: 'project-management', component: ProjectManagementComponent},
    {path: 'lms', component: LmsComponent},
    {path: 'help-desk', component: HelpDeskComponent},
    {
        path: 'apps',
        component: AppsComponent,
        children: [
            {path: '', component: ToDoListComponent},
            {path: 'calendar', component: CalendarComponent},
            {path: 'contacts', component: ContactsComponent},
            {path: 'chat', component: ChatComponent},
            {
                path: 'email',
                component: EmailComponent,
                children: [
                    {path: '', component: InboxComponent},
                    {path: 'compose', component: ComposeComponent},
                    {path: 'read', component: ReadComponent}
                ]
            },
            {path: 'kanban-board', component: KanbanBoardComponent},
            {path: 'file-manager', component: FileManagerComponent}
        ]
    },
    {
        path: 'ecommerce-page',
        component: EcommercePageComponent,
        children: [
            {path: '', component: EProductsGridComponent},
            {path: 'products-list', component: EProductsListComponent},
            {path: 'product-details', component: EProductDetailsComponent},
            {path: 'create-product', component: ECreateProductComponent},
            {path: 'cart', component: ECartComponent},
            {path: 'checkout', component: ECheckoutComponent},
            {path: 'orders-list', component: EOrdersListComponent},
            {path: 'order-details', component: EOrderDetailsComponent},
            {path: 'customers-list', component: ECustomersListComponent},
            {path: 'sellers', component: ESellersComponent},
            {path: 'seller-details', component: ESellerDetailsComponent}
        ]
    },
    {
        path: 'crm-page',
        component: CrmPageComponent,
        children: [
            {path: '', component: CContactsComponent},
            {path: 'opportunities', component: COpportunitiesComponent},
            {path: 'leads', component: CLeadsComponent},
            {path: 'customers', component: CCustomersComponent}
        ]
    },
    {
        path: 'project-management-page',
        component: ProjectManagementPageComponent,
        children: [
            {path: '', component: PmProjectsListComponent},
            {path: 'project-details', component: PmProjectDetailsComponent},
            {path: 'create-project', component: PmCreateProjectComponent},
            {path: 'clients', component: PmClientsComponent},
            {path: 'teams', component: PmTeamsComponent},
            {path: 'tasks', component: PmTasksComponent},
            {path: 'users', component: PmUsersComponent},
            {path: 'kanban-board', component: PmKanbanBoardComponent}
        ]
    },
    {
        path: 'lms-page',
        component: LmsPageComponent,
        children: [
            {path: '', component: LCoursesListComponent},
            {path: 'course-details', component: LCourseDetailsComponent},
            {path: 'lesson-preview', component: LLessonPreviewComponent},
            {path: 'create-course', component: LCreateCourseComponent}
        ]
    },
    {
        path: 'help-desk-page',
        component: HelpDeskPageComponent,
        children: [
            {path: '', component: HdTicketsComponent},
            {path: 'reports', component: HdReportsComponent},
            {path: 'agents', component: HdAgentsComponent}
        ]
    },
    {
        path: 'events',
        component: EventsPageComponent,
        children: [
            {path: '', component: EventsListComponent},
            {path: 'event-details', component: EventDetailsComponent},
            {path: 'create-an-event', component: CreateAnEventComponent}
        ]
    },
    {path: 'social-feed', component: SocialFeedPageComponent},
    {
        path: 'invoices',
        component: InvoicesPageComponent,
        children: [
            {path: '', component: InvoicesComponent},
            {path: 'invoice-details', component: InvoiceDetailsComponent}
        ]
    },
    {
        path: 'users',
        component: UsersPageComponent,
        children: [
            {path: '', component: TeamMembersComponent},
            {path: 'users-list', component: UsersListComponent},
            {path: 'add-user', component: AddUserComponent}
        ]
    },
    {
        path: 'profile',
        component: ProfilePageComponent,
        children: [
            {path: '', component: PUserProfileComponent},
            {path: 'teams', component: PTeamsComponent},
            {path: 'projects', component: PProjectsComponent}
        ]
    },
    {path: 'starter', component: StarterComponent},
    {
        path: 'icons',
        component: IconsComponent,
        children: [
            {path: '', component: MaterialSymbolsComponent},
            {path: 'feathericons', component: FeathericonsComponent},
            {path: 'remixicon', component: RemixiconComponent}
        ]
    },
    {
        path: 'ui-kit',
        component: UiElementsComponent,
        children: [
            {path: '', component: AlertsComponent},
            {path: 'autocomplete', component: AutocompleteComponent},
            {path: 'avatars', component: AvatarsComponent},
            {path: 'accordion', component: AccordionComponent},
            {path: 'badges', component: BadgesComponent},
            {path: 'breadcrumb', component: BreadcrumbComponent},
            {path: 'button-toggle', component: ButtonToggleComponent},
            {path: 'bottom-sheet', component: BottomSheetComponent},
            {path: 'buttons', component: ButtonsComponent},
            {path: 'cards', component: CardsComponent},
            {path: 'carousels', component: CarouselsComponent},
            {path: 'checkbox', component: CheckboxComponent},
            {path: 'chips', component: ChipsComponent},
            {path: 'clipboard', component: ClipboardComponent},
            {path: 'color-picker', component: ColorPickerComponent},
            {path: 'datepicker', component: DatepickerComponent},
            {path: 'dialog', component: DialogComponent},
            {path: 'divider', component: DividerComponent},
            {path: 'drag-drop', component: DragDropComponent},
            {path: 'expansion', component: ExpansionComponent},
            {path: 'form-field', component: FormFieldComponent},
            {path: 'grid-list', component: GridListComponent},
            {path: 'icon', component: IconComponent},
            {path: 'input', component: InputComponent},
            {path: 'list', component: ListComponent},
            {path: 'listbox', component: ListboxComponent},
            {path: 'menus', component: MenusComponent},
            {path: 'pagination', component: PaginationComponent},
            {path: 'progress-bar', component: ProgressBarComponent},
            {path: 'radio', component: RadioComponent},
            {path: 'ratio', component: RatioComponent},
            {path: 'select', component: SelectComponent},
            {path: 'sidenav', component: SidenavComponent},
            {path: 'slide-toggle', component: SlideToggleComponent},
            {path: 'slider', component: SliderComponent},
            {path: 'snackbar', component: SnackbarComponent},
            {path: 'stepper', component: StepperComponent},
            {path: 'table', component: TableComponent},
            {path: 'tabs', component: TabsComponent},
            {path: 'toolbar', component: ToolbarComponent},
            {path: 'tooltip', component: TooltipComponent},
            {path: 'tree', component: TreeComponent},
            {path: 'typography', component: TypographyComponent},
            {path: 'videos', component: VideosComponent},
            {path: 'utilities', component: UtilitiesComponent}
        ]
    },
    {path: 'tables', component: TablesComponent},
    {
        path: 'forms',
        component: FormsComponent,
        children: [
            {path: '', component: BasicElementsComponent},
            {path: 'advanced-elements', component: AdvancedElementsComponent},
            {path: 'wizard', component: WizardComponent},
            {path: 'editors', component: EditorsComponent},
            {path: 'file-uploader', component: FileUploaderComponent}
        ]
    },
    {
        path: 'charts',
        component: ApexchartsComponent,
        children: [
            {path: '', component: LineChartsComponent},
            {path: 'area', component: AreaChartsComponent},
            {path: 'column', component: ColumnChartsComponent},
            {path: 'mixed', component: MixedChartsComponent},
            {path: 'radialbar', component: RadialbarChartsComponent},
            {path: 'radar', component: RadarChartsComponent},
            {path: 'pie', component: PieChartsComponent},
            {path: 'polar', component: PolarChartsComponent},
            {path: 'more', component: MoreChartsComponent}
        ]
    },
    {
        path: 'authentication',
        component: AuthenticationComponent,
        children: [
            {path: '', component: SignInComponent},
            {path: 'sign-up', component: SignUpComponent},
            {path: 'forgot-password', component: ForgotPasswordComponent},
            {path: 'reset-password', component: ResetPasswordComponent},
            {path: 'lock-screen', component: LockScreenComponent},
            {path: 'confirm-email', component: ConfirmEmailComponent},
            {path: 'logout', component: LogoutComponent}
        ]
    },
    {path: 'pricing', component: PricingPageComponent},
    {path: 'timeline', component: TimelinePageComponent},
    {path: 'faq', component: FaqPageComponent},
    {path: 'gallery', component: GalleryPageComponent},
    {path: 'testimonials', component: TestimonialsPageComponent},
    {path: 'search', component: SearchPageComponent},
    {path: 'blank-page', component: BlankPageComponent},
    {path: 'internal-error', component: InternalErrorComponent},
    {path: 'widgets', component: WidgetsComponent},
    {path: 'maps', component: MapsPageComponent},
    {path: 'notifications', component: NotificationsPageComponent},
    {path: 'my-profile', component: MyProfileComponent},
    {
        path: 'settings',
        component: SettingsComponent,
        children: [
            {path: '', component: AccountSettingsComponent},
            {path: 'change-password', component: ChangePasswordComponent},
            {path: 'connections', component: ConnectionsComponent},
            {path: 'privacy-policy', component: PrivacyPolicyComponent},
            {path: 'terms-conditions', component: TermsConditionsComponent}
        ]
    },
    // Here add new pages component

    {path: '**', component: NotFoundComponent} // This line will remain down from the whole pages component list
];