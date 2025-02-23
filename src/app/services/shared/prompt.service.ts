import { inject, Injectable, Signal } from '@angular/core';
import { JobDescriptionAIResponse } from '../resume.model';
import { UserStoreService } from '../store/user-store.service';

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  constructor() {}

  private userStore: UserStoreService = inject(UserStoreService);
  jobDescAISuggestions : Signal<JobDescriptionAIResponse> = this.userStore.getJobDescAIRes();

  getObjective_Propmt(role : String,skills : string, input : String){
    if(role.length > 0 && skills.length > 0 && input.length > 0){
      return `
        Create a professional summary that highlights the user's key strengths, experience, and career goals, with a focus on their most relevant skills, achievements, and job-specific expertise. The summary should be concise, ATS-friendly, and incorporate industry-specific keywords. Ensure the content aligns strictly with the user's stated experience and expertise, avoiding unrelated roles or fields. The summary should be tailored to the target job role and be adaptable for both entry-level and experienced professionals. For Indian and USA audiences, the summary should blend professionalism and adaptability, reflecting the expectations of employers in these regions.

        Example Summaries:

        Dedicated Data Analyst with in-depth knowledge of research methodologies and data visualization. Proven experience modeling structured and unstructured data and working with large data sets.

        Self-motivated problem solver with experience in Android development using GitHub and Java. Designed and maintained the applications' full stacks through design, testing, and deployment.

        Motivated Data Scientist with over three years of professional experience analyzing data for managers to engage in decision-making processes. Seeking a role as a Data Scientist with the Stehr Group.

        Recent graduate with a bachelor's degree in Computer Science and exemplary data analysis and engineering experience seeking a DevOps Engineer position.

        Skilled and insightful Intern with over three years of experience in a business-oriented office environment where I collected research information, created individual reports, detailed vital information about my company, and worked hand-in-hand with skilled executives.

        Detail-oriented Java Developer with three years of experience in developing unique programming solutions for web applications. Skilled in developing user-friendly web applications, debugging written code, and writing unique code to solve technology problems.

        Highly motivated IT Project Manager with over three years of experience leading and facilitating the identification, definition, and delivery of application development solutions.

        User Professional Summary: I am a Full-stack developer and have 4 years of experience working in industry-level web applications with good Angular, ReactJS, Javascript, Springboot, AWS, and Azure knowledge. Designed and maintained a user service application which is a food service application on a High level. 

        Role to be highlighted: ${role}
        Skills to be highlighted: ${skills}
        User Professional Summary: ${input}`
    }
    else if(role.length > 0 && skills.length > 0){
      return  `
         Create a professional summary that highlights the user's key strengths, experience, and career goals, with a focus on their most relevant skills, achievements, and job-specific expertise. The summary should be concise, ATS-friendly, and incorporate industry-specific keywords. Ensure the content aligns strictly with the user's stated experience and expertise, avoiding unrelated roles or fields. The summary should be tailored to the target job role and be adaptable for both entry-level and experienced professionals. For Indian and USA audiences, the summary should blend professionalism and adaptability, reflecting the expectations of employers in these regions.

        Example Summaries:

        Dedicated Data Analyst with in-depth knowledge of research methodologies and data visualization. Proven experience modeling structured and unstructured data and working with large data sets.

        Self-motivated problem solver with experience in Android development using GitHub and Java. Designed and maintained the applications' full stacks through design, testing, and deployment.

        Motivated Data Scientist with over three years of professional experience analyzing data for managers to engage in decision-making processes. Seeking a role as a Data Scientist with the Stehr Group.

        Recent graduate with a bachelor's degree in Computer Science and exemplary data analysis and engineering experience seeking a DevOps Engineer position.

        Skilled and insightful Intern with over three years of experience in a business-oriented office environment where I collected research information, created individual reports, detailed vital information about my company, and worked hand-in-hand with skilled executives.

        Detail-oriented Java Developer with three years of experience in developing unique programming solutions for web applications. Skilled in developing user-friendly web applications, debugging written code, and writing unique code to solve technology problems.

        Highly motivated IT Project Manager with over three years of experience leading and facilitating the identification, definition, and delivery of application development solutions.

        User Professional Summary: I am a Full-stack developer and have 4 years of experience working in industry-level web applications with good Angular, ReactJS, Javascript, Springboot, AWS, and Azure knowledge. Designed and maintained a user service application which is a food service application on a High level. 

        Role to be highlighted: ${role}
        Skills to be highlighted: ${skills}`
    }
    else if(role.length > 0 && input.length > 0){
      return `
        Create a professional summary that highlights the user's key strengths, experience, and career goals, with a focus on their most relevant skills, achievements, and job-specific expertise. The summary should be concise, ATS-friendly, and incorporate industry-specific keywords. Ensure the content aligns strictly with the user's stated experience and expertise, avoiding unrelated roles or fields. The summary should be tailored to the target job role and be adaptable for both entry-level and experienced professionals. For Indian and USA audiences, the summary should blend professionalism and adaptability, reflecting the expectations of employers in these regions.

        Example Summaries:

        Dedicated Data Analyst with in-depth knowledge of research methodologies and data visualization. Proven experience modeling structured and unstructured data and working with large data sets.

        Self-motivated problem solver with experience in Android development using GitHub and Java. Designed and maintained the applications' full stacks through design, testing, and deployment.

        Motivated Data Scientist with over three years of professional experience analyzing data for managers to engage in decision-making processes. Seeking a role as a Data Scientist with the Stehr Group.

        Recent graduate with a bachelor's degree in Computer Science and exemplary data analysis and engineering experience seeking a DevOps Engineer position.

        Skilled and insightful Intern with over three years of experience in a business-oriented office environment where I collected research information, created individual reports, detailed vital information about my company, and worked hand-in-hand with skilled executives.

        Detail-oriented Java Developer with three years of experience in developing unique programming solutions for web applications. Skilled in developing user-friendly web applications, debugging written code, and writing unique code to solve technology problems.

        Highly motivated IT Project Manager with over three years of experience leading and facilitating the identification, definition, and delivery of application development solutions.

        User Professional Summary: I am a Full-stack developer and have 4 years of experience working in industry-level web applications with good Angular, ReactJS, Javascript, Springboot, AWS, and Azure knowledge. Designed and maintained a user service application which is a food service application on a High level. 

        Role to be highlighted: ${role}
        User Professional Summary: ${input}`
    }
    else if(skills.length > 0 && input.length > 0){
      return `
        Create a professional summary that highlights the user's key strengths, experience, and career goals, with a focus on their most relevant skills, achievements, and job-specific expertise. The summary should be concise, ATS-friendly, and incorporate industry-specific keywords. Ensure the content aligns strictly with the user's stated experience and expertise, avoiding unrelated roles or fields. The summary should be tailored to the target job role and be adaptable for both entry-level and experienced professionals. For Indian and USA audiences, the summary should blend professionalism and adaptability, reflecting the expectations of employers in these regions.

        Example Summaries:

        Dedicated Data Analyst with in-depth knowledge of research methodologies and data visualization. Proven experience modeling structured and unstructured data and working with large data sets.

        Self-motivated problem solver with experience in Android development using GitHub and Java. Designed and maintained the applications' full stacks through design, testing, and deployment.

        Motivated Data Scientist with over three years of professional experience analyzing data for managers to engage in decision-making processes. Seeking a role as a Data Scientist with the Stehr Group.

        Recent graduate with a bachelor's degree in Computer Science and exemplary data analysis and engineering experience seeking a DevOps Engineer position.

        Skilled and insightful Intern with over three years of experience in a business-oriented office environment where I collected research information, created individual reports, detailed vital information about my company, and worked hand-in-hand with skilled executives.

        Detail-oriented Java Developer with three years of experience in developing unique programming solutions for web applications. Skilled in developing user-friendly web applications, debugging written code, and writing unique code to solve technology problems.

        Highly motivated IT Project Manager with over three years of experience leading and facilitating the identification, definition, and delivery of application development solutions.

        User Professional Summary: I am a Full-stack developer and have 4 years of experience working in industry-level web applications with good Angular, ReactJS, Javascript, Springboot, AWS, and Azure knowledge. Designed and maintained a user service application which is a food service application on a High level. 

        Skills to be highlighted: ${skills}
        User Professional Summary: ${input}`
    }
    else if(role.length > 0){
      return `
        Create a professional summary that highlights the user's key strengths, experience, and career goals, with a focus on their most relevant skills, achievements, and job-specific expertise. The summary should be concise, ATS-friendly, and incorporate industry-specific keywords. Ensure the content aligns strictly with the user's stated experience and expertise, avoiding unrelated roles or fields. The summary should be tailored to the target job role and be adaptable for both entry-level and experienced professionals. For Indian and USA audiences, the summary should blend professionalism and adaptability, reflecting the expectations of employers in these regions.

        Example Summaries:

        Dedicated Data Analyst with in-depth knowledge of research methodologies and data visualization. Proven experience modeling structured and unstructured data and working with large data sets.

        Self-motivated problem solver with experience in Android development using GitHub and Java. Designed and maintained the applications' full stacks through design, testing, and deployment.

        Motivated Data Scientist with over three years of professional experience analyzing data for managers to engage in decision-making processes. Seeking a role as a Data Scientist with the Stehr Group.

        Recent graduate with a bachelor's degree in Computer Science and exemplary data analysis and engineering experience seeking a DevOps Engineer position.

        Skilled and insightful Intern with over three years of experience in a business-oriented office environment where I collected research information, created individual reports, detailed vital information about my company, and worked hand-in-hand with skilled executives.

        Detail-oriented Java Developer with three years of experience in developing unique programming solutions for web applications. Skilled in developing user-friendly web applications, debugging written code, and writing unique code to solve technology problems.

        Highly motivated IT Project Manager with over three years of experience leading and facilitating the identification, definition, and delivery of application development solutions.

        User Professional Summary: I am a Full-stack developer and have 4 years of experience working in industry-level web applications with good Angular, ReactJS, Javascript, Springboot, AWS, and Azure knowledge. Designed and maintained a user service application which is a food service application on a High level. 

        Role to be highlighted: ${role}`
    }
    else if(skills.length > 0){
      return `
        Create a professional summary that highlights the user's key strengths, experience, and career goals, with a focus on their most relevant skills, achievements, and job-specific expertise. The summary should be concise, ATS-friendly, and incorporate industry-specific keywords. Ensure the content aligns strictly with the user's stated experience and expertise, avoiding unrelated roles or fields. The summary should be tailored to the target job role and be adaptable for both entry-level and experienced professionals. For Indian and USA audiences, the summary should blend professionalism and adaptability, reflecting the expectations of employers in these regions.

        Example Summaries:

        Dedicated Data Analyst with in-depth knowledge of research methodologies and data visualization. Proven experience modeling structured and unstructured data and working with large data sets.

        Self-motivated problem solver with experience in Android development using GitHub and Java. Designed and maintained the applications' full stacks through design, testing, and deployment.

        Motivated Data Scientist with over three years of professional experience analyzing data for managers to engage in decision-making processes. Seeking a role as a Data Scientist with the Stehr Group.

        Recent graduate with a bachelor's degree in Computer Science and exemplary data analysis and engineering experience seeking a DevOps Engineer position.

        Skilled and insightful Intern with over three years of experience in a business-oriented office environment where I collected research information, created individual reports, detailed vital information about my company, and worked hand-in-hand with skilled executives.

        Detail-oriented Java Developer with three years of experience in developing unique programming solutions for web applications. Skilled in developing user-friendly web applications, debugging written code, and writing unique code to solve technology problems.

        Highly motivated IT Project Manager with over three years of experience leading and facilitating the identification, definition, and delivery of application development solutions.

        User Professional Summary: I am a Full-stack developer and have 4 years of experience working in industry-level web applications with good Angular, ReactJS, Javascript, Springboot, AWS, and Azure knowledge. Designed and maintained a user service application which is a food service application on a High level. 

        Skills to be highlighted: ${skills}`
    }
    else if(input.length > 0){
      return `
       Create a professional summary that highlights the user's key strengths, experience, and career goals, with a focus on their most relevant skills, achievements, and job-specific expertise. The summary should be concise, ATS-friendly, and incorporate industry-specific keywords. Ensure the content aligns strictly with the user's stated experience and expertise, avoiding unrelated roles or fields. The summary should be tailored to the target job role and be adaptable for both entry-level and experienced professionals. For Indian and USA audiences, the summary should blend professionalism and adaptability, reflecting the expectations of employers in these regions.

        Example Summaries:

        Dedicated Data Analyst with in-depth knowledge of research methodologies and data visualization. Proven experience modeling structured and unstructured data and working with large data sets.

        Self-motivated problem solver with experience in Android development using GitHub and Java. Designed and maintained the applications' full stacks through design, testing, and deployment.

        Motivated Data Scientist with over three years of professional experience analyzing data for managers to engage in decision-making processes. Seeking a role as a Data Scientist with the Stehr Group.

        Recent graduate with a bachelor's degree in Computer Science and exemplary data analysis and engineering experience seeking a DevOps Engineer position.

        Skilled and insightful Intern with over three years of experience in a business-oriented office environment where I collected research information, created individual reports, detailed vital information about my company, and worked hand-in-hand with skilled executives.

        Detail-oriented Java Developer with three years of experience in developing unique programming solutions for web applications. Skilled in developing user-friendly web applications, debugging written code, and writing unique code to solve technology problems.

        Highly motivated IT Project Manager with over three years of experience leading and facilitating the identification, definition, and delivery of application development solutions.

        User Professional Summary: I am a Full-stack developer and have 4 years of experience working in industry-level web applications with good Angular, ReactJS, Javascript, Springboot, AWS, and Azure knowledge. Designed and maintained a user service application which is a food service application on a High level. 

        User Professional Summary: ${input}`
    }
    else{
      return ``
    }
  }

  getExperience_prompt(input : any){
    return ` You have been an employee in a small company. 
    You are very skilled, creative, and interested in Learning new things. 
    You are very good at each and every technology and learning new technologies. 
    You have been learning technologies for the past 20 years. 
    And now you are trying to go for a Company Interview called Google. 
    You are an expert in creating resumes. 
    All the time you are waiting for this moment and prove yourself that you are worthy of the role.
    Now I will provide you a input and take that input as your professional experience and modify it that amaze the Google Interviewer person. 
    The output format should be a List of project JSON objects. 
    the JSON object contains fields like job_title, company_name, location, dates_of_employment and roles_and_responsibilities. 
    roles_and_responsibilities is list of key points and make sure to include all relevent information about roles and responsibilities with correct use of terminologies and technical words.
    Try to provide less number of roles_and_responsibilities points as possible and make more informative.
    As you are preparing a resume for Google Interview I want you to take the input and create the List of experience JSON objects. 

    Output format
    [
      {
        job_title : "",
        company_name : "",
        location : "",
        dates_of_employment : "",
        roles_and_responsibilities : [
          "", "", "", ""
        ]
      }
    ]
            
    My experience
    ${input}
            `
  }

  get_NEW_Experience_prompt(input : any){
    return ` 
    You are an expert in creating resumes. 
    Now I will provide you my work experience in a particular job. Your task is to rewrite the experience to an optimized and better way of showcasing my work experience to the Interviewer.
    The Output Format Should be a single String containing work experience separated by '###' for every role and responsibility. 

    My Work Experience
    ${input}
            `
  }

  get_New_Project_Prompt(input : any){
    return ` 
    You are an expert in creating resumes. 
    Now I will provide you my project description. Your task is to rewrite the project description to an optimized and better way of showcasing my project description to the Interviewer.
    The output should contain only about the project and I don't want to Project title, technologies used in the Key points. 
    The Output Format Should be a single String containing key points of project description separated by '###' for every key point.


    Project Description
    ${input}
            `
  }

  getEducation_Prompt(input : any){
    return `As a helpful AI assistant, I will provide you the text containing my Education Details. 
            Your task is to provide me optimed, clean text. 
            The Output Format Should be a List of JSON Objects containing values of degree_earned, major_or_field_of_study, school_or_university_name, location, graduation_date, and gpa.
            correct the spelling and meaning of the data provided. 
            If you do not find specific details provide NA.
            If you don't understand the input or feel not related to the particular field then provide NA to the particular field.


            Example:
            10th(SSC) in EFG School (2016) with 9.8 points
            Intermediate in MPC from IOP College, Mars (2016-2018) with 950/1000 Marks
            Bachelor's Degree in Computer Science and Engineering from ABC University, Mumbai (2018-2022) with 8.0 gpa
            Master's Degree in Artificial Intelligence from XYZ University, Erri Puvva (2023-2024) with 8.0 gpa
            Response:
            [
            {
                "degree_earned": "MS",
                "major_or_field_of_study": "Artificial Intelligence",
                "school_or_university_name": "XYZ University",
                "location" : "Arizona",
                "graduation_date": "2023-2024",
                "gpa": "8.0"
            },
                {
                "degree_earned": "B.Tech",
                "major_or_field_of_study": "CSE",
                "school_or_university_name": "ABC University",
                "location" : "Mumbai",
                "graduation_date": "2018-2022",
                "gpa": "8.0"
            },
            {
                "degree_earned": "Inter",
                "major_or_field_of_study": "MPC",
                "school_or_university_name": "IOP College",
                "location" : "NA",
                "graduation_date": "2016-2018",
                "gpa": "950"
            },
            {
                "degree_earned": "10th",
                "major_or_field_of_study": "SSC",
                "school_or_university_name": "EFG School",
                "location" : "NA"
                "graduation_date": "2016",
                "gpa": "9.8"
            },
            ]
            Example:
            10th, EFG School, 2016, 9.8
            Intermediate, MPC, IOP College,Mars 2016-2018, 950
            B.Tech, Computer Science, ABC University,Mumbai, 2018-2022, 8.0
            Master's, AI, XYZ University,Arozona, 2023-2024, 8.0
            Response:
            [
                {
                    "degree_earned": "MS",
                    "major_or_field_of_study": "Artificial Intelligence",
                    "school_or_university_name": "XYZ University",
                    "location" : "Arizona",
                    "graduation_date": "2023-2024",
                    "gpa": "8.0"
                },
                    {
                    "degree_earned": "B.Tech",
                    "major_or_field_of_study": "CSE",
                    "school_or_university_name": "ABC University",
                    "location" : "Mumbai",
                    "graduation_date": "2018-2022",
                    "gpa": "8.0"
                },
                {
                    "degree_earned": "Inter",
                    "major_or_field_of_study": "MPC",
                    "school_or_university_name": "IOP College",
                    "location" : "NA",
                    "graduation_date": "2016-2018",
                    "gpa": "950"
                },
                {
                    "degree_earned": "10th",
                    "major_or_field_of_study": "SSC",
                    "school_or_university_name": "EFG School",
                    "location" : "NA"
                    "graduation_date": "2016",
                    "gpa": "9.8"
                },
            ]

            My Education details
            ${input}
            `
  }

  getSkills_Prompt(input : String){
    return `As a helpful AI assistant, I will provide you the text containing technical skills and soft skills. 
            Your task is to provide JSON containing fields technical_skills and soft_skills.
            If you don't understand the skill provided by me then neither add it to the technical_skills nor the soft_skills.
            the datatype of both the fields is List of strings.
            
            Example:
            User Input: HTML5, CSS3, JavaScript, Effective Communication, okjbhbc, Team Collaboration, Problem Solving, Adaptability, Creativity, Time Management, Pyton, Reac, Node.js, Git, MongoDB, 
            Response: {
            "technical_skills":["HTML5, CSS3, JavaScript, Python, React, Node.js, Git, MongoDB"],
            "soft_skills":["Effective Communication, Team Collaboration, Problem Solving, Adaptability, Creativity, Time Management"]
            }
            
            My skills
            ${input}
            `
  }

  getDescriptionDetailedAnalysis_Prompt(description : String){
    return `
    You are a skilled ATS (Applicant Tracking System) scanner with a deep understanding of data science and ATS functionality, 
    I will provide you the Job description and your task is to provide me all the things I should keep in my resume so that my resume can surpass the ATS tracking.
    provide me the details in JSON format. also provide me How should a profile summary look like according to this Job description, the skills I should include in my resume, and generate a project by using the skills that the Job description has mentioned. 
    Do not stuff all the skills in the project. use only the required skills to generate a project. 
    The project should be creative and shouldn't be generic. 
    Make sure you generate the project with information like project title, description, and technologies_used involved in it. Try to provide more description and sounds technically good.
    Try to generate multiple projects atleast 3 projects. Do not involve the same skill in more than two projects.
    For every project provide me enough information so that I can answer any interview question on the project.
    I would like you to add these lines 'Eager to learn and grow in the field of [field name]' but not all the times.
    Make sure you generated profile_summary should be ATS friendly.
    Generate 5 different profile summaries which should perfectly fits me and my role and choose the best one with in those and provide me. 
    provide me only one profile_summary which is the best one.
    The profile summary should be between 40 to 50 words only with more Informative and concise.  
    Make sure the skills, profile_summary and projects fields are string. check it twice. If not convert all to string.
    The ouput format should be a JSON containing fields skills, profile_summary, projects.


    Output Format:
    {
    "skills": "",
    "profile_summary" : "",
    "projects" : "
                  ###
                  Project-1 title
                  project-1 Description
                  Project-1 Technologies used
                  ###

                  ###
                  Project-2 title
                  project-2 Description
                  Project-2 Technologies used
                  ###

                  ###
                  Project-3 title
                  project-3 Description
                  Project-3 Technologies used
                  ###
                "
    }

    Job Description
    ${description}
    `
  }

  getCertifications_Prompt(input : String){
    return `As an AI assistant, I will provide you the text containing my Certifications. 
            Your task is to optimize, clean the text and provide the output. 
            The Output Format Should be a List of JSON Objects containing values of certification_name, issuing_organization, and date_obtained. 
            If you do not find specific details provide NA
            
            My certifications details
            ${input}
            `
  }

  getProject_Prompt(input : String){
    return `
    You have been an employee in a small company. 
    You are very skilled, creative, and interested in Learning new things. 
    You are very good at each and every technology and learning new technologies. 
    You have been learning technologies for the past 20 years. 
    And now you are trying to go for a Company Interview called Google. 
    You are an expert in creating resumes. 
    All the time you are waiting for this moment and prove yourself that you are worthy of the role.
    Now I will provide you and take the input as your project details and modify it that amaze the Google Interviewer person. 
    The output format should be a List of project JSON objects. 
    the JSON object contains fields like title_of_the_project, description, and technologies_used. 
    I want the project description to be more descriptive and make sense.
    As you are preparing a resume for Google Interview I want you to take the input and create the List of project JSON objects. 
    All the fields in the JSON are string. If anyone of the field is not string covert it to string.
    
    My project details
    ${input}   
    `
  }


  getAward_Prompt(input : String){
    return `As an AI assistant, I will provide you the text containing my Awards. 
            Your task is to optimize, clean the text and provide the output. 
            The Output Format Should be a List of JSON Objects containing values of award_name, issuing_organization, and date_received. 
            If you do not find specific details provide NA
            
            My Awards details
            ${input}
            `
  }

  getLanguage_Prompt(input : String){
    return `As an AI assistant, I will provide you the text containing my language. 
            Your task is to optimize, clean the text and provide the output. 
            The Output Format Should be a List of JSON Objects containing values of language_name, and proficiency_level. 
            If you do not find specific details provide NA
            
            My language details
            ${input}
            `
  }
  getInterest_Prompt(input : String){
    return `As an AI assistant, I will provide you the text containing my Interests. 
            Your task is to optimize, clean the text and provide the output. 
            The Output Format Should be a List of Strings. 

            Example:
            Interest :  Climbing
                        Snowboarding
                        Photography
                        Travelling

            Response : [ "Climbing","Snowboarding","Photography","Travelling"]

            Example:
            Interest: Climbing, Snowboarding, Photography, Travelling
            Response : [ "Climbing","Snowboarding","Photography","Travelling"]

            
            My Interests
            ${input}
            `
  }
  getPublication_Prompt(input : String){
    return `As an AI assistant, I will provide you the text containing my publication. 
            Your task is to optimize, clean the text and provide the output. 
            The Output Format Should be a List of JSON Objects containing values of title, publication_source, and date. 
            If you do not find specific details provide NA
            
            My publication details
            ${input}
            `
  }
  getProfessionalMembership_Prompt(input : String){
    return `As an AI assistant, I will provide you the text containing my Professional membership. 
            Your task is to optimize, clean the text and provide the output. 
            The Output Format Should be a List of JSON Objects containing values of organization_name, membership_level, and dates_of_membership. 
            If you do not find specific details provide NA
            
            My Professional membership details
            ${input}
            `
  }
  getVolunteerExperience_Prompt(input : String){
    return `As an AI assistant, I will provide you the text containing my Volunteer experience. 
            Your task is to optimize, clean the text and provide the output. 
            The Output Format Should be a List of JSON Objects containing values of organization_Name, dates_of_service, and responsibilities. 
            If you do not find specific details provide NA
            
            My Volunteer experience details
            ${input}
            `
  }

  getAchievement_Prompt(input : String){
    return `
            As an AI assistant you task is to complete all my requirements and provide output, I will provide you the text containing my achievements. 
            Your task is to optimize, clean the text, remove grammatical errors, make sure to include correct terminologies and rewrite the achievement in better way of showcasing.  
            The Output Format Should be a single String containing achievements seperated by '###'. 

            My achievements
            ${input}
    
    `
  }

  get_New_v1_Project_Prompt(input : string, title : string, tech_used : string){
    if(input.length > 0 && tech_used.length > 0){
      return `
      You are an expert in creating resumes and have deep knowledge of how the ATS processes resume and what ATS exactly looks for in the resume. 
      Now I will provide you project description, and technologies used in the project. Your task is to rewrite the project description to an optimized and better way of showcasing my project description to the Interviewer. 
      Highlight the skills that I used in the project and also provide how I used the particular skill to the complete the project.
      The Output Format Should be a single String containing key points of project separated by '###' for every key point.


      Project Description : ${input}

      Technologies Used : ${tech_used}

      Output Format : Key Point 1 ### Key Point 2 ### Key Point 3
      `
    }
    else if(title.length > 0 && tech_used.length > 0){
      return `
      You are an expert in creating resumes and have deep knowledge of how the ATS processes resume and what ATS exactly looks for in the resume. 
      Now I will provide you title of the project, and technologies used in the project. Your task is to generate the project description that is optimized and better way of showcasing project description to the Interviewer. 
      Highlight the skills that I used in the project and also provide how I used the particular skill to the complete the project.
      The Output Format Should be a single String containing key points of project separated by '###' for every key point.


      Project Title : ${title}

      Technologies Used : ${tech_used}

      Output Format : Key Point 1 ### Key Point 2 ### Key Point 3

      `
    }
    else if(input.length > 0){
      return `
      You are an expert in creating resumes and have deep knowledge of how the ATS processes resume and what ATS exactly looks for in the resume. 
      Now I will provide you project description. Your task is to rewrite the project description to an optimized and better way of showcasing my project description to the Interviewer. 
      The output should contain only about the project and I don't want to Project title, technologies used in the Key points. 
      The Output Format Should be a single String containing key points of project separated by '###' for every key point.


      Project Description : ${input}

      Output Format : Key Point 1 ### Key Point 2 ### Key Point 3

      `
    }
    else{
      return ``
    }

  }

  get_NEW_v1_Experience_prompt(input : string, position : string, bullets : string){
    if(input.length > 0 && position.length > 0){
      return `
      You are an expert in creating resumes with deep knowledge of how ATS processes resumes and what ATS looks for. I will provide you my work experience for a job role called ${position}. Your task is to rewrite the experience in an optimized and better way to showcase my work experience to the interviewer. Ensure to:
      1. Highlight all roles and responsibilities of the ${position} in the output, using industry-specific keywords and phrases to enhance ATS compatibility.
      2. Focus on specific achievements and their impact in each role.
      3. Generate ${bullets} bullet ponits. Make sure you include each every role and responsibility in given number of bullet ponts.
      4. Format the output as a single string containing work experience separated by '###' for each role and responsibility.
      5. Ensure the text is clear, concise, and focused on key contributions.
      6. Do not include any labels or explanatory text like "Experience:", "Revised experience:", "Role:", or "Skill:" in the output.

      Work Experience: ${input}

      Output Format: Role and Responsibility 1 ### Role and Responsibility 2 ### Role and Responsibility 3

      Example Output Format: Developed and maintained scalable web applications using Angular and Spring Boot. ### Implemented RESTful APIs to enable seamless communication between frontend and backend systems. ### Leveraged AWS services for deployment and management of cloud-based applications.
      `
    }
    else if(input.length > 0){
      return `
      You are an expert in creating resumes with deep knowledge of how ATS processes resumes and what ATS looks for. I will provide you my work experience for a job role called ${position}. Your task is to rewrite the experience in an optimized and better way to showcase my work experience to the interviewer. Ensure to:
      1. Highlight all roles and responsibilities of the ${position} in the output, using industry-specific keywords and phrases to enhance ATS compatibility.
      2. Focus on specific achievements and their impact in each role.
      3. Format the output as a single string containing work experience separated by '###' for each role and responsibility.
      4. Ensure the text is clear, concise, and focused on key contributions.
      5. Do not include any labels or explanatory text like "Experience:", "Revised experience:", "Role:", or "Skill:" in the output.

      Work Experience: ${input}

      Output Format: Role and Responsibility 1 ### Role and Responsibility 2 ### Role and Responsibility 3

      Example Output Format: Developed and maintained scalable web applications using Angular and Spring Boot. ### Implemented RESTful APIs to enable seamless communication between frontend and backend systems. ### Leveraged AWS services for deployment and management of cloud-based applications.

      `
    }
    else if(position.length > 0){
      return `
      You are an expert in creating resumes with deep knowledge of how ATS processes resumes and what ATS looks for. I will provide you my work experience for a job role called ${position}. Your task is to rewrite the experience in an optimized and better way to showcase my work experience to the interviewer. Ensure to:
      1. Highlight all roles and responsibilities of the ${position} in the output, using industry-specific keywords and phrases to enhance ATS compatibility.
      2. Focus on specific achievements and their impact in each role.
      3. Format the output as a single string containing work experience separated by '###' for each role and responsibility.
      4. Ensure the text is clear, concise, and focused on key contributions.
      5. Do not include any labels or explanatory text like "Experience:", "Revised experience:", "Role:", or "Skill:" in the output.

      Output Format: Role and Responsibility 1 ### Role and Responsibility 2 ### Role and Responsibility 3

      Example Output Format: Developed and maintained scalable web applications using Angular and Spring Boot. ### Implemented RESTful APIs to enable seamless communication between frontend and backend systems. ### Leveraged AWS services for deployment and management of cloud-based applications.
      `
    }
    else{
      return ``
    }
  }


  get_chatgpt_experience_prompt(input : string, role : string, bullets : string){

    if(this.jobDescAISuggestions().Responsibilities_and_Duties.length >0){
      let jobDesc = {Skills : "",
        Job_Title: "",
        ATS_Keywords: "",
        Responsibilities_and_Duties: "",
        Required_Experience: ""};
      jobDesc["Responsibilities_and_Duties"] = this.jobDescAISuggestions().Responsibilities_and_Duties;
      jobDesc["Job_Title"] = this.jobDescAISuggestions().Responsibilities_and_Duties;
      jobDesc["ATS_Keywords"] = this.jobDescAISuggestions().ATS_Keywords;
      jobDesc["Required_Experience"] = this.jobDescAISuggestions().Required_Experience;
      jobDesc["Skills"] = this.jobDescAISuggestions().Skills;

      return `
      Create a concise and ATS-friendly professional experience description for a ${role}, optimizing it based on the provided job description details.

      1. Role-specific tasks and responsibilities: Use [Responsibilities_and_Duties] to clearly outline role-specific tasks, responsibilities, and examples of work performed that align with the job description.
      2. Job Title alignment: Ensure the description aligns with the role of [Job_Title], using relevant terminology and language specific to the role.
      3. Incorporate skills and keywords: Ensure that the following skills and keywords from the job description ([Skills] and [ATS_Keywords]) are integrated into the description, ensuring they are naturally woven into the context of tasks and responsibilities.
      4. Emphasize value and impact: Use industry-specific language to highlight how your contributions brought measurable value to the projects. Use results-driven language (e.g., "enhanced," "improved," "reduced," "boosted") to emphasize how your work benefited the organization.
      5. Include relevant experience: Ensure the professional experience description highlights qualifications and [Required_Experience] that directly match the job description, incorporating any relevant past roles or technical requirements.
      6. Balance technical and business outcomes: Ensure the description balances technical details with overall business impact, demonstrating both technical expertise and the value added to projects.
      7. Concise and focused: Avoid redundancy, and ensure the description is concise, focusing only on key responsibilities and achievements without unnecessary details.
      8. Jargon-free: Ensure clear, concise, and jargon-free language without using section headers in the bullet points.

      After generating the experience description:
      1. Review for clarity, removing redundant or unnecessary information while preserving technical depth.
      2. Ensure all job description elements are fully covered: Specifically review the description to confirm that all details from [Responsibilities_and_Duties], [Skills], [ATS_Keywords], and [Required_Experience] are fully and explicitly included. If any information is missing, revise the description to ensure completeness.
      3. Confirm ATS alignment: Review the description to ensure it aligns with the keywords, skills, and job requirements that ATS systems (like Taleo) use to evaluate resumes.
      4. Generate an estimated ATS-Score: Compare the final output with the job description details to generate an estimated ATS-Score based on the relevance of the match.
      5. Focus on matching skills, keywords, responsibilities, and experience.
      6. Provide a score in percentage based on the alignment between the final output and the job description.
      7. Optimize for ATS systems: Suggest improvements to increase the ATS score by incorporating relevant industry-specific keywords and adjusting language to align with the job description.
      8. Fit the description into the user-provided bullet point count without omitting key information.
      
      Important Note: When including statistics or specific details provided in the original experience description, ensure they are accurately represented and not altered or fabricated. Avoid adding new statistics or details that were not provided.

      Output Format:
      1. Provide the updated professional experience description in bullet points.
      2. Concatenate each bullet point with ### starting and ending each bullet point.
      3. Provide the ATS-Score in percentage after the last bullet point, based on the comparison between the output and the job description.
      4. Ensure the final description fits the exact number of bullet points provided by the user. Prioritize and merge where needed to maintain content quality.
      5. Strictly follow the output format.

      Output Format Structure:
      Bullet1###Bullet2###Bullet3###ATS-Score[Percentage]
      Example : Bullet1###Bullet2###Bullet3###85%

      ###
      Candidate Professional experience description:
      ${input}
      ###

      ###
      Skills, Job_Title, ATS_Keywords, Responsibilities_and_Duties, Required_Experience:
      ${JSON.stringify(jobDesc)}
      ###
      Number of bullet points: 
      ${bullets}
      ###
      `
    }
    else{
      return `
    Create a concise and ATS-friendly professional experience description for a ${role} with the following details:
    
    1. Clearly outline role-specific tasks, responsibilities, and examples of work performed.
    2. Emphasize how your contributions brought value to the projects, highlighting both technical expertise and the measurable impact of your work.
    3. Where metrics are provided, accurately incorporate quantifiable achievements. Do not add or alter statistics if not explicitly provided by the user.
    4. Use industry-specific keywords and terminology that align with the job role’s requirements, while focusing on action-driven, impact-oriented language that resonates with hiring managers.
    5. Incorporate results-driven language such as "enhanced," "improved," "reduced," or "boosted" to showcase how your work benefited the organization and led to measurable outcomes.
    6. Balance technical details with the overall business impact of your work, demonstrating both technical skills and how your contributions led to successful project or business outcomes.
    7. Avoid redundancy, and ensure the description is concise, focusing only on key responsibilities and achievements.
    8. Ensure clear, concise, and jargon-free language without using section headers in the bullet points.

    After generating the experience description:
    1. Review the description for clarity, removing any redundant or unnecessary information while preserving technical depth.
    2. Confirm that every detail from the original experience description is included. If any information is missing, revise the description to ensure completeness while fitting within the bullet point limit.
    3. Ensure the description fits within the user-provided bullet point count without omitting key information.
    4. Suggest improvements to increase the ATS score by incorporating relevant industry-specific keywords and adjusting language to align with the job description.
    5. Optimize the description by focusing on both technical expertise and the business value added to projects, making it more effective for both ATS systems and hiring managers.
    6. Verify that the updated description effectively showcases skills, accomplishments, and business outcomes while maintaining ATS optimization.

    Important Note: When including statistics or specific details provided in the original experience description, ensure they are accurately represented and not altered or fabricated. Avoid adding new statistics or details that were not provided.

    Output Format:
    1.Provide the updated professional experience description in bullet points.
    2.Concatenate each bullet point with ### starting and ending each bullet point.
    3.Ensure the final description fits the exact number of bullet points count provided by the user. Prioritize and merge where needed to maintain content quality.
    4.Strictly follow the output format.

    Output Format Structure: ###Bullet1###Bullet2###Bullet3###


    ###
    Candidate Professional experience description:
    ${input}
    ###

    ###
    Number of bullet points: 
    ${bullets}
    ###
    `
    }
  }

  get_chatgpt_project_prompt(input : string, title : string, bullets : string){
    return `
    Create a concise and ATS-friendly project description for a ${title} with the following details:

    1. Clearly outline the project’s objectives, tasks, and responsibilities, providing examples where applicable.
    2. Highlight the skills used and related concepts or technologies applied. For each skill mentioned, include related concepts if applicable. For example, if Spring Boot is used, mention related concepts like Spring Data JPA and Spring Security if they are part of the project.
    3. Emphasize the impact and results of your contributions, highlighting the value added to the project.
    4. Accurately incorporate quantifiable achievements where metrics are provided. Do not add or alter statistics that are not explicitly given.
    5. Incorporate relevant industry-specific keywords and terminology that align with the project’s requirements.
    6. If a specific skill is used in the project, mention related skill concepts or technologies that could be relevant or applied within the project, if applicable.
    7. Use impact-oriented language to showcase both technical expertise and how your work benefited the project.
    8. Ensure that the description balances technical details with the overall impact on project outcomes, appealing to ATS systems and hiring managers.
    9. Avoid redundancy, and ensure the description is concise, focusing only on key tasks and achievements.
    10. Ensure clear, concise, and jargon-free language without using section headers in the bullet points.

    After generating the project description:
    1. Review the description to remove redundant information while maintaining clarity and relevance.
    2. Ensure the description fits within the user-provided bullet point count without omitting key information. Condense or merge key points to fit the required number of bullet points while preserving the content's essence.
    3. Suggest improvements to increase the ATS score by incorporating relevant industry keywords and adjusting language to align with the project description.
    4. Optimize the description to highlight both technical expertise and the value added to the project, making it effective for both ATS and hiring managers.
    5. Verify the updated description effectively showcases skills, accomplishments, and project outcomes while maintaining ATS optimization.

    Important Note: When including statistics or specific details provided in the original project description, ensure they are accurately represented and not altered or fabricated. Avoid adding new statistics or details that were not provided.

    Output Format:
    1. Provide the updated project description in bullet points.
    2. Concatenate each bullet point with ### starting and ending each bullet point.
    3. Ensure the final description fits the exact number of bullet points count provided by the user. Prioritize and merge where needed to maintain content quality.
    4. Strictly follow the output format.

    Output Format Structure: ###Bullet1###Bullet2###Bullet3###


    ###
    Candidate Project description:
    ${input}
    ###

    ###
    Number of bullet points: 
    ${bullets}
    ###
    `
  }

  get_chatgpt_profile_summary(user_summary : string){
    return `
    Create a compelling and ATS-friendly Profile Summary with the following details:

    Highlight Key Skills:
    Incorporate primary skills and relevant concepts applicable to the role, such as Angular, Spring Boot, or data analysis tools.

    Showcase Position-Specific Strengths:
    Emphasize skills and achievements pertinent to the job title, aligning with the role’s requirements and expectations.

    Use Impact-Oriented Language:
    Craft the summary to showcase how the candidate’s skills and experience contribute to impactful results and value for the organization.

    Incorporate Industry-Specific Keywords:
    Use relevant industry terminology to align with job postings and enhance ATS optimization.

    Ensure Conciseness:
    Keep the summary clear and focused, avoiding jargon and redundancy while capturing essential skills and contributions.

    Format for ATS and Hiring Managers:
    Write the summary to appeal to both ATS systems and hiring managers, ensuring it effectively communicates the candidate’s strengths.

    Output Format:
    1. Provide the Profile Summary in a single concise paragraph.
    2. Ensure the summary incorporates key skills and position-specific strengths while being optimized for ATS.

    ###
    Candidate Profile Summary:
    ${user_summary}
    ###
    `
  }

  get_chatgpt_job_description_profile_summary(user_summary : string){
    if(this.jobDescAISuggestions().Responsibilities_and_Duties.length >0){
      let jobDesc = {Skills : "",
        Job_Title: "",
        ATS_Keywords: "",
        Responsibilities_and_Duties: "",
        Required_Experience: ""};
      jobDesc["Responsibilities_and_Duties"] = this.jobDescAISuggestions().Responsibilities_and_Duties;
      jobDesc["Job_Title"] = this.jobDescAISuggestions().Responsibilities_and_Duties;
      jobDesc["ATS_Keywords"] = this.jobDescAISuggestions().ATS_Keywords;
      jobDesc["Required_Experience"] = this.jobDescAISuggestions().Required_Experience;
      jobDesc["Skills"] = this.jobDescAISuggestions().Skills;

      return `
      Create a tailored and ATS-friendly Profile Summary based on the following Job Description:

      Analyze the Job Description:
      Review the job description to understand key responsibilities, required skills, and qualifications.

      Highlight Relevant Skills and Experience:
      Incorporate specific skills, experiences, and concepts mentioned in the job description. Include primary skills such as Angular, Spring Boot, or relevant tools.

      Showcase Position-Specific Strengths:
      Emphasize how the candidate’s experience and skills align with the job role’s requirements and contribute to achieving the position’s goals.

      Use Impact-Oriented Language:
      Craft the summary to highlight how the candidate’s background and skills deliver impactful results and add value to the organization.

      Incorporate Industry-Specific Keywords:
      Utilize keywords and terminology from the job description to ensure alignment with ATS systems and relevance to the role.

      Ensure Conciseness and Clarity:
      Write a clear, focused summary that avoids redundancy and jargon while effectively presenting the candidate’s strengths.

      Output Format:
      Provide the Profile Summary in a single concise paragraph.
      Ensure the summary aligns with the job description, incorporates key skills, and highlights the candidate’s suitability for the role.
      Provide a score in percentage based on the alignment between the final output and the job description.

      Output Format Structure: [Optimized Summary]###[ATS-Score in percentage]
      Example : Experienced Java Developer with expertise in Java application development, Spring framework, Springboot, AWS/GCP cloud framework, and Github/Bitbucket.###85%

      ###
      Candidate Profile Summary:
      ${user_summary}
      ###

      ###
      Job Description:
      ${JSON.stringify(jobDesc)}
      ###
      `
    }
    else{
    return `
        Create a compelling and ATS-friendly Profile Summary with the following details:

        Highlight Key Skills:
        Incorporate primary skills and relevant concepts applicable to the role, such as Angular, Spring Boot, or data analysis tools.

        Showcase Position-Specific Strengths:
        Emphasize skills and achievements pertinent to the job title, aligning with the role’s requirements and expectations.

        Use Impact-Oriented Language:
        Craft the summary to showcase how the candidate’s skills and experience contribute to impactful results and value for the organization.

        Incorporate Industry-Specific Keywords:
        Use relevant industry terminology to align with job postings and enhance ATS optimization.

        Ensure Conciseness:
        Keep the summary clear and focused, avoiding jargon and redundancy while capturing essential skills and contributions.

        Format for ATS and Hiring Managers:
        Write the summary to appeal to both ATS systems and hiring managers, ensuring it effectively communicates the candidate’s strengths.

        Output Format:
        1. Provide the Profile Summary in a single concise paragraph.
        2. Ensure the summary incorporates key skills and position-specific strengths while being optimized for ATS.

        ###
        Candidate Profile Summary:
        ${user_summary}
        ###
    `
    }
  }

  get_chatgpt_job_description_response(job_description : string){
    return `
    You are BotBro, an expert in analyzing job descriptions and optimizing resumes for ATS platforms like Taleo, Greenhouse, and Jobvite. I will provide you with a job description, and your task is to:

    1. Completely analyze the job description to extract key details.
    2. Analyze the job description and extract the following details:

    Job Title: Match or closely align the title from the description.
    Example: If the job title is "Senior Angular Developer," use "Senior Angular Developer" in the output.

    Required Skills and Keywords: Identify technical and soft skills mentioned and use exact terms.
    Example: If the job lists "Angular, TypeScript, REST APIs," make sure these appear in the output.

    Responsibilities and Duties: Reflect similar responsibilities from past roles, matching job description language.
    Example: If the job description says "Develop and maintain scalable applications," your output might say "Developed and maintained scalable web applications."

    Required Experience: Ensure that the years of experience or seniority level mentioned in the job description are included.
    Example: "5+ years of experience with Angular and front-end development."

    Technologies, Tools, and Frameworks: List all technologies and tools mentioned in the description.
    Example: "Angular, TypeScript, Node.js, and REST APIs."

    Soft Skills and Attributes: Include soft skills or attributes reflected in your experience.
    Example: "Strong team collaboration and leadership skills."

    3. Ensure 100% alignment with the job description across all the extracted categories.
    4. Generate Profile summary that completely satisfies the Job Description by using the help of Analyzed Job Description data(Job Title, Required Skills and Keywords, Responsibilities and Duties, Required Experience, Technologies, Tools, and Frameworks, Soft Skills and Attributes). 
    5. Provide a score in percentage for profile summary based on the alignment between the final output and the job description.
  
    Example:
    If skills : "Node.JS###NPM packages###RESTful APIs###java/javascript frameworks###"
    In output I must get Skills : "Node.JS###NPM###RESTful APIs###Java###Javascript###"
    In output I must get Profile_Summary : Optimized Summary###ATS Score

    5. Using the extracted details, generate the following output and Strictly follow the output format:
    Output Format (Stringified JSON):
    {
      "Job_Title": "string",
      "Profile_Summary":  "summary###ats_score",//[Example : summary###85%]
      "Skills":  "skill1###skill2",
      "ATS_Keywords": "keyword1###keyword2",
      "Responsibilities_and_Duties" : "Responsibilities and Duties1###Responsibilities and Duties2",
      "Required_Experience": "Experience1###Experience2",
    }
    Final Instructions:
    Make sure the entire output is well-structured and fully aligned with the job description provided, leaving no key detail unaddressed. Do not any Headers Including like Optimized Summary: , Profile Summary.

    Job Description: 
    ${job_description}
    `
  }

  prompt_testing(job_desc : string){
    return `
    Job Description Prompt

    Context:
    You are an AI assistant specializing in resume enhancement for the application 'Workifence' Your task is to analyze the provided input and deliver outputs that directly optimize the ATS score of a resume. This involves extracting and interpreting key details from the job description, ensuring the resulting resume elements are aligned with the ATS criteria.

    Tone:
    Maintain a professional, concise, and objective tone throughout the output.

    Input:
    Job Role: Provided by the user to guide AI understanding of the role they are applying for.

    Audience: The number of years of experience in the field (e.g., entry-level, mid-senior, senior). This helps tailor the profile summary to match the user’s experience level.

    Job Description:
    Job Title: The name of the role as listed in the description.
    Skills: A list of required technical and soft skills, including proficiency levels.
    Role Responsibilities: Key responsibilities that define the role and its expectations.
    Expected Experience: The level of expertise or duration of experience in specific roles or skills. If this is not provided, make reasonable inferences.

    Output Format:
    The output will be in JSON format with the following structure:

    {
      "job_title": "Suitable Job Title or derived title",
      "profile_summary": "Profile Summary optimized for ATS score",
      "skills": ["List of all extracted or inferred skills"],
      "project_prompt": "ATS scoring context for evaluating projects",
      "experience_prompt": "ATS scoring context for evaluating experiences"
    }

    Details for Each Output Field:
    Job Title:
    Extract the job title directly from the job description. If not present, infer it from the responsibilities.

    Profile Summary:
    Create a concise profile summary that is optimized for ATS score (85% or higher), incorporating key skills, experience, and a professional tone. Tailor this summary to the user's experience level based on the 'audience' input.

    Skills:
    List all relevant technical and soft skills extracted from the job description. Ensure no skill is overlooked, and avoid redundancy.

    Project Prompt:
    Formulate a prompt for comparing the user’s project against the job description to evaluate its ATS score.
    Input Parameters: Project title, technologies used (e.g., NodeJS, AngularJS), and a brief project description.
    Output: The prompt should return an ATS score indicating alignment with the job description. Key factors influencing the score: relevance of technologies, methodologies used, and their match with required skills and responsibilities.

    Experience Prompt:
    Formulate a prompt for comparing the user’s professional experience against the job description to evaluate its ATS score.
    Input Parameters: Organization name, job role, and a description of responsibilities.
    Output: The prompt should return an ATS score indicating the alignment of the responsibilities with the job description. Key factors influencing the score: relevance of prior job responsibilities, use of similar technologies, and demonstrated expertise.

    Fallback Instructions:
    Job Title Missing:
    If the job title is missing, infer it based on the responsibilities and typical industry conventions. For example, a role requiring data analysis, machine learning, and Python programming could be inferred as a 'Data Scientist'.

    Skills Missing:
    If skills are missing, infer likely required skills based on common industry requirements for similar roles, e.g., for a Data Scientist, expect Python, SQL, and TensorFlow.

    Role Responsibilities Missing:
    If responsibilities are missing, prioritize inferred skills and the expected experience to generate appropriate role duties based on industry standards.

    Expected Experience Missing:
    If expected experience is missing, assume a standard level of experience for the role, based on industry norms and the user’s experience level.

    Clarifications:
    Audience Influence:
    The 'audience' parameter (number of years of experience) should influence the depth and technicality of the profile summary. For example, a junior profile may focus on learning and skills, while a senior profile should emphasize leadership, strategic impact, and specialized expertise.

    Ensure that:
    The output is professional and concise.
    Missing data is handled gracefully, maintaining relevance to the user's goal.
    Strictly follow the output format.

    Job Description:
    ${job_desc}

    Job Role: Data Analyst


    Audience: Mid senior level
    `
  }

  testing_work_exp_prompt(exp : string){
    return  `
    Enhance the following resume bullet points to make them impactful, professional, and optimized for ATS scoring. Follow these guidelines:

    1. Action Verbs: Start each bullet point with a powerful and varied action verb that highlights specific accomplishments. Avoid repetition to maintain engagement.
    2. Clarity and Precision: Ensure each point is clear, concise, and easy to understand, while focusing on the key task or achievement.
    3. Quantifiable Outcomes: Include measurable results wherever possible (e.g., percentages, dollar values, or timeframes) to demonstrate the impact.
    4. Relevant Keywords: Incorporate industry-relevant and role-specific keywords (e.g., tools, technologies, methodologies) naturally, ensuring alignment with ATS systems.
    5. Unique Differentiators: Emphasize unique contributions, innovations, or solutions that set the experience apart, avoiding redundancy across points.
    6. Professional and Collaborative Tone: Maintain a professional tone, highlighting teamwork, leadership, or business impact where applicable.
    7. Industry Tools and Techniques: Reference tools, platforms, or frameworks (e.g., Kubernetes, Docker, Jenkins, JIRA) to showcase technical expertise.
    8. Business Value Alignment: Tie achievements to business outcomes such as cost savings, revenue growth, or operational efficiency.

    Here are the original bullet points:
    ${exp}

    Rewrite Instructions:
    1. Enhance each point to maximize clarity, impact, concise, and ATS alignment.
    2. Preserve the original intent of the bullet points while improving their phrasing, measurable results, and relevance to modern job requirements.

    Output Format:
    Return the updated bullet points as a structured list:
    ["ImprovedPoint1", "ImprovedPoint2", "ImprovedPoint3"]
    Strictly follow the output format. Don't add headers or tails at the end. Only List of Improved Points.
    `
  }

  testing_project_desc_prompt(project : string) {
    return `
      Optimize the following project details to make them impactful, professional, and ATS-friendly. Follow these guidelines:

      1. Action Verbs: Start each description with a strong, varied action verb to emphasize the activities performed and their impact.
      2. Clarity and Conciseness: Ensure descriptions are clear, focused, and easy to understand, emphasizing the core achievements.
      3. Quantifiable Results: Include measurable outcomes (e.g., percentages, timeframes, or performance improvements) to highlight the project's success.
      4. Relevant Keywords: Incorporate industry-relevant and role-specific keywords (e.g., tools, technologies, methodologies) that resonate with ATS systems.
      5. Technical Breadth: Highlight tools, platforms, or frameworks used (e.g., Spring Boot, Kubernetes, RESTful APIs) to showcase technical expertise.
      6. Business Value: Link project outcomes to tangible business benefits (e.g., cost savings, efficiency improvements, or scalability enhancements).
      7. Professional Tone: Maintain a polished, professional style throughout the description.

      Here are the original project details:
      ${project}

      Rewrite Instructions:
      1. Enhance each project description to maximize clarity, measurable impact, concise, and ATS alignment.
      2. Preserve the original intent while making descriptions more impactful and aligned with modern job requirements.

      Output Format:
      Return the optimized project descriptions as a structured list:
      ["ImprovedPoint1", "ImprovedPoint2", "ImprovedPoint3"]
      Strictly follow the output format. Don't add headers or tails at the end. Only List of Improved Points.
    `;
  }
  

  optimize_the_point(point : string){
    return  `
    Take the provided work experience point and rewrite it for a resume to make it clear, concise, and impactful. Focus on using action verbs, highlighting key responsibilities, and emphasizing the value or impact of the role. Ensure the tone remains professional and relevant to the industry.

    ${point}
    `
  }

  optimize_project_point(point : string){
    return  `
    Optimize the given project point to make it concise, ATS-friendly, and impactful by:

    1. Refining the language for clarity and relevance.
    2. Highlighting key contributions, tools, and technologies used.
    3. Emphasizing the value or outcome without adding unnecessary statistics.

    Output the optimized project point as a single bullet.

    Input Project Point: ${point}
    `
  }


  profile_summary_testing(profile_summary : string){
    return `
    Optimize the following profile summary for a resume to ensure it is concise, impactful, and optimized for ATS (Applicant Tracking Systems). Use industry-relevant keywords, measurable achievements, and action verbs. Maintain a professional tone suitable for [industry or job title]. The goal is to make the summary stand out while ensuring it is easy to scan by both recruiters and ATS.

    Current Profile Summary:
    ${profile_summary}
    Generate the optimized profile summary.
    `
  }

  final_optimized_profile_summary_prompt( profile_summary : string){
    return `
    Optimize the following profile summary to make it impactful, professional, and ATS-friendly. Follow these guidelines:

    1. Professional Tone: Ensure the summary is clear, brief, and to the point, typically no longer than 4-5 sentences.
    2. Action-Oriented Language: Use strong, active language to convey expertise and achievements.
    3. Quantifiable Achievements: Highlight measurable outcomes where applicable (e.g., efficiency improvements, cost reductions, or project successes).
    4. Technical and Domain-Specific Keywords: Incorporate relevant technical skills, tools, methodologies, and domain-specific terms to enhance ATS relevance.
    5. Business Value Alignment: Connect technical achievements to business outcomes, such as enhanced efficiency, user engagement, or project delivery.
    6. Specificity: If applicable, mention specific industries, project types, or technologies used to add depth and make the profile more personalized to the target role.
    7. Conciseness: While including impactful details, ensure the summary remains clear and concise, focusing on the core value proposition.

    Input Details
    ${profile_summary}

    Rewrite Instructions
    1. Revise the profile summary to maximize clarity, ATS relevance, and professional impact.
    2. Ensure the summary highlights the candidate’s core competencies, measurable achievements, and alignment with the desired role, while adding specificity if necessary.
    3. The final summary should be concise, no longer than 4-5 sentences.

    Output Format
    Return the optimized profile summary in plain text, no longer than 5 sentences.
    `
  }



}