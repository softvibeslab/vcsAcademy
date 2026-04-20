import { CourseItem } from '../types';

type CourseSection = {
  id: string;
  title: string;
  eyebrow: string;
  courseIds: string[];
};

export const skoolPathOverview = {
  eyebrow: 'ACADEMY PERFORMANCE',
  title: 'Top Producer Path',
  description:
    'Your journey to the 1% begins here. Master the elite psychological frameworks and tactical execution used by the industry’s highest earners.',
  defaultCompletionPercent: 64,
  totalTrainingHours: 8.5,
};

export const skoolCourses: CourseItem[] = [
  {
    id: 'front-to-back-challenge',
    module: 'PART 1 of The FRONT TO BACK CHALLENGE',
    section: 'Path Intensive',
    title: 'Session 1: Front to Back Challenge',
    copy: 'Run the full presentation arc with cleaner transitions, stronger authority, and a tighter close sequence.',
    link: 'https://www.youtube.com/watch?v=HmZPlXY6Dqk&t=2s',
    platform: 'youtube',
    durationLabel: '74m Course',
    coverVariant: 'challenge',
    coverEyebrow: 'PATH INTENSIVE',
    coverTitle: 'FRONT TO BACK CHALLENGE',
    statusLabel: 'Resume Session',
    mentor: 'VCSA Intensive',
    order: 1,
  },
  {
    id: 'the-concept-pitch',
    module: 'FREE RESOURCES (The RoadMAP 2026)',
    section: 'Advanced Closing',
    title: 'Session 2: The Concept Pitch',
    copy: 'Clarify the concept before objections show up, so the rest of the presentation lands with more weight.',
    link: 'https://www.youtube.com/watch?v=zkOG6Eyi9Cc&t=2s',
    platform: 'youtube',
    durationLabel: '45m Guide',
    coverVariant: 'pitch',
    coverEyebrow: 'ADVANCED CLOSING',
    coverTitle: 'THE PERFECT PITCH',
    statusLabel: 'Get Started',
    mentor: 'Closing Systems',
    order: 2,
  },
  {
    id: 'first-visit-incentives',
    module: 'FREE RESOURCES (The RoadMAP 2026)',
    section: 'Advanced Closing',
    title: 'Session 3: First Visit Incentives',
    copy: 'Use urgency and incentive framing without sounding needy, transactional, or low-trust.',
    link: 'https://www.youtube.com/watch?v=IZFrfqD6aBY',
    platform: 'youtube',
    durationLabel: '38m Training',
    coverVariant: 'incentive',
    coverEyebrow: 'EXECUTION EDGE',
    coverTitle: 'DECISION ALCHEMY',
    statusLabel: 'Warm Lead',
    mentor: 'Revenue Velocity',
    order: 3,
  },
  {
    id: 'no-comes-at-a-price',
    module: 'FREE RESOURCES (The RoadMAP 2026)',
    section: 'Advanced Closing',
    title: 'Session 4: No Comes at a Price',
    copy: 'Reframe hesitation by exposing the cost of delay and recovering conviction without pressure.',
    link: 'https://www.youtube.com/watch?v=oOrz6H7XSvU',
    platform: 'youtube',
    durationLabel: '32m Session',
    coverVariant: 'contract',
    coverEyebrow: 'CLOSING MASTERY',
    coverTitle: 'CONTRACT MASTERY',
    statusLabel: 'Get Started',
    mentor: 'Commitment Skills',
    order: 4,
  },
  {
    id: 'breaking-the-pact',
    module: 'FREE RESOURCES (The RoadMAP 2026)',
    section: 'Relationship Building',
    title: 'Session 5: Breaking The Pact',
    copy: 'Interrupt the silent agreement prospects make with indecision and move them back into the truth of the opportunity.',
    link: 'https://youtu.be/yN3lahhU-4c',
    platform: 'youtube',
    durationLabel: '28m Class',
    coverVariant: 'mindset',
    coverEyebrow: 'EXECUTIVE PSYCHOLOGY',
    coverTitle: 'MINDSET MASTERY',
    statusLabel: 'In Progress',
    mentor: 'Decision Psychology',
    order: 5,
  },
  {
    id: 'the-residence-story',
    module: 'FREE RESOURCES (The RoadMAP 2026)',
    section: 'Relationship Building',
    title: 'Session 6: The Residence Story',
    copy: 'Tell the ownership story with more elegance, more emotional grip, and more perceived value.',
    link: 'https://www.youtube.com/watch?v=74LcxFvsMHI',
    platform: 'youtube',
    durationLabel: '26m Lesson',
    coverVariant: 'story',
    coverEyebrow: 'TRUST ENGINEERING',
    coverTitle: 'RESIDENCE STORY',
    statusLabel: 'Get Started',
    mentor: 'Storycraft',
    order: 6,
  },
];

export const skoolCourseSections: CourseSection[] = [
  {
    id: 'path-intensive',
    title: 'Path Intensive',
    eyebrow: 'Current Track',
    courseIds: ['front-to-back-challenge'],
  },
  {
    id: 'advanced-closing',
    title: 'Advanced Closing',
    eyebrow: 'Revenue Precision',
    courseIds: ['the-concept-pitch', 'first-visit-incentives', 'no-comes-at-a-price'],
  },
  {
    id: 'relationship-building',
    title: 'Relationship Building',
    eyebrow: 'Trust Architecture',
    courseIds: ['breaking-the-pact', 'the-residence-story'],
  },
];

export const skoolFeaturedCourseId = 'front-to-back-challenge';

export const skoolCourseModules = [
  'All',
  ...Array.from(new Set(skoolCourses.map((course) => course.module))),
];
