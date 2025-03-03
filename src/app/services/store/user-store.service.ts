import { Injectable, Signal, computed, signal } from "@angular/core";
import { ResumeTemplateDto, UserResume, UserState } from "./user-store";
import { Account, BioProfile, LoginProfile, WifRole } from "../profile.model";
import { MenuListItem, ResumeTemplate } from "../bee-compete.model";
import { Education, Experience, Project, Resume, Certification, ResumeContact, ProfileSummary, JobDescriptionAIResponse, JobApplication, RoundDetails, VendorDetails, ClientDetails, Achievement, IsSectionPresent, Other, SkillV2, Accomplishment, Skill} from "../resume.model";
import { ApplicationListDataItem, ClientContact, JobApplicationFeedback, JobApplicationRequest, JobInterviewRounds, ResumeListDataItem, VendorContact } from "../work-ifence-data.model";
import { Address } from "../contact.model";




@Injectable({
    providedIn: 'root',
  })
  export class UserStoreService {
    state = signal<UserState>(
      { 
        account: new Account(), 
        roles: new Array<WifRole>(),
        activeRole: new WifRole(),
        bioProfile: new BioProfile(), 
        loginProfile: new LoginProfile(),
        addresses: new Array<Address>(),
        selectedAddress: new Address(),
        jobApplicationsCompleteDetails : new Array<JobApplicationRequest>,
        jobApplications: new Array<JobApplication>(),
        jobApplicationFlag : false,
        selectedJobApplication: new JobApplication(),
        filteredJobApplications : new Array<JobApplication>,
        selectedRoundDetails : new RoundDetails(),
        jobDescriptionAIResponse : new JobDescriptionAIResponse(),
        token: '', 
        menuList: new Array<MenuListItem>,
        sidebarIconOnly: false,
        currentTab : '',
        selectedResume: new UserResume(),
        selectedResumeListItem: new ResumeListDataItem(),
        resumeListItems : new Array<ResumeListDataItem>,
        filteredResumes : new Array<ResumeListDataItem>,
        isChangeInNewResume : false,
        isUserLoggedIn : false
       });

       resetStore() {
        this.state.update((state) => ({
          ...state,
          account: new Account(), 
          roles: new Array<WifRole>(),
          activeRole: new WifRole(),
          bioProfile: new BioProfile(), 
          loginProfile: new LoginProfile(),
          addresses: new Array<Address>(),
          selectedAddress: new Address(),
          token: '', 
          selectedResume: new UserResume(),
          selectedResumeListItem: new ResumeListDataItem()
        }));
      }


    updateAccount(account: Account) {
        this.state.update((state) => ({
          ...state,
          account: account
        }));
      }

      updateRoles(roles: Array<WifRole>) {
        this.state.update((state) => ({
          ...state,
          roles: roles
        }));
      }

      updateActiveRole(role: WifRole) {
        this.state.update((state) => ({
          ...state,
          activeRole: role
        }));
      }

      updateBioProfile(bioProfile: BioProfile) {
        this.state.update((state) => ({
          ...state,
          bioProfile: bioProfile
        }));
      }

      updateLoginProfile(loginProfile: LoginProfile) {
        this.state.update((state) => ({
          ...state,
          loginProfile: loginProfile
        }));
      }

      // updateJobApplications(applications: Array<JobApplication>) {
      //   this.state.update((state) => ({
      //     ...state,
      //     jobApplications: [...applications],
      //     filteredJobApplications: [...applications]
      //   }));
      // }

      filterJobApplications(applications: Array<JobApplication>) {
        this.state.update((state) => ({
          ...state,
          jobApplications: [...applications]
        }));
      }

      updateAddresses(addresses: Array<Address>) {
        this.state.update((state) => ({
          ...state,
          addresses: [...addresses]
        }));
      }

      addAddress(address : Address){
        this.state.update((state)=>({
            ...state,
            addresses : [...state.addresses, address]
          }));
    }

      updateToken(token: string) {
        this.state.update((state) => ({
          ...state,
          token: token
        }));
      }

      updateMenuList(menuList: Array<MenuListItem>) {
        this.state.update((state) => ({
          ...state,
          menuList: menuList
        }));
      }

      updateSidebar(sidebarIconOnly: boolean) {
        this.state.update((state) => ({
          ...state,
          sidebarIconOnly: sidebarIconOnly
        }));
      }

      addContact(contact : ResumeContact){
        this.state.update((state)=>({
            ...state,
            currentTab : 'CONTACT',
            isEdit : false,
            isChangeInNewResume : true,
            selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm,contact : contact } }
            }))
        }

    addSummary(summary : ProfileSummary){
        this.state.update((state)=>({
            ...state,
            currentTab : 'SUMMARY',
            isEdit : false,
            isChangeInNewResume : true,
            selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm , profileSummary : summary} }
            }))
    }
    setUserLoginStatus(status : boolean){
      this.state.update((state)=>({
          ...state,
          isUserLoggedIn : status
          }))
    }

    updateEducationItem(edu : Education, index : number){
        this.state.update((state)=>({
            ...state,
            currentTab : 'EDUCATION',
            isEdit : false,
            isChangeInNewResume : true,
            selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm , education : [...state.selectedResume.resumeForm.education.slice(0,index), edu, ...state.selectedResume.resumeForm.education.slice(index + 1,)]} }
            }))
    }

    addEducationItem(edu : Education){
      this.state.update((state)=>({
          ...state,
          currentTab : 'EDUCATION',
          isEdit : false,
          isChangeInNewResume : true,
          selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm , education : [...state.selectedResume.resumeForm.education, edu]} }
          }))
  }

  updateAccomplishmentItem(accom : Accomplishment, index : number){
    this.state.update((state)=>({
        ...state,
        currentTab : 'ACCOMPLISHMENT',
        isEdit : false,
        isChangeInNewResume : true,
        selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm , accomplishment : [...state.selectedResume.resumeForm.accomplishment.slice(0,index), accom, ...state.selectedResume.resumeForm.accomplishment.slice(index + 1,)]} }
        }))
}


  addAccomplishmentItem(accom : Accomplishment){
    this.state.update((state)=>({
        ...state,
        currentTab : 'ACCOMPLISHMENT',
        isEdit : false,
        isChangeInNewResume : true,
        selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm , accomplishment : [...state.selectedResume.resumeForm.accomplishment, accom]} }
        }))
}

    setEducationList(eduList : Education[]){
      this.state.update((state)=>({
        ...state,
        currentTab : 'EDUCATION',
        isEdit : false,
        isChangeInNewResume : true,
        selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm , education : [...eduList]} }
        }))
    }

    addCourseWork(work : Array<string>){
        this.state.update((state)=>({
            ...state,
            currentTab : 'COURSEWORK',
            isEdit : false,
            isChangeInNewResume : true,
            selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm , courseWork : [...work]} }
            }))
    }

    addSkill(skills : Array<Skill>){
        this.state.update((state)=>({
            ...state,
            currentTab : 'SKILLS',
            isEdit : false,
            isChangeInNewResume : true,
            selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm , skills : [...skills]} }
            }))
    }

    addSkillV2(skill : Array<SkillV2>){
      this.state.update((state)=>({
          ...state,
          currentTab : 'SKILLS',
          isEdit : false,
          isChangeInNewResume : true,
          selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm , skill_v2 : [...skill]} }
          }))
    }

    updateProjectItem(edu : Project, index : any){
        this.state.update((state)=>({
            ...state,
            currentTab : 'PROJECT',
            isEdit : false,
            isChangeInNewResume : true,
            selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm , project : [...state.selectedResume.resumeForm.project.slice(0,index), edu, ...state.selectedResume.resumeForm.project.slice(index + 1,)]} }
            }))
    }

    addProjectItem(project : Project){
      this.state.update((state)=>({
        ...state,
        currentTab : 'PROJECT',
        isEdit : false,
        isChangeInNewResume : true,
        selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm , project : [...state.selectedResume.resumeForm.project, project]} }
        }))
    }

    updateExperienceItem(edu : Experience, index : number){
        this.state.update((state)=>({
            ...state,
            currentTab : 'EXPERIENCE',
            isEdit : false,
            isChangeInNewResume : true,
            selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm , experience : [...state.selectedResume.resumeForm.experience.slice(0,index), edu, ...state.selectedResume.resumeForm.experience.slice(index + 1,)]} }
            }))
    }

    addExperienceItem(edu : Experience){
      this.state.update((state)=>({
          ...state,
          currentTab : 'EXPERIENCE',
          isEdit : false,
          isChangeInNewResume : true,
          selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm , experience : [...state.selectedResume.resumeForm.experience, edu]} }
          }))
  }

    addAchievement(ach : Achievement){
        this.state.update((state)=>({
            ...state,
            currentTab : 'ACHIEVEMENT',
            isEdit : false,
            isChangeInNewResume : true,
            selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm , achievement : ach} }
            }))
    }

    addOther(ach : Other){
      this.state.update((state)=>({
          ...state,
          currentTab : 'OTHER',
          isEdit : false,
          isChangeInNewResume : true,
          selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm , other : ach} }
          }))
  }

    updateCertificationItem(edu : Certification, index : number){
      this.state.update((state)=>({
          ...state,
          currentTab : 'CERTIFICATION',
          isEdit : false,
          isChangeInNewResume : true,
          selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm , certification : [...state.selectedResume.resumeForm.certification.slice(0,index), edu, ...state.selectedResume.resumeForm.certification.slice(index + 1,)]} }
        }))
      }

      addCertificationItem(edu : Certification){
        this.state.update((state)=>({
            ...state,
            currentTab : 'CERTIFICATION',
            isEdit : false,
            isChangeInNewResume : true,
            selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm , certification : [...state.selectedResume.resumeForm.certification, edu]} }
          }))
    }


      updateContact(){
        this.state.update((state)=>({
          ...state,
          currentTab : 'CONTACT',
          isEdit : true,
          isChangeInNewResume : true
        }))
      }

      updateSummary(){
        this.state.update((state)=>({
          ...state,
          currentTab : 'SUMMARY',
          isEdit : true,
          isChangeInNewResume : true
        }))
      }

      updateEducation(edu : Education){
        this.state.update((state)=>({
          ...state,
          currentTab : 'EDUCATION',
          selectedResume : {...state.selectedResume,  selectedEducation: edu},
          isEdit : true,
          isChangeInNewResume : true
        }))
      }

      updateSkills(){
        this.state.update((state)=>({
          ...state,
          currentTab : 'SKILLS',
          isEdit : true,
          isChangeInNewResume : true
        }))
      }

      updateProject(project : Project){
        this.state.update((state)=>({
          ...state,
          currentTab : 'PROJECT',
          selectedResume : {...state.selectedResume,  selectedProject: project},
          isEdit : true,
          isChangeInNewResume : true
        }))
      }

      updateExperience(exp : Experience){
        this.state.update((state)=>({
          ...state,
          currentTab : 'EXPERIENCE',
          selectedResume : {...state.selectedResume,  selectedExperience: exp},
          isEdit : true,
          isChangeInNewResume : true
        }))
      }

      updateCertification(exp : Certification){
        this.state.update((state)=>({
          ...state,
          currentTab : 'CERTIFICATION',
          selectedResume : {...state.selectedResume,  selectedCertification: exp},
          isEdit : true,
          isChangeInNewResume : true
        }))
      }


      updateResumeForm(resume: Resume) {
        this.state.update((state) => ({
          ...state,
          selectedResume : {...state.selectedResume,  resumeForm: resume},
          isChangeInNewResume : true
        }));
      }

      setResumeForm(resume: Resume) {
        this.state.update((state) => ({
          ...state,
          selectedResume : {...state.selectedResume,  resumeForm: resume},
        }));
      }

      // updateResumeIsPrimary(isPrimary: boolean) {
      //   this.state.update((state) => ({
      //     ...state,
      //     selectedResume : {...state.selectedResume,  currentResumeIsPrimary: isPrimary}
      //   }));
      // }

      // updateResumeIsActive(isActivePublic: boolean) {
      //   this.state.update((state) => ({
      //     ...state,
      //     selectedResume : {...state.selectedResume,  currentResumeIsActive: isActivePublic}
      //   }));
      // }
      
      updateResumeTemplate(template: ResumeTemplate) {
        this.state.update((state) => ({
          ...state,
          selectedResume : {...state.selectedResume,  resumeForm : {...state.selectedResume.resumeForm , template_details : template}}
        }));
      }

      updateSelectedResume(resume: UserResume) {
        this.state.update((state) => ({
          ...state,
          selectedResume: resume
        }));
      }

      updateSelectedResumeListItem(resume: ResumeListDataItem) {
        this.state.update((state) => ({
          ...state,
          selectedResumeListItem: resume
        }));
      }


      deleteContact(){
        this.state.update((state)=>({
          ...state,
          currentTab : '',
          selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm, Contact : new ResumeContact()} },
          isEdit : false,
          isChangeInNewResume : true
        }))
      }

      deleteSummary(){
        this.state.update((state)=>({
            ...state,
            currentTab : '',
            selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm, profileSummary : new ProfileSummary()} },
            isEdit : false,
            isChangeInNewResume : true
          }))
      }

      deleteEducation(edu : Education){
        this.state.update((state)=>({
            ...state,
            currentTab : '',
            selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm, education : [...state.selectedResume.resumeForm.education.filter(e=>e.id != edu.id)]} },
            isEdit : false,
            isChangeInNewResume : true
          }))
      }

      deleteCourseWork(){
        this.state.update((state)=>({
            ...state,
            currentTab : '',
            selectedResume : {...state.selectedResume , resumeForm :{...state.selectedResume.resumeForm, courseWork : []} },
            isEdit : false,
            isChangeInNewResume : true
          }))
      }

      deleteSkill(){
        this.state.update((state)=>({
            ...state,
            currentTab : '',
            selectedResume : {...state.selectedResume , resumeForm :{...state.selectedResume.resumeForm, skill : []} },
            isEdit : false,
            isChangeInNewResume : true
          }))
      }

      deleteProject(pro : Project){
        this.state.update((state)=>({
            ...state,
            currentTab : '',
            selectedResume : {...state.selectedResume , resumeForm :{...state.selectedResume.resumeForm, project : [...state.selectedResume.resumeForm.project.filter(e=> e.id != pro.id)]} },
            isEdit : false,
            isChangeInNewResume : true
          }))
      }

      deleteExperience(exp : Experience){
        this.state.update((state)=>({
            ...state,
            currentTab : '',
            selectedResume : {...state.selectedResume , resumeForm :{...state.selectedResume.resumeForm, experience : [...state.selectedResume.resumeForm.experience.filter(e=>e.id != exp.id)]} },
            isEdit : false,
            isChangeInNewResume : true
          }))
      }

      deleteCertification(exp : Certification){
        this.state.update((state)=>({
            ...state,
            currentTab : '',
            selectedResume : {...state.selectedResume , resumeForm :{...state.selectedResume.resumeForm, certification : [...state.selectedResume.resumeForm.certification.filter(e=>e.id != exp.id)]}},
            isEdit : false,
            isChangeInNewResume : true
          }))
      }

      deleteAchievement(){
        this.state.update((state)=>({
            ...state,
            currentTab : '',
            selectedResume : {...state.selectedResume , resumeForm :{...state.selectedResume.resumeForm, achievement : {ach : '', original_html_achievement : '', isDefault : true}} },
            isEdit : false,
            isChangeInNewResume : true
          }))
      }

      deleteEducationList(){
        this.state.update((state)=>({
          ...state,
          currentTab : '',
          selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm, education : []} },
          isEdit : false,
          isChangeInNewResume : true
        }))
      }

      deleteExperienceList(){
        this.state.update((state)=>({
          ...state,
          currentTab : '',
          selectedResume : {...state.selectedResume , resumeForm :{...state.selectedResume.resumeForm, experience : []} },
          isEdit : false,
          isChangeInNewResume : true
        }))
      }

      deleteProjectList(){
        this.state.update((state)=>({
          ...state,
          currentTab : '',
          selectedResume : {...state.selectedResume , resumeForm :{...state.selectedResume.resumeForm, project : []} },
          isEdit : false,
          isChangeInNewResume : true
        }))
      }

      deleteCertificationList(){
        this.state.update((state)=>({
          ...state,
          currentTab : '',
          selectedResume : {...state.selectedResume , resumeForm :{...state.selectedResume.resumeForm, certification : []}},
          isEdit : false,
          isChangeInNewResume : true
        }))
      }

      setCertification(cer : Certification){
        this.state.update((state)=>({
          ...state,
          currentTab : 'CERTIFICATION',
          selectedResume : {...state.selectedResume , selectedCertification :cer },
          isEdit : false
        }))
      }

      setEducation(cer : Education){
        this.state.update((state)=>({
          ...state,
          currentTab : 'EDUCATION',
          selectedResume : {...state.selectedResume , selectedEducation :cer },
          isEdit : false
        }))
      }

      setExperience(cer : Experience){
        this.state.update((state)=>({
          ...state,
          currentTab : 'EXPERIENCE',
          selectedResume : {...state.selectedResume , selectedExperience :cer },
          isEdit : false
        }))
      }

      setProject(cer : Project){
        this.state.update((state)=>({
          ...state,
          currentTab : 'PROJECT',
          selectedResume : {...state.selectedResume , selectedProject :cer },
          isEdit : false
        }))
      }

      setSelectedAddress(address : Address){
        this.state.update((state)=>({
          ...state,
          selectedAddress : address,
          isEdit : false
        }))
      }

      setIsChangeInNewResume(flag : boolean){
        this.state.update((state)=>({
          ...state,
          isChangeInNewResume : flag
        }))
      }

      updateEducationList(edu : any[]){
        this.state.update((state)=>({
          ...state,
          selectedResume : {...state.selectedResume, resumeForm : { ...state.selectedResume.resumeForm , education : [...edu]}},
          isEdit : false,
          isChangeInNewResume : true
        }))
      }

      updateProjectList(edu : any[]){
        this.state.update((state)=>({
          ...state,
          selectedResume : {...state.selectedResume, resumeForm : { ...state.selectedResume.resumeForm , project : [...edu]}},
          isEdit : false,
          isChangeInNewResume : true
        }))
      }

      updateExperienceList(edu : any[]){
        this.state.update((state)=>({
          ...state,
          selectedResume : {...state.selectedResume, resumeForm : { ...state.selectedResume.resumeForm , experience : [...edu]}},
          isEdit : false,
          isChangeInNewResume : true
        }))
      }

      updateCertificationList(edu : any[]){
        this.state.update((state)=>({
          ...state,
          selectedResume : {...state.selectedResume, resumeForm : { ...state.selectedResume.resumeForm , certification : [...edu]}},
          isEdit : false,
          isChangeInNewResume : true
        }))
      }

      updateAccomplishmentList(edu : any[]){
        this.state.update((state)=>({
          ...state,
          selectedResume : {...state.selectedResume, resumeForm : { ...state.selectedResume.resumeForm , accomplishment : [...edu]}},
          isEdit : false,
          isChangeInNewResume : true
        }))
      }


      addRoundDetails(rounds : RoundDetails){
        this.state.update((state)=>({
          ...state,
          selectedJobApplication : {...state.selectedJobApplication, round_details : [ ...state.selectedJobApplication.round_details , rounds]},
        }))
      }

      editRoundDetailsById(rounds : RoundDetails, index : number){
        this.state.update((state)=>({
          ...state,
          selectedJobApplication : {...state.selectedJobApplication, round_details : [...state.selectedJobApplication.round_details.slice(0,index), rounds, ...state.selectedJobApplication.round_details.slice(index + 1,)]},
        }))
      }

      deleteRoundDetailsById(index : number){
        this.state.update((state)=>({
          ...state,
          selectedJobApplication : {...state.selectedJobApplication, round_details : [...state.selectedJobApplication.round_details.slice(0,index), ...state.selectedJobApplication.round_details.slice(index + 1,)]},
        }))
      }

      editRoundDetailsByUnqId(rounds : RoundDetails, index : number){
        this.state.update((state)=>({
          ...state,
          selectedJobApplication : {...state.selectedJobApplication, round_details : [...state.selectedJobApplication.round_details.slice(0,index), rounds, ...state.selectedJobApplication.round_details.slice(index + 1,)]},
        }))
      }


      addFeedbackDetails(feedback : JobApplicationFeedback){
        this.state.update((state)=>({
          ...state,
          selectedJobApplication : {...state.selectedJobApplication, feedback : feedback},
        }))
      }

      addClientDetails(contact : ClientDetails){
        this.state.update((state)=>({
          ...state,
          selectedJobApplication : {...state.selectedJobApplication, client_details : contact},
        }))
      }

      addVendorDetails(contact : VendorDetails){
        this.state.update((state)=>({
          ...state,
          selectedJobApplication : {...state.selectedJobApplication, vendor_details : contact},
        }))
      }

      setJobApplication(application: JobApplication) {
        this.state.update((state) => ({
          ...state,
          selectedJobApplication: application
        }));
      }

      addJobApplicationList(list : Array<JobApplication>){
        this.state.update((state) => ({
          ...state,
          jobApplications: [...list],
          filteredJobApplications: [...list]
        }));
      }

      setRoundDetails(round : RoundDetails){
        this.state.update((state) => ({
          ...state,
          selectedRoundDetails : round
        }));
      }



      addJobDescriptionAIResponse(res : JobDescriptionAIResponse){
        this.state.update((state)=>({
          ...state,
          jobDescriptionAIResponse : res,
        }))
      }

      setAllJobApplicationsCompleteDetails(applications : JobApplicationRequest[]){
        this.state.update((state) => ({
          ...state,
          jobApplicationsCompleteDetails : applications
        }));
      }

      setLoginProfile(profile : LoginProfile){
        this.state.update((state) => ({
          ...state,
          loginProfile : profile
        }));
      }

      setEmailInLoginProfile(emailId: string) {
        this.state.update((state) => ({
          ...state,
          loginProfile: {
            ...state.loginProfile,
            emailId: emailId,
          },
        }));
      }

      setPhoneInLoginProfile(phoneNumber: string) {
        this.state.update((state) => ({
          ...state,
          loginProfile: {
            ...state.loginProfile,
            phoneNumber: phoneNumber,
          },
        }));
      }

      setBioProfile(profile : BioProfile){
        this.state.update((state) => ({
          ...state,
          bioProfile : profile
        }));
      }

      addAddressForm(address : Address){
        this.state.update((state)=>({
          ...state,
          addresses : [...state.addresses,  address],
        }))
      }

      editAddress(address : Address, index : number){
        this.state.update((state)=>({
          ...state,
          addresses : [...state.addresses.slice(0,index), address, ...state.addresses.slice(index + 1,)],
        }))
      }

      removeAddress(index : number){
        this.state.update((state)=>({
          ...state,
          addresses : [...state.addresses.slice(0,index), ...state.addresses.slice(index + 1,)],
        }))
      }

      setResumeDataListItems(items : ResumeListDataItem[]){
        this.state.update((state)=>({
          ...state,
          resumeListItems : [...items],
        }))
      }

      addResumeDataListItem(item : ResumeListDataItem){
        this.state.update((state)=>({
          ...state,
          resumeListItems : [...state.resumeListItems, item],
        }))
      }

      updateResumeDataListItem(item : ResumeListDataItem, index : number){
        this.state.update((state)=>({
          ...state,
          resumeListItems : [...state.resumeListItems.slice(0,index), item, ...state.resumeListItems.slice(index + 1,)],
        }))
      }

      removeResumeDataListItem(index : number){
        this.state.update((state)=>({
          ...state,
          resumeListItems : [...state.resumeListItems.slice(0,index), ...state.resumeListItems.slice(index + 1,)],
        }))
      }

      setJobApplicationFlag(flag : boolean){
        this.state.update((state)=>({
          ...state,
          jobApplicationFlag : flag
        }))
      }

      setFilteredResumes(resumes : ResumeListDataItem[]){
        this.state.update((state)=>({
          ...state,
          filteredResumes : [...resumes]
        }))
      }

      updateSectionStatus(status : IsSectionPresent){
        this.state.update((state)=>({
          ...state,
          selectedResume : { ...state.selectedResume, resumeForm : {...state.selectedResume.resumeForm, isSectionPresent : {...status}}}
        }))
      }

      removeJobApplication(index : number){
        this.state.update((state)=>({
          ...state,
          jobApplications : [...state.jobApplications.slice(0,index), ...state.jobApplications.slice(index + 1,)],
          filteredJobApplications : [...state.jobApplications]
        }))
      }

      setSelectedAccomplishment(accom : Accomplishment){
        this.state.update((state)=>({
          ...state,
          selectedResume : {...state.selectedResume, selectedAccomplishment : accom}
        }))
      }



      getSidebarIconOnly(): Signal<boolean> {
        return computed(() => this.state().sidebarIconOnly);
      } 

      getUserAccount(): Signal<Account> {
        return computed(() => this.state().account);
      } 

      getUserBioProfile(): Signal<BioProfile> {
        return computed(() => this.state().bioProfile);
      } 

      getUserLoginProfile(): Signal<LoginProfile> {
        return computed(() => this.state().loginProfile);
      } 

      getUserAddresses(): Signal<Array<Address>> {
        return computed(() => this.state().addresses);
      } 

      getSelectedAddresses(): Signal<Address> {
        return computed(() => this.state().selectedAddress);
      } 

      getMenuList(): Signal<Array<MenuListItem>> {
        return computed(() => this.state().menuList);
      } 

      getCurrentTab(): Signal<string> {
        return computed(() => this.state().currentTab);
      }
      
      getResumeForm(): Signal<Resume> {
        return computed(() => this.state().selectedResume.resumeForm);
      }

      getSelectedEducation() : Signal<Education> {
        return computed(()=> this.state().selectedResume.selectedEducation);
      }

      getSelectedExperience() : Signal<Experience> {
        return computed(()=> this.state().selectedResume.selectedExperience);
      }

      getSelectedProject() : Signal<Project> {
        return computed(()=> this.state().selectedResume.selectedProject);
      }

      getSelectedAccomplishment() : Signal<Accomplishment> {
        return computed(()=> this.state().selectedResume.selectedAccomplishment);
      }

      // getCurrentResumeTitle() : Signal<string> {
      //   return computed(()=> this.state().selectedResume.currentResumeTitle);
      // }

      // getCurrentResumePublic() : Signal<boolean> {
      //   return computed(()=> this.state().selectedResume.currentResumeIsPublic);
      // }

      // getCurrentResumePrimary() : Signal<boolean> {
      //   return computed(()=> this.state().selectedResume.currentResumeIsPrimary);
      // }

      // getCurrentResumeIsActive() : Signal<boolean> {
      //   return computed(()=> this.state().selectedResume.currentResumeIsActive);
      // }

      // getCurrentResumeCategory() : Signal<string> {
      //   return computed(()=> this.state().selectedResume.currentResumeCategory);
      // }

      // getSelectedResumeTemplate() : Signal<ResumeTemplateDto> {
      //   return computed(()=> this.state().selectedResume.selectedTemplate);
      // }

      getSelectedIsEdit() : Signal<boolean> {
        return computed(()=> this.state().selectedResume.isEdit);
      }

      getSelectedCertificate() : Signal<Certification> {
        return computed(()=> this.state().selectedResume.selectedCertification);
      }

      getSelectedResume() : Signal<UserResume> {
        return computed(()=> this.state().selectedResume);
      }

      getSelectedResumeListItem() : Signal<ResumeListDataItem> {
        return computed(()=> this.state().selectedResumeListItem);
      }

      getJobDescAIRes() : Signal<JobDescriptionAIResponse> {
        return computed(()=> this.state().jobDescriptionAIResponse);
      }

      getIsChangeInNewResume() : Signal<boolean> {
        return computed(()=> this.state().isChangeInNewResume);
      }

      getJobApplicationsList() : Signal<Array<JobApplication>> {
        return computed(()=> this.state().jobApplications);
      }

      getFilteredJobApplicationsList() : Signal<Array<JobApplication>> {
        return computed(()=> this.state().filteredJobApplications);
      }

      getSelectedJobApplication() : Signal<JobApplication> {
        return computed(()=> this.state().selectedJobApplication);
      }

      getSelectedRoundDetails() : Signal<RoundDetails> {
        return computed(()=> this.state().selectedRoundDetails);
      }

      getALlJobApplicationsCompleteDetails() : Signal<JobApplicationRequest[]> {
        return computed(()=> this.state().jobApplicationsCompleteDetails);
      }

      getResumeDataItemList() : Signal<ResumeListDataItem[]> {
        return computed(()=> this.state().resumeListItems);
      }

      getJobApplicationFlag() : Signal<boolean> {
        return computed(()=> this.state().jobApplicationFlag);
      }

      getFilteredResumes() : Signal<ResumeListDataItem[]> {
        return computed(()=> this.state().filteredResumes);
      }

      getSectionStatus(): Signal<IsSectionPresent> {
        return computed(()=> this.state().selectedResume.resumeForm.isSectionPresent);
      }
      
      getUserLoginStatus(): Signal<boolean> {
        return computed(()=> this.state().isUserLoggedIn);
      }

      getUserRoles(): Signal<Array<WifRole>> {
        return computed(()=> this.state().roles);
      }

      getUserActiveRole(): Signal<WifRole> {
        return computed(()=> this.state().activeRole);
      }

      // getCurrentRoleCategory() : Signal<string> {
      //   return computed(()=> this.state().selectedResume.currentRoleCategory);
      // }

      // getCurrentAccessLevel() : Signal<string> {
      //   return computed(()=> this.state().selectedResume.currentAccessLevel);
      // }

  }
