


export class ResumeContact {

    name: string = '';
    lname: string = '';
    phone_number: string = '';
    email_address: string = '';
    address :  string = '';
    role:  string = '';
    linkedIn_profile:  string = '';
    github_profile:  string = '';
    portfolio_url :  string = '';

}

export class ResumeCategory{
    id: number = -1;
    category: string = '';
    sub_category: string = '';
    tags: string = '';

    constructor(){
        
    }
}

export class ResumeAccess{
    id: number = -1;
    access_category : string = '';
    access_description : string = ''
    tags : string = ''
    constructor(){}
}

export class JobType{
    id: number = -1;
    job_type: string = '';
    description : string = '';
    tags : string = '';
}

export class JobMode{
    id : number= -1
    job_mode : string= ''
    description: string =''
    tags: string =''
}

export class JobApplicationStatus{
    id: number = -1
    status: string = ''
    description: string = ''
    tags: string = ''
}

export class RoundType{
    id: number = -1
    round_type: string = ''
    description: string = ''
    tags: string = ''
}

export class RoundMode{
    id: number = -1
    round_mode: string = ''
    description: string = ''
    tags: string = ''
}

export class RoundStatus{
    id: number = -1
    status: string = ''
    description: string = ''
    tags: string = ''
}

export class ResumeRoleLevel{
    id: number = -1;
    role_level : string = '';
    role_level_desc : string = '';
    tags : string = ''
    constructor(){}
}