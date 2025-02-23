import { GoogleGenerativeAI } from "@google/generative-ai";
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root',
})
export class GenAIService {
  formattedHtml!: SafeHtml;
  constructor(private http: HttpClient, private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object) {}
  getHtmlFile(url: string) {
    return this.http.get(url, { responseType: 'text' });
  }

  getLocalHtmlFile(fileName: string) {
    console.log(`assets/templates/${fileName}`);
    
    return this.http.get(`assets/templates/${fileName}`, { responseType: 'text' });
  }

  async getGeminiProResponse(prompt : any) {
    console.log("In Gemini Pro");
    const genAI = new GoogleGenerativeAI("AIzaSyCPhWHAPmpCE7P40oAMo_Val_AlxRShyY8");
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  }

}