// Skills (Bulleted)
export class SkillsBulletPoint {
  id: string;
  skill: string;
  constructor() {
    this.id = '';
    this.skill = '';
  }
}

// Skills (Category)
export class SkillsCategory {
  id: string;
  category: string;
  skills: string[];
  constructor() {
    this.id = '';
    this.category = '';
    this.skills = [];
  }
}

// Award
export class Award {
  id: string;
  award_name: string;
  issuing_organization: string;
  date_received: string;
  constructor() {
    this.id = '';
    this.award_name = '';
    this.issuing_organization = '';
    this.date_received = '';
  }
}

// Language
export class Language {
  id: string;
  language_name: string;
  proficiency_level: string;
  constructor() {
    this.id = '';
    this.language_name = '';
    this.proficiency_level = '';
  }
}

// Interest
export class Interest {
  id: string;
  interest: string;
  constructor() {
    this.id = '';
    this.interest = '';
  }
}

// Publication
export class Publication {
  id: string;
  title: string;
  publication_source: string;
  date: string;
  constructor() {
    this.id = '';
    this.title = '';
    this.publication_source = '';
    this.date = '';
  }
}

// Professional Membership
export class ProfessionalMembership {
  id: string;
  organization_name: string;
  membership_level: string;
  dates_of_membership: string;
  constructor() {
    this.id = '';
    this.organization_name = '';
    this.membership_level = '';
    this.dates_of_membership = '';
  }
}

// Volunteer Experience
export class VolunteerExperience {
  id: string;
  organization_name: string;
  dates_of_service: string;
  responsibilities: string;
  constructor() {
    this.id = '';
    this.organization_name = '';
    this.dates_of_service = '';
    this.responsibilities = '';
  }
}
import { ResumeTemplateDto, SectionDesc } from "./store/user-store";
import { sections } from "./store/resume-sections";

export class Education{
    id! : string
    degree! : string;
    field_of_study! : string;
    school_name! : string;
    school_location! : string;
    graduation_date! : string;
    gpa! : string;
    isHideSelected : boolean
    isDefault : boolean

