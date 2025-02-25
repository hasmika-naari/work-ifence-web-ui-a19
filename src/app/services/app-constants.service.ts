import { Injectable } from '@angular/core';

export const APP_CONTEXT:string = ''
export const BASE_AWS_S3_API_URL = '';
// export const BASE_AWS_S3_API_URL = 'https://97.74.93.142:8443';http://97.74.93.142:8090
export const APP_ID = 'guruclass';
      


export class SnackTypes {
    public SUCCESS: string;
    public ERROR: string;
    public INFO: string;
    public WARNING: string;

    constructor() {
      this.ERROR = 'error';
      this.SUCCESS = 'success';
      this.INFO = 'info';
      this.WARNING = 'warning';
    }
  }

  
export class ScheduleStatus {
    public NOT_STARTED: string;
    public STARTED: string;
    public CANCELED: string;
    public DONE: string;

    constructor() {
      this.NOT_STARTED = 'NOT_STARTED';
      this.STARTED = 'STARTED';
      this.CANCELED = 'CANCELED';
      this.DONE = 'DONE';
    }
  }

  
export enum PassWordResetStateEnum{
  RESET_STARTED = 0,
  RESET_KEY_REQUESTED = 1,
  RESET_KEY_REQUEST_SUCCESS = 2,
  RESET_KEY_REQUEST_FAILED = 3,
  RESET_KEY_SUBMITTED = 4,
  RESET_KEY_SUBMIT_SUCCESS = 5,
  RESET_KEY_SUBMIT_FAILED = 6,
  RESET_NONE = 7,
}

export class PassWordResetState {
  public RESET_STARTED: number;
  public RESET_KEY_REQUESTED: number;
  public RESET_KEY_REQUEST_SUCCESS: number;
  public RESET_KEY_REQUEST_FAILED: number;
  public RESET_KEY_SUBMITTED: number;
  public RESET_KEY_SUBMIT_SUCCESS: number;
  public RESET_KEY_SUBMIT_FAILED: number;
  public RESET_NONE: number;

  constructor() {
    this.RESET_STARTED = 0;
    this.RESET_KEY_REQUESTED = 1;
    this.RESET_KEY_REQUEST_SUCCESS = 2;
    this.RESET_KEY_REQUEST_FAILED = 3;
    this.RESET_KEY_SUBMITTED = 4;
    this.RESET_KEY_SUBMIT_SUCCESS = 5;
    this.RESET_KEY_SUBMIT_FAILED = 6;
    this.RESET_NONE = 7;
    
  }
}


@Injectable({ providedIn: 'root' })
export class AppConstantsService {
    public JWT_TOKEN: string;
    public CONFIG_URL:string;
    public TEST_CONNECTION !: string;
    public BASE_API_URL: string;
    public BASE_SSR_API_URL: string;

    public BASE_API_SSR_URL: string;
    public BASE_AWS_API_URL: string;
    public BASE_AWS_S3_API_URL: string;
    public SIGN_IN_URL: string;
    public SIGN_IN_PRE_URL: string;
    public ACCOUNT_URL: string;
    public TOKEN_REFRESH_URL: string;

    public SIGNUP_URL: string;
    public SUBMIT_ACTIVATION_CODE_URL: string;
    public GET_ACTIVATION_CODE_URL: string;
    public GET_PASSWORD_URL: string;

    public CHECK_USER_NAME_URL: string;

    public GET_LOGIN_PROFILE_URL: string;
    public SAVE_LOGIN_PROFILE_URL: string;
    public CHANGE_EMAIL_VERIFY_URL: string;
    public CHANGE_EMAIL_URL: string;

    public GET_BIO_PROFILE_URL: string;
    public SAVE_BIO_PROFILE_URL: string;

    public GET_ADDRESS_URL: string;
    public REMOVE_ADDRESS_URL: string;
    public SAVE_ADDRESS_URL: string;
    public GET_CONTACTS: string;

