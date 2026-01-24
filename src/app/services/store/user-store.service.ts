    // ...existing code...

import { Injectable, Signal, computed, signal, inject, Injector } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { Observable } from "rxjs";
import { ResumeTemplateDto, SectionDesc, SectionItem, UserResume, UserState } from "./user-store";
import { Account, BioProfile, LoginProfile, WifRole } from "../profile.model";
import { MenuListItem, ResumeTemplate } from "../bee-compete.model";
import { Education, Experience, Project, Resume, Certification, ResumeContact, ProfileSummary, JobDescriptionAIResponse, JobApplication, RoundDetails, VendorDetails, ClientDetails, AchievementBulletPoints, IsSectionPresent, SkillV2, Accomplishment, Skill, CertificationBulletPoints, courseWork } from "../resume.model";
import { ApplicationListDataItem, ClientContact, JobApplicationFeedback, JobApplicationRequest, JobInterviewRounds, ResumeListDataItem, VendorContact } from "../work-ifence-data.model";
import { Address } from "../contact.model";

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  private injector = inject(Injector);

      // --- Job Profile State ---
      private jobProfile = signal<any | null>(null); // TODO: replace `any` with JobProfile model when available

      getJobProfileSignal(): Signal<any | null> {
        return this.jobProfile;
      }

      setJobProfile(profile: any) {
        this.jobProfile.set(profile);
      }

      updateJobProfileSection(section: string, data: any) {
        const current = this.jobProfile();
        if (!current) {
          return;
        }
        this.jobProfile.set({ ...current, [section]: data });
      }

      state = signal<UserState>({
        account: new Account(),
        roles: new Array<WifRole>(),
        activeRole: new WifRole(),
        bioProfile: new BioProfile(), 
        loginProfile: new LoginProfile(),
        addresses: new Array<Address>(),
        selectedAddress: new Address(),
        jobApplicationsCompleteDetails : new Array<JobApplicationRequest>(),
        jobApplications: new Array<JobApplication>(),
        jobApplicationFlag : false,
        selectedJobApplication: new JobApplication(),
        filteredJobApplications : new Array<JobApplication>(),
        selectedRoundDetails : new RoundDetails(),
        jobDescriptionAIResponse : new JobDescriptionAIResponse(),
        token: '', 
        menuList: new Array<MenuListItem>(),
        sidebarIconOnly: false,
        currentTab : '',
  selectedResume: new UserResume(),
  selectedSkillsCategory: null,
        selectedResumeListItem: new ResumeListDataItem(),
        resumeListItems : new Array<ResumeListDataItem>(),
        filteredResumes : new Array<ResumeListDataItem>(),
        currentResumeSections : new Array<SectionDesc>(),
        isChangeInNewResume : false,
        isUserLoggedIn : false,
        isMultipleColumnTemplateSelected : false,
        multipleSectionsList : new Array<Array<SectionDesc>>()
        ,selectedContact: undefined,
        selectedSummary: undefined
      });
      setSelectedContact(contact: any) {
        this.state.update((state) => ({
          ...state,
          selectedContact: contact
        }));
      }

      setSelectedSummary(summary: any) {
        this.state.update((state) => ({
          ...state,
          selectedSummary: summary
        }));
      }

    // Ensures profile summary is initialized with a default if missing
    public ensureProfileSummaryInitialized() {
      const resumeForm = this.state().selectedResume?.resumeForm;
      if (!resumeForm) return;
      const profileSummarySection = resumeForm.sections?.find(s => s.section === 'PROFILE_SUMMARY');
      const profileSummaryItem = profileSummarySection?.items?.[0]?.data;
      if (!profileSummaryItem || !profileSummaryItem.original_summary_html) {
        const summary = new ProfileSummary();
        summary.original_summary_html = `
          <ul style="margin-left: 1.2em;">
            <li>7+ years of experience in designing and developing scalable web applications</li>
            <li>Expert in Angular, TypeScript, and RxJS for building dynamic SPAs</li>
            <li>Proficient in Node.js, Express, and RESTful API development</li>
            <li>Strong experience with MongoDB, PostgreSQL, and MySQL databases</li>
            <li>Skilled in implementing authentication and authorization (JWT, OAuth)</li>
            <li>Hands-on with CI/CD pipelines and Docker containerization</li>
            <li>Adept at writing unit and integration tests using Jasmine, Karma, Jest</li>
            <li>Familiar with cloud platforms: AWS, Azure, and Firebase</li>
            <li>Excellent problem-solving and debugging skills</li>
            <li>Strong communicator and effective collaborator in agile teams</li>
          </ul>
        `;
        summary.profile_summary = '7+ years of experience in designing and developing scalable web applications...';
        // Update both resumeForm.profileSummary and sections data
        this.setSummary(summary);
      }
  }

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
          selectedSkillsCategory: null,
          selectedResumeListItem: new ResumeListDataItem()
        }));
      }



    setResumeSections(sections : Array<SectionDesc>){
      console.log("Set Sections", sections);
      this.state.update((state) => ({
        ...state,
        selectedResume: {
          ...state.selectedResume,
          resumeForm: {
            ...state.selectedResume.resumeForm,
            sections: sections
          }
        }
      }));
    }

    setSelectedSkillsCategory(category: any) {
      this.state.update((state) => ({
        ...state,
        selectedSkillsCategory: category
      }));
    }

    getSelectedSkillsCategory() {
      return this.state().selectedSkillsCategory;
    }

    setMultipleColumnTemplateSections(list : Array<Array<SectionDesc>>){
    
      this.state.update((state)=>({
        ...state,
        multipleSectionsList : list,
        currentResumeSections : list.flat(2),
        isMultipleColumnTemplateSelected : true
      }))
    }

    
    emptyMultipleColumnTemplateSections(){
    
      this.state.update((state)=>({
        ...state,
        multipleSectionsList : [],
        isMultipleColumnTemplateSelected : false
      }))
    }

    setFlagOnTemplateSelected(template : string){
      this.state.update((state)=>({
        ...state,
       isMultipleColumnTemplateSelected : template == 'TEMPLATE_9'
      }))
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

      updateActiveRole(role: WifRole | undefined | null) {
        this.state.update((state) => ({
          ...state,
          activeRole: role ?? new WifRole()
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

        setContact(contact : ResumeContact){
        this.state.update((state)=>({
            ...state,
            currentTab : 'CONTACT',
            isEdit : false,
            selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm,contact : contact } }
            }))
        }

        addCertificationBulletPoints(certification : CertificationBulletPoints){
        this.state.update((state)=>({
            ...state,
            currentTab : 'CERTIFICATIONS_BULLET_POINTS',
            isEdit : false,
            isChangeInNewResume : true,
            selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm,certificationBulletPoints : certification } }
            }))
        }

    addSummary(summary : ProfileSummary){
        this.state.update((state)=>({
            ...state,
            currentTab : 'SUMMARY',
            isEdit : false,
            isChangeInNewResume : true,
            selectedResume : {...state.selectedResume , resumeForm : {
              ...state.selectedResume.resumeForm,
              profileSummary : summary,
              sections: state.selectedResume.resumeForm.sections.map(section =>
                section.section === 'PROFILE_SUMMARY' ? { ...section, data: summary } : section
              )
            }}
            }))
    }

    setSummary(summary : ProfileSummary){
        this.state.update((state)=>({
            ...state,
            currentTab : 'SUMMARY',
            isEdit : false,
            selectedResume : {...state.selectedResume , resumeForm : {
              ...state.selectedResume.resumeForm,
              profileSummary : summary,
              sections: state.selectedResume.resumeForm.sections.map(section =>
                section.section === 'PROFILE_SUMMARY' ? { ...section, data: summary } : section
              )
            }}
            }))
    }
    setUserLoginStatus(status : boolean){
      this.state.update((state)=>({
          ...state,
          isUserLoggedIn : status
          }))
    }

    updateEducationItem(edu : Education, index : number){
    this.state.update((state) => {
      const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
        if (section.section === 'EDUCATION') {
          const items = section.items ? [...section.items] : [];
          items[index] = { ...items[index], data: edu };
          return { ...section, items };
        }
        return section;
      });
      return {
        ...state,
        currentTab: 'EDUCATION',
        isEdit: false,
        isChangeInNewResume: true,
        selectedResume: {
          ...state.selectedResume,
          resumeForm: {
            ...state.selectedResume.resumeForm,
            sections: updatedSections
          }
        }
      };
    });
    }

    addEducationItem(edu : Education){
    this.state.update((state) => {
      const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
        if (section.section === 'EDUCATION') {
          return {
            ...section,
            items: [...(section.items ?? []), { id: edu.id, data: edu }]
          };
        }
        return section;
      });
      return {
        ...state,
        currentTab: 'EDUCATION',
        isEdit: false,
        isChangeInNewResume: true,
        selectedResume: {
          ...state.selectedResume,
          resumeForm: {
            ...state.selectedResume.resumeForm,
            sections: updatedSections
          }
        }
      };
    });
  }

  updateAccomplishmentItem(accom : Accomplishment, index : number){
  this.state.update((state) => {
    const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
      if (section.section === 'ACCOMPLISHMENT') {
        const items = section.items ? [...section.items] : [];
        items[index] = { ...items[index], data: accom };
        return { ...section, items };
      }
      return section;
    });
    return {
      ...state,
      currentTab: 'ACCOMPLISHMENT',
      isEdit: false,
      isChangeInNewResume: true,
      selectedResume: {
        ...state.selectedResume,
        resumeForm: {
          ...state.selectedResume.resumeForm,
          sections: updatedSections
        }
      }
    };
  });
}


  addAccomplishmentItem(accom : Accomplishment){
  this.state.update((state) => {
    const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
      if (section.section === 'ACCOMPLISHMENT') {
        return {
          ...section,
          items: [...(section.items ?? []), { id: accom.id, data: accom }]
        };
      }
      return section;
    });
    return {
      ...state,
      currentTab: 'ACCOMPLISHMENT',
      isEdit: false,
      isChangeInNewResume: true,
      selectedResume: {
        ...state.selectedResume,
        resumeForm: {
          ...state.selectedResume.resumeForm,
          sections: updatedSections
        }
      }
    };
  });
}

    setEducationList(eduList: Education[]) {
      this.state.update((state) => {
        const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
          if (section.section === 'EDUCATION') {
            return {
              ...section,
              items: eduList.map(e => ({ id: e.id, data: e }))
            };
          }
          return section;
        });
        return {
          ...state,
          currentTab: 'EDUCATION',
          isEdit: false,
          selectedResume: {
            ...state.selectedResume,
            resumeForm: {
              ...state.selectedResume.resumeForm,
              sections: updatedSections
            }
          }
        };
      });
    }

    addSkill(skills : Array<Skill>){
    this.state.update((state) => {
      const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
        if (section.section === 'SKILLS') {
          return {
            ...section,
            items: skills.map(s => ({ id: s.name, data: s }))
          };
        }
        return section;
      });
      return {
        ...state,
        currentTab: 'SKILLS',
        isEdit: false,
        isChangeInNewResume: true,
        selectedResume: {
          ...state.selectedResume,
          resumeForm: {
            ...state.selectedResume.resumeForm,
            sections: updatedSections
          }
        }
      };
    });
    }

    addSkillV2(skill : Array<SkillV2>){
    this.state.update((state) => {
      const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
        if (section.section === 'SKILLS_V2') {
          return {
            ...section,
            items: skill.map(s => ({ id: s.sub_title, data: s }))
          };
        }
        return section;
      });
      return {
        ...state,
        currentTab: 'SKILLS',
        isEdit: false,
        isChangeInNewResume: true,
        selectedResume: {
          ...state.selectedResume,
          resumeForm: {
            ...state.selectedResume.resumeForm,
            sections: updatedSections
          }
        }
      };
    });
    }

    setSkillV2(skill : Array<SkillV2>){
    this.state.update((state) => {
      const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
        if (section.section === 'SKILLS_V2') {
          return {
            ...section,
            items: skill.map(s => ({ id: s.sub_title, data: s }))
          };
        }
        return section;
      });
      return {
        ...state,
        currentTab: 'SKILLS',
        isEdit: false,
        selectedResume: {
          ...state.selectedResume,
          resumeForm: {
            ...state.selectedResume.resumeForm,
            sections: updatedSections
          }
        }
      };
    });
    }

    setSkillsBulletPoints(skills: string[]){
    this.state.update((state) => {
      const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
        if (section.section === 'SKILLS_BULLET_POINTS') {
          return {
            ...section,
            items: skills.map((s, index) => ({ id: `skill${index + 1}`, data: { skill: s }, actions: { edit: true, delete: true, moveUp: true, moveDown: true } }))
          };
        }
        return section;
      });
      return {
        ...state,
        currentTab: 'SKILLS_BULLET_POINTS',
        isEdit: false,
        selectedResume: {
          ...state.selectedResume,
          resumeForm: {
            ...state.selectedResume.resumeForm,
            sections: updatedSections
          }
        }
      };
    });
    }

    updateProjectItem(edu : Project, index : any){
    this.state.update((state) => {
      const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
        if (section.section === 'PROJECT') {
          const items = section.items ? [...section.items] : [];
          items[index] = { ...items[index], data: edu };
          return { ...section, items };
        }
        return section;
      });
      return {
        ...state,
        currentTab: 'PROJECT',
        isEdit: false,
        isChangeInNewResume: true,
        selectedResume: {
          ...state.selectedResume,
          resumeForm: {
            ...state.selectedResume.resumeForm,
            sections: updatedSections
          }
        }
      };
    });
    }

    addProjectItem(project : Project){
    this.state.update((state) => {
      const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
        if (section.section === 'PROJECT') {
          return {
            ...section,
            items: [...(section.items ?? []), { id: project.id, data: project }]
          };
        }
        return section;
      });
      return {
        ...state,
        currentTab: 'PROJECT',
        isEdit: false,
        isChangeInNewResume: true,
        selectedResume: {
          ...state.selectedResume,
          resumeForm: {
            ...state.selectedResume.resumeForm,
            sections: updatedSections
          }
        }
      };
    });
    }

    updateExperienceItem(edu: Experience, index: number) {
      this.state.update((state) => {
        const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
          if (section.section === 'WORK_EXPERIENCE') {
            const items = section.items ? [...section.items] : [];
            items[index] = { id: edu.id, data: edu };
            return { ...section, items };
          }
          return section;
        });
        return {
          ...state,
          currentTab: 'EXPERIENCE',
          isEdit: false,
          isChangeInNewResume: true,
          selectedResume: {
            ...state.selectedResume,
            resumeForm: {
              ...state.selectedResume.resumeForm,
              sections: updatedSections
            }
          }
        };
      });
    }

    addExperienceItem(edu: Experience) {
      this.state.update((state) => {
        const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
          if (section.section === 'WORK_EXPERIENCE') {
            return {
              ...section,
              items: [...(section.items ?? []), { id: edu.id, data: edu }]
            };
          }
          return section;
        });
        return {
          ...state,
          currentTab: 'EXPERIENCE',
          isEdit: false,
          isChangeInNewResume: true,
          selectedResume: {
            ...state.selectedResume,
            resumeForm: {
              ...state.selectedResume.resumeForm,
              sections: updatedSections
            }
          }
        };
      });
    }


    addAchievement(ach : AchievementBulletPoints){
        this.state.update((state)=>({
            ...state,
            currentTab : 'ACHIEVEMENT',
            isEdit : false,
            isChangeInNewResume : true,
            selectedResume : {...state.selectedResume , resumeForm : {...state.selectedResume.resumeForm , achievementBulletPoints : ach} }
            }))
    }

    updateAchievementItem(ach: AchievementBulletPoints, index: number) {
      this.state.update((state) => {
        const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
          if (section.section === 'ACHIEVEMENTS_BULLET_POINTS') {
            const items = section.items ? [...section.items] : [];
            const id = 'ach_' + Date.now();
            items[index] = { id, data: ach };
            return { ...section, items };
          }
          return section;
        });
        return {
          ...state,
          currentTab: 'ACHIEVEMENT',
          isEdit: false,
          isChangeInNewResume: true,
          selectedResume: {
            ...state.selectedResume,
            resumeForm: {
              ...state.selectedResume.resumeForm,
              sections: updatedSections
            }
          }
        };
      });
    }

    updateCertificationItem(edu: SectionItem, index: number) {
      this.state.update((state) => {
        const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
          if (section.section === 'CERTIFICATIONS') {
            const items = section.items ? [...section.items] : [];
            items[index] = { id: edu.id, data: edu.data };
            return { ...section, items };
          }
          return section;
        });
        return {
          ...state,
          currentTab: 'CERTIFICATION',
          isEdit: false,
          isChangeInNewResume: true,
          selectedResume: {
            ...state.selectedResume,
            resumeForm: {
              ...state.selectedResume.resumeForm,
              sections: updatedSections
            }
          }
        };
      });
    }

    /**
     * Delete an achievement from ACHIEVEMENTS_BULLET_POINTS section by id or index
     */
    deleteAchievementItem(achievement: any, index?: number) {
      this.state.update((state) => {
        const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
          if (section.section === 'ACHIEVEMENTS_BULLET_POINTS') {
            let items = section.items ? [...section.items] : [];
            if (achievement && achievement.id) {
              items = items.filter(item => item.id !== achievement.id && (!item.data || item.data.id !== achievement.id));
            } else if (typeof index === 'number') {
              items.splice(index, 1);
            }
            return { ...section, items };
          }
          return section;
        });
        return {
          ...state,
          currentTab: '',
          isEdit: false,
          isChangeInNewResume: true,
          selectedResume: {
            ...state.selectedResume,
            resumeForm: {
              ...state.selectedResume.resumeForm,
              sections: updatedSections
            }
          }
        };
      });
    }
    
  
    addCertificationItem(edu: SectionItem) {
      this.state.update((state) => {
        const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
          if (section.section === 'CERTIFICATIONS') {
            return {
              ...section,
              items: [...(section.items ?? []), { id: edu.id, data: edu.data }]
            };
          }
          return section;
        });
        return {
          ...state,
          currentTab: 'CERTIFICATION',
          isEdit: false,
          isChangeInNewResume: true,
          selectedResume: {
            ...state.selectedResume,
            resumeForm: {
              ...state.selectedResume.resumeForm,
              sections: updatedSections
            }
          }
        };
      });
    }


      updateContact(){
        this.state.update((state)=>({
          ...state,
          currentTab : 'CONTACT',
          isEdit : true
        }))
      }

      updateSummary(){
        this.state.update((state)=>({
          ...state,
          currentTab : 'SUMMARY',
          isEdit : true
        }))
      }

      updateSummaryWithData(summary: any){
        this.state.update((state)=>({
          ...state,
          currentTab : 'SUMMARY',
          selectedSummary: summary,
          isEdit : true
        }))
      }

      updateEducation(edu : Education){
        this.state.update((state)=>({
          ...state,
          currentTab : 'EDUCATION',
          selectedResume : {...state.selectedResume,  selectedEducation: edu},
          isEdit : true
        }))
      }

      updateSkills(){
        this.state.update((state)=>({
          ...state,
          currentTab : 'SKILLS',
          isEdit : true
        }))
      }

      updateProject(project : Project){
        this.state.update((state)=>({
          ...state,
          currentTab : 'PROJECT',
          selectedResume : {...state.selectedResume,  selectedProject: project},
          isEdit : true
        }))
      }

      updateExperience(exp : Experience){
        this.state.update((state)=>({
          ...state,
          currentTab : 'EXPERIENCE',
          selectedResume : {...state.selectedResume,  selectedExperience: exp},
          isEdit : true
        }))
      }

      updateExperienceAddMode(){
        this.state.update((state)=>({
          ...state,
          currentTab : 'EXPERIENCE',
          selectedResume : {...state.selectedResume,  selectedExperience: new Experience()},
          isEdit : false
        }))
      }

      updateCertification(exp : SectionItem){
        this.state.update((state)=>({
          ...state,
          currentTab : 'CERTIFICATION',
          selectedResume : {...state.selectedResume,  selectedCertification: exp},
          isEdit : true
        }))
      }


      updateResumeForm(resume: Resume) {
        this.state.update((state) => {
          // Only update the sections array and selectedContact in resumeForm, not replace the whole object
          const updatedResumeForm = {
            ...state.selectedResume.resumeForm,
            sections: resume.sections,
            selectedContact: resume.selectedContact
          };
          return {
            ...state,
            selectedResume: {
              ...state.selectedResume,
              resumeForm: updatedResumeForm
            },
            isChangeInNewResume: true
          };
        });
      }