    constructor(){
      this.id = ""
      this.degree = ""
      this.field_of_study = ""
      this.school_name = ""
      this.school_location = ""
      this.graduation_date = ""
      this.gpa = ""
      this.isHideSelected = false
      this.isDefault = true;
    }
  }
  
  export class Project{
  id : string;
  project_name : string;
  project_link : string;
  period : string;
  description : string;
  technologies_used : string;
  isHideSelected : boolean;
  bullet_points_count : string;
  original_description_html : string;
  responsibilitiesRichText: string; // rich text for responsibilities/roles
  highlightsRichText: string; // rich text for highlights
  role: string; // new field for project role
  start_date: string; // new field for project start date
  end_date: string; // new field for project end date

      constructor(){
  this.id = "";
  this.project_name = "";
  this.project_link = "";
  this.period  = "";
  this.description = "";
  this.technologies_used = "";
  this.original_description_html = "";
  this.isHideSelected = false;
  this.bullet_points_count = "4";
  this.responsibilitiesRichText = "";
  this.highlightsRichText = "";
  this.role = "";
  this.start_date = "";
  this.end_date = "";
      }
    }
  
  export class Experience{
    id : string;
    position_title : string;
    company_name : string;
    location : string;
    start_date : string;
    end_date : string;
    description : string;
    isCurrentlyWorkHere : boolean;
    isHideSelected : boolean
    bullet_points_count : string;
    original_description_html : string;

    constructor(){
      this.id = ""
      this.position_title = ""
      this.company_name = ""
      this.location = ""
      this.start_date = ""
      this.end_date = ""
      this.description = "",
      this.isCurrentlyWorkHere = false;
      this.isHideSelected = false
      this.bullet_points_count = ""
      this.original_description_html = ""
    }
  }
  
  export class Certification {
    name: string;
    authority: string;
    licenseNumber: string;
    url: string;
    date: string;
    description: string;
    isHideSelected: boolean;

    constructor() {
      this.name = "";
      this.authority = "";
      this.licenseNumber = "";
      this.url = "";
      this.date = "";
      this.description = "";
      this.isHideSelected = false;
    }
  }
  
  

  export class ResumeContact{
    fname : string;
    lname : string;
    subTitle : string;
    role : string;
    email : string;
    phone_number : string;
    address : string;
    linkedIn_profile : string;
    github_profile : string;
    portfolio_link : string
    linkedIn_profile_display_name : string;
    github_profile_display_name : string;
    isHideSelected : boolean
    isDefaultData : boolean

    constructor(){
      this.fname = "";
      this.lname = "";
      this.subTitle = '';
      this.role = "";
      this.email = "";
      this.phone_number = "";
      this.address = "";
      this.linkedIn_profile = "";
      this.github_profile = "";
      this.portfolio_link = "";
      this.linkedIn_profile_display_name = "";
      this.github_profile_display_name = "";
      this.isHideSelected = false;
      this.isDefaultData = true;
    }
  }

  export class courseWork{
    id : number
    courseworkname : string
    institution : string
    isHideSelected : boolean
    constructor(){
      this.id = -1
      this.courseworkname = ""
      this.institution = ""
      this.isHideSelected = false
    }
  }

  export class achievement{
    id : number
    achievement : string

    constructor(){
      this.id = -1
      this.achievement = ""
    }
  }

  export class ProfileSummary{
    profile_summary : string;
    original_summary_html : string;
    position_highlight : string;
    skills_highlight : string;
    isDefault : boolean;
    isHideSelected : boolean;
    summary_bullets: string[];

    constructor(){
      this.profile_summary = "";
      this.position_highlight = "";
      this.skills_highlight = "";
      this.isDefault = true;
      this.isHideSelected = false;
      this.original_summary_html = '';
      this.summary_bullets = [];
    }
  }

  export class JobResumeRequest{
    id?: string;
    title! : string;
    description! : string;
    current_documentUrl! : string;
    old_documentUrl! : string;
    resumeJson! : string;
    category? : string;
    status! : string;
    access! : string;
    lastUpdatedDate! : string;
    lastUsedFor! : string;
    templateId! : string;
    ownerId! : string;
    htmlcontent! : string;
    username! : string;
    old_filename! : string;
    current_filename! : string;
    roleCategory! : string;
    isPrimary! : boolean;
    createdDate! : string | undefined;
    priority! : boolean;
  }

  export class JobResume{
    id?: string;
    title! : String;
    description? : string;
    documentUrl! : string;
    resumeJson? : string;
    category? : string;
    status? : string;
    access? : string;
    createdDate?: string;
    lastUpdatedDate! : string;
    lastUsedFor! : string;
    templateId? : string;
    ownerId! : string;
    roleCategory! : string;
    filename! : string;
    tags!: string;
    isPrimary! : boolean
    isActive! : boolean
  }

  export class AchievementBulletPoints{
    title: string;
    organization: string;
    year: string;
    ach?: string; // legacy or description
    original_html_achievement?: string;
    isDefault: boolean = true;
    constructor(){
      this.title = '';
      this.organization = '';
      this.year = '';
      this.ach = '';
      this.original_html_achievement = '';
    }
  }

  export class CertificationBulletPoints{
    point : string;
    original_html_content : string;
    isDefault : boolean = true
    constructor(){
      this.point = ""
      this.original_html_content =""
    }
  }

  // export class ResumeOnEdit{
  //   title: string;
  //   resume: Resume;

  //   constructor(){
  //     this.title = '';
  //     this.resume = new Resume();
  //   }
  // }

  export class IsSectionPresent{
    isContact : boolean
    isSummary : boolean
    isEducation : boolean
    isCourseWork : boolean
    isSkill : boolean
    isSkillV2 : boolean
    isSkillsBulletPoints : boolean
    isProject : boolean
    isExperience : boolean
    isCertification : boolean
    isAchievement : boolean
    isAccomplishments : boolean
    isSkillsCategory : boolean
    constructor(){
      this.isContact = false
      this.isSummary = false
      this.isEducation = false
      this.isCourseWork = false
      this.isSkill = false
      this.isSkillV2 = false;
      this.isSkillsBulletPoints = false;
      this.isProject = false
      this.isExperience = false
      this.isCertification = false
      this.isAchievement = false
      this.isAccomplishments = false
      this.isSkillsCategory = false
    }
  }

  export interface Skill {
    name: string;
    selected: boolean;
  }
  

  export class SkillV2{
    sub_title : string;
    skills : Array<string>;
    constructor(){
      this.sub_title= ''
      this.skills = []
    }
  }

  export class Accomplishment{
    id : string;
    accomplisment : string;
    date : string;
    description : string;
    original_html_description : string;
    isDefault : boolean;
    isHideSelected : boolean
    constructor(){
      this.id = '';
      this.accomplisment = ''
      this.date = ''
      this.description = ''
      this.original_html_description = ''
      this.isDefault = true
      this.isHideSelected = false;
    }
  }
  
  export class Resume{
    id?: string;
    title: string;
    resume_category: string;
    role_category: string;
    access_level: string;
    template_details: ResumeTemplateDto;
    isPrimary: boolean;
    isActive: boolean;
    subTitle: string;
    imageBase64Encoded: any;
    isSectionPresent: IsSectionPresent;
    sections: Array<SectionDesc>;
    multipleSections: Array<Array<SectionDesc>>;

  selectedContact?: any;
  constructor() {
      this.title = '';
      this.subTitle = 'Experienced Project Manager';
      this.access_level = 'Private';
      this.resume_category = '';
      this.role_category = '';
      this.template_details = { id: 1, name: 'Template 1', companyName: '', template_name: 'TEMPLATE_1', imgPath: 'assets/img/resume-avatar3.png' };
      this.isActive = false;
      this.isPrimary = false;
      this.imageBase64Encoded = null;
      this.isSectionPresent = new IsSectionPresent();
      // Initialize all sections from the sections array, with default sections having isAdded: true
      this.sections = sections.map(section => ({
        ...section,
        // Only CONTACT, PROFILE_SUMMARY, EDUCATION, WORK_EXPERIENCE, SKILLS_BULLET_POINTS are default
        isAdded: ['CONTACT', 'PROFILE_SUMMARY', 'EDUCATION', 'WORK_EXPERIENCE', 'SKILLS_BULLET_POINTS'].includes(section.section)
      }));
      this.multipleSections = [];
    }
  }

  export class TemplateVariables{
    template_name! : string;
    name! : boolean;
    email! : boolean;
    phone_number! : boolean;
    address! : boolean;
    linkedIn_profile! : boolean;
    github_profile! : boolean;
    role! : boolean;
    profile_summary! : boolean;
    experience! : boolean;
    education! : boolean;
    skills! : boolean;
    certification! : boolean;
    project! : boolean;
    awards! : boolean;
    languages! : boolean;
    interests! : boolean;
    volunteer_experiences! : boolean;
    professional_memberships! : boolean;
    publications! : boolean;
    profile_image! : boolean
  }

  export class JobDescriptionAIResponse
  {
    Profile_Summary: string
    Skills: string
    Job_Title: string
    ATS_Keywords: string
    Responsibilities_and_Duties: string
    Required_Experience: string

    constructor(){
      this.Profile_Summary = ""
      this.Skills = ""
      this.Job_Title = ""
      this.ATS_Keywords = ""
      this.Responsibilities_and_Duties = ""
      this.Required_Experience = ""
    }
  }

  export class JobApplicationDetails{
    id : string = ''
    job_role : string = ''
    company_name : string = ''
    location : string = ''
    email_provided : string = ''
    applied_date : string = ''
    job_type : string = ''
    job_mode : string = ''
    job_reference_url : string = ''
    job_description : string = ''
    status : string = ''
    resume_download_link : string = ''
    createdBy: string = '';
    createdDate: string = '';
    lastModifiedBy: string = '';
    lastModifiedDate: string = '';
    formatted_date : string = '';
    applicantId!: string;
    vendorContactId: string | undefined;
    clientContactId!: string;
    enterPriseId!: string;
    readOnlyUserIds!: string;
    writeUserIds!: string;
    emailUsed!: string;
    jobRole!: string;
    jobDescription!: string;
    companyName!: string;
    jobType!: string;
    jobMode!: string;
    jobShiftTimings!: string;
    salaryType!: string;
    salaryMin!: string; 
    salaryMax!: string;
    salaryExpected!: string;
    jobPostedDate!: string;
    jobAppliedDate!: string;
    startDate!: string;
    basicQualifications!: string;
    primarySkills!: string;
    atsScore!: string;
    resumeId!: string;
    previouslyAttended!: string;
    previouslyAttendedIds!: string;
    selectionProcess!: string;
    genderPreference!: string;
    feedbackProvided!: string;
    bondToBeSigned!: string;
    bondDetails!: string;
    companyOfficialWebsite!: string;
    companySize!: string;
  }

  export class VendorDetails{
    id : string = ''
    first_name : string = ''
    last_name : string = ''
    email : string = ''
    phone_number : string = ''
    company_name : string = ''
    createdBy: string = '';
    createdDate: string = '';
    lastModifiedBy: string = '';
    lastModifiedDate: string = '';
  }

  export class ClientDetails{
    id : string = ''
    first_name : string = ''
    last_name : string = ''
    email : string = ''
    phone_number : string = ''
    company_name : string = ''
    createdBy: string = '';
    createdDate: string = '';
    lastModifiedBy: string = '';
    lastModifiedDate: string = '';
  }

  export class RoundDetails{
    id : string = ''
    status : string = ''
    date : string = ''
    time : string = ''
    mode : string = ''
    type : string = ''
    notes : string = ''
    meet_link : string = ''
    createdBy: string = '';
    createdDate: string = '';
    lastModifiedBy: string = '';
    lastModifiedDate: string = '';
    isNew : boolean = true
    unqId : string = ''
    formatted_date : string  = ''
  }

  export class JobApplication{
    job_application_details : JobApplicationDetails = new JobApplicationDetails()
    vendor_details : VendorDetails = new VendorDetails()
    client_details : ClientDetails = new ClientDetails()
    round_details : RoundDetails[] = []
  }