import { PassWordResetStateEnum } from "./app-constants.service";
import { Address } from "./contact.model";
import { ContactListItem, Profile } from "./profile.model";
import { SignUpResult } from "./signup.model";

export enum ActivationStatus {
  ACTIVATED = 'activated',
  NOT_ACTIVATED = 'not-activated'
}
export class UserSubscription {
  id!: string;
  title!: string;
  description!: string;
  statDate!: string;
  endDate!: string;
  icon!: string;
  status!: string;
  price!: string;
  currency!: string;
  constructor() {
  }
}
export class UserMenu {
  id!: string;
  menuId!: string;
  title!: string;
  translate!: string;
  type!: string;
  icon!: string;
  url!: string;
  refMenuId!: string;
  children!: Array<any>;

  constructor() {
    this.children = new Array<any>();
  }
}

export class ProcessOrgModel {
  userId!: string;
  processId!: string;
  orgId!: string;
  processName!: string;
}

export class LoginRequest {
  public username!: string;
  public password!: string;
  constructor() {
  }
}
export class RegisterRequest {
  public login!: string;
  public email!: string;
  public password!: string;
  public langKey!: string;

  public firstName!: string;
  public lastName!: string;
  public dob!: string;
  public userType!: string;
  public phoneNumber!: string;
  public personalEmialID!: string;
  public parentEmailID!: string;

  constructor(){
    // this.login = ''
  }
// }
// export class SignUpResult {
//   public activationCode?: string;
//   public emailId?: string;
//   public active?: string;
//   public id?: string;
//   public password?: string;
//   public phoneNumber?: string;
//   public status?: string;
//   public userName?: string;

//   constructor() {}
// }
// export class LoginResponse {
//   accessToken!: string;
//   tokenType!: string;
//   usersMenus!: Array<UserMenu>;
//   username!: string;
//   processOrgModel!: ProcessOrgModel;
//   loginResponseStatus!: string;
//   statusMessage!: string;
//   statusCode!: string;
//   errorCodeId!: string;
//   userId!: string;
//   profilePic!: string;

//   constructor(){
//     this.usersMenus = new Array<UserMenu>();
//     this.processOrgModel = new ProcessOrgModel();
//   }
}

export class ListOfScreenMapping {
  screeName!: string;
  enabled!: boolean;

  constructor() {
    this.enabled = true;
  }
}

export class LoginResponseStatus {
  userMailId!: any;
  firstTimeLogin!: boolean;
  clientId!: number;
  branchId!: number;
  branchName!: string;
  processId!: any;
  clientNumber!: any;
  listOfScreenMapping!: ListOfScreenMapping[];

  constructor() {
    this.listOfScreenMapping = new Array<ListOfScreenMapping>();
  }
}

export class LoginResponse {
  emailId!: string;
  id_token!: string;
  status!: string;
  userName!: string;
  username!: string;

  constructor() {
  }
}
export class SignUpRequest {
  public parentname?: any;
  public langKey?: string;

  public username?: any;
  public password?: any;
  public phoneNumber?: any;
  public emailId?: any;
  public activated?: any;
  public activationCode?: any;
  public type?: any;
  constructor() {
    this.parentname = '';
  }
}

export interface AuthState {
  id_token: string;
  loginProfileLoading: boolean;
  profile: Profile;
  updatedAddress: Address;
  contacts: Array<ContactListItem>;
  selectedContact: ContactListItem;
  password: any;
  authenticated: boolean;
  isAdmin: boolean;
  actionInProgress: boolean;
  isUserNameAvailable: boolean;
  userNameCheckInProgress: boolean,
  activationInfo: SignUpResult;
  passwordSent: boolean;
  error: any;
  userCountry: string;
  userSubscriptions: Array<UserSubscription>;

  loginResponse: LoginResponse;
  account: AccountProfile;
  isActivated : Boolean;
  passwordResetState: PassWordResetStateEnum
  isForgotPasswordInitSuccess : Boolean;
  isForgotPasswordFinishSuccess : Boolean;
}

export class AccountProfile{
  activated?: any;
  authorities: Array<string>;
  createdBy?: any;
  createdDate?: any;
  email?: any;
  firstName?: any;
  id?: any;
  imageUrl?: any;
  langKey?: any;
  lastModifiedBy?: any;
  lastModifiedDate?: any;
  lastName?: any;
  login?: any;


  constructor(){
      this.authorities = [];
  }

}

export class ProfileDataItem{
  fname?: string;
  lname?: string;
  mobile?: string;
  email?: string;
  message?: string;
}

export class PasswordRequest {
    
  public username?: any;
  public emailId?: any;

  constructor() {}
}
 
export class PasswordResult{
  public username?: any;
  public status?: any;
}