removeSection(sectionName: string) {
  // Remove the section from the selected resume's sections array
  this.state.update((state) => {
    let updatedSections = state.selectedResume.resumeForm.sections.filter(section => section.section !== sectionName);
    return {
      ...state,
      selectedResume: {
        ...state.selectedResume,
        resumeForm: {
          ...state.selectedResume.resumeForm,
          sections: updatedSections
        }
      }
    };
  });

  // Set isAdded = false in the default sections list
  const defaultSections = require('./resume-sections').sections;
  const defaultSection = defaultSections.find((s: any) => s.section === sectionName);
  if (defaultSection) defaultSection.isAdded = false;

  // Clear section data
  this.clearSectionData(sectionName);

  console.log(`Removed section ${sectionName} from resume (removed from array, set isAdded = false in default list)`);
}

private clearSectionData(sectionName: string) {
  const resume = this.state().selectedResume.resumeForm;

  // Find the section in resume.sections and clear its items
  const sectionObj = resume.sections?.find((s: any) => s.section === sectionName);
  if (sectionObj) {
    if (["PROFILE_SUMMARY", "RELEVANT_COURSEWORK", "SKILLS_BULLET_POINTS", "SKILLS_CATEGORY", "EDUCATION", "PROJECT", "WORK_EXPERIENCE", "CERTIFICATIONS", "ACHIEVEMENTS_BULLET_POINTS", "CERTIFICATIONS_BULLET_POINTS", "ACHIEVEMENT_WITH_DESC"].includes(sectionName)) {
      sectionObj.items = [];
    }
  }

  // Update status flags
  const status = resume.isSectionPresent;
  if(sectionName === "PROFILE_SUMMARY") status.isSummary = false;
  else if(sectionName === "RELEVANT_COURSEWORK") status.isCourseWork = false;
  else if(sectionName === "SKILLS_BULLET_POINTS" || sectionName === "SKILLS_CATEGORY") status.isSkill = false;
  else if(sectionName === "EDUCATION") status.isEducation = false;
  else if(sectionName === "PROJECT") status.isProject = false;
  else if(sectionName === "WORK_EXPERIENCE") status.isExperience = false;
  else if(sectionName === "CERTIFICATIONS") status.isCertification = false;
  else if(sectionName === "ACHIEVEMENTS_BULLET_POINTS") status.isAchievement = false;
  else if(sectionName === "ACHIEVEMENT_WITH_DESC") status.isAccomplishments = false;

  this.setResumeForm(resume);
}


