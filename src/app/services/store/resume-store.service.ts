// import { Injectable, Signal, computed, signal } from "@angular/core";
// import { Certification, Contact, Education, Experience, Project, Resume, achievement, courseWork } from "../resume.model";
// import { ResumeState } from "./resume-store";



// @Injectable({
//     providedIn: 'root',
//   })
//   export class ResumeStoreService {

//     resumeState = signal<ResumeState>(
//       {
//         currentTab : '',
//         resumeForm : new Resume(),
//         selectedExperience : new Experience(),
//         selectedProject : new Project(),
//         selectedEducation : new Education(),
//         selectedCertification : new Certification(),
//         isEdit : false
//       }
//     )

//     addContact(contact : Contact){
//         this.resumeState.update((resumeState)=>({
//             ...resumeState,
//             currentTab : 'CONTACT',
//             isEdit : false,
//             resumeForm : {...resumeState.resumeForm , contact : contact}
//             }))
//         }

//     addSummary(summary : string){
//         this.resumeState.update((resumeState)=>({
//             ...resumeState,
//             currentTab : 'SUMMARY',
//             isEdit : false,
//             resumeForm : {...resumeState.resumeForm , profile_summary : summary}
//             }))
//     }

//     addEducation(edu : Education){
//         this.resumeState.update((resumeState)=>({
//             ...resumeState,
//             currentTab : 'EDUCATION',
//             isEdit : false,
//             resumeForm : {...resumeState.resumeForm , education : edu.id?[...resumeState.resumeForm.education.slice(0,edu.id), edu, ...resumeState.resumeForm.education.slice(edu.id + 1,)]:[...resumeState.resumeForm.education, edu]}
//             }))
//     }

//     addCourseWork(work : Array<string>){
//         this.resumeState.update((resumeState)=>({
//             ...resumeState,
//             currentTab : 'COURSEWORK',
//             isEdit : false,
//             resumeForm : {...resumeState.resumeForm , courseWork : [...work]}
//             }))
//     }

//     addSkill(skill : Array<string>){
//         this.resumeState.update((resumeState)=>({
//             ...resumeState,
//             currentTab : 'SKILLS',
//             isEdit : false,
//             resumeForm : {...resumeState.resumeForm , skill : [...skill]}
//             }))
//     }

//     addProject(edu : Project){
//         this.resumeState.update((resumeState)=>({
//             ...resumeState,
//             currentTab : 'PROJECT',
//             isEdit : false,
//             resumeForm : {...resumeState.resumeForm , project : edu.id?[...resumeState.resumeForm.project.slice(0,edu.id), edu, ...resumeState.resumeForm.project.slice(edu.id + 1,)]:[...resumeState.resumeForm.project, edu]}
//             }))
//     }

//     addExperience(edu : Experience){
//         this.resumeState.update((resumeState)=>({
//             ...resumeState,
//             currentTab : 'EXPERIENCE',
//             isEdit : false,
//             resumeForm : {...resumeState.resumeForm , experience : edu.id?[...resumeState.resumeForm.experience.slice(0,edu.id), edu, ...resumeState.resumeForm.experience.slice(edu.id + 1,)]:[...resumeState.resumeForm.experience, edu]}
//             }))
//     }

//     addAchievement(ach : Array<string>){
//         this.resumeState.update((resumeState)=>({
//             ...resumeState,
//             currentTab : 'ACHIEVEMENT',
//             isEdit : false,
//             resumeForm : {...resumeState.resumeForm , achievement : [...ach]}
//             }))
//     }





//       updateContact(){
//         this.resumeState.update((resumeState)=>({
//           ...resumeState,
//           currentTab : 'CONTACT',
//           isEdit : true
//         }))
//       }

//       updateSummary(){
//         this.resumeState.update((resumeState)=>({
//           ...resumeState,
//           currentTab : 'SUMMARY',
//           isEdit : true
//         }))
//       }

//       updateEducation(edu : Education){
//         this.resumeState.update((resumeState)=>({
//           ...resumeState,
//           currentTab : 'EDUCATION',
//           selectedEducation : edu,
//           isEdit : true
//         }))
//       }

//       updateSkills(){
//         this.resumeState.update((resumeState)=>({
//           ...resumeState,
//           currentTab : 'SKILLS',
//           isEdit : true
//         }))
//       }

//       updateProject(project : Project){
//         this.resumeState.update((resumeState)=>({
//           ...resumeState,
//           currentTab : 'PROJECT',
//           selectedProject : project,
//           isEdit : true
//         }))
//       }

//       updateExperience(exp : Experience){
//         this.resumeState.update((resumeState)=>({
//           ...resumeState,
//           currentTab : 'EXPERIENCE',
//           selectedExperience : exp,
//           isEdit : true
//         }))
//       }

//       deleteContact(){
//         this.resumeState.update((resumeState)=>({
//           ...resumeState,
//           currentTab : '',
//           resumeForm : {...resumeState.resumeForm, Contact : new Contact()},
//           isEdit : false
//         }))
//       }

//       deleteSummary(){
//         this.resumeState.update((resumeState)=>({
//             ...resumeState,
//             currentTab : '',
//             resumeForm : {...resumeState.resumeForm, profile_summary : ""},
//             isEdit : false
//           }))
//       }

//       deleteEducation(edu : Education){
//         this.resumeState.update((resumeState)=>({
//             ...resumeState,
//             currentTab : '',
//             resumeForm : {...resumeState.resumeForm, education : [...resumeState.resumeForm.education.filter((e)=>{e.id != edu.id})]},
//             isEdit : false
//           }))
//       }

//       deleteCourseWork(work : string){
//         this.resumeState.update((resumeState)=>({
//             ...resumeState,
//             currentTab : '',
//             resumeForm : {...resumeState.resumeForm, courseWork : [...resumeState.resumeForm.courseWork.filter((e)=>{e != work})]},
//             isEdit : false
//           }))
//       }

//       deleteSkill(){
//         this.resumeState.update((resumeState)=>({
//             ...resumeState,
//             currentTab : '',
//             resumeForm : {...resumeState.resumeForm, skill : []},
//             isEdit : false
//           }))
//       }

//       deleteProject(pro : Project){
//         this.resumeState.update((resumeState)=>({
//             ...resumeState,
//             currentTab : '',
//             resumeForm : {...resumeState.resumeForm, project : [...resumeState.resumeForm.project.filter((e)=>{e.id != pro.id})]},
//             isEdit : false
//           }))
//       }

//       deleteExperience(exp : Experience){
//         this.resumeState.update((resumeState)=>({
//             ...resumeState,
//             currentTab : '',
//             resumeForm : {...resumeState.resumeForm, experience : [...resumeState.resumeForm.experience.filter((e)=>{e.id != exp.id})]},
//             isEdit : false
//           }))
//       }

//       deleteAchievement(ach : string){
//         this.resumeState.update((resumeState)=>({
//             ...resumeState,
//             currentTab : '',
//             resumeForm : {...resumeState.resumeForm, achievement : [...resumeState.resumeForm.achievement.filter((e)=>{e != ach})]},
//             isEdit : false
//           }))
//       }

//   }