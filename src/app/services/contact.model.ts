export class Address {
    id?: any;
    line1?: any;
    line2?: any;
    city?: any;
    country?: any;
    state?: any;
    zipcode?: any;
    location?: any;
    locationName?: any;
    name?: any;
    userName?: any;
    ownerId?: any;
    constructor() {}
}

export class Location {
    public addr1?: any;
    public addr2?: any;
    public countryCode?: any;
    public countryName?: any;
    public stateCode?: any;
    public stateName?: any;
    public cityCode?: any;
    public cityName?: any;
    public zipCode?: any;
    public visibleFlag?: any;
    constructor() {}
}

export class PhoneNumber {
    public phoneNumber?: any;
    public type?: any;  /* mobile/ landlane / frontdesk */
    public visibleFlag?: any;
    constructor() {}
}

export class Email {
    public emailId?: any;
    public visibleFlag?: any;
    constructor() {}
}

export class ContactInfo {
    public locations: Array<Location>;
    public phoneNumbers: Array<PhoneNumber>;
    public emails: Array<Email>;
    constructor() {
        this.emails = new Array<Email>();
        this.locations = new Array<Location>();
        this.phoneNumbers = new Array<PhoneNumber>();

    }
}