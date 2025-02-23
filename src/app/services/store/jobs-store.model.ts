
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


export interface JobOpeningsState{
    actionInProgress : boolean;
    homePageJobsFeed : Array<JobFeedItem>;
    searchPageJobsFeed : Array<JobFeedItem>;
    seletedJobFeed :  JobFeedItem;
    jobWishList : Array<JobFeedItem>;
    appliedJobs : Array<JobItem>;
    selectedAppliedJob : JobItem;
    enterprise : Array<Enterprise>;
    errorMessage : any
}
