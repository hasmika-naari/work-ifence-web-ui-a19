import { MenuListItem, ResumeTemplate } from "../bee-compete.model";
import { Address } from "../contact.model";
import { Account, BioProfile, LoginProfile, WifRole } from "../profile.model";
import { Education, Experience, Project, Resume, Certification, JobDescriptionAIResponse, JobApplication, RoundDetails, Accomplishment, courseWork} from "../resume.model";
import { ApplicationListDataItem, JobApplicationData, JobApplicationRequest, ResumeListDataItem } from "../work-ifence-data.model";
import { sections } from "./resume-sections";


  
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
  selectedContact?: any;
  selectedSummary?: any;
  selectedSkillsCategory?: any;
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
    icon?: string; // Optional icon for section (PrimeNG icon class)
    rightImage?: string; // Optional right image for section (e.g., summary illustration)
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

  export class UserResume{
    resumeForm :Resume = new Resume();
    selectedExperience :Experience = new Experience();
    selectedProject :Project = new Project();
    selectedEducation : Education = new Education();
    selectedCertification : SectionItem = { data: null };
    selectedAccomplishment : SectionItem = { data: null };
    selectedCourseWork : courseWork = new courseWork();
    selectedSkill?: any;
    selectedSkillCategory?: any;
    isEdit : boolean = false;
  }