addSection(sectionName: string) {
  // Find the default section definition
  const defaultSections = require('./resume-sections').sections;
  const defaultSection = defaultSections.find((s: any) => s.section === sectionName);
  if (!defaultSection) {
    console.error(`Section ${sectionName} not found in default sections.`);
    return;
  }
  // Set isAdded to true in the default list
  defaultSection.isAdded = true;

  // Deep clone the section to add
  const newSection = JSON.parse(JSON.stringify(defaultSection));
  newSection.isAdded = true;

  // Get current sections and add the new section as last
  this.state.update((state) => {
    let sections = state.selectedResume.resumeForm.sections ? [...state.selectedResume.resumeForm.sections] : [];
    // Prevent duplicate add
    if (sections.some(s => s.section === sectionName && s.isAdded)) {
      return state;
    }

    // Update previous last section's headerActions
    if (sections.length > 0) {
      const prevLast = sections[sections.length - 1];
      if (!prevLast.headerActions) prevLast.headerActions = {};
      // If adding the second section (after CONTACT), only enable down arrow for it
      if (sections.length === 1 && prevLast.section === 'CONTACT') {
        prevLast.headerActions.moveUp = false;
        prevLast.headerActions.moveDown = true;
      } else {
        prevLast.headerActions.moveDown = true;
        prevLast.headerActions.moveUp = sections.length > 1;
      }
    }
    // Set headerActions for new section
    if (!newSection.headerActions) newSection.headerActions = {};
    // If this is the second section (first after CONTACT), only down arrow
    if (sections.length === 1 && sections[0].section === 'CONTACT') {
      newSection.headerActions.moveUp = false;
      newSection.headerActions.moveDown = false;
    } else {
      newSection.headerActions.moveUp = sections.length > 0;
      newSection.headerActions.moveDown = false;
    }

    // Add the new section as last
    sections.push(newSection);

    return {
      ...state,
      selectedResume: {
        ...state.selectedResume,
        resumeForm: {
          ...state.selectedResume.resumeForm,
          sections: sections
        }
      }
    };
  });
  // Add default data based on section type
  this.addDefaultDataForSection(sectionName);
  console.log(`Added section ${sectionName} to resume as last, updated arrow flags.`);
}

