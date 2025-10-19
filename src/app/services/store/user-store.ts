import { MenuListItem, ResumeTemplate } from "../bee-compete.model";
import { Address } from "../contact.model";
import { Account, BioProfile, LoginProfile, WifRole } from "../profile.model";
import { Education, Experience, Project, Resume, Certification, JobDescriptionAIResponse, JobApplication, RoundDetails, Accomplishment, courseWork} from "../resume.model";
import { ApplicationListDataItem, JobApplicationData, JobApplicationRequest, ResumeListDataItem } from "../work-ifence-data.model";


  
  export interface UserState {
    account: Account;
    roles: Array<WifRole>;
    activeRole: WifRole;
    bioProfile: BioProfile; 
    loginProfile: LoginProfile;
    addresses: Array<Address>;
    selectedAddress: Address;
    jobApplicationsCompleteDetails : Array<JobApplicationRequest>;
    jobApplications: Array<JobApplication>;
    jobApplicationFlag : boolean;
    selectedJobApplication: JobApplication;
    filteredJobApplications : Array<JobApplication>;
    selectedRoundDetails : RoundDetails;
    jobDescriptionAIResponse : JobDescriptionAIResponse;
    token: string;
    menuList: Array<MenuListItem>;
    sidebarIconOnly: boolean;
    currentTab : string;
    selectedResume: UserResume;
    selectedResumeListItem: ResumeListDataItem;
    resumeListItems : Array<ResumeListDataItem>;
    filteredResumes : Array<ResumeListDataItem>;
    currentResumeSections : Array<SectionDesc>;
    isChangeInNewResume : boolean;
    isUserLoggedIn : boolean;
    isMultipleColumnTemplateSelected : boolean
    multipleSectionsList : Array<Array<SectionDesc>>
  }

  
  export const userStateConfig = {
    initState: {
      account: new Account(),
      roles: new Array<WifRole>(),
      activeRole: new WifRole(),
      token: '',
      MenuListItem: new Array<MenuListItem>(),
      jobApplications: new Array<JobApplication>(),
      sidebarIconOnly: false,
      currentTab : '',
      resumeForm : new Resume(),
      selectedExperience : new Experience(),
      selectedProject : new Project(),
      selectedEducation : new Education(),
      selectedCertification : new Certification(),
      selectedCourseWork : new courseWork(),
      isEdit : false
    }
  };

  export class ResumeTemplateDto {
    id: number;
    name: string;
    companyName: string;
    template_name : string;
    imgPath : string;
    constructor(){
      this.id = -1
      this.name = "-"
      this.companyName = "-"
      this.template_name = 'TEMPLATE_1'
      this.imgPath = '-'
    }
  };

  export interface SectionDesc {
    id?: string;
    section: string;
    description: string;
    isAdded: boolean;
    isPremium: boolean;
    tags: string;
    label: string;
    title?: string;
    editable_section_title?: string;
    canMoveUp?: boolean;
    canMoveDown?: boolean;
    data?: any;
    items?: SectionItem[];
    headerActions?: SectionActionConfig;
  }

  export interface SectionActionConfig {
    add?: boolean;
    edit?: boolean;
    delete?: boolean;
    moveUp?: boolean;
    moveDown?: boolean;
    [key: string]: boolean | undefined;
  }

  export interface SectionItem {
    id?: string;
    data: any;
    actions?: SectionActionConfig;
  }

  export const sections: Array<SectionDesc> = [
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

  export class UserResume{
    resumeForm :Resume = new Resume();
    selectedExperience :Experience = new Experience();
    selectedProject :Project = new Project();
    selectedEducation : Education = new Education();
    selectedCertification : Certification = new Certification();
    selectedAccomplishment : Accomplishment = new Accomplishment();
    selectedCourseWork : courseWork = new courseWork();
    isEdit : boolean = false;
  }

