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

  export class SectionDesc{
    section : string;
    title : string;
    constructor(){
      this.section = '',
      this.title = ''
    }
  }

  export const sections : Array<SectionDesc> = [
    {
      section : 'PROFILE_SUMMARY',
      title : 'Profile summary'
    },
    {
      section : 'EDUCATION',
      title : 'Education'
    },
    {
      section : 'RELEVANT_COURSEWORK',
      title : 'Relevant coursework'
    },
    {
      section : 'SKILLS_BULLET_POINTS',
      title : 'Skills with bullet points'
    },
    {
      section : 'SKILLS_CATEGORY',
      title : 'Skills category'
    },
    {
      section : 'WORK_EXPERIENCE',
      title : 'Work experience'
    },
    {
      section : 'PROJECT',
      title : 'Project'
    },
    {
      section : 'CERTIFICATIONS',
      title : 'Certification'
    },
    {
      section : 'ACHIEVEMENTS_BULLET_POINTS',
      title : 'Achievements with bullet points'
    },
    {
      section : 'ACHIEVEMENT_WITH_DESC',
      title : 'Accomplishments'
    }
  ]

  export class UserResume{
    resumeForm :Resume = new Resume();
    selectedExperience :Experience = new Experience();
    selectedProject :Project = new Project();
    selectedEducation : Education = new Education();
    selectedCertification : Certification = new Certification();
    selectedAccomplishment : Accomplishment = new Accomplishment();
    isEdit : boolean = false;
  }

 