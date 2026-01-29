import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import type { ResumeCard } from '../models/resume-card.model';

@Injectable({ providedIn: 'root' })
export class ResumePortalMockService {
  private readonly data: ResumeCard[] = buildMockResumes(92);

  getAllResumes(): Observable<ResumeCard[]> {
    return of(this.data);
  }
}

const FIRST_NAMES = [
  'Ananya', 'Arjun', 'Priya', 'Rohan', 'Isha', 'Vikram', 'Meera', 'Kiran',
  'Neha', 'Sanjay', 'Aisha', 'Rahul', 'Nina', 'Derek', 'Ava', 'Leo',
  'Isabella', 'Mateo', 'Chloe', 'Ethan', 'Maya', 'Owen', 'Layla', 'Zara',
  'Henry', 'Liam', 'Sofia', 'Noah', 'Grace', 'Lucas'
];

const LAST_NAMES = [
  'Kapoor', 'Singh', 'Sharma', 'Patel', 'Gupta', 'Nair', 'Reddy', 'Mehta',
  'Khan', 'Iyer', 'Brown', 'Johnson', 'Garcia', 'Martinez', 'Lee', 'Clark',
  'Walker', 'Harris', 'Lopez', 'Young', 'Wright', 'Allen', 'King', 'Hill'
];

const ROLES = [
  'Salesforce Developer',
  'Salesforce Admin',
  'OmniStudio Consultant',
  'Java Spring Boot Engineer',
  'Angular Frontend Engineer',
  'Data Engineer',
  'QA Automation Engineer',
  'Full Stack Developer',
  'Cloud DevOps Engineer',
  'Product Designer'
];

const ROLE_TEMPLATES: Record<string, string> = {
  'Salesforce Developer': 'TEMPLATE_3',
  'Salesforce Admin': 'TEMPLATE_2',
  'OmniStudio Consultant': 'TEMPLATE_4',
  'Java Spring Boot Engineer': 'TEMPLATE_5',
  'Angular Frontend Engineer': 'TEMPLATE_1',
  'Data Engineer': 'TEMPLATE_6',
  'QA Automation Engineer': 'TEMPLATE_7',
  'Full Stack Developer': 'TEMPLATE_9',
  'Cloud DevOps Engineer': 'TEMPLATE_10',
  'Product Designer': 'TEMPLATE_2',
};

const LOCATIONS = [
  'Atlanta, GA',
  'Austin, TX',
  'Seattle, WA',
  'San Jose, CA',
  'Chicago, IL',
  'New York, NY',
  'Dallas, TX',
  'Boston, MA',
  'Denver, CO',
  'Raleigh, NC',
  'Phoenix, AZ',
  'Tampa, FL',
];

const SKILLS = [
  'Salesforce', 'Apex', 'LWC', 'OmniStudio', 'Java', 'Spring Boot', 'Angular',
  'TypeScript', 'Python', 'SQL', 'Snowflake', 'AWS', 'Azure', 'Selenium',
  'Cypress', 'Playwright', 'CI/CD', 'Kafka', 'ETL', 'Power BI', 'Figma',
  'REST APIs', 'GraphQL', 'Node.js', 'React'
];

const HIGHLIGHTS = [
  'Reduced onboarding time by 30% through automation.',
  'Built scalable integrations serving 1M+ users.',
  'Improved test coverage from 62% to 92%.',
  'Led migration to cloud-native architecture.',
  'Delivered dashboards for executive reporting.',
  'Optimized CI/CD pipelines for weekly releases.',
  'Designed reusable component libraries.',
  'Implemented data quality checks across pipelines.',
  'Collaborated with cross-functional teams globally.',
  'Mentored junior engineers and interns.',
];

const DOMAINS: ResumeCard['badges']['domain'][] = [
  'Healthcare', 'FinTech', 'Retail', 'Education', 'Other'
];

const WORK_AUTH: ResumeCard['workAuthorization'][] = ['US_CITIZEN', 'GC', 'H1B', 'EAD', 'OTHER'];
const AVAILABILITY: ResumeCard['availability'][] = ['IMMEDIATE', '2_WEEKS', '1_MONTH', 'NOT_LOOKING'];

function buildMockResumes(count: number): ResumeCard[] {
  const results: ResumeCard[] = [];
  for (let i = 0; i < count; i += 1) {
    const seed = `resume-${i + 1}`;
    const rand = mulberry32(hashString(seed));
    const firstName = pick(FIRST_NAMES, rand);
    const lastName = pick(LAST_NAMES, rand);
    const primaryRole = pick(ROLES, rand);
    const yearsExperience = Math.floor(rand() * 11) + 2; // 2-12
    const location = pick(LOCATIONS, rand);
    const workAuthorization = pick(WORK_AUTH, rand);
    const availability = pick(AVAILABILITY, rand);
    const domain = pick(DOMAINS, rand);
    const topSkills = pickMany(SKILLS, 6, rand);
    const highlights = pickMany(HIGHLIGHTS, 3, rand);
    const atsOptimized = rand() > 0.35;
    const verified = rand() > 0.45;
    const activelyLooking = rand() > 0.3;
    const profileImageUrl = rand() > 0.55 ? `https://i.pravatar.cc/150?img=${(i % 70) + 1}` : undefined;
    const updatedAt = new Date(Date.now() - Math.floor(rand() * 60) * 24 * 60 * 60 * 1000).toISOString();

    results.push({
      id: `rp-${i + 1}`,
      firstName,
      lastName,
      profileImageUrl,
      headline: `${primaryRole} | ${topSkills.slice(0, 2).join(', ')}`,
      primaryRole,
      yearsExperience,
      location,
      workAuthorization,
      availability,
      topSkills,
      highlights,
      badges: {
        atsOptimized,
        verified,
        activelyLooking,
        domain,
      },
      templateKey: ROLE_TEMPLATES[primaryRole] ?? 'TEMPLATE_1',
      updatedAt,
    });
  }
  return results;
}

function pick<T>(list: T[], rand: () => number): T {
  return list[Math.floor(rand() * list.length)];
}

function pickMany<T>(list: T[], count: number, rand: () => number): T[] {
  const copy = [...list];
  const result: T[] = [];
  while (result.length < count && copy.length > 0) {
    const index = Math.floor(rand() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }
  return result;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}