    public GET_USA_STATES: string;
    public GET_INDIA_STATES: string;


    public MESSAGES_GET: string;
    public MESSAGE_REMOVE: string;

    public GET_DEAL_DETAILS_BY_ID : string;
    public SEND_MESSAGE_TO_USER_URL:string;
    public SEND_BROADCAST_MESSAGE_URL:string;

    public GET_DEAL_CATEGORIES_BY_COUNTRY: string;
    public GET_DEAL_CATEGORY_TYPES_BY_COUNTRY: string;

    public GET_ALL_DEALS_BY_COUNTRY: string;


    public BASE_APP_URL: string;
    public BASE_FRONT_PAGE_API_URL: string;


    public GET_RESUMES_BY_USER_NAME_URL: string;
    public GET_RESUMES_BY_USER_ID: string;
    public SAVE_RESUMES: string;
    public UPDATE_RESUME: string;
    public DELETE_RESUME: string;
    public SAVE_RESUME_AND_DOWNLOAD: string;
    public DOWNLOAD_RESUME: string;
    public DOWNLOAD_EXTERNAL_RESUME : string;
    public UPLOAD_PROFILE_IMAGE : string;

    public UPDATE_USER_RESUME_PRIMARY_VALUE : string;
    public UPDATE_USER_RESUME_STATUS_VALUE : string;
    public UPDATE_USER_RESUME_ACCESS_VALUE : string;

    public POST_JOB_RESUME_URL: string;
    public UPDATE_JOB_RESUME_URL: string;
    public GET_JOB_RESUMES_URL: string;
    public GET_JOB_RESUME_BY_ID_URL: string;
    public DELETE_JOB_RESUME_BY_ID_URL: string;

    public POST_APPLIED_JOB_URL: string;
    public UPDATE_APPLIED_JOB_URL: string;
    public GET_APPLIED_JOBS_URL: string;
    public GET_APPLIED_JOB_BY_ID_URL: string;
    public DELETE_APPLIED_JOB_BY_ID_URL: string;

    public GET_ENTERPRISE_BY_CATEGORY : string;

    public SAVE_JOB_APPLICATION : string;
    public UPDATE_JOB_APPLICATION : string;
    public UPDATE_JOB_APPLICATION_STATUS : string;

    public REQUEST_OPENAI : string;

    public GET_ALL_JOB_APPLICATIONS : string;
    public POST_EXTERNAL_RESUME : string;
    public DELETE_EXTERNAL_RESUME : string;
    public DELETE_INTERVIEW_ROUND : string;
    public DELETE_JOB_APPLICATION : string;
    public DELETE_VENDOR_CONTACT : string;
    public DELETE_CLIENT_CONTACT : string;


    public snackbarType: SnackTypes;
    public passwordResetState: PassWordResetState;

