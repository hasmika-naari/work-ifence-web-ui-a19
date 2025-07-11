import { Injectable } from '@angular/core';
import { Accomplishment, Certification, Education, Experience, Project, Resume, Skill, SkillV2 } from '../resume.model';
import { SectionDesc } from '../store/user-store';

@Injectable({
  providedIn: 'root',
})
export class Templatesv2Service {

    constructor() {}

    getFormatedResumeHTMLText(template_name : String, resume : Resume){    
      if(template_name == "TEMPLATE_1"){
        return this.getHTMLTemplateForMonoPro(resume);
      }
      else if(template_name == 'TEMPLATE_9'){
        return this.getHTMLTemplateForDualEdge(resume);
      }
      else if(template_name == 'TEMPLATE_10'){
        return this.getHTMLTemplateForModern(resume);
      } 
      return "";
    }

    getHTMLTemplateForMonoPro(resumeForm : Resume){
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
            font-size:12px !important;
            font-family: 'Poppins', sans-serif;
        }
         .skill-category-span {
            font-weight: 400 !important;
            font-size:12px;
        }

        .skill-category {
            flex: 1 1 calc(50% - 20px); /* Two columns */
            list-style-type: disc;
            margin: 0;
            padding: 0;
        }
        .skill-category-li {
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
            margin-bottom: 14px;
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
    ${
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
      ` 
    }
       ${this.getFormattedSectionsForMonoPro(resumeForm)}
      
    </div>
    </body>
    </html>
        `
    }

    getFormattedSectionsForMonoPro(resume : Resume){
        let firstHalfSkills = [...resume.skill_v2.slice(0, Math.ceil(resume.skill_v2.length/2))]
        let secondHalfSkills = [...resume.skill_v2.slice(Math.ceil(resume.skill_v2.length/2),)]
        return resume.sections.map((e : SectionDesc)=>
        `
        ${
            e.section == 'PROFILE_SUMMARY'?
            `
            ${(resume.profileSummary.profile_summary.length > 0)?
            `
            <section class="trigger-area resume-summary">
                <span class="summary-section-title">Summary</span>
                <div class="project-content">
                ${
                    resume.profileSummary.profile_summary
                }
                </div>
            </section>
            ` : ''
            }`:
            e.section == 'EDUCATION'?
            `
            ${(resume.education.length > 0)?
            `
            <section  class="trigger-area resume-education">
                <span class="summary-section-title">Education</span>  
                ${this.getEducationSectionForMonoPro(resume.education)}        
            </section>
            ` : ''
            }`:
             e.section == 'RELEVANT_COURSEWORK'?
            `
            ${(resume.courseWork.length > 0)?
            `
            <section  class="trigger-area course-work">
                <span class="summary-section-title">Relevant Coursework</span>
                <div  class="course-work-section-content project-content" style="margin-top:7px;">
                    <ul class="course-work-list">
                        ${this.getCourseWorkSectionForMonoPro(resume.courseWork)}
                    </ul>
                </div>
            </section>
            ` : ''
            }`:
            e.section == 'SKILLS_BULLET_POINTS'?
            `
            ${(resume.skill.length > 0)?
            `
            <section  class="trigger-area course-work">
                <span class="summary-section-title">Skills</span>
                <div  class="course-work-section-content project-content" style="margin-top:7px;">
                    <ul class="course-work-list">
                        ${this.getSkillsWithBulletPointsSectionForMonoPro(resume.skill)}
                    </ul>
                </div>
            </section>
            ` : ''
            }`:
            e.section == 'SKILLS_CATEGORY'?
            `
            ${resume.skill_v2.length > 0?
            `
            <section  class="trigger-area course-work">
                <div class="summary-section-title" style="margin-bottom:5px">Skills</div>
                <div  class="course-work-section-content template1-section-content">
                    <div class="skills-content">
                        <ul class="skill-category">
                            ${this.getSkillsCategorySectionForMonoPro(firstHalfSkills)}
                        </ul>
                        <ul class="skill-category">
                            ${this.getSkillsCategorySectionForMonoPro(secondHalfSkills)}
                        </ul>
                    </div>
                </div>
            </section>
            ` : ''
            }`:
            e.section == 'WORK_EXPERIENCE'?
            `
            ${(resume.experience.length > 0)?
            `
            <section class="course-work section-details trigger-area">
                <span class="summary-section-title">Experience</span>  
                ${this.getExperienceSectionForMonoPro(resume.experience)}
            </section>
            ` : ''
            }`:
            e.section == 'PROJECT'?
            `
             ${(resume.project.length > 0)?
            `
            <section class="course-work section-details trigger-area">
                <span class="summary-section-title">Projects</span>
                    ${this.getProjectSectionForMonoPro(resume.project)}  
                </section>
            ` : ''
            }`:
            e.section == 'CERTIFICATIONS'?
            `
            ${(resume.certification.length > 0)?
            `
            <section class="course-work section-details trigger-area">
                <span class="summary-section-title">Certifications</span>  
                ${this.getCertificationSectionForMonoPro(resume.certification)}
            </section>
            ` : ''
            }`:
            e.section == 'ACHIEVEMENTS_BULLET_POINTS'?
            `
            ${(resume.achievementBulletPoints.ach.length > 0)?
            `
            <section  class="trigger-area course-work trigger-area">
                <span class="summary-section-title">Achievements</span>
                <div  class="course-work-section-content">
                    <div class="project-content">
                    ${
                        resume.achievementBulletPoints.ach
                    }
                    </div>
                </div>
            </section>
            ` : ''
            }`:''
        }
        `
        ).join('\n')
    }


    public getEducationSectionForMonoPro(items : Education[]) : string{
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

    public getCourseWorkSectionForMonoPro(items : string[]) : string{
        return items.map((item : string)=> 
        `
        ${item.length > 0 ?
            `
        <li class="course-work-lisit-item" style="margin:0;padding:0;">${item}</li>
        ` : ''
        }
        `).join('');
    }

    public getSkillsWithBulletPointsSectionForMonoPro(items : Skill[]) : string{
        return items.map((item : Skill)=> 
        `
        ${items.length > 0 ?
            `
        <li class="course-work-lisit-item" style="margin:0;padding:0;">${item.name}</li>
        ` : ''
        }
        `).join('');
    }

    public getSkillsCategorySectionForMonoPro(items : SkillV2[]) : string{
      return items.map((item : SkillV2)=> 
      `
      <li class="skill-category-li"><b>${item.sub_title}:</b> ${item.skills.join(', ')}</li>
      `).join('');
    }

    public getExperienceSectionForMonoPro(items : Experience[]) : string{
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

    public getProjectSectionForMonoPro(items : Project[]) : string{
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

    public getCertificationSectionForMonoPro(items : Certification[]) : string{
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

    getHTMLTemplateForDualEdge(resumeForm : Resume){
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
        font-family: "Open Sans", sans-serif !important;
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
        font-size: 28px;
        color: #2a7ae4;
        }

        .header-title {
        color: #555;
        margin: 5px 0px 5px 0px;
        font-size: 16px;
        font-weight: 400;
        }

        .header-summary {
        font-size: 12px !important;
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
       margin: 8px 0 8px 0;
       border-bottom: 2px solid #ddd;
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
       text-align: right;
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
      margin: 5px 0 5px 0;
      padding-left: 15px;
      grid-column: 1 / -1;
      }

     .job-ul-li {
     font-size: 12px;
     font-weight: 400;
     margin-bottom: 5px;
    }

    .contact-ul {
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
    text-transform: uppercase;
    }
    
    .education-h2 {
    font-size: 16px;
    font-weight: 400;
    color: #2a7ae4;
    margin-bottom: 8px;
    border-bottom: 2px solid #ddd;
    text-transform: uppercase;
    }
    
    .contact-h2{
    font-size: 16px;
    font-weight: 400;
    color: #2a7ae4;
    margin-bottom: 8px;
    border-bottom: 2px solid #ddd;
    text-transform: uppercase;
    margin-top: 0; 
    }


    .education-p {
    margin: 5px 0;
    font-size: 12px;
    font-weight: 400;
    }

   .skill-items{
    display:flex;
    flex-wrap: wrap;
    gap: 10px;
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
    font-family: "Open Sans", sans-serif !important;;
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
    font-family: "Open Sans", sans-serif !important;;
    color: black;
    white-space: pre-wrap;
    }

    .project-content p {
    font-size: 12px;
    font-weight: 400;
    padding: 3px 0px;
    font-family: "Open Sans", sans-serif !important;;
    color: black;
    white-space: pre-wrap;
    margin: 0;
    }

    .course-work{
    text-align: left;
    margin-bottom: 12px;
        
    .course-work-section-content{
    padding: 6px 0px;
    border-radius: 5px;
    color: black;
    text-align: left;
        
    p{
    font-size: 12px;
    font-weight: 400;
    padding: 3px 0px;
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

    .skills-content {
    display: flex;
    flex-wrap: wrap;
    column-gap: 20px;
    row-gap: 10px;
    margin-left: 12px;
    font-size:12px !important;
    }
    .skill-category-span {
    font-weight: 400 !important;
    font-size:12px;
    }

    .skill-category {
    flex: 1 1 calc(50% - 20px); /* Two columns */
    list-style-type: disc;
    margin: 0;
    padding: 0;
    }
    .skill-category-li {
    margin-bottom: 5px;
    font-size: 12px;
    }
    
    .experience-container{
    display: flex;
    flex-direction: column;
    }
    </style>
    </head>
    <body>
    <div class="container">    
        <div class="main-content">
            <header class="work-experience">
                <div class="header">
                    <h1 class="header-h1">${resumeForm.contact.fname + ' ' + resumeForm.contact.lname}</h1>
                    ${resumeForm.contact.subTitle.length > 0 ?
                    `
                    <p class="header-title">${resumeForm.contact.subTitle}</p>
                    ` : ''}
                </div>
            </header>
            <div>
                ${this.getFormattedRightSideSectionsForDualEdge(resumeForm)}
            </div>

            <div class="sidebar">
                ${this.getFormattedLeftSideSectionsForDualEdge(resumeForm)}
            </div>
        </div>
    </div>
    </body>
    </html>
    `
    }


    getFormattedRightSideSectionsForDualEdge(resume : Resume){
        let firstHalfSkills = [...resume.skill_v2.slice(0, Math.ceil(resume.skill_v2.length/2))]
        let secondHalfSkills = [...resume.skill_v2.slice(Math.ceil(resume.skill_v2.length/2),)]
        return resume.multipleSections[0].map((e : SectionDesc)=>
        `
        ${
            e.section == 'PROFILE_SUMMARY'?
            `
            ${(resume.profileSummary.profile_summary.length > 0)?
            `
            <section class="resume-summary">
                <h2 class="work-experience-h2">Profile Summary</h2>
                <div class="project-content">
                ${
                    resume.profileSummary.profile_summary
                }
                </div>
            </section>
            ` : ''
            }`:
            e.section == 'EDUCATION'?
            `
            ${(resume.education.length > 0)?
            `
            <section  class="education">
                <h2 class="work-experience-h2">Education</h2>  
                ${this.getEducationSectionForDualEdge(resume.education)}        
            </section>
            ` : ''
            }`:
             e.section == 'RELEVANT_COURSEWORK'?
            `
            ${(resume.courseWork.length > 0)?
            `
            <section class="skills">
                <h2 class="work-experience-h2">Courseworks</h2>
                <div class="skill-items">
                    ${this.getCourseWorkSectionForDualEdge(resume.courseWork)}
                </div>
            </section>
            ` : ''
            }`:
            e.section == 'SKILLS_BULLET_POINTS'?
            `
            ${(resume.skill.length > 0)?
            `
            <section class="skills">
                <h2 class="work-experience-h2">Skills</h2>
                <div class="skill-items">
                    ${this.getSkillsSectionForDualEdge(resume.skill)}
                </div>
            </section>
            ` : ''
            }`:
            e.section == 'SKILLS_CATEGORY'?
            `
            ${resume.skill_v2.length > 0?
            `
            <section  class="trigger-area course-work">
                <h2 class="work-experience-h2">Skills</h2>
                <div  class="course-work-section-content">
                    <div class="skills-content">
                        <ul class="skill-category">
                            ${this.getSkillsCategorySectionForDualEdge(firstHalfSkills)}
                        </ul>
                        <ul class="skill-category">
                            ${this.getSkillsCategorySectionForDualEdge(secondHalfSkills)}
                        </ul>
                    </div>
                </div>
            </section>
            ` : ''
            }`:
            e.section == 'WORK_EXPERIENCE'?
            `
            ${(resume.experience.length > 0)?
            `
            <section>
                <h2 class="work-experience-h2">Experience</h2>  
                ${this.getExperienceSectionForDualEdge(resume.experience)}
            </section>
            ` : ''
            }`:
            e.section == 'PROJECT'?
            `
             ${(resume.project.length > 0)?
            `
            <section>
                <h2 class="work-experience-h2">Projects</h2> 
                ${this.getProjectSectionForDualEdge(resume.project)}  
            </section>
            ` : ''
            }`:
            e.section == 'CERTIFICATIONS'?
            `
            ${(resume.certification.length > 0)?
            `
            <section>
                <h2 class="work-experience-h2">Certifications</h2>  
                ${this.getCertificationSectionForDualEdge(resume.certification)}
            </section>
            ` : ''
            }`:
            e.section == 'ACHIEVEMENTS_BULLET_POINTS'?
            `
            ${(resume.achievementBulletPoints.ach.length > 0)?
            `
             <section class="resume-summary">
                <h2 class="work-experience-h2">Achievements</h2>
                <div class="project-content">
                    ${
                        resume.achievementBulletPoints.ach
                    }
                </div>
            </section>
            ` : ''
            }`:
            e.section == 'CERTIFICATIONS_BULLET_POINTS'?
            `
            ${(resume.certificationBulletPoints.point.length > 0)?
            `
            <section class="resume-summary">
                <h2 class="work-experience-h2">Certifications</h2>
                <div class="project-content">
                ${
                    resume.certificationBulletPoints.point
                }
                </div>
            </section>
            ` : ''
            }`:
            e.section == 'ACHIEVEMENT_WITH_DESC'?
            `
            ${(resume.accomplishment.length > 0)?
            `
            <section class="resume-summary">
                <h2 class="work-experience-h2">Accomplishments</h2>
                ${this.getAccomplishmentsSectionForDualEdge(resume.accomplishment)}
            </section>
            ` : ''
            }`:''
        }
        `
        ).join('\n')
    }

    getFormattedLeftSideSectionsForDualEdge(resume : Resume){
      return resume.multipleSections[1].map((e : SectionDesc)=>
        `
        ${
            e.section == 'EDUCATION'?
            `
            ${(resume.education.length > 0)?
            `
            <section  class="education">
                <h2 class="work-experience-h2">Education</h2>  
                ${this.getEducationSectionForDualEdge(resume.education)}        
            </section>
            ` : ''
            }`:
             e.section == 'RELEVANT_COURSEWORK'?
            `
            ${(resume.courseWork.length > 0)?
            `
            <section class="skills">
                <h2 class="work-experience-h2">Courseworks</h2>
                <div class="skill-items">
                    ${this.getCourseWorkSectionForDualEdge(resume.courseWork)}
                </div>
            </section>
            ` : ''
            }`:
            e.section == 'SKILLS_BULLET_POINTS'?
            `
            ${(resume.skill.length > 0)?
            `
            <section class="skills">
                <h2 class="work-experience-h2">Skills</h2>
                <div class="skill-items">
                    ${this.getSkillsSectionForDualEdge(resume.skill)}
                </div>
            </section>
            ` : ''
            }`:
            e.section == 'ACHIEVEMENTS_BULLET_POINTS'?
            `
            ${(resume.achievementBulletPoints.ach.length > 0)?
            `
             <section class="resume-summary">
                <h2 class="work-experience-h2">Achievements</h2>
                <div class="project-content">
                    ${
                        resume.achievementBulletPoints.ach
                    }
                </div>
            </section>
            ` : ''
            }`:
            e.section == 'CERTIFICATIONS_BULLET_POINTS'?
            `
            ${(resume.certificationBulletPoints.point.length > 0)?
            `
            <section class="resume-summary">
                <h2 class="work-experience-h2">Certifications</h2>
                <div class="project-content">
                ${
                    resume.certificationBulletPoints.point
                }
                </div>
            </section>
            ` : ''
            }`:''
        }
        `
        ).join('\n')
    }

    public getEducationSectionForDualEdge(items : Array<Education>){
         return items.map((item : Education)=> 
            `
            <div class="edu-item project-content" style="margin-bottom: 5px;">
                <p><b>${item.school_name}</b></p>
                <p>${item.degree}, ${item.field_of_study}</p>
                <p>${item.school_location} - ${item.graduation_date}</p>
            </div>
            `).join('');
    }

    public getCourseWorkSectionForDualEdge(items : string[]){
        return items.map((item : string)=> 
        `
        <div class="skill-item">
            ${item}
        </div>
        `).join('');
    }

    public getSkillsSectionForDualEdge(items : Skill[]){
        return items.map((item : Skill)=> 
        `
        <div class="skill-item">
            ${item.name}
        </div>
        `).join('');
    }

    public getSkillsCategorySectionForDualEdge(items : SkillV2[]){
         return items.map((item : SkillV2)=> 
            `
            <li class="skill-category-li"><b>${item.sub_title}:</b> ${item.skills.join(', ')}</li>
            `).join('');
    }

    public getExperienceSectionForDualEdge(items : Experience[]){
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

    public getProjectSectionForDualEdge(items : Project[]){
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

    public getCertificationSectionForDualEdge(items : Certification[]){
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

    public getAccomplishmentsSectionForDualEdge(items : Accomplishment[]){
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

    getHTMLTemplateForModern(resumeForm : Resume){
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

            <div>
            ${this.getFormattedSectionsForModern(resumeForm)}
            </div>
            
        </div>
        </body>
        </html>
        `
    }

    getFormattedSectionsForModern(resume : Resume){
        let firstHalfSkills = [...resume.skill_v2.slice(0, Math.ceil(resume.skill_v2.length/2))]
        let secondHalfSkills = [...resume.skill_v2.slice(Math.ceil(resume.skill_v2.length/2),)]
        return resume.sections.map((e : SectionDesc)=>
        `
        ${
            e.section == 'PROFILE_SUMMARY'?
            `
            ${(resume.profileSummary.profile_summary.length > 0)?
            `
            <div class="section">
                <span class="section-title">Profile Summary</span>
                <div class="project-content-container" style="margin:0;padding:0;">
                <div class="project-content">
                    ${
                        resume.profileSummary.profile_summary
                    }
                </div>
                </div>
            </div>
            ` : ''
            }`:
            e.section == 'EDUCATION'?
            `
            ${(resume.education.length > 0)?
            `
            <div class="section education">
                <div class="section-title">Education</div>
                ${this.getEducationSectionForModern(resume.education)}
            </div>
            ` : ''
            }`:
             e.section == 'RELEVANT_COURSEWORK'?
            `
            ${(resume.courseWork.length > 0)?
            `
            <div  class="section">
                <div class="section-title">Relevant Coursework</div>
                <div  class="course-work-section-content project-content" style="margin-top:7px;">
                    <ul class="course-work-list">
                        ${this.getCourseWorkSectionForMonoPro(resume.courseWork)}
                    </ul>
                </div>
            </div>
            ` : ''
            }`:
            e.section == 'SKILLS_BULLET_POINTS'?
            `
            ${(resume.skill.length > 0)?
            `
            <div class="section">
                <div class="section-title">Skills</div>
                <div  class="course-work-section-content project-content" style="margin-top:7px;">
                    <ul class="course-work-list">
                        ${this.getSkillsWithBulletPointsSectionForMonoPro(resume.skill)}
                    </ul>
                </div>
            </div>
            ` : ''
            }`:
            e.section == 'SKILLS_CATEGORY'?
            `
            ${resume.skill_v2.length > 0?
            `
            <div class="section skills">
                <div class="section-title">Skills</div>
                <div class="skills-content">
                    <ul class="skill-category">
                        ${this.getSkillsCategorySectionForModern(firstHalfSkills)}
                    </ul>
                    <ul class="skill-category">
                        ${this.getSkillsCategorySectionForModern(secondHalfSkills)}
                    </ul>
                </div>
            </div>
            ` : ''
            }`:
            e.section == 'WORK_EXPERIENCE'?
            `
            ${(resume.experience.length > 0)?
            `
            <div class="section experince trigger-area">
                <div class="section-title">Experience</div>
                ${this.getExperienceSectionForModern(resume.experience)}
            </div>
            ` : ''
            }`:
            e.section == 'PROJECT'?
            `
             ${(resume.project.length > 0)?
            `
            <div class="section experince trigger-area">
                <div class="section-title">Projects</div>
                ${this.getProjectSectionForModern(resume.project)}
            </div>
            ` : ''
            }`:
            e.section == 'CERTIFICATIONS'?
            `
            ${(resume.certification.length > 0)?
            `
            <div class="section experince trigger-area">
            <div class="section-title">Certifications</div>
                ${this.getCertificationSectionForDualEdge(resume.certification)}
            </div>
            ` : ''
            }`:
            e.section == 'ACHIEVEMENTS_BULLET_POINTS'?
            `
            ${(resume.achievementBulletPoints.ach.length > 0)?
            `
             <div class="section experince trigger-area">
             <div class="section-title">Achievements</div>
                <div class="project-content">
                    ${
                        resume.achievementBulletPoints.ach
                    }
                </div>
            </div>
            ` : ''
            }`:
            e.section == 'CERTIFICATIONS_BULLET_POINTS'?
            `
            ${(resume.certificationBulletPoints.point.length > 0)?
            `
             <div class="section experince trigger-area">
             <div class="section-title">Certifications</div>
                <div class="project-content">
                ${
                    resume.certificationBulletPoints.point
                }
                </div>
            </div>
            ` : ''
            }`:
            e.section == 'ACHIEVEMENT_WITH_DESC'?
            `
            ${(resume.accomplishment.length > 0)?
            `
             <div class="section education">
                <div class="section-title">Accomplishments</div>
                ${this.getAccomplishmentsSectionForModern(resume.accomplishment)}
            </div>
            ` : ''
            }`:''
        }
        `
        ).join('\n')
    }

    public getEducationSectionForModern(items : Array<Education>){
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

    public getSkillsCategorySectionForModern(items : SkillV2[]){
        return items.map((item : SkillV2)=> 
        `
        <li><span>${item.sub_title}:</span> ${item.skills.join(', ')}</li>
        `).join('');
    }

    public getExperienceSectionForModern(items : Experience[]){
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

    public getProjectSectionForModern(items : Project[]){
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

    public getAccomplishmentsSectionForModern(items : Accomplishment[]){
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




}