import { Injectable } from '@angular/core';
import { Address } from './contact.model';
import { BioProfileAddRequest } from './signup.model';


export class Account{
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

export class WifRole{
    title: string = '';
    role: string = '';
}

export class MenuListItem{
    title: string = '';
    icon: string = '';
    url: string = '';
    role: string = '';
    subscription: string = '';
}


export class LoginProfile{
    id?: string;
    userId!: string;
    userName!: string;
    memberId!: string;
    phoneNumber: string = '';
    emailId!: string;
    password!: string;
    status!: string;
    activationCode!: string;

    constructor(){}
}

export class LoginProfile_JH{
    public account: Account;
    public userType?: any; /* Parent / Children / Teacher / Counsiler */
    public phoneNumber?: any;      /* admin/user */
    public password?: any;
    constructor(){
        this.account = new Account();
    }
}

export class BioProfile {
    public id?: any;
    public userId?: any;
    public userName!: string;
    public memberId!: string;
    public firstName?: any;
    public lastName?: any;
    public title?: any;
    public summary?: any;
    public dob?: any;
    public gender?: any;
    public imageUrl?: any;

    constructor() {
    }
}

export class TeachingProfile {
    public id?: any;
    public userName!: string;
    public memberId!: string;
    public firstName?: string;
    public lastName?: string;
    public status?: string;
    public summary?: string;
    public location?: string;
    public sinceYear?: string;
    public phone?: string;
    public categories?: Array<string>;

    constructor() {
        this.categories = [];
    }
}


export class ContactListItem {
    public userId?: any;
    public phoneNumber?: any;
    public emailId? : any;
    public bioProfile? : BioProfileAddRequest
    constructor() {
    }
}

export class PasswordResetRqst {
    public username: string = '';
    public email : string = '';
    public language : string = '';
    constructor() {
    }
}


export class PasswordResetFinishRqst {
    public key: string = '';
    public newPassword : string = '';
    constructor() {
    }
}


export class AcademicProfile {
    public id?: any;
    public userName!: string;
    public memberId!: string;
    public grade?: string;
    public gradYear?: string;
    public school?: string;
    public city?: string;
    public description?: string;
    constructor() {
    }
}


export class Profile {
    public account: Account;
    public login: LoginProfile;
    public bio: BioProfile;
    public address: Address;
    constructor() {
        this.account = new Account();
        this.bio = new BioProfile();
        this.login = new LoginProfile();
        this.address = new Address();
    }

}
export class MessageDTO {

    messageContent!: string;
    from!: string;
    to!: string;

    constructor(){}
}

export  class ReceivedNotification {

    message!: string;
    from!: string;
    to!: string;
    type!: string;
    imageUrl!: string;

    constructor(){}
}