export class ResumeListDataItem {
    id!: string;
    code!: string;
    title!: string;
    description!: string;
    documentUrl: string;
    resumeJson!: string;
    createdDate!: string;
    lastUpdatedDate!: string;
    resumeCategory!: string;
    roleCategory! : string;
    type!: string;
    status!: string;
    userName!: string;
    rating!: number;
    selected!: boolean;
    access!: string;
    wish!: boolean;
    lastUsedFor!: string;
    templateId!: string;
    ownerId!: string;
    tags!: string;
    fileName : string;
    imageBytes : string[];
    priority! : any;
    constructor() {
        this.documentUrl= ""
        this.fileName=""
        this.imageBytes = []
    }
}



export class ApplicationListDataItem {
    id!: string;
    code!: string;
    title!: string;
    description!: string;
    documentUrl: string;
    resumeJson!: string;
    createdDate!: string;
    lastUpdatedDate!: string;
    resumeCategory!: string;
    roleCategory! : string;
    type!: string;
    status!: string;
    userName!: string;
    rating!: number;
    selected!: boolean;
    access!: string;
    wish!: boolean;
    lastUsedFor!: string;
    templateId!: string;
    ownerId!: string;
    tags!: string;
    fileName : string;
    imageBytes! : any;
    priority! : any;
    constructor() {
        this.documentUrl= ""
        this.fileName=""
        this.imageBytes = "assets/img/resume-avatar3.png"
    }
}


export class JobApplication {
    id: string = '';
    applicantId: string = '';
    vendorContactId: string = '';
    clientContactId: string = '';
    enterPriseId: string = '';
    readOnlyUserIds: string = '';
    writeUserIds: string = '';
    status: string = '';
    emailUsed: string = '';
    jobRole: string = '';
    jobDescription: string = '';
    companyName: string = '';
    location: string = '';
    jobType: string = '';
    jobMode: string = '';
    jobShiftTimings: string = '';
    salaryType: string = '';
    salaryMin: number = 0;
    salaryMax: number = 0;
    salaryExpected: number = 0;
    jobPostedDate: string = '';
    jobAppliedDate: string = '';
    startDate: string = '';
    basicQualifications: string = '';
    primarySkills: string = '';
    atsScore: number = 0;
    resumeId: string = '';
    previouslyAttended: boolean = false;
    previouslyAttendedIds: string = '';
    selectionProcess: string = '';
    genderPreference: string = '';
    feedbackProvided: boolean = false;
    bondToBeSigned: boolean = false;
    bondDetails: string = '';
    companyOfficialWebsite: string = '';
    companySize: string = '';
    createdBy: string = '';
    createdDate: string = '';
    lastModifiedBy: string = '';
    lastModifiedDate: string = '';
  
    wish!: boolean;
    constructor() {}
  }

  export class JobInterviewRounds{
    id : string = '';
    applicationId: string = '';
    roundNumber: number = 0;
    roundType: string = '';
    roundDate: string = '';
    mode: string = '';
    venueOrLink: string = '';
    conductedBy: string = '';
    status: string = '';
    remindMe: boolean = false;
    feedback: string = '';
    score: string = '';
    result: string = '';
    roundDescription: string = '';
    createdBy: string = '';
    createdDate: string = '';
    lastModifiedBy: string = '';
    lastModifiedDate: string = '';
  }

  export class JobApplicationFeedback{
    id : number = 0;
    applicationId: string = '';
    applicantId: string = '';
    companyName: string = '';
    jobRole: string = '';
    userFeedback: string = '';
    postedDate: string = '';
    createdBy: string = '';
    createdDate: string = '';
    lastModifiedBy: string = '';
    lastModifiedDate: string = '';

  }

  export class VendorContact{
    id : string = '';
    firstName: string = '';
    lastName: string = '';
    email: string = '';
    phone: string = '';
    companyName: string = '';
    description: string = '';
    createdBy: string = '';
    createdDate: string = '';
    lastModifiedBy: string = '';
    lastModifiedDate: string = '';
  }

  export class ClientContact{
    id : string | undefined;
    firstName: string = '';
    lastName: string = '';
    email: string = '';
    phone: string = '';
    companyName: string = '';
    description: string = '';
    createdBy: string = '';
    createdDate: string = '';
    lastModifiedBy: string = '';
    lastModifiedDate: string = '';
  }

  export class JobApplicationRequest{
    jobApplication: JobApplication = new JobApplication();
    jobInterviewRounds: JobInterviewRounds[] = [];  // Assuming array of any type for now
    vendorContact : VendorContact = new VendorContact();
    clientContact : ClientContact = new ClientContact();
  }

  
  export class JobApplicationData {
    jobApplication: JobApplication = new JobApplication();
    jobInterviewRounds: JobInterviewRounds[] = [];  // Assuming array of any type for now
    feedback: JobApplicationFeedback = new JobApplicationFeedback();
    vendorContact : VendorContact = new VendorContact();
    clientContact : ClientContact = new ClientContact();
    resume: ResumeListDataItem = new ResumeListDataItem();
    selected: boolean = false;
    constructor() {}
  }