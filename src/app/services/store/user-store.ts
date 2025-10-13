import { MenuListItem, ResumeTemplate } from "../bee-compete.model";
import { Address } from "../contact.model";
import { Account, BioProfile, LoginProfile, WifRole } from "../profile.model";
import { Education, Experience, Project, Resume, Certification, JobDescriptionAIResponse, JobApplication, RoundDetails, Accomplishment} from "../resume.model";
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
  }

  export const sections: Array<SectionDesc> = [
    {
        section: 'PROFILE_SUMMARY',
        description: 'A brief summary of your skills and experience.',
        isAdded: false,
        isPremium: false,
        tags: 'summary, profile, objective',
        label: 'Summary',
        title : 'Profile summary',
        editable_section_title : 'Profile Summary'
    },
    {
        section: 'EDUCATION',
        description: 'Details about your educational background.',
        isAdded: false,
        isPremium: false,
        tags: 'education, school, degree',
        label: 'Education',
        title : 'Education',
        editable_section_title : "Education"
    },
    {
        section: 'RELEVANT_COURSEWORK',
        description: 'Relevant coursework you have completed.',
        isAdded: false,
        isPremium: false,
        tags: 'coursework, classes, subjects',
        label: 'Coursework',
        title : 'Relevant coursework',
        editable_section_title :'Relevant Coursework'
    },
    {
        section: 'SKILLS_BULLET_POINTS',
        description: 'A list of your skills in bullet points.',
        isAdded: false,
        isPremium: false,
        tags: 'skills, abilities, competencies',
        label: 'Skills (B.P.)',
        title : 'Skills with bullet points',
        editable_section_title : 'Skills'
    },
    {
        section: 'SKILLS_CATEGORY',
        description: 'Categorized list of your skills.',
        isAdded: false,
        isPremium: false,
        tags: 'skills, categorized, grouped',
        label: 'Skills (Category)',
        title : 'Skills category',
        editable_section_title : 'Skills'
    },
    {
        section: 'WORK_EXPERIENCE',
        description: 'Your professional work experience.',
        isAdded: false,
        isPremium: false,
        tags: 'experience, work, job',
        label: 'Experience',
        title : 'Work experience',
        editable_section_title : 'Experience'
    },
    {
        section: 'PROJECT',
        description: 'Projects you have worked on.',
        isAdded: false,
        isPremium: false,
        tags: 'projects, portfolio, work',
        label: 'Projects',
        title : 'Project',
        editable_section_title : 'Project'
    },
    {
        section: 'CERTIFICATIONS',
        description: 'Certifications you have earned.',
        isAdded: false,
        isPremium: false,
        tags: 'certifications, licenses, credentials',
        label: 'Certifications',
        title : 'Certification',
        editable_section_title : 'Certifications'
    },
    {
        section: 'CERTIFICATIONS_BULLET_POINTS',
        description: 'A list of your certifications in bullet points.',
        isAdded: false,
        isPremium: true,
        tags: 'certifications, bullet points, list',
        label: 'Certs (B.P.)',
        title : 'Certification with bullet points',
        editable_section_title : 'Certifications'
    },
    {
        section: 'ACHIEVEMENTS_BULLET_POINTS',
        description: 'Your achievements in bullet points.',
        isAdded: false,
        isPremium: false,
        tags: 'achievements, accomplishments, awards',
        label: 'Achievements',
        title : 'Achievements with bullet points',
        editable_section_title : 'Achievements'
    },
    {
        section: 'ACHIEVEMENT_WITH_DESC',
        description: 'Detailed description of your achievements.',
        isAdded: false,
        isPremium: true,
        tags: 'achievements, description, details',
        label: 'Accomplishments',
        title : 'Accomplishments',
        editable_section_title : 'Accomplishments'
    }
  ];

  export class UserResume{
    resumeForm :Resume = new Resume();
    selectedExperience :Experience = new Experience();
    selectedProject :Project = new Project();
    selectedEducation : Education = new Education();
    selectedCertification : Certification = new Certification();
    selectedAccomplishment : Accomplishment = new Accomplishment();
    isEdit : boolean = false;
  }

