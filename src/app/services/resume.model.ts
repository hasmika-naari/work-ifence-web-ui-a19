import { ResumeTemplateDto } from "./store/user-store";

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
    id : string
    project_name : string;
    project_link : string;
    period : string;
    description : string;
    technologies_used : string;
    isHideSelected : boolean
    bullet_points_count : string;
    original_description_html : string;


    constructor(){
      this.id = ""
      this.project_name = ""
      this.project_link = ""
      this.period  = ""
      this.description = ""
      this.technologies_used = ""
      this.original_description_html = ""
      this.isHideSelected = false
      this.bullet_points_count = "4"
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
      this.bullet_points_count = "4"
      this.original_description_html = ""
    }
  }
  
  export class Certification{
    id : string;
    certification_name : string;
    issued_organisation : string;
    certification_link : string;
    issued_month : string;
    issued_year : string;
    isHideSelected : boolean

    constructor(){
      this.id = ""
      this.certification_name = ""
      this.issued_organisation = ""
      this.certification_link = ""
      this.issued_month = ""
      this.issued_year = ""
      this.isHideSelected = false
    }
  }
  
  export class Award{
    award_name!: string;
    issuing_organization!: string;
    date_received!: string;
  }
  
  export class Language{
    language_name! : string;
    proficiency_level! : string
  }
  
  export class Publication{
    title!: string
    publication_source!: string
    date!: string
  }
  
  export class Professional_Membership{
    organization_name!: string;
    membership_level!: string;
    dates_of_membership!: string;
  }
  
  export class Volunteer_Experience{
    organization_Name!: string;
    dates_of_service!: string;
    responsibilities!: string;
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
    constructor(){
      this.id = -1
      this.courseworkname = ""
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
    profile_summary : string
    original_summary_html : string;
    position_highlight : string
    skills_highlight : string
    isDefault : boolean
    isHideSelected : boolean

    constructor(){
      this.profile_summary = ""
      this.position_highlight = ""
      this.skills_highlight = ""
      this.isDefault = true;
      this.isHideSelected = false;
      this.original_summary_html = ''
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

  export class Achievement{
    ach : string;
    original_html_achievement : string;
    isDefault : boolean = true
    constructor(){
      this.ach = ""
      this.original_html_achievement =""
    }
  }

  export class Other{
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
    isProject : boolean
    isExperience : boolean
    isCertification : boolean
    isAchievement : boolean
    isAccomplishments : boolean
    isOther : boolean
    constructor(){
      this.isContact = false
      this.isSummary = false
      this.isEducation = false
      this.isCourseWork = false
      this.isSkill = false
      this.isSkillV2 = false;
      this.isProject = false
      this.isExperience = false
      this.isCertification = false
      this.isAchievement = false
      this.isAccomplishments = false
      this.isOther = false
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
    title: string;
    resume_category : string;
    role_category : string;
    access_level : string;
    template_details : ResumeTemplateDto;
    isPrimary : boolean;
    isActive : boolean;
    subTitle: string;
    contact : ResumeContact;
    profileSummary : ProfileSummary;
    skill : Array<string>;
    skill_v2 : Array<SkillV2>;
    education : Array<Education>;
    project : Array<Project>;
    experience : Array<Experience>;
    certification : Array<Certification>;
    achievement : Achievement;
    accomplishment : Array<Accomplishment>;
    other : Other;
    courseWork : Array<string>;
    award : Array<Award>;
    language : Array<Language>;
    interest : Array<string>;
    publication  : Array<Publication>;
    professional_membership : Array<Professional_Membership>;
    volunteer_experience : Array<Volunteer_Experience>;
    imageBase64Encoded : any
    isSectionPresent : IsSectionPresent;

    constructor(){
      this.title = '';
      this.subTitle = 'Experienced Project Manager';
      this.access_level = 'Private';
      this.resume_category = '';
      this.role_category = '';
      this.template_details = { id: 1,name: 'Template 1',companyName : '',template_name: 'TEMPLATE_1',imgPath : 'assets/img/resume-avatar3.png'};
      this.isActive = false;
      this.isPrimary = false;
      this.contact = {subTitle: 'Experienced Project Manager',fname : "JOHN", lname : "DOE", role : "Software Developer", email : "Email", phone_number : "Phone", address : "Location", linkedIn_profile : "https://www.linkedin.com/", github_profile : "https://github.com/", portfolio_link : "",linkedIn_profile_display_name : "LinkedIn" ,github_profile_display_name : 'GitHub' , isHideSelected : false, isDefaultData : true}
      this.profileSummary = { profile_summary : "", position_highlight : "", skills_highlight : "", isDefault : true, isHideSelected : false, original_summary_html : ''}
      this.skill = [] 
      this.skill_v2 = []
      this.education = []
      this.project = []
      this.experience = []
      this.certification = []
      this.achievement = { ach : "", original_html_achievement : '', isDefault : true}
      this.courseWork = []
      this.award = []
      this.language = []
      this.interest = []
      this.publication = []
      this.professional_membership = []
      this.volunteer_experience = []
      this.accomplishment = []
      this.isSectionPresent = {isContact : false, isSummary : false, isEducation : false, isCourseWork : false, isSkill : false,isSkillV2 : false, isProject : false, isExperience : false, isCertification : false, isAchievement : false, isOther : false, isAccomplishments : false},
      this.other = {point : '', original_html_content : '', isDefault : true}
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