import { Injectable, Signal, inject } from '@angular/core';
import { Accomplishment, achievement, Award, Certification, Education, Experience, Language, Project, Resume, Skill, SkillV2, TemplateVariables } from '../resume.model';
import { UserStoreService } from '../store/user-store.service';

@Injectable({
  providedIn: 'root',
})
export class TemplatesService {

  constructor() {}

  private userStore: UserStoreService = inject(UserStoreService);

  private templates_json : Array<TemplateVariables>= [
    {
      template_name : 'delloite_template',
      name : true,
      email : true,
      phone_number : true,
      address : false,
      linkedIn_profile : true,
      github_profile : true,
      role : true,
      profile_summary : true,
      experience : true,
      education : true,
      skills : true,
      certification : true,
      project : true,
      awards : false,
      languages : false,
      interests : false,
      volunteer_experiences : false,
      professional_memberships : false,
      publications : false,
      profile_image : true
    },
    {
      template_name : 'devresume_template',
      name : true,
      email : true,
      phone_number : true,
      address : true,
      linkedIn_profile : true,
      github_profile : false,
      role : true,
      profile_summary : true,
      experience : true,
      education : true,
      skills : true,
      certification : false,
      project : true,
      awards : true,
      languages : true,
      interests : true,
      volunteer_experiences : false,
      professional_memberships : false,
      publications : false,
      profile_image : true
    }
  ]

  getFormatedResumeHTMLText(template_name : String, resume : Resume){    
    if(template_name == "TEMPLATE_1"){
      return this.getTemplate1HTMLV1(resume);
    }
    else if(template_name == 'TEMPLATE_2'){
      return this.getTemplate2HTMLText(resume);
    }
    else if(template_name == 'TEMPLATE_3'){
      return this.getTemplate3HTMLText(resume);
    }
    else if(template_name == 'TEMPLATE_4'){
      return this.getTemplate4HTMLText(resume);
    }
    else if(template_name == 'TEMPLATE_5'){
      return this.getTemplate5HTMLText(resume);
    }
    else if(template_name == 'TEMPLATE_6'){
      return this.getTemplate6HTMLText(resume);
    }
    else if(template_name == 'TEMPLATE_7'){
      return this.getTemplate7HTMLText(resume);
    }
    else if(template_name == 'TEMPLATE_8'){
      return this.getTemplate8HTMLText(resume);
    }
    else if(template_name == 'TEMPLATE_9'){
      return this.getTemplate9HTMLV1(resume);
    }
    else if(template_name == 'TEMPLATE_10'){
      return this.formatTemplate10HTML(resume);
    }
    return "";
  }

  getTemplates_JSON(){
    return this.templates_json;
  }

  getDelloite_Template(resume : Resume){
    // return `
    // <!DOCTYPE html>
    // <html lang="en">
    // <head>
    // <meta charset="UTF-8">
    // <meta name="viewport" content="width=device-width, initial-scale=1.0">
    // <title>${resume.name} Resume</title>
    // <script defer src="src/main/resources/templates/fontawesome/js/all.min.js"></script>
    // <link href="src/main/resources/templates/template-fonts/delloite.css" id="theme-style" rel="stylesheet">
    // <style>

    // * {
    //     margin: 0;
    //     padding: 0;
    //     box-sizing: border-box;
    //   }
    //   html {
    //     height: 100%;  
    //   }

    //   body {
    //     min-height: 100%;  
    //     background: #eee;
    //     font-family: 'Lato', sans-serif;
    //     font-weight: 400;
    //     font-size: 12px;
    //     background-color: #ffffff;
    //     color: #000000;
    //   }

    //   .container {
    //     max-width: 700px;   
    //     background: #fff;
    //     margin: 0px auto 0px; 
    //   }

    // header {
    //   background-color: #ffffff;
    //   color: black;
    //   text-align: left; /* Align name to the left */
    //   position : relative
    // }

    // header h1 {
    //   margin: 0;
    //   font-family: 'Poppins', sans-serif; /* Use Poppins font for the name */
    //   letter-spacing: 0.1em; /* Character spacing for titles */
    // }

    // header img {
    //   border-radius: 50%;
    //   width: 100px;
    //   height: 100px;
    //   object-fit: cover;
    //   position: absolute;
    //   top: 50%;
    //   right: 20px;
    //   transform: translateY(-50%);
    // }

    // .contact-icons {
    //   list-style: none;
    //   padding: 12px 0; /* Better padding for contact details */
    //   margin: 0;
    // }

    // .contact-container {
    //   width: 45%; /* Updated to 40% width */
    //   display: inline-block;
    // }

    // .contact-icons li {
    //   margin-bottom: 5px;
    // }

    // .contact-icons i {
    //   color: black;
    //   margin-right: 5px;
    // }

    // section {
    //   background-color: #ffffff; /* White background for sections */
    //   margin-bottom: 12px; /* Margin between sections */
    // }

    // /* New styles for the Profile Summary, Technical Skills, Soft Skills, and Education sections */
    // .profile-summary,
    // .technical-skills,
    // .soft-skills,
    // .education,
    // .projects,
    // .experience,
    // .certifications {
    //   font-family: 'Poppins', sans-serif; /* Use Poppins font for titles */
    // }

    // .profile-summary h2,
    // .technical-skills h2,
    // .soft-skills h2,
    // .education h2,
    // .projects h2,
    // .experience h2,
    // .certifications h2 {
    //   letter-spacing: 0.1em; /* Character spacing for titles */
    //   margin-bottom: 5px; /* Margin below titles */
    // }

    // .profile-summary p,
    // .technical-skills p,
    // .soft-skills p,
    // .education p,
    // .projects p,
    // .experience p,
    // .certifications p {
    //   font-family: 'Wix Madefor Text', sans-serif; /* Use Wix Madefor Text font for paragraphs */
    // }

    // /* Education Section */
    // .education span {
    //   color: #4F4F4F; /* Color for date */
    // }

    // .education p,
    // .projects p,
    // .experience p,
    // .certifications p{
    //   margin-bottom: 5px;
    // }
    // </style>
    // </head>
    // <body>
    // <!-- resume.component.html -->

    // <div class="container">
    // <header>
    //     ${resume.name? `
    //     <h1>${resume.name}</h1>
    //     ` : ''}
    //     <div class="contact-icons">
    //     ${resume.email?`
    //     <div class="contact-container">
    //         <li><i class="fas fa-envelope"></i> ${resume.email}</li>
    //     </div>
    //     `:''
    //     }
    //     ${resume.phone_number?`
    //     <div class="contact-container">
    //         <li><i class="fas fa-phone"></i> ${resume.phone_number}</li>
    //     </div>
    //     ` : ''}
    //     ${resume.linkedIn_profile?`
    //     <div class="contact-container">
    //         <li><i class="fab fa-linkedin"></i> <a href="${resume.linkedIn_profile}">LinkedIn Profile</a></li>
    //     </div>
    //     `:''}
    //     ${resume.github_profile?`
    //     <div class="contact-container">
    //         <li><i class="fab fa-github"></i> <a href="${resume.github_profile}">Github Profile</a></li>
    //     </div>
    //     ` : ''}
    //     </div>
    //     ${resume.imageBase64Encoded?`
    //     <img src="data:image/png;base64,${ resume.imageBase64Encoded }" alt="Profile Image">
    //     `:''}
    // </header>

    // <!-- Profile Summary Section -->
    // ${resume.profile_summary?`
    // <section class="profile-summary">
    //     <h2>Profile Summary</h2>
    //     <p>${resume.profile_summary}</p>
    // </section>
    // ` : ''}

    // <!-- Technical Skills Section -->
    // ${resume.technical_skills || resume.soft_skills?`
    // <section class="technical-skills">
    //     <h2>Skills</h2>
    //     ${resume.technical_skills?`
    //     <p>Technical Skills : ${resume.technical_skills.join(', ')}</p>
    // ` : ""}
    //     ${resume.soft_skills?`
    //         <p>Soft Skills : ${resume.soft_skills.join(', ')}</p>
    //     ` : ""}
    // </section>
    // ` : ''}

    // <!-- Education Section -->
    // ${resume.educationList?`
    // <section class="education">
    //     <h2>Education</h2>
    //     ${this.formatEductionListItems(resume.educationList)}
    // </section>
    // ` : ''}

    // <!-- Projects Section -->
    // ${resume.projectList?`
    // <section class="projects">
    //     <h2>Projects</h2>
    //     ${this.formatProjectListItems(resume.projectList)}
    // </section>
    // ` : ''}

    // <!-- Experience Section -->
    // ${resume.experienceList?`
    // <section class="experience">
    //     <h2>Experience</h2>
    //     ${this.formatExperienceListItems(resume.experienceList)}
    // </section>
    // ` : ''}

    // <!-- Certifications Section -->
    // ${resume.certificationList?`
    // <section class="certifications">
    //  <h2>Certifications</h2>
    //  ${this.formatCertificationListItems(resume.certificationList)}
    // </section>
    // ` : ''}
    // </div>  
    // </body>
    // </html>
    // `

    return ``
  }

  private formatEductionListItems(items: any[]): string {
    return items.map((item: any) => `
      <p>
        <b>${item.degree_earned}(${item.major_or_field_of_study}), ${item.school_or_university_name}</b><br>
        <span>${item.graduation_date}</span><br>
        GPA - ${item.gpa}
      </p>
    `).join('');
  }

  private formatProjectListItems(items: any[]): string {
    return items.map((item: any) => `
      <p>
        <strong>${item.title_of_the_project}</strong><br>
        <span>${item.description}</span><br>
        <b>Technologies - </b> ${item.technologies_used}
      </p>
    `).join('');
  }

  private formatExperienceListItems(items: any[]): string {
    return items.map((item: any) => `
      <p>
        <strong>${item.job_title}, ${ item.company_name }</strong>
        <span style="float: right;">${ item.dates_of_employment }</span>
        <br>
        ${ item.description }
      </p>
    `).join('');
  }

  private formatCertificationListItems(items: Certification[]): string {
    return items.map((item: Certification) => `
    <div style="font-size: 12px;" class="template1-section-content trigger-area">
    <div>
      <p>
      <span><a href="${item.certification_link}" style="color : black !important"> ${item.certification_name}</a>, ${item.issued_organisation}</span>
      <span style="float: right;">${item.issued_month} ${item.issued_year}</span>
      </p>
    </div>
  </div>
    `).join('');
  }


