import { SectionDesc } from "./user-store";

export const sections: Array<SectionDesc> = [
  {
    section: 'SKILLS_BULLET_POINTS',
    description: 'Your skills in bullet points.',
    isAdded: true,
    isPremium: false,
    tags: 'skills, bulleted',
    label: 'Skills',
    title: 'Skills (Bulleted)',
    editable_section_title: 'Skills',
    data: {
      summary: '',
    },
    headerActions: { add: true, edit: true },
    items: [
      { id: 'skill1', data: { skill: 'Angular' }, actions: { edit: true, delete: true, moveUp: true, moveDown: true } },
      { id: 'skill2', data: { skill: 'TypeScript' }, actions: { edit: true, delete: true, moveUp: true, moveDown: true } }
    ]
  },
  {
    section: 'SKILLS_CATEGORY',
    description: 'Your skills grouped by category.',
    isAdded: false,
    isPremium: false,
    tags: 'skills, category',
    label: 'Skills (Category)',
    title: 'Skills by Category',
    editable_section_title: 'Skills by Category',
    data: {
      summary: '',
    },
    headerActions: { add: true, edit: true },
    items: [
      { id: 'cat1', data: { category: 'Frontend', skills: ['Angular', 'React'] }, actions: { edit: true, delete: true, moveUp: true, moveDown: true } },
      { id: 'cat2', data: { category: 'Backend', skills: ['Node.js', 'Express'] }, actions: { edit: true, delete: true, moveUp: true, moveDown: true } }
    ]
  },
    {
      section: 'CONTACT',
      description: 'Your contact details and personal information.',
      isAdded: true,
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
      isAdded: true,
      isPremium: false,
      tags: 'summary, profile, objective',
      label: 'Summary',
      title: 'Profile summary',
      editable_section_title: 'Profile Summary',
      data: {
        format: 'paragraph', // or 'bulleted'
        paragraph: 'Experienced software engineer with 7+ years in web development, specializing in Angular and TypeScript. Proven track record in delivering scalable solutions and collaborating in agile teams.',
        bulleted: [
          '7+ years of experience in web development',
          'Expert in Angular, TypeScript, and RxJS',
          'Proficient in Node.js and RESTful APIs',
          'Skilled in CI/CD and Docker',
          'Strong communicator and agile team player'
        ]
      },
      headerActions: { edit: true },
      items: []
    },
    {
      section: 'EDUCATION',
      description: 'Details about your educational background.',
      isAdded: true,
      isPremium: false,
      tags: 'education, school, degree',
      label: 'Education',
      title: 'Education',
      editable_section_title: 'Education',
      data: {},
      headerActions: { add: true },
      items: [
        {
          id: 'edu1',
          data: {
            degree: 'B.Sc. Computer Science',
            school_name: 'ABC University',
            year: 2020
          },
          actions: { edit: true, delete: true, moveUp: true, moveDown: true }
        }
      ]
    },
    {
      section: 'WORK_EXPERIENCE',
      description: 'Your professional work experience.',
      isAdded: true,
      isPremium: false,
      tags: 'experience, work, job',
      label: 'Experience',
      title: 'Work experience',
      editable_section_title: 'Experience',
      data: {},
      headerActions: { add: true },
      items: [
        {
          id: 'exp1',
          data: {
            position: 'Software Engineer',
            company: 'XYZ Corp',
            start: '2019',
            end: '2021'
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
      headerActions: { add: true },
      items: []
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
      headerActions: { add: true },
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
      headerActions: { add: true },
      items: []
    }
  ];