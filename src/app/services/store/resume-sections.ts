// Removed stray PROFILE_SUMMARY and PROFILE_SUMMARY_BULLETED objects at the top of the file
import { SectionDesc } from "./user-store";

export const sections: Array<SectionDesc> = [
  {
    section: 'SKILLS_BY_CATEGORY',
    description: 'Showcase your skills grouped by category (e.g., Programming Languages, Frameworks, Tools).',
    isAdded: false,
    isPremium: false,
    tags: 'skills, category, grouped',
    label: 'Skills',
    title: 'Skills',
    editable_section_title: 'Skills',
    icon: 'pi pi-tags',
    data: {
      categories: [
        {
          name: 'Programming Languages',
          skills: ['TypeScript', 'JavaScript', 'Python']
        },
        {
          name: 'Frameworks',
          skills: ['Angular', 'React', 'Node.js']
        },
        {
          name: 'Tools',
          skills: ['Git', 'Docker', 'Jira']
        }
      ]
    },
    headerActions: { edit: true, delete: true, moveDown: true, moveUp: true, add: true },
    items: []
  },
  {
    section: 'CONTACT',
    description: 'Your contact details and personal information.',
    isAdded: false,
    isPremium: false,
    tags: 'contact, personal, information',
    label: 'Contact',
    title: 'Contact Information',
    editable_section_title: 'Contact',
    icon: 'pi-id-card',
    data: {
      fname: 'John',
      lname: 'Doe',
      subTitle: 'Software Engineer',
      role: 'Frontend Developer',
      address: '123 Main St, City, Country',
      phone_number: '+1 234-567-8901',
      email_address: 'john.doe@example.com',
      emailId: 'john.doe@example.com',
      github_profile_display_name: 'johndoe',
      github_profile: 'https://github.com/johndoe',
      linkedIn_profile_display_name: 'John Doe',
      linkedIn_profile: 'https://linkedin.com/in/johndoe',
      portfolio_url: 'https://johndoe.dev'
    },
    headerActions: { edit: true },
    items: []
  },
  {
    section: 'PROFILE_SUMMARY',
    description: 'A brief summary of your skills and experience.',
    isAdded: false,
    isPremium: false,
    tags: 'summary, profile, objective',
    label: 'Summary',
    title: 'Profile summary',
    editable_section_title: 'Profile Summary',
    rightImage: 'assets/images/summary-right.png',
  icon: 'pi-align-left',
    data: {
      profile_summary: 'Experienced software engineer with 7+ years in web development, specializing in Angular and TypeScript. Proven track record in delivering scalable solutions and collaborating in agile teams.',
      summary_bullets: [
        'Skilled in Angular, TypeScript, and modern web technologies.',
        'Strong background in building scalable, maintainable applications.',
        'Excellent communicator and effective team collaborator.',
        'Proven ability to deliver projects on time in agile environments.'
      ],
      original_summary_html: '',
      position_highlight: '',
      skills_highlight: '',
      isDefault: true,
      isHideSelected: false
    },
    headerActions: { edit: true, delete: true, moveDown: true },
    items: []
  },
  {
    section: 'PROFILE_SUMMARY_BULLETED',
    description: 'A brief summary of your skills and experience in bullet points.',
    isAdded: false,
    isPremium: false,
    tags: 'summary, profile, objective, bulleted',
    label: 'Summary (Bulleted)',
    title: 'Profile summary',
    editable_section_title: 'Profile Summary',
    rightImage: 'assets/images/summary-right.png',
    icon: 'pi-list',
    data: {
      profile_summary: `<ul style="margin-left: 1.2em;">
        <li>7+ years of experience in web development.</li>
        <li>Expert in Angular, TypeScript, and modern JavaScript.</li>
        <li>Strong problem-solving and debugging skills.</li>
        <li>Excellent communicator and team player.</li>
      </ul>`,
      summary_bullets: [],
      original_summary_html: '',
      position_highlight: '',
      skills_highlight: '',
      isDefault: true,
      isHideSelected: false,
      format: 'bulleted'
    },
    headerActions: { edit: true, delete: true, moveDown: true },
    items: []
  },
  {
    section: 'SKILLS_BULLET_POINTS',
    description: 'Your skills in bullet points.',
    isAdded: false,
    isPremium: false,
    tags: 'skills, bulleted',
    label: 'Skills',
    title: 'Skills (Bulleted)',
    editable_section_title: 'Skills',
    data: {
      summary: '',
    },
    headerActions: { edit: true, delete: true, moveDown: true, moveUp: true },
    items: [
      { id: 'skill1', data: { skill: 'Angular' }, actions: { edit: true, delete: true, moveUp: true, moveDown: true } },
      { id: 'skill2', data: { skill: 'TypeScript' }, actions: { edit: true, delete: true, moveUp: true, moveDown: true } },
      { id: 'skill3', data: { skill: 'RxJS' }, actions: { edit: true, delete: true, moveUp: true, moveDown: true } },
      { id: 'skill4', data: { skill: 'NgRx' }, actions: { edit: true, delete: true, moveUp: true, moveDown: true } },
      { id: 'skill5', data: { skill: 'HTML5' }, actions: { edit: true, delete: true, moveUp: true, moveDown: true } },
      { id: 'skill6', data: { skill: 'SCSS/SASS' }, actions: { edit: true, delete: true, moveUp: true, moveDown: true } },
      { id: 'skill7', data: { skill: 'Jasmine & Karma' }, actions: { edit: true, delete: true, moveUp: true, moveDown: true } },
      { id: 'skill8', data: { skill: 'RESTful APIs' }, actions: { edit: true, delete: true, moveUp: true, moveDown: true } },
      { id: 'skill9', data: { skill: 'Node.js' }, actions: { edit: true, delete: true, moveUp: true, moveDown: true } },
      { id: 'skill10', data: { skill: 'Git & GitHub' }, actions: { edit: true, delete: true, moveUp: true, moveDown: true } },
      { id: 'skill11', data: { skill: 'Agile/Scrum' }, actions: { edit: true, delete: true, moveUp: true, moveDown: true } },
      { id: 'skill12', data: { skill: 'CI/CD (Jenkins, GitHub Actions)' }, actions: { edit: true, delete: true, moveUp: true, moveDown: true } }
    ]
  },
  {
    section: 'WORK_EXPERIENCE',
    description: 'Your professional work experience.',
    isAdded: false,
    isPremium: false,
    tags: 'experience, work, job',
    label: 'Experience',
    title: 'Work experience',
    editable_section_title: 'Experience',
    data: {},
    headerActions: { edit: true, delete: true, moveDown: true, moveUp: true, add: true },
    items: [
      {
        id: 'exp1',
        data: {
          position_title: 'Senior Frontend Engineer',
          company_name: 'Acme Tech Solutions',
          location: 'San Francisco, CA',
          start_date: 'Feb 2022',
          end_date: 'Present',
          description: `Lead the design and development of scalable Angular applications for enterprise clients. Mentored a team of 5 engineers, implemented CI/CD pipelines, and improved application performance by 30%. Collaborated closely with UX/UI designers and backend teams to deliver seamless user experiences.`
        },
        actions: { edit: true, delete: true, moveUp: true, moveDown: true }
      },
      {
        id: 'exp2',
        data: {
          position_title: 'Software Engineer',
          company_name: 'BrightApps Inc.',
          location: 'Remote',
          start_date: 'Jun 2019',
          end_date: 'Jan 2022',
          description: `Developed and maintained web applications using Angular, TypeScript, and RxJS. Automated testing with Jasmine and Karma, and contributed to the migration of legacy codebases to modern frameworks. Recognized for delivering features ahead of schedule and improving code quality.`
        },
        actions: { edit: true, delete: true, moveUp: true, moveDown: true }
      }
    ]
  },
  {
    section: 'EDUCATION',
    description: 'Details about your educational background.',
    isAdded: false,
    isPremium: false,
    tags: 'education, school, degree',
    label: 'Education',
    title: 'Education',
    editable_section_title: 'Education',
    data: {},
    headerActions: { edit: true, delete: true, moveDown: false, moveUp: true, add: true },
    items: [
      {
        id: 'edu1',
        data: {
          degree: 'B.Sc. Computer Science',
          field_of_study: 'Computer Science',
          school_name: 'ABC University',
          school_location: 'New York, NY',
          graduation_date: 'May 2020',
          gpa: '3.8'
        },
        actions: { edit: true, delete: true, moveUp: true, moveDown: true }
      },
      {
        id: 'edu2',
        data: {
          degree: 'M.Sc. Software Engineering',
          field_of_study: 'Software Engineering',
          school_name: 'Stanford University',
          school_location: 'Stanford, CA',
          graduation_date: 'Jun 2022',
          gpa: '3.9'
        },
        actions: { edit: true, delete: true, moveUp: true, moveDown: true }
      }
    ]
  },
    {
      section: 'PROJECT',
      description: 'Projects you have worked on.',
      isAdded: false,
      isPremium: false,
      tags: 'projects, portfolio, work',
      label: 'Projects',
      title: 'Project',
      editable_section_title: 'Project',
      data: {},
      headerActions: { edit: true, delete: true, moveDown: false, moveUp: true, add: true },
      items: [
        {
          id: 'project1',
          data: {
            project_name: 'AI-Powered Resume Builder',
            description: 'Developed a full-stack AI-powered resume builder that generates personalized resume content using OpenAI. Features include customizable templates, drag-and-drop sections, PDF export, and real-time preview.',
            project_link: 'https://github.com/johndoe/ai-resume-builder',
            technologies_used: 'Angular, TypeScript, PrimeNG, Node.js, Express, MongoDB, OpenAI API',
            start_date: '2024-01',
            end_date: '2024-06',
            role: 'Full Stack Developer',
            responsibilitiesRichText: `<ul><li>Designed and implemented the Angular frontend with dynamic form generation and live preview.</li><li>Integrated OpenAI API for AI-generated resume summaries and bullet points.</li><li>Built RESTful APIs with Node.js and Express for user authentication and data management.</li><li>Implemented MongoDB for persistent storage of user profiles and resumes.</li><li>Enabled PDF export and print-ready formatting using server-side rendering.</li><li>Deployed the application on Azure with CI/CD pipelines.</li></ul>`,
            highlightsRichText: `<ul><li>Reduced resume creation time by 70% for users.</li><li>Achieved 99.9% uptime post-deployment.</li><li>Adopted by 500+ users within the first month.</li></ul>`
          },
          actions: { edit: true, delete: true, moveUp: true, moveDown: false }
        },
        {
          id: 'project2',
          data: {
            project_name: 'E-Commerce Analytics Dashboard',
            description: 'Built an analytics dashboard for e-commerce businesses to visualize sales, customer behavior, and inventory trends. Included interactive charts, real-time data updates, and exportable reports.',
            project_link: 'https://github.com/johndoe/ecommerce-analytics',
            technologies_used: 'Angular, TypeScript, PrimeNG, Node.js, Express, PostgreSQL, Chart.js',
            start_date: '2023-03',
            end_date: '2023-10',
            role: 'Frontend Engineer',
            responsibilitiesRichText: `<ul><li>Developed reusable Angular components for data visualization.</li><li>Integrated Chart.js for interactive and dynamic charting.</li><li>Collaborated with backend team to design RESTful APIs for analytics data.</li><li>Implemented authentication and role-based access control.</li><li>Optimized dashboard performance for large datasets.</li><li>Created exportable PDF and CSV reports.</li></ul>`,
            highlightsRichText: `<ul><li>Enabled business users to reduce manual reporting time by 80%.</li><li>Supported 10,000+ concurrent users with real-time updates.</li><li>Recognized as a top internal tool by client stakeholders.</li></ul>`
          },
          actions: { edit: true, delete: true, moveUp: true, moveDown: false }
        }
      ]
    },
    {
      section: 'CERTIFICATIONS',
      description: 'Certifications you have earned.',
      isAdded: false,
      isPremium: false,
      tags: 'certifications, licenses, credentials',
      label: 'Certifications',
      title: 'Certification',
      editable_section_title: 'Certifications',
      data: {},
      headerActions: { edit: true, delete: true, moveDown: false, moveUp: true, add: true },
      items: []
    },
    {
      section: 'ACHIEVEMENTS_BULLET_POINTS',
      description: 'Your achievements in bullet points.',
      isAdded: false,
      isPremium: false,
      tags: 'achievements, accomplishments, awards',
      label: 'Achievements',
      title: 'Achievements with bullet points',
      editable_section_title: 'Achievements',
      data: {},
      headerActions: { edit: true, delete: true, moveDown: false, moveUp: true },
      items: []
    }
  ];