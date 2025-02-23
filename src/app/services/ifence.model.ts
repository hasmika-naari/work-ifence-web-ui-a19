export  class ReceivedNotification {
    title: string = '';
    message: string = '';
    type : string = '';
    unreadNotificationCount: number = 0;
    constructor(){}
}

export class Notification{
   id : string = '';
   userId : string = '';
   title : string = '';
   message : string = '';
   status : string = '';
   type : string = '';
   dateOfread : string = '';
   unreadNotificationCount : number = 0;
  }
export class JLink {
    __cdata: string;
    constructor(){
        this.__cdata = ''
    }
}

export class JobType{
  region: string = '';
  jobtype: string = '';
  id: string = '';
}

export class JobCategory{
  title: string = '';
  code: string = '';
  id: string = '';
}


export class FaqType{
  title: string = '';
  code: string = '';
  selected: boolean = false;
  id: string = '';
}

export class Slide{
    id: string = '';
    title: string = '';
    subTitle: string = '';
    status: string = '';
    country: string = '';
    startDate: string = '';
    endDate: string = '';
    imageUrl: string = '';
    dealUrl: string = '';
    merchantIcon: string = '';
    tags:string = '';
    isLoaded?: boolean = false;
  }

  export class Category{
    id: string = '';
    parent: string = '';
    title: string = '';
    subTitle: string = '';
    description: string = '';
    imageUrl: string = '';
    country: string = '';
    code: string = '';
    status: string = '';
    isSelected:boolean = false;
    isLoaded:boolean = false; 
  }
  
  export class CategoryList{
    type: string;
    cats: Array<Category>;
  
    constructor(){
      this.type = '';
      this.cats = new Array<Category>();
    }
  }

  export class PCategory{
    parent: String = '';
    categories: Array<Category>;
    constructor(){
      this.categories = new Array<Category>();
    }
}

export class JobSorting{
  title: string = "";
  isSelected?:boolean;
}
  export class Industry {
    id: string = '';
    title: string = '';
    subTitle: string = '';
    address: string = '';
    phone: string = '';
    country: string = '';
    city: string = '';
    imageUrl: string = '';
    type: string = '';
    location: string = '';
    siteUrl: string = '';
    status: string = '';
  }
export class JobFeedItem{
    id: string = '';
    link: any = '';
    name: any = '';
    region: any = '';
    description: any = '';
    company: any = '';
    pubdate: any = '';
    updated: any = '';
    expire: string = '';
    jobtype: any = '';
    selected?: boolean = false;
    loading?: boolean = true;

    constructor(){
        this.selected = false;
    }
}

export class JobResumeItem{
    id: string = '';
    title: any = '';
    description: string = '';
    summary: string = '';
    documentUrl: string = '';
    status: string = '';
    access: string = '';
    lastUpdatedDate: string = '';
    lastUsedFor: string = '';
    ownerId: string = '';  
}

export class JobItem{
   id : string = '';
   title : string = '';
   description : string = '';
   ownerId : string = '';
   enterpriseId : string = '';
   vendorUserId : string = '';
   clientUserId : string = '';
   status      : string = '';
   appliedDate : Date | undefined
   resumeUrl   : string = '';
   resumeId    : string = '';
   resumeSummary     : string = '';
   lasteResponseDate : Date | undefined  
   notes             : string = '';
   meetingType       : string = '';  
   meetingLocation   : string = '';
   meetingScheduledDate : Date | undefined
}

export class Enterprise{
  contactPh : string = '';
  description: string = '';
  emailId : string = '';
  id : string = '';
  imageUrl : string = '';
  name : string = '';
  ownerId : string = '';
  socialLinks: Array<any> = [];
}

export class CourseOption {
  id: string = '';
  title: string = '';
  type: string = '';
  subType: string = '';
  description: string = '';
  isItFree: boolean = false;
  icon: string = '';
  color: string = '';
  iconColor: string = '';
  isSlected: boolean = false;
  constructor(){}
}

export class CourseSearchRequest {
  category: string = '';
  userId: string = '';
  subCategory: string = '';
  title: string = '';
  displayCategory: string = '';
  constructor(){}
}

export class InterviewQueAndAns{
  id : string = '';
  question : string  = '';
  answer : string = '';
  example : string = '';
  followUpQue : string = '';
  competencyOrArea : string = '';
  level : string = '';
  importance : string = '';
  required : string = '';
  helpful : string = '';
  comments : Array<QuestionComment> = []
}

export class QuestionComment{
  company : string = '';
  comment : string = '';
  helpful : string = '';
  questionId : string = '';
  userId : string = '';
}

export interface IIfenceState{
    actionInProgress : boolean;
    homePageJobsFeed : Array<JobFeedItem>;
    searchPageJobsFeed : Array<JobFeedItem>;
    seletedJobFeed :  JobFeedItem;
    jobWishList : Array<JobFeedItem>;
    jobResumes :  Array<JobResumeItem>;
    selectedJobResume :  JobResumeItem;
    selectedFaqType :  FaqType;
    faqTypes :  Array<FaqType>;
    appliedJobs : Array<JobItem>;
    selectedAppliedJob : JobItem;
    enterprise : Array<Enterprise>;
    selectedQuestion : InterviewQueAndAns;
    notifications : Array<Notification>;
    notificationCount : number;
    notificationCallCount : number;
    errorMessage : any
}

