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

export class NaariNotification{
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

export class DealSorting{
  title: string = "";
  isSelected?:boolean;
}
export class DealType{
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
  isSelected?:boolean;
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
  isSelected?:boolean;
}

export class PCategory{
    parent!: String;
    categories!: Array<Category>
}

export class CategoryListItem{
  title: string = "";
  categories: Array<Category>;

  constructor(){
    this.categories = [];
  }
}

export class PostDealItem{
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
  tags?:string;
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

export class DealDataItem {
  id: string = "";
  title: string = "";
  description: string = "";
  imageUrl: string = "";
  dealUrl: string = "";
  postedBy: string = "";
  postedDate: string = "";
  startDate: string = "";
  highlight: string = "";
  highlightColor: string = "";
  endDate: string = "";
  originalPrice: string = "";
  currentPrice: string = "";
  discount: string = "";
  discountType: string = "";
  active: string = "";
  approved:  boolean= false;
  country: string = "";
  city: string = "";
  pinCode: string = "";
  merchant: string = "";
  brand: string = "";
  category: string = "";
  tags: string = "";
  expired?: boolean;
  loader?: boolean;
  selected?:boolean;
}

export class AmazonDealDataRequestItem {
  keywords: string = "";
  searchIndex: string = "";
  minSavingPercent: string = "";
  category: string = "";
  country: string = "";
  tags: string = "";
  partnerTag: string = "";
  marketplace: string = "";
  validDays: string = "";
  maxPrice: string = "";
  startDate: string = "";
  numPages: string = "";
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
  country?: string;
  category?: string;
  type?: string;
}

export interface DealsState{
  showContent: boolean;
  selectedDeal : DealDataItem;
  selectedDealId: string;
  selectedCategory: Category;
  selectedCountry: string;
  selectedCategoryCode: string;
  selectedDealType: DealType;
  selectedBrand:  Brand,
  selectedSorting: DealSorting;
  selectedType: string;
  categories: Array<Category>;
  dealTypes: Array<DealType>;
  brands: Array<Brand>;
  merchants: Array<Merchant>;
  boutiques:  Array<Merchant>;
  slidesRequestType: string;
  homeSlides: Array<Slide>;
  dealsSlides: Array<Slide>;
  boutiqueSlides: Array<Slide>;
  selectedCategoryDeals: Array<DealDataItem>;
  relatedDeals: Array<DealDataItem>;
  dailyDeals: Array<DealDataItem>;
  clearenceDeals: Array<DealDataItem>;
  upto50Deals: Array<DealDataItem>;
  above50Deals: Array<DealDataItem>;
  
  allDeals: Array<DealDataItem>;
  filteredDeals: Array<DealDataItem>;

  subscriptions: Array<EmailSubscription>;

  actionProgress: boolean;

  registrationStatus: string;
  emailRegistered: boolean;
  errorMessage: string;

  notificationCount : number;
  notifications :Array<NaariNotification>;
}