  getDevresume_Template(resume : Resume){
    // return `
    // <!DOCTYPE html>
    // <html lang="en">
    // <head>
    //   <meta charset="UTF-8">
    //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //   <title>${resume.name}'s - Resume</title>
    //   <script defer src="src/main/resources/templates/fontawesome/js/all.min.js"></script>
    //   <link href="src/main/resources/templates/template-fonts/devresume.css" id="theme-style" rel="stylesheet">
    //   <style>
    //     * {
    //       margin: 0;
    //       padding: 0;
    //       box-sizing: border-box;
    //     }
    
    //     html {
    //       height: 100%;
    //     }
    
    //     body {
    //       min-height: 100%;
    //       background: #eee;
    //       font-family: 'Roboto',sans-serif !important;
    //       font-weight: 400;
    //       font-size: 0.85rem;
    //       background-color: #ffffff;
    //       color: #000000;
    //     }
    
    //     .container {
    //       max-width: 700px;
    //       background: #ffffff;
    //       margin: 0px auto 0px;
    //     }
    
    //     .header {
    //       background-color: #ffffff;
    //       color: black;
    //       text-align: left;
    //       display: flex;
    //       justify-content: space-between;
    //       align-items: center;
    //     }
    
    //     .header h2 {
    //       font-family: 'Roboto',sans-serif !important;
    //       font-size: 1.9rem;
    //       font-weight: bold;
    //       letter-spacing: 0.1rem;
    //       color: #54B689;
    //       text-transform: uppercase !important;
    //     }
    
    //     .contact-details {
    //       list-style: none;
    //       padding: 0 0 0 5px;
    //       margin: 0;
    //       display: flex;
    //       flex-direction: column;
    //       align-items: flex-start;
    //     }
    
    //     .resume-contact {
    //       border-left: 1px solid rgba(0, 0, 0, 0.08);
    //       font-size: 0.75rem;
    //     }
    
    //     .resume-tagline {
    //       font-size: 0.9rem;
    //       font-weight: 100;
    //       padding-top: 12px;
    //     }
    
    //     .col-12 {
    //       flex: 0 0 auto;
    //       width: 100%;
    //     }
    
    //     .row {
    //       --bs-gutter-x: 1.5rem;
    //       --bs-gutter-y: 0;
    //       display: flex;
    //       flex-wrap: wrap;
    //       margin-top: calc(-1 * var(--bs-gutter-y));
    //       margin-right: calc(-.5 * var(--bs-gutter-x));
    //       margin-left: calc(-.5 * var(--bs-gutter-x));
    //     }
    
    //     .row>* {
    //       flex-shrink: 0;
    //       width: 100%;
    //       max-width: 100%;
    //       padding-right: calc(var(--bs-gutter-x) * .5);
    //       padding-left: calc(var(--bs-gutter-x) * .5);
    //       margin-top: var(--bs-gutter-y);
    //     }
    
    //     .contact-details li {
    //       font-family: 'Wix Madefor Text', sans-serif;
    //     }
    
    //     .align-items-center {
    //       align-items: center !important;
    //     }
    
    //     .mb-0 {
    //       margin-bottom: 0 !important;
    //     }
    
    //     a.resume-link {
    //       color: #4f4f4f;
    //     }
    
    //     a.resume-link:hover {
    //       color: #54B689;
    //     }
    
    //     ol,
    //     ul {
    //       padding-left: 2rem;
    //     }
    
    //     ol,
    //     ul,
    //     dl {
    //       margin-top: 0;
    //       margin-bottom: 1rem;
    //     }
    
    //     ol ol,
    //     ul ul,
    //     ol ul,
    //     ul ol {
    //       margin-bottom: 0;
    //     }
    
    //     .contact-details i {
    //       color: black;
    //       margin-right: 5px;
    //     }
    
    //     /* Section 2 styles */
    //     .section2 {
    //       border-top: 1px solid rgba(0, 0, 0, 0.08);
    //       padding: 12px 0px 12px 0px;
    //       display: flex;
    //       align-items: center;
    //     }
    
    //     .profile-image {
    //       border-radius: 50%;
    //       margin-right: 20px;
    //       width:100px;
    //       height:100px;
    //     }
    
    //     .profile-summary {
    //       font-family: 'Wix Madefor Text', sans-serif;
    //       flex: 1;
    //     }
               
    //   .sub-sections-row {
    //     display: flex;
    //     flex-direction: row;
    //     margin-top: 12px;
    //   }
      
    //   /* Sub-Section Styles */
    //   .sub-section1,
    //   .sub-section2 {
    //     border-top: 1px solid rgba(0, 0, 0, 0.08);
    //   }
      
    //   .sub-section1{
    //       width: 72%;
    //       padding-right: 5px;
    //   }
      
    //   .sub-section2{
    //       width: 28%;
    //       padding-left: 20px;
    //   }
      
    //   .sub-section-title {
    //     font-family:Arial, Helvetica, sans-serif;
    //     font-size: 1.2rem;
    //     font-weight: 700;
    //     color: #54B689;
    //     margin-bottom: 12px;
    //     text-transform: uppercase !important;
    //   }
      
    //   .resume-section-heading{position:relative;padding-left:1rem;font-size:1.125rem;letter-spacing:0.15rem;color:#54B689}
    //   .resume-section-heading:before{content:"";display:inline-block;width:5px;height:100%;background:#54B689;position:absolute;left:0;top:0}
      
    //   section{
    //       margin: 12px 0px 12px 0px;
    //   }
      
    //   .list-unstyled{
    //       list-style: none;
    //   }
      
    //   .pd-0{
    //       padding:0 !important;
    //   }
      
    //   .resume-body{
    //       padding: 0px;
    //   }
      
    //   .text-muted{--bs-text-opacity: 1;color:var(--bs-secondary-color) !important}
      
    //     </style>
    //   </head>
    //   <body>
    //     <div class="container">
    //       <div class="header col-12">
    //         <div class="resume-title col-md-6 col-lg-8 col-xl-9">
    //           ${resume.name?`
    //           <h2 class="resume-name mb-0 text-uppercase">${resume.name}</h2>
    //           `:''}
    //           ${resume.role?`
    //           <div class="resume-tagline mb-3 mb-md-0">${resume.role}</div>
    //           `:''}
    //         </div>
    //         <div class="col-md-6 col-lg-4 col-xl-3">
    //           <ul class="contact-details mb-0">
    //             ${resume.phone_number?`
    //             <li class="mb-2">
    //             <i class="fas fa-phone fa-fw fa-lg me-2"></i>
    //             <a class="resume-link" href="tel:#">${resume.phone_number}</a></li>
    //             ` : ''}
    //             ${resume.email?`
    //             <li class="mb-2"><i class="fas fa-envelope-square fa-fw fa-lg me-2"></i><a class="resume-link" href="mailto:#">${resume.email}</a></li>
    //             `:''}
    //             ${resume.linkedIn_profile?`
    //             <li class="mb-2"><i class="fab fa-linkedin fa-fw fa-lg me-2"></i><a class="resume-link" href="${resume.linkedIn_profile}">LinkedIn Profile</a></li>
    //             `:''}
    //             ${resume.address?`
    //             <li class="mb-0"><i class="fas fa-map-marker-alt fa-fw fa-lg me-2"></i>${resume.address}</li>
    //             `:''}
    //           </ul>
    //         </div>
    //       </div>
      
    //       <!-- Section 2: Profile Image and Profile Summary -->
    //       <div class="section2">
    //       ${resume.imageBase64Encoded?`
    //         <img src="data:image/png;base64,${resume.imageBase64Encoded}" alt="Profile Image" class="profile-image" width="120" height="120">
    //         `:''}
    //         <div class="profile-summary">
    //         ${resume.profile_summary?`
    //           <p>${resume.profile_summary}</p>      
    //           `:''}
    //         </div>
    //       </div>
      
    //       <!-- Sub-Section 1: Work Experience and Projects -->
    //   <!-- Sub-Sections 1 and 2 in One Row -->
      
    //   <div class="resume-body">
    //       <div class="row">
    //           <div class="resume-main sub-section1 col-lg-8 col-xl-9   pe-0   pe-lg-5">
    //           ${resume.experienceList?`
    //               <section class="work-section py-3">
    //                   <h3 class="text-uppercase sub-section-title resume-section-heading mb-4">Work Experiences</h3>
    //                   ${this.formatWorkExperienceDevResume(resume.experienceList)}
    //               </section><!--//work-section-->
    //               `:''}
      
                  
    //               ${resume.projectList?`
    //               <section class="project-section py-3">
    //                   <h3 class="text-uppercase sub-section-title resume-section-heading mb-4">Projects</h3>
    //                   ${this.formatProjectDevResume(resume.projectList)}
    //               </section><!--//project-section-->	
    //               `:''}
    //           </div><!--//resume-main-->
    //           <aside class="resume-aside sub-section2 resume-contact  col-lg-4 col-xl-3 px-lg-4 pb-lg-4">
    //           ${resume.technical_skills || resume.soft_skills?`
    //               <section class="skills-section py-3">
    //                   <h3 class="text-uppercase sub-section-title resume-section-heading mb-4">Skills</h3>
    //                   ${resume.technical_skills?`
    //                   <div class="item">
    //                       <h4 class="item-title">Technical</h4>
    //                       <ul class="list-unstyled resume-skills-list pd-0" >
    //                       ${this.formatListItems(resume.technical_skills)}
    //                       </ul>
    //                   </div><!--//item-->
    //                   `:''}
    //                   ${resume.soft_skills?`
    //                   <div class="item">
    //                       <h4 class="item-title">Professional</h4>
    //                       <ul class="list-unstyled resume-skills-list pd-0">
    //                       ${this.formatListItems(resume.soft_skills)}
    //                       </ul>
    //                   </div><!--//item-->
    //                   `:''}
    //                 </section><!--//skills-section-->
    //                 `:''}
    //                 ${resume.educationList?`
    //                 <section class="education-section py-3">
    //                       <h3 class="text-uppercase sub-section-title resume-section-heading mb-4">Education</h3>
    //                       <ul class="list-unstyled resume-education-list pd-0">
    //                           ${this.formatEductionDevResume(resume.educationList)}
    //                       </ul>
    //                 </section><!--//education-section-->
    //                 `:''}
    //                 ${resume.awardList?`
    //                 <section class="education-section py-3">
    //                       <h3 class="text-uppercase sub-section-title resume-section-heading mb-4">Awards</h3>
    //                       <ul class="list-unstyled resume-awards-list pd-0">
    //                           ${this.formatAwardDevResume(resume.awardList)}
    //                       </ul>
    //                 </section><!--//education-section-->
    //                 `:''}
    //                 ${resume.languageList?`
    //                 <section class="skills-section py-3">
    //                       <h3 class="text-uppercase sub-section-title resume-section-heading mb-4">Languages</h3>
    //                       <ul class="list-unstyled resume-lang-list pd-0">
    //                           ${this.formatLanguageDevResume(resume.languageList)}
    //                       </ul>
    //                 </section><!--//certificates-section-->
    //                 `:''}
    //                 ${resume.interestList?`
    //                 <section class="skills-section py-3">
    //                       <h3 class="text-uppercase sub-section-title resume-section-heading mb-4">Interests</h3>
    //                       <ul class="list-unstyled resume-interests-list mb-0 pd-0">
    //                           ${this.formatListItems(resume.interestList)}
    //                       </ul>
    //                 </section><!--//certificates-section-->
    //                 `:''}
                          
    //                   </aside><!--//resume-aside-->
    //               </div><!--//row-->
    //           </div><!--//resume-body-->
        
        
      
    //       <!-- SkillsCategory sections will be added here -->
      
    //     </div>
    //   </body>
    // </html>    
    // `

    return ``
  }


  public formatWorkExperienceDevResume(items: Experience[]): string {
    return items.map((item: Experience) => `
    <div class="item mb-3">
    <div class="item-heading row align-items-center mb-2">
        <h4 class="item-title col-12 col-md-6 col-lg-8 mb-2 mb-md-0">${item.position_title}</h4>
        <div class="item-meta col-12 col-md-6 col-lg-4 text-muted text-start text-md-end">${ item.company_name} | ${item.start_date} - ${item.end_date}</div>
        
    </div>
    <div class="item-content">
        <ul class="resume-list">
        </ul>
    </div>
    </div><!--//item-->
    `).join('');
  }

  public formatListItems(items : String[]) : string {
    return items.map((item : String)=> `
    <li style="margin: 5px 0; font-size: 12px">${item}</li>
    `).join('');
  }

    public formatSkillListItems(items : Skill[]) : string {
    return items.map((item : Skill)=> `
    <li style="margin: 5px 0; font-size: 12px">${item.name}</li>
    `).join('');
  }

  public formatProjectDevResume(items : Project[]) : string{
    return items.map((item : Project)=> `
    <div class="item mb-3" style="padding-bottom : 5px">
    <div class="item-heading row align-items-center mb-2">
        <h4 class="item-title col-12 col-md-6 col-lg-8 mb-2 mb-md-0">${item.project_name}</h4>                        
    </div>
    <div class="item-content">
        <p>${item.description}</p>
        <div class="item-meta col-12 col-md-6 col-lg-4 text-muted text-start text-md-end"><b>Technologies :</b> ${item.technologies_used}</div>  
    </div>
    </div><!--//item-->
    `).join('');
  }

  public formatEductionDevResume(items : Education[]) : string{
    return items.map((item : Education)=> `
    <li class="mb-3">
        <div class="resume-degree font-weight-bold">${item.degree} in ${item.field_of_study}</div>
        <div class="resume-degree-org text-muted">${item.school_name}</div>
        <div class="resume-degree-time text-muted">${item.graduation_date}</div>
    </li>
    `).join('');
  }

  private formatAwardDevResume(items : Award[]) : string{
    return items.map((item : Award)=> `
    <li class="mb-3">
        <div class="font-weight-bold">${item.award_name}</div>
        <div class="text-muted">${item.issuing_organization} (${item.date_received})</div>
    </li>
    `).join('');
  }

  private formatLanguageDevResume(items : Language[]) : string{
    return items.map((item : Language)=> `
    <li class="mb-2">${item.language_name} <span class="text-muted">(${item.proficiency_level})</span></li>
    `).join('');
  }