    constructor() {
        this.CONFIG_URL = 'assets/config/web.config.json';
        this.JWT_TOKEN = '';
        this.BASE_APP_URL = 'http://Workifence.com';
        // this.BASE_APP_URL = 'http://localhost:4200';
        this.BASE_API_SSR_URL = 'http://Workifence.com:8090';
        this.BASE_API_URL = 'http://Workifence.com:8090';
        this.BASE_SSR_API_URL = 'http://Workifence.com:8090';
        // this.BASE_AWS_API_URL = 'https://97.74.93.142:8443';
        // this.BASE_FRONT_PAGE_API_URL = 'https://97.74.93.142:8443';
        // this.BASE_API_URL = '';
        this.BASE_AWS_API_URL = 'http://Workifence.com:8090';
        this.BASE_FRONT_PAGE_API_URL = '';
        this.SIGN_IN_PRE_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT + '/api/wif-login';
        this.SIGN_IN_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT + '/api/authenticate';
        this.ACCOUNT_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT + '/api/account';
        this.SIGNUP_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT + '/api/wif-register';
        this.SUBMIT_ACTIVATION_CODE_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT + '/api/wif-activate';
        this.GET_ACTIVATION_CODE_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT + '/api/wif-send-activation-code';
        this.GET_PASSWORD_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT + '/getPassword';
        this.TOKEN_REFRESH_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/account/refreshToken';

        this.CHECK_USER_NAME_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/wif-check-user-name';

        this.GET_LOGIN_PROFILE_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/login-profile-by-name';
        this.SAVE_LOGIN_PROFILE_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/login-profiles';
        this.CHANGE_EMAIL_VERIFY_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/wif-change-email-verify';
        this.CHANGE_EMAIL_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/wif-change-email';
        
        this.GET_BIO_PROFILE_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/bio-profile-by-name';
        this.SAVE_BIO_PROFILE_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/bio-profiles';
        this.GET_CONTACTS = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/wif-get-my-contacts';


        this.GET_ADDRESS_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/gs-addresses-by-username';
        this.SAVE_ADDRESS_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/addresses';
        this.REMOVE_ADDRESS_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/addresses';
        this.GET_DEAL_DETAILS_BY_ID = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/wif-deals';
        this.GET_DEAL_CATEGORIES_BY_COUNTRY = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/competation-category';
        this.GET_DEAL_CATEGORY_TYPES_BY_COUNTRY = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/wif-deal-category-types';

        
        this.BASE_AWS_S3_API_URL = 'https://gurusamaya.s3.us-east-2.amazonaws.com/';

        this.MESSAGES_GET = APP_CONTEXT ? '/' : '' + APP_CONTEXT + '/api/getMessagesByUserName';
        this.MESSAGE_REMOVE = APP_CONTEXT ? '/' : '' + APP_CONTEXT + '/api/removeMessage';

        this.SEND_MESSAGE_TO_USER_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/send-private-message/';
        this.SEND_BROADCAST_MESSAGE_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/send-broad-message';

        this.GET_USA_STATES =  '/assets/demo/data/states-usa.json';
        this.GET_INDIA_STATES =  '/assets/demo/data/states-india.json';

        this.POST_JOB_RESUME_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/job-resumes';
        this.UPDATE_JOB_RESUME_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/job-resumes';
        this.GET_JOB_RESUMES_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/job-resumes';
        this.GET_JOB_RESUME_BY_ID_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/job-resumes';
        this.DELETE_JOB_RESUME_BY_ID_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/job-resumes';

        this.POST_APPLIED_JOB_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/job-applications';
        this.UPDATE_APPLIED_JOB_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/job-applications';
        this.GET_APPLIED_JOBS_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/job-applications';
        this.GET_APPLIED_JOB_BY_ID_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/job-applications';
        this.DELETE_APPLIED_JOB_BY_ID_URL = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/job-applications';

        this.GET_ENTERPRISE_BY_CATEGORY = APP_CONTEXT ? '/' : '' + APP_CONTEXT +  '/api/enterprise-profiles';


        ////////////// Deal START
        this.GET_ALL_DEALS_BY_COUNTRY = APP_CONTEXT
        ? '/'
        : '' + APP_CONTEXT + '/api/wif-deals-by-country';
      
      this.GET_DEAL_DETAILS_BY_ID = APP_CONTEXT
        ? '/'
        : '' + APP_CONTEXT + '/api/wif-deals';
        
      // this.GET_DEAL_CATEGORIES_BY_COUNTRY = APP_CONTEXT
      //   ? '/'
      //   : '' + APP_CONTEXT + '/api/wif-deal-categories-by-country';
      this.GET_RESUMES_BY_USER_NAME_URL = APP_CONTEXT
      ? '/'
      : '' + APP_CONTEXT + '/api/wif-deals';

      this.GET_RESUMES_BY_USER_ID =  APP_CONTEXT
      ? '/'
      : '' + APP_CONTEXT + '/api/job-resumes';

      this.SAVE_RESUMES = APP_CONTEXT
      ? '/'
      : '' + APP_CONTEXT + '/api/saveResumeDocument';

      this.UPDATE_RESUME = APP_CONTEXT
      ? '/'
      : '' + APP_CONTEXT + '/api/job-resumes';

      this.DELETE_RESUME = APP_CONTEXT
      ? '/'
      : '' + APP_CONTEXT + '/api/deleteResumeById';

      this.SAVE_RESUME_AND_DOWNLOAD = APP_CONTEXT
      ? '/'
      : '' + APP_CONTEXT + '/api/saveResumeandDownloadResume';

      this.DOWNLOAD_RESUME = APP_CONTEXT
      ? '/'
      : '' + APP_CONTEXT + '/api/downloadResume';

      this.DOWNLOAD_EXTERNAL_RESUME = APP_CONTEXT
      ? '/'
      : '' + APP_CONTEXT + '/api/downloadExternalResume';

      this.UPDATE_USER_RESUME_PRIMARY_VALUE = APP_CONTEXT
      ? '/'
      : '' + APP_CONTEXT + '/api/updateIsPrimaryByResumeId';

      this.UPDATE_USER_RESUME_STATUS_VALUE = APP_CONTEXT
      ? '/'
      : '' + APP_CONTEXT + '/api/updateStatusByResumeId';

      this.UPDATE_USER_RESUME_ACCESS_VALUE = APP_CONTEXT
      ? '/'
      : '' + APP_CONTEXT + '/api/updateAccessByResumeId';

      this.UPLOAD_PROFILE_IMAGE = APP_CONTEXT
      ? '/'
      : '' + APP_CONTEXT + '/api/uploadProfileImage1';

      this.SAVE_JOB_APPLICATION = APP_CONTEXT
      ? '/'
      : '' + APP_CONTEXT + '/api/post-job-application-by-user';

      this.UPDATE_JOB_APPLICATION = APP_CONTEXT
      ? '/'
      : '' + APP_CONTEXT + '/api/post-job-application-by-user';

      this.UPDATE_JOB_APPLICATION_STATUS = APP_CONTEXT
      ? '/'
      : '' + APP_CONTEXT + '/api/job-applications';

      this.REQUEST_OPENAI = APP_CONTEXT
      ? '/'
      : '' + APP_CONTEXT + '/api/openai/completions';

      this.GET_ALL_JOB_APPLICATIONS = APP_CONTEXT
      ? '/'
      : '' + APP_CONTEXT + '/api/get-job-application-by-userid';

      this.POST_EXTERNAL_RESUME = APP_CONTEXT
      ? '/'
      : '' + APP_CONTEXT + '/api/uploadExternalResumeInS3';

      this.DELETE_EXTERNAL_RESUME = APP_CONTEXT
      ? '/'
      : '' + APP_CONTEXT + '/api/deleteExternalResume';

      this.DELETE_INTERVIEW_ROUND = APP_CONTEXT
      ? '/'
      : '' + APP_CONTEXT + '/api/job-interview-rounds';

      this.DELETE_JOB_APPLICATION = APP_CONTEXT
      ? '/'
      : '' + APP_CONTEXT + '/api/deleteApplicationById';

      this.DELETE_VENDOR_CONTACT = APP_CONTEXT
      ? '/'
      : '' + APP_CONTEXT + '/api/vendor-contacts';

      this.DELETE_CLIENT_CONTACT = APP_CONTEXT
      ? '/'
      : '' + APP_CONTEXT + '/api/client-contacts';


        this.snackbarType = new SnackTypes();
        this.passwordResetState = new PassWordResetState();

    }
}

@Injectable({ providedIn: 'root' })
export class UserTypes {

    public USER_MERCHANT: string;
    public USER_BUYER: string;
    public USER_ADMIN: string;

    constructor(){
        this.USER_ADMIN = 'admin';
        this.USER_BUYER = 'buyer';
        this.USER_MERCHANT = 'merchant';
    }

}
