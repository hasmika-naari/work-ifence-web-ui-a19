import { Injectable } from '@angular/core';
import { Certification, Education, Experience, Project, Resume, Skill, SkillV2 } from '../resume.model';
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
    //   else if(template_name == 'TEMPLATE_9'){
    //     return this.getTemplate9HTMLV1(resume);
    //   }
    //   else if(template_name == 'TEMPLATE_10'){
    //     return this.formatTemplate10HTML(resume);
    //   } 
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
            ${(resume.achievement.ach.length > 0)?
            `
            <section  class="trigger-area course-work trigger-area">
                <span class="summary-section-title">Achievements</span>
                <div  class="course-work-section-content">
                    <div class="project-content">
                    ${
                        resume.achievement.ach
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


}