  getDefaultResumeTemplate(resumeForm : Resume){

    return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <script defer src="http://Workifence.com:8090/css/fontawesome/js/all.min.js"></script>
      <link href="http://Workifence.com:8090/css/template-fonts/delloite.css" id="theme-style" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body{
        background-color: #fff;
        font-family: "Manrope", sans-serif !important;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .resume-contact-us{
  text-align: left !important;
  margin-bottom: 15px;
  padding: 8px 16px;
  padding-left: 0px;
  .profile-full-name{
    white-space:0 pre-wrap;
    padding-bottom: 0px;
    font-family: 'Poppins', sans-serif !important;
    text-transform: uppercase;
    // font-size: 34px;
    font-weight: 500 !important;
    font-size: 2rem;
    margin-bottom: 4px;
    text-align: left;
  }
a{
  color: dodgerblue;
}

  .profile-sub-title{
    
    padding-bottom: 4px;
    // font-family: Rubik, Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", sans-serif;
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 2px !important;
    text-align: left;
    width: 100%;
    display: block;
  }
  .profile-contact-details-list{
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: left;
    font-size: 0.9rem !important;
      li{
        margin: 0 7px;
        i{
          color:  rgb(185, 185, 185);
          margin-right: 6px;
        }
        span{
            color: rgb(43, 49, 51) !important;
        }

        a{
          padding: 0px !important;
          
          span{
            color: rgb(43, 49, 51) !important;
        }
        }
      }
  }
}


.course-work{
  padding: 0.2rem;
   text-align: left;
  .course-work-section-title{
    font-weight: 400;
    color: black;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(101, 105, 109, .5);
    
    padding-bottom: 1px;
    // font-family: Rubik, Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", sans-serif;
    font-size: 12px;
    width: 100%;
    display: block;
    text-align: left;
    font-family: 'Poppins', sans-serif;
  }

  .course-work-section-content{
    border-radius: 5px;
    color: black;
    text-align: left;

  .qualification-name{
    
    color: black;
    font-size: 12px;
    font-weight: 500 !important;
  }

  .university-name{
    
    color: black;
    font-size: 12px !important;
  }

  .course-work-list{
    display: flex;
    flex-wrap: wrap;
    font-size: 12px;
    text-align:left;

    .course-work-lisit-item{
      flex: 0 0 25%;
      font-size: 12px;
    }
  }
}

}

.resume-summary{
  padding: 0.2rem;
  text-align: left;
  .summary-section-title{
    font-weight: 400;
    color: black;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(101, 105, 109, .5);
    
    padding-bottom: 1px;
    font-size: 1rem;
    width: 100%;
    display: block;
    text-align: left;
    font-family: 'Poppins', sans-serif;
  }

  .resume-summary{
    
    // font-family: Inter, Arial, Helvetica, "Noto Sans Devanagari", "Noto Sans CJK SC Thin", "Noto Sans SC", "Noto Sans Hebrew", sans-serif;
    text-align: left;
    font-size: 1rem;
    padding: 8px 16px;
    font-family: 'Poppins', sans-serif ;
    color: rgb(17, 17, 17);
  }
}

.skill-section{
  padding: 0.2rem;
  text-align: left;
  .skills-section-title{
    font-weight: 400;
    color: black;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(101, 105, 109, .5);
    
    padding-bottom: 1px;
    font-size: 1rem;
    width: 100%;
    display: block;
    text-align: left;
    font-family: 'Poppins', sans-serif;
  }

  .skills-section-content{
    padding: 8px 16px;
    border-radius: 5px;
    color: black;
    text-align: left;

    .skills-list{
      list-style:none; 
      font-size: 1rem;
      text-align:left;

      .skills-list-item{
        font-size: 1rem;
      }
    }

  }

}
.opacity-50{
  opacity: 0.5;
}

.opacity-100{
  opacity: 1;
}
  </style>
</head>
<body>
  <div class="container">
    <header class="trigger-area resume-contact-us" >
      <div>
          <h1 class="profile-full-name" id="resumeName">${resumeForm.contact.fname + ' ' + resumeForm.contact.lname}</h1>
          <span class="profile-sub-title">PMP Certified Manager | Enterprise SaaS | Strategy Development</span>
      </div>
      <div>
            <ul class="profile-contact-details-list">
                ${resumeForm.contact.phone_number.length > 0?
                `<li><i class="fa fa-phone" ></i> <span style="margin-right:12px">${resumeForm.contact.phone_number}</span></li>`:''
                }
                ${resumeForm.contact.email.length > 0?
                `<li><i class="fa fa-envelope" ></i><span style="margin-right:12px">${resumeForm.contact.email}</span></li>`:''
                }
                ${resumeForm.contact.linkedIn_profile.length > 0?
                `<li> <a href="${resumeForm.contact.linkedIn_profile}"> 
                    <span style="margin-right:12px"> ${resumeForm.contact.linkedIn_profile}</span> </a>
                </li>`:''
                }
                ${resumeForm.contact.github_profile.length > 0?
                `<li> <a  href="${resumeForm.contact.github_profile}"> 
                    <span style="margin-right:12px">${resumeForm.contact.github_profile}</span></a>
                </li>`:''
                }
            </ul>
      </div>
    </header>

    ${resumeForm.profileSummary.profile_summary.length > 0?
      `<section class="trigger-area resume-summary"  >
        <span class="summary-section-title">Summary</span>
          <p class="resume-summary" >${resumeForm.profileSummary.profile_summary}</p>
      </section>` : ''
    }

    ${resumeForm.education.length > 0?
      `<section  class="trigger-area resume-education">
        <span class="education-section-title">Education</span>
         ${this.formatDefaultEducation(resumeForm.education)}
      </section>` : ''
    }

    ${resumeForm.courseWork.length > 0?
      `<section  class="trigger-area course-work">
        <span class="course-work-section-title">Relevant Coursework</span>
        <div  class="course-work-section-content">
        <ul class="course-work-list">
           ${this.formatDefaultCourseWork(resumeForm.courseWork)}
        </ul>
        </div>
      </section> ` : ''
    }


    ${resumeForm.skill.length > 0?
      `<section  class="trigger-area skill-section">
        <span class="skills-section-title">Technical Skills</span>
        <div class="template1-section-content ">
          <ul  class="skills-list">
            ${this.formatDefaultSkill(resumeForm.skill)}
          </ul>
         
        </div>
      </section>`:''
    }

    ${resumeForm.project.length > 0?
      `<section style="padding: 0.2rem;">
        <span class="template1-section-title">Projects</span>
          ${this.formatDefaultProject(resumeForm.project)}
      </section>`:''
    }

    ${resumeForm.experience.length > 0?
      `<section style="padding: 0.2rem;">
        <span class="template1-section-title">Experience</span>
          ${this.formatDefaultExperience(resumeForm.experience)}
      </section>` : ''
    }

    ${resumeForm.certification.length > 0?
      `<section style="padding: 0.2rem;">
        <span class="template1-section-title">Certifications</span>
        ${this.formatCertificationListItems(resumeForm.certification)}
      </section>` : ''
    }
  </div>
</body>
</html>

    `
  }


  public formatDefaultEducation(items : Education[]) : string{
    return items.map((item : Education)=> 
    `
    <div class="education-section-content" style="margin:12px 0;margin-bottom:0">
      <div style="display: flex;justify-content: space-between;padding:0;margin:0;margin-bottom:5px">
        <div style="flex: 1;text-align: left;padding:0;margin:0">
            <p class="qualification-name" style="font-size:12px">${item.degree}, ${item.field_of_study}</p>
        </div>
        <div style="flex: 1;text-align: right;padding:0;margin:0">
            <p style="font-size: 12px;padding:0;margin:0;color : black">${item.school_location}</p></div>
        </div>
      <div style="display: flex;justify-content: space-between;padding:0;margin:0;margin-bottom:5px">
        <div style="flex: 1;text-align: left;padding:0;margin:0">
          <p class="university-name">${item.school_name}</p></div>
        <div style="flex: 1;text-align: right;padding:0;margin:0">
          <p style="font-size:12px;padding:0;margin:0;color: black;">${item.graduation_date}</p></div>
      </div>
      <div style="padding:0;margin:0;">
        <div style="flex: 1;text-align: left;padding:0;margin:0">
          <p style="font-size: 12px;padding:0;margin:0; color: black;">CGPA - ${item.gpa}</p></div>
      </div>

    </div>
    `).join('');
  }

  public formatDefaultCourseWork(items : string[]) : string{
    return items.map((item : string)=> `
    ${item != ''?`<li class="course-work-lisit-item">${item}</li>`:''}
    `).join('');
  }

    public formatDefaultSKillWork(items : Skill[]) : string{
    return items.map((item : Skill)=> `
    ${item.name != ''?`<li class="course-work-lisit-item">${item.name}</li>`:''}
    `).join('');
  }


  public formatDefaultSkill(items : Skill[]) : string{
    return items.map((item : Skill)=> `
    ${item.name != ''?`<li class="skills-list-item">${item.name}</li>`:''}
    `).join('');
  }

  public formatDefaultProject(items : Project[]) : string{
    return items.map((item : Project)=> `
    <div  class="template1-section-content trigger-area" style="margin-top:15px">
            <div style="padding:0;margin:0">
              <div style="display: flex;justify-content: space-between;font-size: 12px">
                <a href="${item.project_link}">${item.project_name}</a>
            </div>
            <p style="font-size: 12px;color: black;padding:0;margin:0;margin-top:5px">${item.technologies_used}</p>
            <div style="padding: 0;margin: 0;font-size: 12px;color: black;">
              <ul style="margin-top:5px;padding-top:0;">
              </ul>
            </div>
            </div>
        </div>
    `).join('');
  }

  public formatDefaultExperience(items : Experience[]) : string{
    return items.map((item : Experience)=> `
    <div class="template1-section-content trigger-area" style="margin-top:15px">
    <div>
      <div style="display: flex;justify-content: space-between;font-size: 12px;padding:0;margin:0"><span style="flex: 1;text-align: left;font-size: 12px;color: black;">${item.company_name}</span><span style="flex: 1;text-align: right;color: black;font-size:12px">${item.start_date} - ${item.end_date}</span></div>
      <p style="font-size: 12px;color: black;padding:0;margin:0;margin-top:5px">${item.position_title}</p>
      <div style="padding: 0;margin: 0;font-size: 12px;color: black;">
        <ul style="margin-top:5px;padding-top:0;">
        </ul>
      </div>
    </div>
</div>
    `).join('');
  }



  getTemplate1HTMLText(resumeForm : Resume){

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Resume</title>
    <script defer src="http://Workifence.com:8090/css/fontawesome/js/all.min.js"></script>
      <link href="http://Workifence.com:8090/css/template-fonts/delloite.css" id="theme-style" rel="stylesheet">
    <style>
    .container {
      margin: auto;
      position: relative;
      text-align: start !important;
      }
    .resume-contact-us{
    text-align: center;
    margin-bottom: 15px;
  
    }

     .profile-contact-details-list{
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: left;
    font-size: 12px !important;
      li{
        margin: 0 7px;
        i{
          color:  rgb(185, 185, 185) !important;
          margin-right: 6px;
        }
        span{
            color: black;
        }

        a{
          padding: 0px !important;
        }
      }
    }

    .profile-full-name{
    padding-bottom: 0px;
    font-family: 'Poppins', sans-serif;
    text-transform: uppercase;
    font-weight: 500 !important;
    font-size: 24px;
    margin-bottom: 4px;
    text-align: left;
    }

    .profile-sub-title{
    
    padding-bottom: 4px;
    font-size: 12px;
    font-weight: 400 !important;
    margin-bottom: 2px !important;
    text-align: left;
    width: 100%;
    display: block;
    }


    .education-section-content{
        border-radius: 5px;
        color: black;
        text-align: left;
        padding:0;
        margin:0;
        margin-bottom:15px;
    }

.education-section-title{
      font-weight: 600;
      color: black;
      text-transform: uppercase;
      border-bottom: 1px solid rgba(101, 105, 109, .5);
      
      padding-bottom: 1px;
      font-size: 12px;
      width: 100%;
      display: block;
      text-align: left;
      font-family: 'Poppins', sans-serif;
    }

   .qualification-name{
        
        color: black;
        font-size: 12px;
        font-weight: 500 !important;
        padding:0;
        margin:0
      }

      .university-name{
        
        color: black;
        font-size: 12px !important;
        padding:0;
        margin:0
      }

      .course-work-section-title{
    font-weight: 600;
    color: black;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(101, 105, 109, .5);
    
    padding-bottom: 1px;
    font-size: 12px;
    width: 100%;
    display: block;
    text-align: left;
    font-family: 'Poppins', sans-serif;
  }

  .qualification-name{
    
    color: black;
    font-size: 12px;
    font-weight: 500 !important;
  }

  .course-work-lisit-item{
      flex: 0 0 25%;
      font-size: 12px;
      padding-bottom:5px !important;
    }

    .course-work-list{
    display: flex;
    flex-wrap: wrap;
    font-size: 12px;
    text-align:left;


  }

  .course-work-section-content{
    border-radius: 5px;
    color: black;
    text-align: left;
}

.summary-section-title{
    font-weight: 600;
    color: black;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(101, 105, 109, .5);
    padding-bottom: 1px;
    font-size: 12px;
    width: 100%;
    display: block;
    text-align: left;
    font-family: 'Poppins', sans-serif;
  }

  .resume-summary{
    text-align: left;
    font-size: 12px;
    font-family: 'Poppins', sans-serif ;
    color: rgb(17, 17, 17);
  }


.skills-section-title{
    font-weight: 600;
    color: black;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(101, 105, 109, .5);
    
    padding-bottom: 1px;
    font-size: 12px;
    width: 100%;
    display: block;
    text-align: left;
    font-family: 'Poppins', sans-serif;
  }

  .skills-list-item{
        font-size: 12px;
        color: black;
        margin-bottom:5px;
      }

      .skills-list{
      list-style:none; 
      font-size: 12px;
      text-align:left;

      
    }

    .skills-section-content{
    border-radius: 5px;
    color: black;
    text-align: left;
    }


    .opacity-50{
    opacity: 0.5;
    }

    .opacity-100{
    opacity: 1;
    }
    .education-section-title{
      font-weight: 600;
      color: black;
      text-transform: uppercase;
      border-bottom: 1px solid rgba(101, 105, 109, .5);
      padding-bottom: 1px;
      font-family: 'Poppins', sans-serif;
      font-size: 12px;
      width: 100%;
      display: block;
      text-align: left;
      font-family: 'Poppins', sans-serif;
    }

     .qualification-name{
        color: black;
        font-size: 12px;
        font-weight: 500 !important;
      }

      .university-name{
       
        color: black;
        font-size: 12px;
        
      }

    .resume-education{
     text-align: left;
     margin-bottom:12px;
    }
     .qualification-name, .university-name, .resume-summary, .skills-list-item {
  font-size: 12px !important;
}
  .profile-contact-details-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-wrap: wrap;
        }

        .profile-contact-details-list li {
            margin-right: 15px;
            font-size: 12px;
        }

  </style>
</head>
<body>
  <div class="container">
    <header class="trigger-area resume-contact-us" >
      <div>
          <h1 class="profile-full-name" id="resumeName">${resumeForm.contact.fname + ' ' + resumeForm.contact.lname}</h1>
          <span class="profile-sub-title">${resumeForm.contact.subTitle}</span>
      </div>
      <div>
            <ul class="profile-contact-details-list">
            ${resumeForm.contact.phone_number.length > 0 ? `<li>Phone: ${resumeForm.contact.phone_number}</li>` : ''}
            ${resumeForm.contact.email.length > 0 ? `<li>Email: ${resumeForm.contact.email}</li>` : ''}
            ${resumeForm.contact.linkedIn_profile.length > 0 ? `<li>LinkedIn: <a href="${resumeForm.contact.linkedIn_profile}">Profile</a></li>` : ''}
            ${resumeForm.contact.github_profile.length > 0 ? `<li>GitHub: <a href="${resumeForm.contact.github_profile}">Profile</a></li>` : ''}
           
        </ul>
      </div>
    </header>

    ${resumeForm.profileSummary.profile_summary.length > 0?
      `<section class="trigger-area resume-summary"  >
        <span class="summary-section-title" style="margin:0px;margin-bottom:10px;padding:0px">Summary</span>
          <p class="resume-summary" >${resumeForm.profileSummary.profile_summary}</p>
      </section>` : ''
    }

    ${resumeForm.education.length > 0?
      `<section  class="trigger-area resume-education">
        <span class="education-section-title">Education</span>
         ${this.formatDefaultEducation(resumeForm.education)}
      </section>` : ''
    }

    ${resumeForm.courseWork.length > 0?
      `<section  class="trigger-area course-work">
        <span class="course-work-section-title">Relevant Coursework</span>
        <div  class="course-work-section-content">
        <ul class="course-work-list" style="padding-left:18px">
           ${this.formatDefaultCourseWork(resumeForm.courseWork)}
        </ul>
        </div>
      </section> ` : ''
    }


    ${resumeForm.skill.length > 0?
      `<section  class="trigger-area skill-section">
        <span class="skills-section-title">Technical Skills</span>
         <div  class="course-work-section-content">
          <ul  class="course-work-list" style="padding-left:18px">
            ${this.formatDefaultSKillWork(resumeForm.skill)}
          </ul>
         
        </div>
      </section>`:''
    }

    ${resumeForm.project.length > 0?
      `<section>
        <span class="course-work-section-title">Projects</span>
          ${this.formatDefaultProject(resumeForm.project)}
      </section>`:''
    }

    ${resumeForm.experience.length > 0?
      `<section>
        <span class="course-work-section-title">Experience</span>
          ${this.formatDefaultExperience(resumeForm.experience)}
      </section>` : ''
    }

    ${resumeForm.certification.length > 0?
      `<section style="color: black !important;margin-top:10px">
        <span class="course-work-section-title">Certifications</span>
        ${this.formatCertificationListItems(resumeForm.certification)}
      </section>` : ''
    }
     ${resumeForm.achievement.ach.length > 0?
      `<section style="color: black !important;">
        <span class="course-work-section-title">Achievements</span>
      </section>` : ''
    }
  </div>
</body>
</html>

    `
  }

  getTemplate2HTMLText(resume : Resume){
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume</title>
      <script defer src="http://Workifence.com:8090/css/fontawesome/js/all.min.js"></script>
      <link href="http://Workifence.com:8090/css/template-fonts/delloite.css" id="theme-style" rel="stylesheet">
      <style>
      .resume-container {
      margin: auto;
      position: relative;
      text-align: start !important;
      }


.header {
    text-align: left;
    border-bottom: 1px solid rgba(0, 0, 0, 0.4);
}

.header h1 {
    margin: 0;
    color: black;
    font-size: 24px;
    font-weight: 500;
    margin-bottom:5px;
}

.contact-details {
   font-weight: 600;
    color: black;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(101, 105, 109, .5);
    padding-bottom: 1px;
    font-size: 12px;
    width: 100%;
    display: block;
    text-align: left;
    font-family: 'Poppins', sans-serif;
}

.profile-contact-details-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-wrap: wrap;
        }

        .profile-contact-details-list li {
            margin-right: 15px;
            font-size: 12px;
        }


.icon {
    color: black;
    font-size: 12px;
}

.summary {
    margin-top: 15px;
}

.summary h2 {
    margin: 0;
    margin-bottom: 5px;
    font-size: 12px;
    padding: 0;
    font-weight: 600 !important;
}

.summary p {
    font-size: 12px;
    margin: 0;
}

.experience,
.project,
.education,
.skills {
    margin-top: 12px;
}

.experience h2,
.project h2,
.education h2,
.skills h2 {
    margin: 0;
    font-size: 12px;
    margin-bottom: 5px;
    font-weight: 600 !important;
}

.experience-details,
.project-details,
.education-details {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin :0;
    // margin-top: 12px;
}

.education-details{
margin-bottom:5px}

.experience-details p,
.project-details p,
.education-details p,
.skills-details p{
    margin: 0;
    font-size: 12px;
    margin-right: 12px;
    opacity: 1;
}
  ..project-details a{
  font-size:12px}

.experience-bullets,
.project-bullets,
.skills-bullets {
    // margin-top: 12px;
}

.experience-bullets ul,
.project-bullets ul {
    list-style-type: disc;
    margin-top:5px;
}

.skills-bullets ul{
list-style-type: disc;
}

.experience-bullets li,
.project-bullets li,
.skills-bullets li{
    font-size: 12px;
    margin-bottom: 5px;
}
      .course-work-section-content{
    border-radius: 5px;
    color: black;
    text-align: left;
}
      .course-work-lisit-item{
      flex: 0 0 25%;
      font-size: 12px;
    }

    .course-work-list{
    display: flex;
    flex-wrap: wrap;
    font-size: 12px;
    text-align:left;


  }
      </style>
    </head>
    <body>
      <div class="resume-container">
    <div class="body-container">
        <header class="trigger-area">
        <div class="header">
            <h1>${resume.contact.fname + ' ' + resume.contact.lname}</h1>
        </div>
        <div>
        <ul class="profile-contact-details-list">
            ${resume.contact.phone_number.length > 0 ? `<li>Phone: ${resume.contact.phone_number}</li>` : ''}
            ${resume.contact.email.length > 0 ? `<li>Email: ${resume.contact.email}</li>` : ''}
            ${resume.contact.linkedIn_profile.length > 0 ? `<li>LinkedIn: <a href="${resume.contact.linkedIn_profile}">Profile</a></li>` : ''}
            ${resume.contact.github_profile.length > 0 ? `<li>GitHub: <a href="${resume.contact.github_profile}">Profile</a></li>` : ''}
           
        </ul>
        </div>

        </header>
        ${resume.profileSummary.profile_summary.length > 0?`
        <div class="summary trigger-area" style='margin-top:12px'>
            <h2>Summary</h2>
            <p class="resume-summary" >${resume.profileSummary.profile_summary}</p>
        </div>
        ` : ''}
        ${resume.experience.length > 0?`
        <div class="experience trigger-area">
            <h2>Experience</h2>
            ${this.formatTemplate2Experience(resume.experience)}
        </div>
        ` : ''}
        ${resume.project.length > 0?` 
        <div class="project trigger-area">
            <h2>Projects</h2>
            ${this.formatTemplate2Project(resume.project)}
        </div>
        ` : ''}
        ${resume.education.length > 0?`
        <div class="education trigger-area">
            <h2>Education</h2>
            ${this.formatTemplate2Education(resume.education)}
        </div>
        ` :''}
        ${resume.skill.length > 0?`
        <div class="skills trigger-area">
            <h2 style="margin:0px;padding:0px">Skills</h2>
           <div  class="course-work-section-content" style="margin:0px;padding:0px">
              <ul  class="course-work-list" style="color:black !important; padding-left:17px;margin:0px;padding:0px">
                ${this.formatDefaultSKillWork(resume.skill)}
              </ul>
            
            </div>
        </div>
        ` : ''}
    </div>
</div>
    <body>
    </html>
    `
  }

  formatTemplate2Experience(items : Array<Experience>){
    return items.map((item : Experience)=> `
                <div class="experience-details">
                    <p style="color: black">${item.position_title}  |  ${item.company_name}  |  ${item.location}  |  ${item.start_date} - ${item.end_date}</p>
                </div>
                <div class="experience-bullets">
                    <ul>
                    </ul>
                </div>
    `).join('');
  }

  formatTemplate2Project(items : Array<Project>){
    return items.map((item : Project)=> `
                <div class="project-details" style="margin : 0">
                    <p style="margin : 0"><a href="${item.project_link}" style="margin : 0;font-size:12px">${item.project_name}</a></p>
                </div>
                <div class="project-bullets">
                    <ul>
                    </ul>
                </div>
    `).join('');
  }

  formatTemplate2Education(items : Array<Education>){
    return items.map((item : Education)=> `
                <div class="education-details">
                <p>${item.degree}, ${item.field_of_study} | ${item.school_name} | ${item.school_location} | CGPA: ${item.gpa} | ${item.graduation_date}</p>
                </div>
    `).join('');
  }

  getTemplate3HTMLText(resume : Resume){
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume</title>
      <script defer src="http://Workifence.com:8090/css/fontawesome/js/all.min.js"></script>
      <link href="http://Workifence.com:8090/css/template-fonts/delloite.css" id="theme-style" rel="stylesheet">
      <style>
      .resume-container {
          margin: auto;
          background-color: white;
          text-align: start !important;
      }

      .header {
          text-align: center;
          margin: 0;
          padding: 0;
      }

      .header h1 {
          white-space:0 pre-wrap;
          padding-bottom: 0px;
          font-family: 'Tahoma', sans-serif;
          text-transform: uppercase;
          color: black;
          font-size: 20px;
          font-weight: 500 !important;
          margin-bottom: 4px;
      }

      .divider {
          width: 100%;
          height: 1px;
          background-color: rgba(0, 0, 0, 0.4);
      }

      .contact-details {
          display: flex;
          flex-wrap: wrap; /* Allow items to wrap */
          justify-content: center; /* Center items horizontally */
          margin: 0;
          padding: 0;
      }

      .contact-details p, a {
          margin: 0;
          margin-left: 12px;
          font-size: 12px;
      }

      .icon {
          color: black;
          font-size: 12px;
      }

      .summary h2 {
          margin: 0;
          font-size: 12px;
          padding: 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.4);
          font-weight:500
      }

      .summary p {
          font-size: 12px;
          margin: 0;
      }

      .education h2,
      .skills h2 {
          margin: 0;
          font-size: 12px;
          margin-bottom: 5px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.4);
          font-weight:500
      }

      .education-details{
          margin-top: 12px;
      }

      .education-details p,
      .skills-bullets p {
          margin: 0;
          font-size: 12px;
          opacity: 1;
      }

      .skills-bullets ul {
          list-style-type: disc;
          padding-left: 20px;
      }

      .skills-bullets li {
          margin-bottom: 5px;
      }

      .summary,
      .experience,
      .project,
      .education,
      .skills
      {
        margin-top : 12px;
      }

    .experience h2,
    .project h2 {
      margin: 0;
      font-size: 12px;
      margin-bottom: 5px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.4);
      font-weight:500
    }

    .experience-item-header,
    .project-item-header {
        display: flex;
        justify-content: space-between;
    }

    .experience-item-header-left,
    .project-item-header-left {
        flex: 1;
        text-align: left;
    }

    .experience-item-header-right,
    .project-item-header-right {
        flex: 1;
        text-align: right;
    }

    .experience-item-header-left p,
    .project-item-header-left p,
    .experience-item-header-right p,
    .project-item-header-right p {
        margin: 0;
        font-size: 12px;
        opacity: 1;
    }

    .experience-item-details,
    .project-item-details {
        margin-top: 5px;
        opacity: 1;
    }

    .experience-bullets,
    .project-bullets,
    .skills-bullets {
        margin-top: 12px;
    }

    .experience-bullets ul,
    .project-bullets ul,
    .skills-bullets ul {
        list-style-type: disc;
        padding-left: 18px;
        margin-top : 5px;
    }

    .experience-bullets li,
    .project-bullets li,
    .skills-bullets li {
        margin-bottom: 5px;
        font-size: 12px !important;
    }

    .course-work-section-content{
        border-radius: 5px;
        color: black;
        text-align: left;
    }

    .course-work-lisit-item{
      flex: 0 0 25%;
      font-size: 12px;
       padding-bottom:5px !important;
    }

    .course-work-list{
      display: flex;
      flex-wrap: wrap;
      font-size: 12px;
      text-align:left;
    }
    </style>
    </head>
    <body>
    <div class="resume-container">
    <div class="body-container">
        <header class="trigger-area">
        <div class="header">
            <h1>${resume.contact.fname + ' ' + resume.contact.lname}</h1>
        </div>
        <div class="contact-details">
            ${resume.contact.email.length > 0?`
            <i class="fa fa-envelope  icon"></i>
            <p>${resume.contact.email}</p>
            ` : ''}
            ${resume.contact.phone_number.length > 0?`
            <i class="fa fa-phone icon" style="margin-left: 12px;"></i>
            <p>${resume.contact.phone_number}</p>
            ` : ''}
            ${resume.contact.linkedIn_profile.length > 0?`
            <i class="fa fa-linkedin icon" style="margin-left: 12px;"></i>
            <a href="${resume.contact.linkedIn_profile}"> LinkedIn Profile</a>
            ` : ''}
            ${resume.contact.github_profile.length > 0?`
            <i class="fa fa-github icon" style="margin-left: 12px;"></i>
            <a  href="${resume.contact.github_profile}"> GitHub Profile</a>
            ` : ''}
        </div>
        </header>

        ${resume.profileSummary.profile_summary.length > 0?`
        <div class="summary trigger-area">
            <h2>Summary</h2>
            <p class="resume-summary" style="padding-top:12px !important">${resume.profileSummary.profile_summary}</p>
        </div>
        ` : ''}
        ${resume.experience.length > 0?`
        <div class="experience trigger-area">
            <h2>Experience</h2>
            ${this.formatTemplate3Experience(resume.experience)}
        </div>
        ` : ''}
    ${resume.project.length > 0 ? `
        <div class="project trigger-area">
            <h2>Projects</h2>
            ${this.formatTemplate3Project(resume.project)}
        </div>
    ` : ''}
    ${resume.education.length > 0 ? `
        <div class="education trigger-area">
            <h2>Education</h2>
            ${this.formatTemplate3Education(resume.education)}
        </div>
    ` : ''}
    ${resume.skill.length > 0?`
        <div class="skills trigger-area">
            <h2>Skills</h2>
            <div  class="course-work-section-content">
              <ul  class="course-work-list" style="color:black !important;padding-left: 18px;">
                ${this.formatDefaultSKillWork(resume.skill)}
              </ul>
            </div>
        </div>
    ` : ''}
    </div>
</div>
    <body>
    </html>
    `
  }