private addDefaultDataForSection(sectionName: string) {
  const ResumeModel = require('../resume.model');

  switch (sectionName) {
    case 'CONTACT':
      // Add default contact data
      const defaultContact = new ResumeModel.ResumeContact();
      defaultContact.fname = 'John';
      defaultContact.lname = 'Doe';
      defaultContact.email_address = 'john.doe@email.com';
      defaultContact.phone_number = '+1-555-0123';
      this.addContact(defaultContact);
      break;
    case 'PROFILE_SUMMARY':
      const defaultSummary = new ResumeModel.ProfileSummary();
      defaultSummary.profile_summary = 'Experienced professional with a passion for delivering high-quality solutions.';
      this.addSummary(defaultSummary);
      break;
    case 'EDUCATION':
      // For education, just set up add mode (form will handle adding)
      break;
    case 'PROJECT': {
      // Find the static PROJECT section definition
      const staticProjectSection = require('./resume-sections').sections.find((s: any) => s.section === 'PROJECT');
      const defaultItems = staticProjectSection && staticProjectSection.items ? [...staticProjectSection.items] : [];
      // Update the user's resumeForm.sections to ensure items is set
      this.state.update((state) => {
        const updatedSections = state.selectedResume.resumeForm.sections.map(section =>
          section.section === 'PROJECT' ? { ...section, items: defaultItems } : section
        );
        return {
          ...state,
          selectedResume: {
            ...state.selectedResume,
            resumeForm: {
              ...state.selectedResume.resumeForm,
              sections: updatedSections
            }
          }
        };
      });
      this.setProject(new ResumeModel.Project());
      break;
    }
    case 'WORK_EXPERIENCE':
      this.setExperience(new ResumeModel.Experience());
      this.updateExperienceAddMode();
      break;
    case 'CERTIFICATIONS':
      this.setCertification(new ResumeModel.Certification());
      break;
    case 'ACHIEVEMENT_WITH_DESC':
      this.setSelectedAccomplishment(new ResumeModel.Accomplishment());
      break;
    case 'ACHIEVEMENTS_BULLET_POINTS':
      // Handled in comprehensive data loading
      break;
    case 'RELEVANT_COURSEWORK':
      // Reset form will be handled by component
      break;
    case 'SKILLS_BULLET_POINTS':
      const skill1 = new ResumeModel.SkillV2();
      skill1.sub_title = 'JavaScript';
      skill1.skills = ['Advanced'];

      const skill2 = new ResumeModel.SkillV2();
      skill2.sub_title = 'TypeScript';
      skill2.skills = ['Intermediate'];

      const skill3 = new ResumeModel.SkillV2();
      skill3.sub_title = 'Angular';
      skill3.skills = ['Advanced'];

      this.addSkillV2([skill1, skill2, skill3]);
      break;
  }
}

