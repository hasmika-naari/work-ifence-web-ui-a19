import { SectionDesc } from "./user-store";

export const sections: Array<SectionDesc> = [
  {
    section: 'CONTACT',
    description: 'Your contact details and personal information.',
    isAdded: false,
    isPremium: false,
    tags: 'contact, personal, information',
    label: 'Contact',
    title: 'Contact Information',
    editable_section_title: 'Contact',
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
    data: {
      profile_summary: 'Experienced software engineer with 7+ years in web development, specializing in Angular and TypeScript. Proven track record in delivering scalable solutions and collaborating in agile teams.',
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
      { id: 'skill2', data: { skill: 'TypeScript' }, actions: { edit: true, delete: true, moveUp: true, moveDown: true } }
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
          position_title: 'Software Engineer',
          company_name: 'XYZ Corp',
          location: 'New York, NY',
          start_date: 'Jan 2019',
          end_date: 'Dec 2021',
          description: 'Developed web applications using Angular and TypeScript. Collaborated with cross-functional teams to deliver high-quality software solutions.'
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
            project_title: 'AI-Powered Resume Builder',
            project_link: 'https://github.com/johndoe/ai-resume-builder',
            technologies_used: 'Angular, TypeScript, PrimeNG, Node.js, Express, MongoDB, OpenAI API',
            description: 'Developed a full-stack AI-powered resume builder that generates personalized resume content using OpenAI. Features include customizable templates, drag-and-drop sections, PDF export, and real-time preview.',
            start_date: '2024-01',
            end_date: '2024-06',
            role: 'Full Stack Developer',
            responsibilities: [
              'Designed and implemented the Angular frontend with dynamic form generation and live preview.',
              'Integrated OpenAI API for AI-generated resume summaries and bullet points.',
              'Built RESTful APIs with Node.js and Express for user authentication and data management.',
              'Implemented MongoDB for persistent storage of user profiles and resumes.',
              'Enabled PDF export and print-ready formatting using server-side rendering.',
              'Deployed the application on Azure with CI/CD pipelines.'
            ],
            highlights: [
              'Reduced resume creation time by 70% for users.',
              'Achieved 99.9% uptime post-deployment.',
              'Adopted by 500+ users within the first month.'
            ]
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