  formatTemplate3Experience(items : Array<Experience>){
    return items.map((item : Experience)=> `
                <div class="experience-item" style="margin-top:12px">
                <div class="experience-item-header">
                    <div class="experience-item-header-left">
                        <p>${item.position_title}</p>
                        <p style="color: black">${item.company_name}</p>
                    </div>
                    <div class="experience-item-header-right">
                        <p>${item.start_date} - ${item.end_date}, ${item.location}</p>
                    </div>
                </div>
                <div class="experience-bullets">
                    <ul style="margin-bottom : 0">
                    </ul>
                </div>
                </div>
    `).join('');
  }

  formatTemplate3Project(items : Array<Project>){
    return items.map((item : Project)=> `
                <div class="project-item" style="margin-top:12px">
                <div class="project-item-header">
                    <div class="project-item-header-left">
                    <p style="margin : 0"><a href="${item.project_link}" style="margin : 0;font-size:12px">${item.project_name}</a></p>
                    </div>
                </div>
                <div class="project-bullets">
                    <ul style="margin-bottom : 0">
                    </ul>
                </div>
            </div>
    `).join('');
  }

  formatTemplate3Education(items : Array<Education>){
    return items.map((item : Education)=> `
                <div class="education-details">
                <p>${item.degree}, ${item.field_of_study}</p>
                <p>${item.school_name} | ${item.graduation_date}</p>
                </div>
    `).join('');
  }

  

  getTemplate4HTMLText(resume : Resume){
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume</title>
      <script defer src="http://Workifence.com:8090/css/fontawesome/js/all.min.js"></script>
      <link href="http://Workifence.com:8090/css/template-fonts/delloite.css" id="theme-style" rel="stylesheet">
      <style>
      .resume-container {
          margin: auto;
          background-color: white;
          text-align: start !important;
      }

      .divider {
          width: 100%;
          height: 1px;
          background-color: rgba(0, 0, 0, 0.4);
      }

      .contact-details {
          display: flex;
          flex-wrap: wrap; /* Allow items to wrap */
          justify-content: center; /* Center items horizontally */
          margin: 0;
          padding: 0;
      }

      .contact-details p {
          margin: 0;
          margin-left: 12px;
          font-size: 12px;
      }

      .icon {
          color: black;
          font-size: 12px;
      }

      .summary h2 {
          margin: 0;
          font-size: 12px;
          padding: 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.4);
          font-weight:500
      }

      .summary p {
          font-size: 12px;
          margin: 0;
      }

      .education h2,
      .skills h2 {
          margin: 0;
          font-size: 12px;
          margin-bottom: 5px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.4);
          font-weight:500
      }

      .education-details{
          margin-top: 12px;
      }

      .education-details p,
      .skills-bullets p {
          margin: 0;
          font-size: 12px;
          opacity: 1;
      }

      .skills-bullets ul {
          list-style-type: disc;
          padding-left: 20px;
      }

      .skills-bullets li {
          margin-bottom: 5px;
      }

      .summary,
      .experience,
      .project,
      .education,
      .skills
      {
        margin-top : 12px;
      }

    .experience h2,
    .project h2 {
      margin: 0;
      font-size: 12px;
      margin-bottom: 5px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.4);
      font-weight:500
    }

    .experience-item-header,
    .project-item-header {
        display: flex;
        justify-content: space-between;
    }

    .experience-item-header-left,
    .project-item-header-left {
        flex: 1;
        text-align: left;
    }

    .experience-item-header-right,
    .project-item-header-right {
        flex: 1;
        text-align: right;
    }

    .experience-item-header-left p,
    .project-item-header-left p,
    .experience-item-header-right p,
    .project-item-header-right p {
        margin: 0;
        font-size: 12px;
        opacity: 1;
    }

    .experience-item-details,
    .project-item-details {
        margin-top: 5px;
        opacity: 1;
    }

    .experience-bullets,
    .project-bullets,
    .skills-bullets {
        margin-top: 12px;
    }

    .experience-bullets ul,
    .project-bullets ul,
    .skills-bullets ul {
        list-style-type: disc;
        padding-left: 18px;
        margin-top : 5px;
    }

    .experience-bullets li,
    .project-bullets li,
    .skills-bullets li {
        margin-bottom: 5px;
        font-size: 12px !important;
    }

    .course-work-section-content{
        border-radius: 5px;
        color: black;
        text-align: left;
    }

    .course-work-lisit-item{
      flex: 0 0 25%;
      font-size: 12px;
       padding-bottom:5px !important;
    }

    .course-work-list{
      display: flex;
      flex-wrap: wrap;
      font-size: 12px;
      text-align:left;
    }


      .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
      }

      .header-left {
          flex: 1;
      }

      .header-right p {
          margin: 0;
          padding: 0;
          color: #666;
          font-size: 12px;

      }

      .header-right {
          text-align: right;
      }

      .header-left h1 {
          margin: 0;
          color: #333;
      }
      
    </style>
    </head>
    <body>
      <div class="resume-container">
    <div class="body-container">
        <header class="trigger-area header">
        <div class="header-left" style="width:60%;top:0;left:0">
            <h1 style="font-size: 20px;font-weight:500 !important">${resume.contact.fname + ' ' + resume.contact.lname}</h1>
        </div>
        <div class="contact-details header-right" style="width:40%">
            ${resume.contact.email.length > 0?`
            <div style="width: 100%; float: right;display: flex;justify-content:right;align-items: center;">
                <i class="fa fa-envelope icon" style="margin-right: 5px;"></i>
                <p>${resume.contact.email}</p><br>
            </div>
            ` : ''}
            ${resume.contact.phone_number.length > 0? `
                <div style="width: 100%; float: right;display: flex;justify-content:right;align-items: center;">
                    <i class="fa fa-phone icon" style="margin-right: 5px;"></i>
                    <p>${resume.contact.phone_number}</p><br>
                </div>
            ` : ''}
            ${resume.contact.linkedIn_profile.length > 0?`
                <div style="width: 100%; float: right;display: flex;justify-content:right;align-items: center;">
                    <i class="fa fa-linkedin icon" style="margin-right: 5px;"></i>
                    <a href="${resume.contact.linkedIn_profile}" style="color: black;text-decoration: none;"> <p>${resume.contact.linkedIn_profile}</p></a><br>
                </div>
            ` : ''}
            ${resume.contact.github_profile.length > 0?`
                <div style="width: 100%; float: right;display: flex;justify-content:right;align-items: center;">
                    <i class="fa fa-github icon" style="margin-right: 5px;"></i>
                    <a  href="${resume.contact.github_profile}" style="color: black;text-decoration: none;"> <p>${resume.contact.github_profile}</p></a>
                </div>
            ` : ''}
        </div>
        </header>

         ${resume.profileSummary.profile_summary.length > 0?`
        <div class="summary trigger-area">
            <h2>Summary</h2>
            <p class="resume-summary" style="padding-top:12px !important">${resume.profileSummary.profile_summary}</p>
        </div>
        ` : ''}
        ${resume.skill.length > 0?`
        <div class="skills trigger-area">
            <h2>Skills</h2>
            <div  class="course-work-section-content">
              <ul  class="course-work-list" style="color:black !important;padding-left: 18px;">
                ${this.formatDefaultSKillWork(resume.skill)}
              </ul>
            </div>
        </div>
        ` : ''}
        ${resume.project.length > 0? `
        <div class="project trigger-area">
            <h2>Projects</h2>
            ${this.formatTemplate3Project(resume.project)}
        </div>
        ` : ''}
        ${resume.experience.length > 0? `
        <div class="experience trigger-area">
            <h2>Experience</h2>
            ${this.formatTemplate3Experience(resume.experience)}
        </div>
        ` : ''}
        ${resume.education.length > 0? `
        <div class="education trigger-area">
            <h2>Education</h2>
            ${this.formatTemplate3Education(resume.education)}
        </div>
        ` : ''}
    </div>