removeSectionFromMultipleSectionsList(section: string) {
  console.log("Before:", this.state().multipleSectionsList);
  this.state.update((state) => ({
    ...state,
    multipleSectionsList: state.multipleSectionsList.map((e)=>e.filter((s)=> s.section != section))
  }));
  console.log("After:", this.state().multipleSectionsList);
}

reorderSections(fromIndex: number, toIndex: number) {
  this.state.update((state) => {
    const newSections = [...state.selectedResume.resumeForm.sections];
    const [moved] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, moved);
    return {
      ...state,
      selectedResume: {
        ...state.selectedResume,
        resumeForm: {
          ...state.selectedResume.resumeForm,
          sections: newSections
        }
      }
    };
  });
}

moveSectionUp(section: string) {
  const currentSections = this.state().selectedResume.resumeForm.sections;
  const idx = currentSections.findIndex(s => s.section === section);
  if (idx > 0) {
    this.reorderSections(idx, idx - 1);
  }
}

moveSectionDown(section: string) {
  const currentSections = this.state().selectedResume.resumeForm.sections;
  const idx = currentSections.findIndex(s => s.section === section);
  if (idx < currentSections.length - 1) {
    this.reorderSections(idx, idx + 1);
  }
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
    this.state.update((state) => {
      const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
        if (section.section === 'EDUCATION') {
          return {
            ...section,
            items: section.items?.filter(item => item.data.id !== edu.id) ?? []
          };
        }
        return section;
      });
      return {
        ...state,
        currentTab: '',
        isEdit: false,
        isChangeInNewResume: true,
        selectedResume: {
          ...state.selectedResume,
          resumeForm: {
            ...state.selectedResume.resumeForm,
            sections: updatedSections
          }
        }
      };
    });
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

      addCourseWork(courseWork : courseWork[]){
        this.state.update((state) => {
            const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
                if (section.section === 'COURSEWORK') {
                    return {
                        ...section,
                        items: courseWork.map(cw => ({ id: String(cw.id), data: cw }))
                    };
                }
                return section;
            });
            return {
                ...state,
                currentTab: 'COURSEWORK',
                isEdit: false,
                isChangeInNewResume: true,
                selectedResume: {
                    ...state.selectedResume,
                    resumeForm: {
                        ...state.selectedResume.resumeForm,
                        sections: updatedSections
                    }
                }
            };
        });
      }

      // New methods for courseWork item management
      addCourseWorkItem(course: courseWork) {
    this.state.update((state) => {
      const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
        if (section.section === 'COURSEWORK') {
          return {
            ...section,
            items: [...(section.items ?? []), { id: String(course.id), data: course }]
          };
        }
        return section;
      });
      return {
        ...state,
        currentTab: 'COURSEWORK',
        isEdit: false,
        isChangeInNewResume: true,
        selectedResume: {
          ...state.selectedResume,
          resumeForm: {
            ...state.selectedResume.resumeForm,
            sections: updatedSections
          }
        }
      };
    });
      }

      updateCourseWorkItem(course: courseWork, index: number) {
        this.state.update((state) => {
            const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
                if (section.section === 'COURSEWORK') {
                    const items = section.items ? [...section.items] : [];
                    items[index] = { ...items[index], data: course, id: String(course.id) };
                    return { ...section, items };
                }
                return section;
            });
            return {
                ...state,
                currentTab: 'COURSEWORK',
                isEdit: false,
                isChangeInNewResume: true,
                selectedResume: {
                    ...state.selectedResume,
                    resumeForm: {
                        ...state.selectedResume.resumeForm,
                        sections: updatedSections
                    }
                }
            };
        });
      }

      deleteCourseWorkItem(course: courseWork) {
    this.state.update((state) => {
      const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
        if (section.section === 'COURSEWORK') {
          return {
            ...section,
            items: section.items?.filter(item => item.data.id !== String(course.id)) ?? []
          };
        }
        return section;
      });
      return {
        ...state,
        currentTab: 'COURSEWORK',
        isEdit: false,
        isChangeInNewResume: true,
        selectedResume: {
          ...state.selectedResume,
          resumeForm: {
            ...state.selectedResume.resumeForm,
            sections: updatedSections
          }
        }
      };
    });
      }

      setCourseWorkList(courseList: courseWork[]) {
    this.state.update((state: UserState) => {
      const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
        if (section.section === 'COURSEWORK') {
          return {
            ...section,
            items: courseList.map(cw => ({ id: String(cw.id), data: cw }))
          };
        }
        return section;
      });
      return {
        ...state,
        currentTab: 'COURSEWORK',
        isEdit: false,
        isChangeInNewResume: true,
        selectedResume: {
          ...state.selectedResume,
          resumeForm: {
            ...state.selectedResume.resumeForm,
            sections: updatedSections
          }
        }
      };
    });
      }

      // Course work selection methods for editing
      updateCourseWork(course: courseWork) {
        this.state.update((state) => ({
          ...state,
          currentTab: 'COURSEWORK',
          selectedResume: { ...state.selectedResume, selectedCourseWork: course },
          isEdit: true
        }));
      }

      getSelectedCourseWork(): Signal<courseWork> {
        return computed(() => this.state().selectedResume.selectedCourseWork);
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
    this.state.update((state) => {
      const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
        if (section.section === 'PROJECT') {
          return {
            ...section,
            items: section.items?.filter(item => {
              // Support both {id, data} and {id} structures
              if (item.id && pro.id && item.id === pro.id) return false;
              if (item.data && item.data.id && pro.id && item.data.id === pro.id) return false;
              return true;
            }) ?? []
          };
        }
        return section;
      });
      return {
        ...state,
        currentTab: '',
        isEdit: false,
        isChangeInNewResume: true,
        selectedResume: {
          ...state.selectedResume,
          resumeForm: {
            ...state.selectedResume.resumeForm,
            sections: updatedSections
          }
        }
      };
    });
      }

      deleteExperience(exp : Experience){
    // ...refactored above...
  }

      deleteCertification(exp : SectionItem){
        this.state.update((state) => {
          const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
            if (section.section === 'CERTIFICATIONS') {
              return {
                ...section,
                items: section.items?.filter(item => {
                  // Support both {id, data} and {id} structures
                  if (item.id && exp.id && item.id === exp.id) return false;
                  if (item.data && item.data.id && exp.id && item.data.id === exp.id) return false;
                  return true;
                }) ?? []
              };
            }
            return section;
          });
          return {
            ...state,
            currentTab: '',
            isEdit: false,
            isChangeInNewResume: true,
            selectedResume: {
              ...state.selectedResume,
              resumeForm: {
                ...state.selectedResume.resumeForm,
                sections: updatedSections
              }
            }
          };
        });
      }

      deleteAccomplishment(exp : Accomplishment){
    this.state.update((state) => {
      const updatedSections = state.selectedResume.resumeForm.sections.map(section => {
        if (section.section === 'ACCOMPLISHMENT') {
          return {
            ...section,
            items: section.items?.filter(item => item.data.id !== exp.id) ?? []
          };
        }
        return section;
      });
      return {
        ...state,
        currentTab: '',
        selectedResume: {
          ...state.selectedResume,
          resumeForm: {
            ...state.selectedResume.resumeForm,
            sections: updatedSections
          }
        },
        isEdit: false,
        isChangeInNewResume: true
      };
    });
  }

      setEducation(edu: Education) {
        this.state.update((state) => ({
          ...state,
          currentTab: 'EDUCATION',
          selectedResume: { ...state.selectedResume, selectedEducation: edu },
          isEdit: false
        }));
      }

      setExperience(cer: Experience) {
        this.state.update((state) => ({
          ...state,
          currentTab: 'EXPERIENCE',
          selectedResume: { ...state.selectedResume, selectedExperience: cer },
          isEdit: false
        }));
      }

      setCertification(cer: SectionItem) {
        this.state.update((state) => ({
          ...state,
          currentTab: 'CERTIFICATION',
          selectedResume: { ...state.selectedResume, selectedCertification: cer },
          isEdit: false
        }));
      }

      setProject(cer: Project) {
        this.state.update((state) => ({
          ...state,
          currentTab: 'PROJECT',
          selectedResume: { ...state.selectedResume, selectedProject: cer },
          isEdit: false
        }));
      }

      setSelectedAddress(address: Address) {
        this.state.update((state) => ({
          ...state,
          selectedAddress: address,
          isEdit: false
        }));
      }

      setIsChangeInNewResume(flag: boolean) {
        this.state.update((state) => ({
          ...state,
          isChangeInNewResume: flag
        }));
      }


      editRoundDetailsById(rounds: RoundDetails, index: number) {
        this.state.update((state) => ({
          ...state,
          selectedJobApplication: {
            ...state.selectedJobApplication,
            round_details: [
              ...state.selectedJobApplication.round_details.slice(0, index),
              rounds,
              ...state.selectedJobApplication.round_details.slice(index + 1)
            ]
          }
        }));
      }

      deleteRoundDetailsById(index: number) {
        this.state.update((state) => ({
          ...state,
          selectedJobApplication: {
            ...state.selectedJobApplication,
            round_details: [
              ...state.selectedJobApplication.round_details.slice(0, index),
              ...state.selectedJobApplication.round_details.slice(index + 1)
            ]
          }
        }));
      }

      editRoundDetailsByUnqId(rounds: RoundDetails, index: number) {
        this.state.update((state) => ({
          ...state,
          selectedJobApplication: {
            ...state.selectedJobApplication,
            round_details: [
              ...state.selectedJobApplication.round_details.slice(0, index),
              rounds,
              ...state.selectedJobApplication.round_details.slice(index + 1)
            ]
          }
        }));
      }


      addFeedbackDetails(feedback: JobApplicationFeedback) {
        this.state.update((state) => ({
          ...state,
          selectedJobApplication: {
            ...state.selectedJobApplication,
            feedback: feedback
          }
        }));
      }

      addClientDetails(contact: ClientDetails) {
        this.state.update((state) => ({
          ...state,
          selectedJobApplication: {
            ...state.selectedJobApplication,
            client_details: contact
          }
        }));
      }

      addVendorDetails(contact: VendorDetails) {
        this.state.update((state) => ({
          ...state,
          selectedJobApplication: {
            ...state.selectedJobApplication,
            vendor_details: contact
          }
        }));
      }

      setJobApplication(application: JobApplication) {
        this.state.update((state) => ({
          ...state,
          selectedJobApplication: application
        }));
      }

      addJobApplicationList(list: Array<JobApplication>) {
        this.state.update((state) => ({
          ...state,
          jobApplications: [...list],
          filteredJobApplications: [...list]
        }));
      }

      setRoundDetails(round: RoundDetails) {
        this.state.update((state) => ({
          ...state,
          selectedRoundDetails: round
        }));
      }

      addRoundDetails(round: RoundDetails) {
        this.state.update((state) => ({
          ...state,
          selectedJobApplication: {
            ...state.selectedJobApplication,
            round_details: [
              ...state.selectedJobApplication.round_details,
              round
            ]
          }
        }));
      }



      addJobDescriptionAIResponse(res: JobDescriptionAIResponse) {
        this.state.update((state) => ({
          ...state,
          jobDescriptionAIResponse: res,
        }));
      }

      setAllJobApplicationsCompleteDetails(applications: JobApplicationRequest[]) {
        this.state.update((state) => ({
          ...state,
          jobApplicationsCompleteDetails: applications
        }));
      }

      setLoginProfile(profile: LoginProfile) {
        this.state.update((state) => ({
          ...state,
          loginProfile: profile
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

      setResumeDataListItems(items : ResumeListDataItem[]) {
        this.state.update((state) => ({
          ...state,
          resumeListItems: [...items],
        }));
      }

      addResumeDataListItem(item: ResumeListDataItem) {
        this.state.update((state) => ({
          ...state,
          resumeListItems: [...state.resumeListItems, item],
        }));
      }

      updateResumeDataListItem(item: ResumeListDataItem, index: number) {
        this.state.update((state) => ({
          ...state,
          resumeListItems: [
            ...state.resumeListItems.slice(0, index),
            item,
            ...state.resumeListItems.slice(index + 1)
          ],
        }));
      }

      removeResumeDataListItem(index: number) {
        this.state.update((state) => ({
          ...state,
          resumeListItems: [
            ...state.resumeListItems.slice(0, index),
            ...state.resumeListItems.slice(index + 1)
          ],
        }));
      }

      setJobApplicationFlag(flag: boolean) {
        this.state.update((state) => ({
          ...state,
          jobApplicationFlag: flag
        }));
      }

      setFilteredResumes(resumes: ResumeListDataItem[]) {
        this.state.update((state) => ({
          ...state,
          filteredResumes: [...resumes]
        }));
      }

      updateSectionStatus(status: IsSectionPresent) {
        this.state.update((state) => ({
          ...state,
          selectedResume: {
            ...state.selectedResume,
            resumeForm: {
              ...state.selectedResume.resumeForm,
              isSectionPresent: { ...status }
            }
          }
        }));
      }

      removeJobApplication(index: number) {
        this.state.update((state) => ({
          ...state,
          jobApplications: [
            ...state.jobApplications.slice(0, index),
            ...state.jobApplications.slice(index + 1)
          ],
          filteredJobApplications: [...state.jobApplications]
        }));
      }

      setSelectedAccomplishment(accom: SectionItem) {
        this.state.update((state) => ({
          ...state,
          selectedResume: {
            ...state.selectedResume,
            selectedAccomplishment: accom
          }
        }));
      }

      setSelectedEducation(edu: Education) {
        this.state.update((state) => ({
          ...state,
          selectedResume: {
            ...state.selectedResume,
            selectedEducation: edu
          }
        }));
      }

      setSelectedExperience(exp: Experience) {
        console.log('setSelectedExperience called with:', exp);
        this.state.update((state) => ({
          ...state,
          selectedResume: {
            ...state.selectedResume,
            selectedExperience: exp
          }
        }));
        console.log('selectedExperience after update:', this.state().selectedResume.selectedExperience);
      }

      setSelectedProject(proj: Project) {
        this.state.update((state) => ({
          ...state,
          selectedResume: {
            ...state.selectedResume,
            selectedProject: proj
          }
        }));
      }

      setSelectedCertification(cert: SectionItem) {
        this.state.update((state) => ({
          ...state,
          selectedResume: {
            ...state.selectedResume,
            selectedCertification: cert
          }
        }));
      }

      setSelectedCourseWork(cw: courseWork) {
        this.state.update((state) => ({
          ...state,
          selectedResume: {
            ...state.selectedResume,
            selectedCourseWork: cw
          }
        }));
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

      getSelectedAccomplishment() : Signal<SectionItem> {
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

      getMultipleColumnTemplateSections() : Signal<Array<Array<SectionDesc>>> {
        return computed(()=> this.state().multipleSectionsList);
      }

      
      getFlagforMultipleColumnTemplateSections() : Signal<boolean> {
        return computed(()=> this.state().isMultipleColumnTemplateSelected);
      }

      getSelectedCertificate() : Signal<SectionItem> {
        return computed(()=> this.state().selectedResume.selectedCertification);
      }

      getSelectedResume() : Signal<UserResume> {
        return computed(()=> this.state().selectedResume);
      }

      getSelectedResumeListItem() : Signal<ResumeListDataItem> {
        return computed(()=> this.state().selectedResumeListItem);
      }

      getCurrentSections() : Signal<SectionDesc[]> {
        return computed(()=> this.state().selectedResume.resumeForm.sections??[]);
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
      
      // Observable version of getUserLoginStatus for use with subscribe
      getUserLoginStatus$(): Observable<boolean> {
        return toObservable(this.getUserLoginStatus(), { injector: this.injector });
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

      getSelectedSummary(): Signal<any> {
        return computed(() => this.state().selectedSummary);
      }
  }
