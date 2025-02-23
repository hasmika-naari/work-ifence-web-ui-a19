export class SocialLinks{
  id: string = "";
  type: string = "";
  title: string = "";
  url: string = "";
  status: string = "";
  merchantId: string = "";
  action : string = "";
}

export class Merchant {
  code : string = "";
  id: string = "";
  title: string = "";
  subTitle: string = "";
  address: string = "";
  phone: string = "";
  country: string = "";
  city: string = "";
  imageUrl: string = "";
  type: string = "";
  location: string = "";
  siteUrl: string = "";
  status: string = "";
  socialLinks: Array<SocialLinks>;
  
  constructor(){
    this.socialLinks = [];
  }
}

export class WorkifenceNotification{
  id!: string;
  toMember!: string;
  fromMember!: string;
  fromMemberImageUrl!: string;
  title!: string;
  message!: string;
  status!: string;
  type!: string;
  date!: string;
  constructor(){}
}

export class Competitionsorting{
  title: string = "";
  isSelected:boolean = false;
}
export class ComepetationType{
  id: string = "";
  title: string = "";
  subTitle: string = "";
  dealCount: string = "";
  icon: string = "";
  bgColor: string = "";
  country: string = "";
  code: string = "";
  status: string = "";
  display:  boolean= false;
  isSelected:boolean = false;
}

export class Category{
  id: string = "";
  parent: string = "";
  title: string = "";
  subTitle: string = "";
  description: string = "";
  imageUrl: string = "";
  country: string = "";
  code: string = "";
  status: string = "";
  isSelected:boolean = false;
}

export class PCategory{
    parent: String = '';
    categories: Array<Category>;
    constructor(){
      this.categories = new Array<Category>();
    }
}

export class ResumeTemplate{
  id: number = 0;
  name: string = '';
  companyName: string = '';
  template_name : string ='';
  imgPath : string = '';

  constructor(){}
}

export class MenuItem {
  id: string = "";
  title: string = "";
  count: string = "";
  code: string = "";
  status: string = "";
  isSelected:boolean = false;
}

export class MenuListItem{
  id: string = '';
  parent: String = '';
  menuItems: Array<MenuItem>;
  constructor(){
    this.menuItems = new Array<MenuItem>();
  }
}



export class CategoryListItem{
  title: string = "";
  categories: Array<Category>;

  constructor(){
    this.categories = [];
  }
}

export class PostCompetationItem{
  title: string = '';
  valid: number = 0;
}
export class Slide{
  id: string = "";
  title: string = "";
  subTitle: string = "";
  status: string = "";
  country: string = "";
  startDate: string = "";
  endDate: string = "";
  imageUrl: string = "";
  dealUrl: string = "";
  merchantIcon: string = "";
  tags:string = '';
}

export class Brand{
  id: string = "";
  title: string = "";
  subTitle: string = "";
  code: string = "";
  status: string = "";
  country: string = "";
  imageUrl: string = "";
}

export class CompetationDataItem {
  id: string = '';
  copetitionCode: string = "";
  title: string = "";
  description: string = "";
  imageUrl: string = "";
  siteUrl: string = "";
  ctegoryId: string = "";
  categoryName: string = "";
  locationType: string = "";
  location: string = "";
  ownerId: string = "";
  orignizationName: string = "";
  orignizationId: string = "";
  country: string = "";
  minRegisterCount: string = "";
  maxRegisterCount: string = "";
  totalRegisterCount: string = "";
  startDate: string = "";
  endDate: string = "";
  scheduledYear: string = "";
  statusMessage: string = "";
  registerationStartDate: string = "";
  registerationEndDate: string = "";
  registerationStatus: string = "";
  submissionEndDate: string = "";
  startAgeLimit: string = "";
  endAgeLimit: string = "";
  gender: string = "";
  fee: string = "";
  feeCurrency: string = "";
  tags: string = "";
  selected: boolean = false;
}


export class EmailSubscription{
  id: string = "";
  email: string = "";
  country: string = "";
  createdDate: string = "";
  status: string = "";
  remarks: string = "";
}

export class GetDealsRequestParam{
  country: string = '';
  category: string = '';
  type: string = '';
}