</div>
    <body>
    </html>
    `
  }

  formatTemplate4Project(items : Array<Project>){
    return items.map((item : Project)=> `
         <div class="project-item">
              <div class="project-item-header">
                  <div class="project-item-header-left">
                      <p><a href="${item.project_link}" style="color:black;text-decoration: none;">${item.project_name}</a></p>
                  </div>
              </div>
              <div class="project-bullets">
                  <ul>
                  </ul>
              </div>
          </div>
    `).join('');
  }

  formatTemplate4Experience(items : Array<Experience>){
    return items.map((item : Experience)=> `
         <div class="experience-item">
              <div class="experience-item-header">
                  <div class="experience-item-header-left">
                      <p>${item.position_title}</p>
                      <p>${item.company_name}</p>
                  </div>
                  <div class="experience-item-header-right">
                      <p>${item.start_date} - ${item.end_date}, ${item.location}</p>
                  </div>
              </div>
              <div class="experience-bullets">
                  <ul>
                  </ul>
              </div>
          </div>
    `).join('');
  }

  formatTemplate4Education(items : Array<Education>){
    return items.map((item : Education)=> `
          <div class="education-details">
              <p>${item.degree}, ${item.field_of_study}</p>
              <p>${item.school_name} | ${item.graduation_date}</p>
          </div>
    `).join('');
  }


  getTemplate5HTMLText(resume : Resume){
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume</title>
      <script defer src="http://Workifence.com:8090/css/fontawesome/js/all.min.js"></script>
      <link href="http://Workifence.com:8090/css/template-fonts/delloite.css" id="theme-style" rel="stylesheet">
      <style>
      .resume-container {
    // width: 100%; /* Make the container full width */
    // max-width: 940px; /* Limit maximum width */
    margin: auto;
    // position: relative;
    background-color: white;
    text-align: start !important;
}

// .body-container {
//     padding: 36px 36px 0px;
// }


.divider {
    width: 100%;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.4);
}

.contact-details {
    display: flex;
    flex-wrap: wrap; /* Allow items to wrap */
    margin: 0;
    padding: 0;
    text-align: start;
}

.contact-details p {
    margin: 0;
    margin-left: 12px;
    font-size: 12px;
}

.icon {
    color: black;
    font-size: 12px;
}

.summary {
    // margin-top: 20px;
}

.summary h2 {
    margin: 0;
    font-size: 20px;
    padding: 0;
    margin-bottom: 5px;
    font-weight: 500;
}

.summary p {
    font-size: 12px;
    margin: 0;
}

.education,
.skills {
}

.education h2,
.skills h2 {
    margin: 0;
    font-size: 20px;
    margin-bottom: 5px;
    font-weight: 500;
}

.skills{
    ul{
        margin: 0;
        padding: 0;
    }
    li{
        margin: 0;
        padding: 0;
    }
    margin: 0;
    padding: 0;
}

.education-details,
.skills-bullets {
    margin-top: 12px;
    padding: 0 !important;
    ul, li{
        padding: 0;
    }
}

.education-details p,
.skills-bullets p {
    margin: 0;
    font-size: 12px;
    opacity: 0.8;
}

.skills-bullets ul {
    list-style-type: disc;
    padding-left: 20px;
}

.skills-bullets li {
    font-size: 12px;
    margin-bottom: 5px;
}

.experience,
.project {
}

.experience h2,
.project h2 {
    margin: 0;
    font-size: 20px;
    margin-bottom: 5px;
    font-weight: 500;
}

.experience-item,
.project-item {
}

.experience-item-header,
.project-item-header {
    display: flex;
    justify-content: space-between;
}

.experience-item-header-left,
.project-item-header-left {
    flex: 1;
    text-align: left;
}

.experience-item-header-right,
.project-item-header-right {
    flex: 1;
    text-align: right;
}

.experience-item-header-left p,
.project-item-header-left p,
.experience-item-header-right p,
.project-item-header-right p {
    margin: 0;
    font-size: 12px;
    opacity: 0.8;
}

.experience-item-details,
.project-item-details {
    margin-top: 5px;
    opacity: 0.8;
}

.experience-bullets,
.project-bullets {
    margin-top: 12px;
}

.experience-bullets ul,
.project-bullets ul {
    list-style-type: disc;
    padding-left: 20px;
}

.experience-bullets li,
.project-bullets li {
    font-size: 12px;
    margin-bottom: 5px;
}

/* Media queries for responsiveness */
@media only screen and (max-width: 768px) {
    .resume-container {
        width: 100%; /* Make the container full width */
        height: auto; /* Allow height to adjust based on content */
    }

    .body-container {
        margin: 12px; /* Decrease margin for smaller screens */
    }

    .header h1 {
        font-size: 20px; /* Decrease font size for smaller screens */
    }

    .contact-details p,
    .icon {
        font-size: 12px; /* Decrease font size for smaller screens */
    }

    .summary h2 {
        font-size: 16px; /* Decrease font size for smaller screens */
    }

    .summary p {
        font-size: 12px; /* Decrease font size for smaller screens */
    }

    .education h2,
    .skills h2 {
        font-size: 16px; /* Decrease font size for smaller screens */
    }

    .education-details p,
    .skills-bullets p {
        font-size: 12px; /* Decrease font size for smaller screens */
    }

    .experience h2,
    .project h2 {
        font-size: 16px; /* Decrease font size for smaller screens */
    }

    .experience-item-header-left p,
    .project-item-header-left p,
    .experience-item-header-right p,
    .project-item-header-right p {
        font-size: 12px; /* Decrease font size for smaller screens */
    }

    .experience-bullets li,
    .project-bullets li {
        font-size: 12px; /* Decrease font size for smaller screens */
    }
}

.header {
    text-align: start;
    // padding: 20px 0;
    margin: 0;
    padding: 0;
}

.header h1 {
    white-space:0 pre-wrap;
    padding-bottom: 0px;
    font-family: 'Poppins', sans-serif;;
    text-transform: uppercase;
    color: black;
    // font-size: 34px;
    font-weight: 600 !important;
    font-size: 20px;
    margin-bottom: 4px;
}
      </style>
    </head>
    <body>
    <div class="resume-container">
    <div class="body-container">
        <header class="trigger-area">
            <div class="header">
                <h1>${resume.contact.fname + ' ' + resume.contact.lname}</h1>
            </div>
            <div class="contact-details">
                ${resume.contact.email.length > 0?`
                <i class="fa fa-envelope"></i>
                <p>${resume.contact.email}</p>
                ` : ''}
                ${resume.contact.phone_number.length > 0?`
                <i class="fa fa-phone" style="margin-left: 12px;"></i>
                <p>${resume.contact.phone_number}</p>
                ` : ''}
                ${resume.contact.linkedIn_profile.length > 0?`
                <i class="fa fa-linkedin" style="margin-left: 12px;"></i>
                <a href="${resume.contact.linkedIn_profile}"> <p>${resume.contact.linkedIn_profile}</p></a>
                ` : ''}
                ${resume.contact.github_profile.length > 0?`
                <i class="fa fa-github" style="margin-left: 12px;"></i>
                <a  href="${resume.contact.github_profile}"> <p>${resume.contact.github_profile}</p></a>
                  ` : ''}
            </div>
            </header>

        ${resume.profileSummary.profile_summary.length > 0?`
        <div class="summary trigger-area">
            <h2>Summary</h2>
            <p class="resume-summary" >${resume.profileSummary.profile_summary}</p>
        </div>
        ` : ''}
        ${resume.project.length > 0?`
        <div class="project trigger-area">
            <h2>Projects</h2>
            ${this.formatTemplate5Project(resume.project)}
        </div>
        ` : ''}
        ${resume.experience.length > 0?`
        <div class="experience trigger-area">
            <h2>Experience</h2>
            ${this.formatTemplate5Experience(resume.experience)}
        </div>

        ` : ''}
        ${resume.education.length > 0?`
        <div class="education trigger-area">
            <h2>Education</h2>
            ${this.formatTemplate5Education(resume.education)}
        </div>
        ` : ''}
        ${resume.skill.length > 0?`
        <div class="skills trigger-area">
            <h2 style="margin: 0;padding: 0;">Skills</h2>
            <div style="display: flex;width: 100%;height: auto;margin: 0;padding: 0;">
                <div style="width: 18%;margin: 0;padding: 0;">
                    
                </div>
                <div style="width: 82%;margin: 0;padding: 0;height: fit-content;">
                    <div class="skills-bullets">
                        <ul style="list-style-type: none;padding: 0;margin: 0;">
                            ${this.formatSkillListItems(resume.skill)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        ` : ''}
    </div>
</div>
    <body>
    </html>
    `
  }

  formatTemplate5Project(items : Array<Project>){
    return items.map((item : Project)=> `
        <div style="display: flex;width: 100%;height: auto;margin: 0;padding: 0;">
                <div style="width: 18%;margin: 0;padding: 0;">
                    
                </div>
                <div style="width: 82%;margin: 0;padding: 0;">
                        <div class="project-item-header">
                            <div class="project-item-header-left">
                                <p><a href="${item.project_link}" style="color: black;text-decoration: none;"><strong>${item.project_name}</strong></a></p>
                            </div>
                        </div>
                        <div class="project-bullets">
                            <ul>
                            </ul>
                        </div>
                </div>
            </div>
    `).join('');
  }

  formatTemplate5Education(items : Array<Education>){
    return items.map((item : Education)=> `
        <div style="display: flex;width: 100%;height: auto;margin: 0;padding: 0;">
              <div style="width: 18%;margin: 0;padding: 0">
                  <p style="font-size: 12px;">${item.graduation_date}</p>
              </div>
              <div style="width: 82%;margin: 0;padding: 0;">
                  <div class="education-details">
                      <p><strong>${item.degree}, ${item.field_of_study}, ${item.school_name}</strong></p>
                  </div>
              </div>
        </div>
    `).join('');
  }

  formatTemplate5Experience(items : Array<Experience>){
    return items.map((item : Experience)=> `
        <div style="display: flex;width: 100%;height: auto;margin: 0;padding: 0;">
                <div style="width: 18%;margin: 0;padding: 0;">
                    <p style="font-size: 12px;">${item.start_date} - ${item.end_date}</p>
                </div>
                <div style="width: 82%;margin: 0;padding: 0;">
                        <div class="experience-item-header">
                            <div class="experience-item-header-left">
                                <p><strong>${item.position_title}, ${item.company_name}</strong></p>
                            </div>
                        </div>
                        <div class="experience-bullets">
                            <ul>
                            </ul>
                        </div>
                       
                </div>
            </div>
    `).join('');
  }

  getTemplate6HTMLText(resume : Resume){
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume</title>
     <script defer src="http://Workifence.com:8090/css/fontawesome/js/all.min.js"></script>
      <link href="http://Workifence.com:8090/css/template-fonts/delloite.css" id="theme-style" rel="stylesheet">
      <style>
      .resume-container {
          font-family: 'Helvetica', sans-serif;
          font-size: 12px;
          text-align: start !important;
          margin : 0 !important;
      }

header {
    text-align: center;
    margin: 0px;
}
header h1 {
    font-size: 24px;
    margin: 0px;
    fornt-weight : 600 !important;
}
header p {
    font-size: 12px;
    margin: 2px 0;
}
section {
    margin: 0px;
}
.section-header {
    font-size: 12px;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 5px;
    margin-bottom: 0px;
    font-weight: 500;
}
    h3{
    font-size:12px ;
    font-weight: 500;
    }
ul {
    list-style-type: disc;
    margin-left: 16px;
}
.experience, .education, .skills, .projects {
    margin-bottom: 5px;
}
.experience h3, .education h3, .skills h3, .projects h3 {
    font-size: 12px;
    margin: 0;
}
.experience p, .education p, .skills p, .projects p {
    margin: 0;
}
.experience ul, .education ul, .skills ul, .projects ul {
    margin-top: 0px;
}
    .course-work-section-content{
        border-radius: 5px;
        color: black;
        text-align: left;
      }

      .course-work-lisit-item{
        flex: 0 0 25%;
        font-size: 12px;
         padding-bottom:5px !important;
      }

      .course-work-list{
        display: flex;
        flex-wrap: wrap;
        font-size: 12px;
        text-align:left;
      }
      </style>
    </head>
    <body>
    
<div class="resume-container">
    <header class="trigger-area">
        <h1 style="font-weight:300 !important">${resume.contact.fname + ' ' + resume.contact.lname}</h1>
        <p>${resume.contact.email} | ${resume.contact.phone_number}</p>
        <p><a href="${resume.contact.linkedIn_profile}"> LinkedIn Profile</a> | <a  href="${resume.contact.github_profile}"> Github Profile</a></p>
    </header>
    <section class="trigger-area">
        <h2 class="section-header">Objective</h2>
        <p>${resume.profileSummary.profile_summary}</p>
    </section>
    <section class="trigger-area">
        <h2 class="section-header">Experience</h2>
        ${this.formatTemplate7Experience(resume.experience)}
    </section>
    <section class="trigger-area">
        <h2 class="section-header">Skills</h2>
         <div  class="course-work-section-content">
              <ul  class="course-work-list" style="color:black !important;padding-left: 23px;">
                ${this.formatDefaultSKillWork(resume.skill)}
              </ul>
            </div>
    </section>
    <section class="trigger-area">
        <h2 class="section-header">Projects</h2>
        ${this.formatTemplate7Project(resume.project)}
    </section>
    <section class="trigger-area">
        <h2 class="section-header">Education</h2>
       ${this.formatTemplate7Education(resume.education)}
    </section>
</div>

    <body>
    </html>
    `
  }

  getTemplate7HTMLText(resume : Resume){
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume</title>
     <script defer src="http://Workifence.com:8090/css/fontawesome/js/all.min.js"></script>
      <link href="http://Workifence.com:8090/css/template-fonts/delloite.css" id="theme-style" rel="stylesheet">
      <style>
      .resume-container {
    font-family: 'Arial', sans-serif;
    color: #333;
    text-align: start !important;
    font-size:12px;
}
header {
    text-align: left;
    margin-bottom: 12px;
}
header h1 {
    font-size: 24px;
    margin-bottom: 5px;
    color: #000;
    font-weight: 600 !important
}
header p {
    font-size: 12px;
    margin: 2px 0;
}
section {
    // margin-bottom: 12px;
}
h2 {
    font-size: 12px;
    color: #000;
    font-weight: 600 !important
}
h3 {
    font-size: 12px;
    margin: 5px 0;
    color: #333;
    font-weight:500;
}
ul {
    list-style-type: disc;
    margin-left: 20px;
    margin-top:5px;
}
.experience, .education, .skills, .projects {
    margin-bottom: 5px;
}
.experience p, .education p, .skills p, .projects p {
    margin: 2px 0;
}
    .course-work-section-content{
        border-radius: 5px;
        color: black;
        text-align: left;
      }

      .course-work-lisit-item{
        flex: 0 0 25%;
        font-size: 12px;
         padding-bottom:5px !important;
      }

      .course-work-list{
        display: flex;
        flex-wrap: wrap;
        font-size: 12px;
        text-align:left;
      }
      </style>
    </head>
    <body>
    <div class="resume-container">
    <header class="trigger-area">
        <h1 style="font-weight: 300 !important">${resume.contact.fname + ' ' + resume.contact.lname}</h1>
        <p>${resume.contact.email} | ${resume.contact.phone_number}</p>
        <p><a href="${resume.contact.linkedIn_profile}"> LinkedIn Profile</a> | <a  href="${resume.contact.github_profile}"> Github Profile</a></p>
    </header>
    <section class="trigger-area" style="margin:0px;margin-top:20px">
        <h2 style="margin:0px; margin-bottom:12px;">Objective</h2>
        <p style="margin:0px">${resume.profileSummary.profile_summary}</p>
    </section>
    <section class="trigger-area" style="margin:0px;margin-top:12px">
        <h2 style="margin:0px;">Experience</h2>
        ${this.formatTemplate7Experience(resume.experience)}
    </section>
    <section class="trigger-area" style="margin:0px;margin-top:12px">
        <h2 style="margin:0px; margin-bottom:12px;">Skills</h2>
        <div  class="course-work-section-content">
              <ul  class="course-work-list" style="padding-left: 20px;color:#333">
                ${this.formatDefaultSKillWork(resume.skill)}
              </ul>
            </div>
    </section>
    <section class="trigger-area" style="margin:0px;margin-top:12px">
        <h2 style="margin:0px">Projects</h2>
        ${this.formatTemplate7Project(resume.project)}
    </section>
    <section class="trigger-area" style="margin:0px;margin-top:12px">
        <h2 style="margin:0px">Education</h2>
        ${this.formatTemplate7Education(resume.education)}
    </section>
</div>

    <body>
    </html>
    `
  }

  formatTemplate7Experience(items : Array<Experience>){
    return items.map((item : Experience)=> `
            <div class="experience" style="margin : 12px 0">
            <h3 style="font-size:12px">${item.position_title}</h3>
            <p style="opacity : 0.8; margin-top : 5px">${item.company_name}, ${item.start_date} - ${item.end_date}</p>
            <ul style="margin:0px">
            </ul>
            </div>
    `).join('');
  }

  formatTemplate7Project(items : Array<Project>){
    return items.map((item : Project)=> `
            <div class="projects" style="margin : 12px 0">
                <h3 style="font-size:12px">${item.project_name}</h3>
                <ul style="margin:0px">
                </ul>
            </div>
    `).join('');
  }

  formatTemplate7Education(items : Array<Education>){
    return items.map((item : Education)=> `
            <div class="education" style="margin : 12px 0">
                <h3>${item.school_name},  ${item.school_location}</h3>
                <p>${item.field_of_study},  ${item.degree},  ${item.graduation_date}</p>
            </div>
    `).join('');
  }

  getTemplate8HTMLText(resume : Resume){
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume</title>
      <script defer src="http://Workifence.com:8090/css/fontawesome/js/all.min.js"></script>
      <link href="http://Workifence.com:8090/css/template-fonts/delloite.css" id="theme-style" rel="stylesheet">
      <style>
          .resume-container {
    font-family: 'Tahoma', sans-serif;
    font-size: 12px;
    color: #333;
    text-align: start !important;
}
.header {
    text-align: center;
    margin-bottom: 20px;
}
.header h1 {
    font-size: 20px;
    margin-bottom: 5px;
    color: #000;
    font-weight : 500 !important
}
.header p {
    font-size: 12px;
    margin: 2px 0;
}
.section {
    margin-bottom: 20px;
}
.section-title {
    font-size: 12px;
    color: #000;
    margin-bottom: 12px;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 5px;
    display:flex;
    justify-content:center;
    align-items:center;
}
.job-title {
    font-size: 12px;
    margin: 5px 0;
    font-weight : 300 !important
}
    h3{
    font-size: 12px;
    margin: 5px 0;
    font-weight : 300 !important
    }
.company-duration {
    font-size: 12px;
    margin: 2px 0;
    color: #666;
}
ul {
    list-style-type: square !important;
    margin-left: 12px;
    margin-top:5px !important;
}
.skills ul, .projects ul {
    list-style-type: disc;
}

.course-work-section-content{
        border-radius: 5px;
        color: black;
        text-align: left;
      }

      .course-work-lisit-item{
        flex: 0 0 25%;
        font-size: 12px;
         padding-bottom:5px !important;
      }

      .course-work-list{
        display: flex;
        flex-wrap: wrap;
        font-size: 12px;
        text-align:left;
        list-style-type: square;
      }
      </style>
    </head>
    <body>
      <div class="resume-container">
    <div class="header trigger-area">
        <h1 style="font-weight: 300 !important">${resume.contact.fname + ' ' + resume.contact.lname}</h1>
        <p>${resume.contact.email} | ${resume.contact.phone_number}</p>
        <p><a href="${resume.contact.linkedIn_profile}"> LinkedIn Profile</a> | <a  href="${resume.contact.github_profile}"> Github</a></p>
    </div>
    <div class="section trigger-area" style="margin:0px;margin-top:12px">
        <div class="section-title" style="font-weight : 500 !important">Professional Summary</div>
        <p>${resume.profileSummary.profile_summary}</p>
    </div>
    <div class="section trigger-area" style="margin:0px;margin-top:12px">
        <div class="section-title" style="font-weight : 500 !important">Experience</div>
        ${this.formatTemplate8Experience(resume.experience)}
    </div>
    <div class="section trigger-area" style="margin:0px;margin-top:12px">
        <div class="section-title" style="font-weight : 500 !important">Technical Skills</div>
       <div  class="course-work-section-content">
              <ul  class="course-work-list" style="color:black !important;padding-left: 40px;">
                ${this.formatDefaultSKillWork(resume.skill)}
              </ul>
            </div>
    </div>
    <div class="section trigger-area" style="margin:0px;margin-top:12px">
        <div class="section-title" style="font-weight : 500 !important">Projects</div>
        ${this.formatTemplate8Project(resume.project)}
    </div>
    <div class="section trigger-area" style="margin:0px;margin-top:12px">
        <div class="section-title" style="font-weight : 500 !important">Education</div>
        ${this.formatTemplate8Education(resume.education)}
    </div>
</div>

    <body>
    </html>
    `
  }

  formatTemplate8Experience(items : Array<Experience>){
    return items.map((item : Experience)=> `
            <div class="experience">
            <div class="job-title"> <b>${item.position_title}</b></div>
            <div class="company-duration">${item.company_name} | ${item.start_date} - ${item.end_date}</div>
            <ul style="padding:0;margin:0px; padding-left: 50px;">
            </ul>
            </div>
    `).join('');
  }

  formatTemplate8Project(items : Array<Project>){
    return items.map((item : Project)=> `
            <div class="projects" style="margin : 12px 0">
                <div class="job-title"><b>${item.project_name}</b></div>
                <ul style="padding:0;margin:0px; padding-left: 50px;">
                </ul>
            </div>
    `).join('');
  }

  formatTemplate8Education(items : Array<Education>){
    return items.map((item : Education)=> `
          <div class="education">
            <div class="job-title">${item.school_name}, ${item.school_location}</div>
            <div class="company-duration">${item.field_of_study}, ${item.degree}, ${item.graduation_date}</div>
        </div>
    `).join('');
  }



  // ------------------------------------------------- Updated Templates -------------------------------------------


  getTemplate1HTMLV1(resumeForm : Resume){
    let firstHalfSkills = [...resumeForm.skill_v2.slice(0, Math.ceil(resumeForm.skill_v2.length/2))]
    let secondHalfSkills = [...resumeForm.skill_v2.slice(Math.ceil(resumeForm.skill_v2.length/2),)]
    console.log(resumeForm);
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Resume</title>
    <script defer src="http://Workifence.com:8090/css/fontawesome/js/all.min.js"></script>
    <link href="http://Workifence.com:8090/css/template-fonts/delloite.css" id="theme-style" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <style>
        .resume-contact-us{
          text-align: left !important;
          margin: 0px;
          padding: 0px;
        }

        .profile-full-name{
            font-family: 'Poppins', sans-serif;
            text-transform: uppercase;
            font-weight: 500 !important;
            font-size: 28px;
            margin: 0px !important;
            padding:0px !important;
            text-align: left;
            width:100%;
          }
        
          .profile-sub-title{
            font-size: 16px;
            font-weight: 400;
            margin: 0px !important;
            text-align: left;
            width: 100%;
          }

          .profile-contact-details-list{
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            justify-content: left;
            flex-wrap: wrap;
          }

          .skills-content {
            display: flex;
            flex-wrap: wrap;
            column-gap: 20px;
            row-gap: 10px;
            margin-left: 12px;
        }
         .skill-category span {
            font-weight: bold;
        }

        .skill-category {
            flex: 1 1 calc(50% - 20px); /* Two columns */
            list-style-type: disc;
            margin: 0;
            padding: 0;
        }
        .skill-category li {
            margin-bottom: 5px;
            font-size: 12px;
        }

          .contact-li{
                white-space: pre-wrap;
                font-size: 10px;
                display: flex;
                width: auto;
                margin-left: 1px;
                padding-right: 5px !important;
                padding-left: 2px;
                justify-content: center;
                align-items: center;  
                i{
                  color:  black;
                }
                span{
                    color: black;
                }
              }

        .contact-a{
                  text-decoration: underline;
                  white-space: pre-wrap;
                  font-size: 10px;
                  display: flex;
                  width: auto;
                  margin-left: 1px;
                  justify-content: center;
                  align-items: center;  
                }
        
        .contact-detail-icon{
            font-size: small;
            font-style: normal !important;
            font-variant: normal !important;
            font-weight: 400 !important;
            text-transform: none !important;
            -webkit-font-smoothing: antialiased;
        }
        
        a{
          text-decoration: underline;
        }
        
        .resume-education{
            text-align: left;
            margin-bottom: 12px;
            .education-section-title{
              font-weight: 400;
              color: black;
              text-transform: uppercase;
              border-bottom: 1px solid rgba(101, 105, 109, .5);
              white-space: pre-wrap;
              padding-bottom: 1px;
              font-size: 1rem;
              height: 25px !important;
              width: 100%;
              display: block;
              text-align: left;
              font-family: 'Poppins', sans-serif;
        
            }
            
            .education-section-content{
                padding: 0px 0px;
                border-radius: 5px;
                color: black;
                text-align: left;
        
              p{
                font-size: 12px;
                font-weight: 400;
                padding: 3px 0px;
                font-family: 'Poppins', sans-serif ;
                color: black;
                white-space: pre-wrap;
              }
            }
          
        
            &:hover{
              .add-education-icon{
                display: block;
                cursor: pointer;
                font-size: small;
              }
            }
          
          
        }
        
        .course-work{
          text-align: left;
          margin-bottom: 12px;
          .course-work-section-title{
            font-weight: 600;
            color: black;
            text-transform: uppercase;
            border-bottom: 1px solid rgba(101, 105, 109, .5);
            white-space: pre-wrap;
            padding-bottom: 1px;
            font-size: 16px;
            width: 100%;
            display: block;
            text-align: left;
            font-family: 'Poppins', sans-serif;
          }
        
          .course-work-section-content{
            padding: 6px 0px;
            border-radius: 5px;
            color: black;
            text-align: left;
        
            p{
              font-size: 12px;
              font-weight: 400;
              padding: 3px 0px;
              font-family: 'Poppins', sans-serif ;
              color: black;
              white-space: pre-wrap;
            }
        
            ol,ul{
              padding-left: 1.09rem !important;
              margin: 0 !important;
              li{
                font-size: 12px;
                font-weight: 400;
                padding: 3px 0px;
                font-family: 'Poppins', sans-serif ;
                color: black;
                white-space: pre-wrap;
              }
            }
        

        }
        
        }

        .course-work-list{
            display: flex;
            flex-wrap: wrap;
            font-size: 1rem;
            text-align:left;
          }

        .course-work-lisit-item{
              flex: 0 0 25%;
            }
        
        .project-content ol {
          padding-left: 1.09rem !important;
          margin: 0 !important;
        }
        
        .project-content ol li {
          font-size: 12px;
          font-weight: 400;
          padding: 3px 0px;
          font-family: 'Poppins', sans-serif;
          color: black;
          white-space: pre-wrap;
        }
        
        .project-content ul {
          padding-left: 1.09rem !important;
          margin: 0 !important;
        }
        
        .project-content ul li {
          font-size: 12px;
          font-weight: 400;
          padding: 3px 0px;
          font-family: 'Poppins', sans-serif;
          color: black;
          white-space: pre-wrap;
        }
        
        .project-content p {
          font-size: 12px;
          font-weight: 400;
          padding: 3px 0px;
          font-family: 'Poppins', sans-serif;
          color: black;
          white-space: pre-wrap;
          margin: 0;
        }
        
        
        
        .resume-summary{
          text-align: left;
          margin-bottom: 12px;
        }
        
        .summary-section-title{
          font-weight: 400;
          color: #384347;
          text-transform: uppercase;
          border-bottom: 1px solid rgba(101, 105, 109, .5);
          white-space: pre-wrap;
          padding-bottom: 8px;
          font-size: 16px;
          display: block;
          text-align: left;
        }
        
        .resume-summary-text{
          white-space: pre-wrap;
          text-align: left;
          font-size: 12px;
          font-weight: 400;
          padding: 6px 0px;
          font-family: 'Poppins', sans-serif ;
          color: #384347;
          margin: 0 !important;
        }
        
        
        .Section-header {
          font-size: 20px !important; /* Bold and prominent */
          font-weight: bold;
          color: #333; /* Strong, professional color */
          /* Underline with accent color */
          margin-bottom: 8px;
          padding-bottom: 4px;
        }
        
        /* Section Item Header (e.g., Job Title, Company Name) */
        .section-item-header {
          font-size: 18px !important; /* Emphasized for clarity */
          font-weight: bold;
          color: #444; /* Slightly muted compared to section header */
          margin-bottom: 5px;
        }
        
        /* Section Item Content (e.g., Job Description, Achievements) */
        .section-item-content {
          font-size: 12px !important; /* Standard content size */
          color: #555; /* Regular text color */
          margin-bottom: 10px;
        }
        
        .section-item-content ul {
          list-style-type: disc;
          margin-left: 20px;
          padding-left: 0;
        }
        
        .section-item-content li {
          margin-bottom: 5px;
        }

        li::marker{
            font-size: 8px !important; /* Adjust the size of the bullet point here */
            color: #000; /* You can also change the color of the bullet */
        }

        .education-p{
            color: #000;
            display: flex;
            font-size: 12px;
        }
        .education-p p{
            color: #000;
            padding: 0 2.5px;
            margin: 0;
            font-size: 12px;
        }
        
    </style>
    </head>
    <body>
      <div class="container">
    ${resumeForm.isSectionPresent.isContact?
     `
      <header class="trigger-area resume-contact-us" style="margin-bottom:15px;">
        <div style="display:flex;flex-direction:column;"> 
            <span class="profile-full-name" style="margin:0;padding:0;" id="resumeName">${resumeForm.contact.fname + ' ' + resumeForm.contact.lname}</span>
            <span class="profile-sub-title" style="margin:0;padding:0;padding-bottom:5px">${resumeForm.contact.subTitle}</span>
        </div>
        <div>
              <ul class="profile-contact-details-list">
                  ${resumeForm.contact.phone_number.length > 0?
                    `
                  <li class="contact-li"><span class="material-icons contact-detail-icon">phone</span> ${resumeForm.contact.phone_number}</li>
                  ` : ''
                  }
                  ${resumeForm.contact.email.length > 0?
                    `
                  <li class="contact-li"><span class="material-icons contact-detail-icon">alternate_email</span> ${resumeForm.contact.email}</li>
                  ` : ''
                  }
                  ${resumeForm.contact.linkedIn_profile.length > 0?
                    `
                  <li class="contact-li"><i class="fab fa-linkedin contact-detail-icon"></i> <a href="${resumeForm.contact.linkedIn_profile}" class="contact-a" style="color:#000000DE"> ${resumeForm.contact.linkedIn_profile_display_name}</a></li>
                  ` : ''
                  }
                  ${resumeForm.contact.github_profile.length > 0?
                    `
                  <li class="contact-li"><i class="fab fa-github contact-detail-icon"></i> <a  href="${resumeForm.contact.github_profile}" class="contact-a" style="color:#000000DE"> ${resumeForm.contact.github_profile_display_name}</a></li>
                  ` : ''
                  }
              </ul>
        </div>
      </header>
      ` : ''
    }
  
      ${(resumeForm.profileSummary.profile_summary.length > 0 && resumeForm.isSectionPresent.isSummary)?
        `
        <section class="trigger-area resume-summary">
          <span class="summary-section-title">Summary</span>
          <div class="project-content">
          ${
          resumeForm.profileSummary.profile_summary
          }
          </div>
        </section>
        ` : ''
      }
  
      ${(resumeForm.education.length > 0 && resumeForm.isSectionPresent.isEducation)?
        `
        <section  class="trigger-area resume-education">
            <span class="summary-section-title">Education</span>  
            ${this.formatHTMLTemplate1EducationV1(resumeForm.education)}        
        </section>
        ` : ''
      }
      
  
      ${(resumeForm.courseWork.length > 0 && resumeForm.isSectionPresent.isCourseWork)?
        `
        <section  class="trigger-area course-work">
          <span class="summary-section-title">Relevant Coursework</span>
          <div  class="course-work-section-content project-content" style="margin-top:7px;">
              <ul class="course-work-list">
                ${this.formatHTMLTemplate1CourseWorkV1(resumeForm.courseWork)}
              </ul>
          </div>
        </section>
        ` : ''
      }
  
      ${(resumeForm.isSectionPresent.isSkill && resumeForm.skill.length > 0)?
        `
        <section  class="trigger-area course-work">
          <span class="summary-section-title">Skills</span>
          <div  class="course-work-section-content project-content" style="margin-top:7px;">
              <ul class="course-work-list">
                ${this.formatHTMLTemplate1SkillWorkV1(resumeForm.skill)}
              </ul>
          </div>
        </section>
        ` : ''
      }

      ${resumeForm.skill_v2.length > 0 && resumeForm.isSectionPresent?.isSkillV2?
          `
        <section  class="trigger-area course-work">
            <div class="section-title">Skills</div>
            <div class="skills-content">
                <ul class="skill-category">
                ${this.formatSkillsTemplate10(firstHalfSkills)}
                </ul>
                <ul class="skill-category">
                    ${this.formatSkillsTemplate10(secondHalfSkills)}
                </ul>
            </div>
        </section>
        ` : ''
        }

      ${(resumeForm.experience.length > 0 && resumeForm.isSectionPresent.isExperience)?
        `
        <section class="course-work section-details trigger-area">
            <span class="summary-section-title">Experience</span>  
            ${this.formatHTMLTemplate1ExperienceV1(resumeForm.experience)}
        </section>
        ` : ''
      }
  
      ${(resumeForm.project.length > 0 && resumeForm.isSectionPresent.isProject)?
        `
        <section class="course-work section-details trigger-area">
            <span class="summary-section-title">Projects</span>
            ${this.formatHTMLTemplate1ProjectV1(resumeForm.project)}  
        </section>
        ` : ''
      }
      
  
      ${(resumeForm.certification.length > 0 && resumeForm.isSectionPresent.isCertification)?
        `
        <section class="course-work section-details trigger-area">
            <span class="summary-section-title">Certifications</span>  
            ${this.formatHTMLTemplate1CertificationV1(resumeForm.certification)}
        </section>
        ` : ''
      }
  
      ${(resumeForm.achievement.ach.length > 0 && resumeForm.isSectionPresent.isAchievement)?
        `
        <section  class="trigger-area course-work trigger-area">
          <span class="summary-section-title">Achievements</span>
          <div  class="course-work-section-content">
          <div class="project-content">
            ${
            resumeForm.achievement.ach
            }
            </div>
          </div>
        </section>
        ` : ''
      }
    </div>
    </body>
    </html>
    `
  }


  public formatHTMLTemplate1EducationV1(items : Education[]) : string{
    return items.map((item : Education)=> 
    `
    <div class="education-section-content template1-section-content trigger-area" style="margin-top:7px;">
        <div style="display: flex;justify-content: space-between;">
            <div style="flex: 1;text-align: left;margin:0;padding:0;" class="project-content">
            ${(item.degree.length > 0 && item.field_of_study.length >0) ?
                `
                <p class="qualification-name" style="margin:0;padding:0;"><b>${item.degree}, ${item.field_of_study}</b></p>
                ` : ''
            }
            ${(item.degree.length > 0 && item.field_of_study.length == 0)?
                `
                <p class="qualification-name" style="margin:0;padding:0;"><b>${item.degree}</b></p>
                ` : ''
            }
            ${(item.field_of_study.length>0 && item.degree.length == 0)?
                `
                <p class="qualification-name" style="margin:0;padding:0;"><b>${item.field_of_study}</b></p>
                ` : ''
            }
            </div>
            ${item.school_location.length > 0?
                `
            <div style="flex: 1;text-align: right;margin:0;padding:0;" class="project-content">
                <p class="qualification-name" style="margin:0;padding:0;">${item.school_location}</p></div>
            </div>
            ` : ''
            }
        <div style="display: flex;justify-content: space-between;margin:0;padding:0;" class="project-content">
            ${item.school_name.length > 0?
                `
            <div style="flex: 1;text-align: left;margin:0;padding:0;">
            <p class="qualification-name" style="margin:0;padding:0;">${item.school_name}</p></div>
            ` : ''
            }
            ${item.graduation_date.length > 0?
                `
            <div style="flex: 1;text-align: right;margin:0;padding:0;" class="project-content">
            <p class="qualification-name" style="margin:0;padding:0;">${item.graduation_date}</p></div>
            ` : ''
            }
        </div>
        ${item.gpa.length > 0?
            `
        <div style="margin:0;padding:0;">
            <div style="flex: 1;text-align: left;margin:0;padding:0;" class="project-content">
            <p class="qualification-name" style="margin:0;padding:0;">GPA - ${item.gpa}</p></div>
        </div>
        ` : ''
        }
    </div>
    `).join('');
  }


  public formatHTMLTemplate1SkillWorkV1(items : Skill[]) : string{
    return items.map((item : Skill)=> 
    `
    ${items.length > 0 ?
        `
    <li class="course-work-lisit-item" style="margin:0;padding:0;">${item.name}</li>
    ` : ''
    }
    `).join('');
  }

    public formatHTMLTemplate1CourseWorkV1(items : string[]) : string{
    return items.map((item : string)=> 
    `
    ${item.length > 0 ?
        `
    <li class="course-work-lisit-item" style="margin:0;padding:0;">${item}</li>
    ` : ''
    }
    `).join('');
  }


  public formatHTMLTemplate1ProjectV1(items : Project[]) : string{
    return items.map((item : Project)=> 
    `
    <div  class="course-work-section-content template1-section-content trigger-area" style="margin-top:7px;">
        ${item.project_name.length > 0?
            `
          <div style="flex: 1;text-align: left;margin:0;padding:0;" class="project-content">
            <div class="education-p">
                ${item.project_name.length > 0 && item.project_link.length>0?
                `
                    <p style="margin:0;padding:0;"><a style="color:#000000DE" href="${item.project_link}"><b>${item.project_name}</b></a></p>
                ` : ''
                }
                ${item.project_name.length > 0 && item.project_link.length==0?
                `
                    <p style="margin:0;padding:0;"><b>${item.project_name}</b></p>
                ` : ''
                }
                ${item.project_name.length > 0 && item.technologies_used.length > 0?
                `
                    <p>|</p>
                ` : ''
                }
                ${item.technologies_used.length > 0?
                `
                    <p>{{item.technologies_used}}</p>
                ` : ''
                }
            </div> 
        </div>
        ` : ''
        }
        <div class="project-content-container" style="margin:0;padding:0;">
        <div class="project-content">
            ${
              item.description
            }
        </div>
        </div>
    </div>
    `).join('');
  }


  public formatHTMLTemplate1ExperienceV1(items : Experience[]) : string{
    return items.map((item : Experience)=> 
    `
    <div class="course-work-section-content template1-section-content trigger-area" style="margin-top:7px">
        <div style="display: flex;justify-content: space-between;margin:0;padding:0;" class="project-content">
            <p style="flex: 1;text-align: left;margin: 0;padding:0;"><b>${item.position_title}</b>, ${item.company_name}</span></p>
            ${item.start_date.length > 0?
            `
            <p style="flex: 1;text-align: right;margin:0;padding:0;">${item.start_date} - ${item.end_date}</p>
            ` : ''
            }
        </div>
        <div class="project-content-container" style="margin:0;padding:0;">
        <div class="project-content">
        ${
          item.description
        }
        </div>
        </div>
    </div>
    `).join('');
  }


  public formatHTMLTemplate1CertificationV1(items : Certification[]) : string{
    return items.map((item : Certification)=> 
    `
    <div class="course-work-section-content template1-section-content trigger-area" style="margin-top:5px;">
          <div style="display: flex;justify-content: space-between;margin:0;padding:0;" class="project-content">
          <p style="flex: 1;text-align: left;margin: 0;padding:0;"><a href="${item.certification_link}" style="margin: 0;padding: 0;color:#000000DE">${item.certification_name}</a>, ${item.issued_organisation}</p>
          <p style="flex: 1;text-align: right;margin:0;padding:0;">${item.issued_month} ${item.issued_year}</p>
          </div>
      </div>
    `).join('');
  }


  getTemplate9HTMLV1(resumeForm : Resume){
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Resume</title>
    <style>
      .container {
          margin: 0;
          //font-family: Arial, sans-serif;
          color: #333;
          box-sizing: border-box;
      }

      /* Layout */
      .container {
          box-sizing: border-box;
          background-color: #fff;
      }

      .main-content {
          display: grid;
          grid-template-columns: 65% 35%;
          gap: 10px; /* Adjust the gap between columns as needed */
      }

      .sidebar {
          display: block;
          padding: 15px;
          background-color: rgb(242, 246, 248);
          border-radius: 5px;
      }


      .header {
          grid-column: 1 / -1;
          text-align: left;
          padding-bottom: 0;
          margin-bottom: 10px;
      }

      .header-h1 {
          margin: 0;
          font-weight: 500 !important;
          font-size: 32px;
          color: #2a7ae4;
      }

      .header-title {
          color: #555;
          margin: 5px 0px 5px 0px;
          font-size: 18px;
          font-weight: 400;
      }

      .header-summary {
          font-size: 12px;
          font-weight: 400;
          color: #666;
          margin: 0px;
      }

      .work-experience{
          padding-right: 15px;
          padding-left: 0;
          padding-top: 0;
          padding-bottom: 0;
      }

      .work-experience-h2 {
          font-size: 16px;
          font-weight: 400;
          color: #2a7ae4;
          margin: 0;
          margin-bottom: 8px;
          border-bottom: 2px solid #ddd;
          padding-bottom: 8px;
          text-transform: uppercase;
      }

      .job {
          margin-bottom: 8px;
          gap: 10px;
          align-items: start;
      }

      .job-h3 {
          font-size: 12px;
          font-weight: 400;
          margin: 0;
      }

      .job-date {
          font-size: 12px;
          font-weight: 400;
          color: #777;
          margin: 0;
      }

      .job-company {
          font-size: 12px;
          font-weight: 400;
          color: #555;
          margin-bottom: 10px;
          grid-column: 1 / -1;
          margin: 0;
      }

      .job-ul {
          margin: 0;
          padding-left: 20px;
          grid-column: 1 / -1;
          margin: 0;
      }

      .job-ul-li {
          font-size: 12px;
          font-weight: 400;
          margin-bottom: 5px;
      }

      .contact-ul
      {
          margin: 0;
          padding: 5px 17px;
      }
      
      .skills-ul {
          margin: 0;
          padding: 5px 17px;
      }

      .contact-ul-li{
          margin-bottom: 3px;
          font-size: 12px;
          font-weight: 400;
      }

      .skills-ul-li {
          margin-bottom: 3px;
          font-size: 12px;
          font-weight: 400;
      }

      .contact-ul-li-a {
          color: #2a7ae4;
          text-decoration: none;
      }

      .skills-h2{
          font-size: 16px;
          font-weight: 400;
          color: #2a7ae4;
          margin-bottom: 8px;
          border-bottom: 2px solid #ddd;
          padding-bottom: 8px;
          text-transform: uppercase;
      } 
      
      .education-h2{
          font-size: 16px;
          font-weight: 400;
          color: #2a7ae4;
          margin-bottom: 8px;
          border-bottom: 2px solid #ddd;
          padding-bottom: 8px;
          text-transform: uppercase;
      }
       
      .contact-h2{
          font-size: 16px;
          font-weight: 400;
          color: #2a7ae4;
          margin-bottom: 8px;
          border-bottom: 2px solid #ddd;
          padding-bottom: 8px;
          text-transform: uppercase;
      }

      .skill-item{
          margin-top: 5px;
          margin-bottom: 0;
          font-size: 12px;
          font-weight: 400;
      }

      .contact-h2{
          margin-top: 0;
      }

      .education {
          margin-top: 20px;
      }

      .education-p {
          margin: 5px 0;
          font-size: 12px;
          font-weight: 400;
      }

      .skill-items{
          display:flex;
          flex-wrap: wrap;
          gap: 5px;
      }

      .skill-item{
          padding: 5px 10px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 5px;
          font-size: 12px;
          font-weight: 400;
      }

      .project-content ol {
          padding-left: 1.09rem !important;
          margin: 0 !important;
        }
        
        .project-content ol li {
          font-size: 12px;
          font-weight: 400;
          padding: 3px 0px;
          font-family: 'Poppins', sans-serif;
          color: black;
          white-space: pre-wrap;
        }
        
        .project-content ul {
          padding-left: 1.09rem !important;
          margin: 0 !important;
        }
        
        .project-content ul li {
          font-size: 12px;
          font-weight: 400;
          padding: 3px 0px;
          font-family: 'Poppins', sans-serif;
          color: black;
          white-space: pre-wrap;
        }
        
        .project-content p {
          font-size: 12px;
          font-weight: 400;
          padding: 3px 0px;
          font-family: 'Poppins', sans-serif;
          color: black;
          white-space: pre-wrap;
          margin: 0;
        }
    </style>
    </head>
    <body>
    <div class="container">    
        <div class="main-content">
            <section class="work-experience">
                <div class="header">
                    <h1 class="header-h1">${resumeForm.contact.fname + ' ' + resumeForm.contact.lname}</h1>
                    ${resumeForm.contact.subTitle.length > 0 ?
                    `
                    <p class="header-title">${resumeForm.contact.subTitle}</p>
                    ` : ''}
                    ${resumeForm.profileSummary.profile_summary.length > 0 && resumeForm.isSectionPresent?.isSummary ? 
                    `
                    <div class="project-content">
                    ${resumeForm.profileSummary.profile_summary}
                    </div>
                    ` : ''}
                </div>
                ${resumeForm.experience.length > 0 && resumeForm.isSectionPresent?.isExperience? 
                `
                <h2 class="work-experience-h2">Work Experience</h2>
                ${this.formatHTMLTemplate9Experience(resumeForm.experience)}
                ` : ''}

                ${resumeForm.project.length > 0 && resumeForm.isSectionPresent?.isProject?
                `
                <h2 class="work-experience-h2">Project</h2>
                ${this.formatHTMLTemplate9Project(resumeForm.project)}
                ` : ''
                }
            </section>

            <div class="sidebar">
                ${resumeForm.isSectionPresent?.isContact?
                `
                <section class="contact">
                    <h2 class="contact-h2">Contact</h2>
                    <ul class="contact-ul">
                        ${resumeForm.contact.phone_number.length > 0?
                        `
                        <li class="contact-ul-li">${resumeForm.contact.phone_number}</li>
                        ` : ''
                        }
                        ${resumeForm.contact.email.length > 0?
                        `
                        <li class="contact-ul-li"><a href="mailto:${resumeForm.contact.email}" class="contact-ul-li-a">${resumeForm.contact.email}</a></li>
                        ` : ''
                        }
                        ${resumeForm.contact.linkedIn_profile.length > 0?
                        `
                        <li class="contact-ul-li"><a href="${resumeForm.contact.linkedIn_profile}" class="contact-ul-li-a">${resumeForm.contact.linkedIn_profile_display_name}</a></li>
                        ` : ''
                        }
                        ${resumeForm.contact.github_profile.length > 0?
                        `
                        <li class="contact-ul-li"><a href="${resumeForm.contact.github_profile}" class="contact-ul-li-a">${resumeForm.contact.github_profile_display_name}</a></li>
                        ` : ''
                        }
                    </ul>
                </section>
                ` : ''
                }

                ${resumeForm.isSectionPresent?.isCourseWork && resumeForm.courseWork.length > 0?
                `
                <section class="skills">
                    <h2 class="skills-h2">Courseworks</h2>
                    <div class="skill-items">
                        ${this.formatHTMLTemplate9CourseWork(resumeForm.courseWork)}
                    </div>
                </section>
                ` : ''
                }

                ${resumeForm.isSectionPresent?.isSkill && resumeForm.skill.length > 0?
                `
                <section class="skills">
                    <h2 class="skills-h2">Skills</h2>
                    <div class="skill-items">
                        ${this.formatHTMLTemplate9SkillWork(resumeForm.skill)}
                    </div>
                </section>
                ` : ''
                }

                ${resumeForm.education.length > 0 && resumeForm.isSectionPresent?.isEducation?
                `
                <section class="education">
                    <h2 class="education-h2">Education</h2>
                    ${this.formatHTMLTemplate9Education(resumeForm.education)}
                </section>
                ` : ''
                }

                ${(resumeForm.skillsCategory.point.length > 0 && resumeForm.isSectionPresent?.isSkillsCategory)?
                `
                <section class="skills">
                    <h2 class="skills-h2">Certifications</h2>
                    <div class="project-content">
                    ${resumeForm.skillsCategory.point}
                    </div>
                </section>
                ` : ''
                }

                ${!resumeForm.achievement.isDefault && resumeForm.isSectionPresent?.isAchievement?
                    `
                    <section class="skills">
                        <h2 class="skills-h2">Achievements</h2>
                        <div class="project-content">
                        ${resumeForm.achievement.ach}
                        </div>
                    </section>
                    ` : ''
                }
            </div>
        </div>
    </div>
    </body>
    </html>
    `
  }

  public formatHTMLTemplate9Experience(items : Experience[]) : string{
    return items.map((item : Experience)=> 
    `
    <div class="job">
        <div style="display: flex;justify-content: space-between;margin:0;padding:0;" class="project-content">
          <p  class="job-h3" style="flex: 1;text-align: left;margin: 0;padding:0;margin-bottom:5px;"><b>${item.position_title}</b></p>
          <p class="job-date" style="flex: 1;text-align: right;margin:0;padding:0;">${item.start_date} - ${item.end_date}</p>
        </div>
        <p class="job-company" style="margin:0;padding:0;margin-bottom:5px;">${item.company_name}, ${item.location}</p>
        <div class="project-content">
        ${item.description}
        </div>
    </div>
    `).join('');
}


public formatHTMLTemplate9Project(items : Project[]) : string{
    return items.map((item : Project)=> 
    `
    <div class="job">
        <div style="display: flex;justify-content: space-between;margin:0;padding:0;" class="project-content">
          <p  class="job-h3" style="flex: 1;text-align: left;margin: 0;padding:0;margin-bottom:5px;"><a href="${item.project_link}" style="color:black;text-decoration: none;"><b>${item.project_name}</b></a></p>
        </div>
        <p class="job-company" style="margin:0;padding:0;margin-bottom:5px;">${item.technologies_used}</p>
        <div class="project-content">
        ${item.description}
        </div>
    </div>
    `).join('');
}


public formatHTMLTemplate9SkillWork(items : Skill[]) : string{
    return items.map((item : Skill)=> 
    `
    <div class="skill-item">
        ${item.name}
    </div>
    `).join('');
}

public formatHTMLTemplate9CourseWork(items : string[]) : string{
    return items.map((item : string)=> 
    `
    <div class="skill-item">
        ${item}
    </div>
    `).join('');
}

public formatHTMLTemplate9Education(items : Education[]) : string{
    return items.map((item : Education)=> 
    `
    <div class="edu-item project-content" style="margin-bottom: 5px;">
        <p><b>${item.school_name}</b></p>
        <p>${item.degree}, ${item.field_of_study}</p>
        <p>${item.school_location} - ${item.graduation_date}</p>
    </div>
    `).join('');
}


public formatTemplate10HTML(resumeForm : Resume){
  let firstHalfSkills = [...resumeForm.skill_v2.slice(0, Math.ceil(resumeForm.skill_v2.length/2))]
  let secondHalfSkills = [...resumeForm.skill_v2.slice(Math.ceil(resumeForm.skill_v2.length/2),)]
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume</title>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet">
      <style>
        .container {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 0;
            color: #000;
            opacity: 0.85;
        }
        .header {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }
        .name {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 5px;
            border-bottom: 2px solid #39A5B7;
            width: 100%;
            font-family: 'Merriweather', sans-serif;
        }
        .contact {
            font-size: 10px;
            color: #000;
            padding-bottom: 5px;
            display: flex;
        }
        .contact p{
            font-size: 10px;
            padding: 0px 2.5px;
            margin: 0;
        }
        .section {
            margin-top: 10px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px !important;
            padding-bottom: 2px;
            display: flex;
            align-items: flex-start;
        }
        .education .degree {
            font-style: italic;
            font-weight: normal;
        }
        .education-p{
            color: #000;
            display: flex;
            font-size: 12px;
        }
        .education-p p{
            color: #000;
            padding: 0 2.5px;
            margin: 0;
            font-size: 12px;
        }
        .experince p{
            color: #000;
            font-size: 12px;
        }
        .skills-content {
            display: flex;
            flex-wrap: wrap;
            column-gap: 20px;
            row-gap: 10px;
            margin-left: 12px;
        }
        .skill-category {
            flex: 1 1 calc(50% - 20px); /* Two columns */
            list-style-type: disc;
            margin: 0;
            padding: 0;
        }
        .skill-category li {
            margin-bottom: 5px;
            font-size: 12px;
        }
        .experince ul{
            padding: 0;
            margin-left: 12px;
            margin-top: 5px;
            margin-bottom: 0;
        }
        .experince li{
            margin-bottom: 5px;
            font-size: 12px;
        }
        .experince li::marker{
            font-size: 8px; /* Adjust the size of the bullet point here */
            color: #000; /* You can also change the color of the bullet */
        }
        .experince p{
            font-size: 12px;
            margin: 0;
        }
        .skill-category li::marker {
            font-size: 8px; /* Adjust the size of the bullet point here */
            color: #000; /* You can also change the color of the bullet */
        }
        .skill-category span {
            font-weight: bold;
            font-style: italic;
        }

        .experience-container{
          display: flex;
          flex-direction: column;
        }

        .project-content ol {
          padding-left: 1.09rem !important;
          margin: 0 !important;
        }
        
        .project-content ol li {
          font-size: 12px;
          font-weight: 400;
          padding: 0px 0px 0px 0px;
          font-family: 'Roboto', sans-serif;
          color: black;
          white-space: pre-wrap;
        }
        
        .project-content ul {
          padding-left: 1.09rem !important;
          margin: 0 !important;
        }
        
        .project-content ul li {
          font-size: 12px;
          font-weight: 400;
          padding: 0px 0px 0px 0px;
          font-family: 'Roboto', sans-serif;
          color: black;
          white-space: pre-wrap;
        }
        
        .project-content p {
          font-size: 12px;
          font-weight: 400;
          padding: 0px 0px 0px 0px;
          font-family: 'Roboto', sans-serif;
          color: black;
          white-space: pre-wrap;
          margin: 0;
        }
        
        .project-content a {
          font-size: 12px;
          font-weight: 400;
          font-family: 'Roboto', sans-serif;
          color: black;
          white-space: pre-wrap;
          margin: 0;
        }
      </style>
  </head>
  <body>
      <div class="container">
    
      <div class="header">
        <div class="name">${resumeForm.contact.fname + ' ' + resumeForm.contact.lname}</div>
        <div class="contact">
        ${resumeForm.contact.address.length > 0?
        `
        <p style="padding-left: 0;">${resumeForm.contact.address}</p>
        ` : ''
        } 
        ${resumeForm.contact.phone_number.length > 0 && resumeForm.contact.address.length > 0?
        `
        <p>|</p>   
        ` : ''
        }
        ${resumeForm.contact.phone_number.length > 0?
        `
        <p>${resumeForm.contact.phone_number}</p>
        ` : ''
        }
        ${resumeForm.contact.email.length > 0?
        `
        <p>|</p>
        ` : ''   
        }
        ${resumeForm.contact.email.length > 0?
        `
        <p>${resumeForm.contact.email}</p>
        ` : ''
        }
        ${resumeForm.contact.linkedIn_profile.length > 0?
        `
        <p>|</p>   
        ` : ''
        }
        ${resumeForm.contact.linkedIn_profile.length > 0?
        `
        <p><a href="${resumeForm.contact.linkedIn_profile}" target="_blank" style="color: #39A5B7; text-decoration: none;">${resumeForm.contact.linkedIn_profile_display_name}</a></p>
        ` : ''
        }
        ${resumeForm.contact.github_profile.length > 0?
        `
        <p>|</p>   
        ` : ''
        }
        ${resumeForm.contact.github_profile.length > 0?
        `
        <p><a href="${resumeForm.contact.github_profile}" target="_blank" style="color: #39A5B7; text-decoration: none;">${resumeForm.contact.github_profile_display_name}</a></p>
        ` : ''
        }
        </div>
    </div>

    ${resumeForm.profileSummary.profile_summary.length > 0 && resumeForm.isSectionPresent?.isSummary?
      `
      <div class="section">
        <span class="section-title">Profile Summary</span>
        <div class="project-content-container" style="margin:0;padding:0;">
          <div class="project-content">
              ${
                resumeForm.profileSummary.profile_summary
              }
          </div>
          </div>
      </div>
      ` : ''
    }


      ${resumeForm.education.length > 0 && resumeForm.isSectionPresent?.isEducation?
      `
      <div class="section education">
          <div class="section-title">Education</div>
          ${this.formatEducationTemplate10(resumeForm.education)}
      </div>
      `: ''
      }

      ${resumeForm.skill_v2.length > 0 && resumeForm.isSectionPresent?.isSkillV2?
          `
        <div class="section skills">
            <div class="section-title">Skills</div>
            <div class="skills-content">
                <ul class="skill-category">
                ${this.formatSkillsTemplate10(firstHalfSkills)}
                </ul>
                <ul class="skill-category">
                    ${this.formatSkillsTemplate10(secondHalfSkills)}
                </ul>
            </div>
        </div>
        ` : ''
        }

        ${resumeForm.accomplishment.length > 0 && resumeForm.isSectionPresent?.isAccomplishments?
        `
        <div class="section education">
            <div class="section-title">Accomplishments</div>
            ${this.formatAccomplishmentsTemplate10(resumeForm.accomplishment)}
        </div>
        ` : ''
        }
      

        ${resumeForm.experience.length > 0 && resumeForm.isSectionPresent?.isExperience?
        `
        <div class="section experince trigger-area">
            <div class="section-title">Experience</div>
            ${this.formatExperienceTemplate10(resumeForm.experience)}
        </div>
        ` : ''
        }
      
        ${resumeForm.project.length > 0 && resumeForm.isSectionPresent?.isProject?
        `
        <div class="section experince trigger-area">
            <div class="section-title">Projects</div>
            ${this.formatProjectTemplate10(resumeForm.project)}
        </div>
        ` : ''
        }
  </div>
  </body>
  </html>

  `
}


formatEducationTemplate10(items : Education[]){
  return items.map((item : Education)=> 
  `
      <div class="education-p">
      ${item.degree.length > 0?
          `
          <p style="padding-left: 0;"><b>${item.degree}</b></p>
          ` : ''
      }
      ${item.degree.length > 0 && item.school_name.length > 0?
          `
          <p>|</p>
          ` : ''
      }
      ${item.school_name.length > 0?
          `
          <p><b>${item.school_name}</b></p>
          ` : ''
      }
      ${item.graduation_date.length > 0?
          `
          <p>|</p>
          ` : ''
      }
      ${item.graduation_date.length > 0?
          `
          <p><b>${item.graduation_date}</b></p>
          ` : ''
      }
      ${item.gpa.length > 0?
          `
          <p>|</p>
          ` : ''
      }
      ${item.gpa.length > 0?
          `
          <p><b>${item.gpa} GPA</b></p>
          ` : ''
      }
  </div>
  `).join('');
}

formatSkillsTemplate10(items : SkillV2[]){
  return items.map((item : SkillV2)=> 
  `
  <li><span>${item.sub_title}:</span> ${item.skills.join(', ')}</li>
  `).join('');
}

formatAccomplishmentsTemplate10(items : Accomplishment[]){
  return items.map((item : Accomplishment)=> 
  `
      <div class="experience-container" style="margin-top:7px">
        <div style="display: flex;justify-content: space-between;margin:0;padding:0;">
            <p style="flex: 1;text-align: left;margin: 0;padding:0;font-size: 12px;color: #000;"><b>${item.accomplisment}</b></p>
            <p style="text-align: right;margin:0;padding:0;font-size: 12px;">${item.date}</p>
        </div>
        <div class="project-content-container" style="margin:0;padding:0;">
          <div class="project-content">
              ${
                item.description
              }
          </div>
          </div>
    </div>
  `).join('');
}

formatExperienceTemplate10(items : Experience[]){
  return items.map((item : Experience)=> 
  `
  <div class="experience-container" style="margin-top:7px">
      <p style="font-size: 12px;margin: 0;"><b>${item.position_title} | ${item.company_name} | ${item.start_date} - ${item.end_date}</b></p>
      <div class="project-content-container" style="margin:0;padding:0;">
          <div class="project-content">
              ${
                item.description
              }
          </div>
      </div>   
  </div>
  `).join('');
}

formatProjectTemplate10(items : Project[]){
  return items.map((item : Project)=> 
  `
  <div class="experience-container" style="margin-top:7px">
      <p style="font-size: 12px;margin: 0;"><b>${item.project_name} | ${item.period}</b></p>
      <div class="project-content-container" style="margin:0;padding:0;">
          <div class="project-content">
              ${
                item.description
              }
          </div>
      </div>   
  </div>
  `).join('');
}


}
