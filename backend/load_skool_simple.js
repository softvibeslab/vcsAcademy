// Load Skool Courses - Simple Version

// Get admin user
const adminUser = db.users.findOne({role: "admin"}) || db.users.findOne({});
const createdBy = adminUser ? adminUser.user_id : 'system';

print("Loading Skool Courses...");

// Course 1: FREE RESOURCES
const course1Id = "course_skool_roadmap_2026";
const course1Lessons = [];

// Check if course exists
let course1 = db.courses.findOne({course_id: course1Id});

if (!course1) {
  course1 = {
    course_id: course1Id,
    title: "FREE RESOURCES (The RoadMAP 2026)",
    description: "Essential training resources for vacation club sales professionals - RoadMAP 2026 Edition",
    thumbnail: "https://img.youtube.com/vi/default/maxresdefault.jpg",
    category: "masterclass",
    min_level: 1,
    vip_only: false,
    lessons: [],
    created_at: new Date(),
    created_by: createdBy
  };
  db.courses.insertOne(course1);
  print("Created course: FREE RESOURCES (The RoadMAP 2026)");
} else {
  // Delete old lessons
  db.lessons.deleteMany({course_id: course1Id});
  print("Updated existing course: FREE RESOURCES (The RoadMAP 2026)");
}

// Lessons for Course 1
const course1Data = [
  {
    title: "Breaking The Pact",
    description: "Learn how to break traditional sales patterns and mindset limitations",
    video_url: "https://www.youtube.com/embed/yN3lahhU-4c",
    duration: 15,
    order: 1
  },
  {
    title: "First Visit Incentives",
    description: "Master first visit incentive strategies to close more deals",
    video_url: "https://www.youtube.com/embed/IZFrfqD6aBY",
    duration: 15,
    order: 2
  },
  {
    title: "The Residence Story",
    description: "Learn to tell compelling residence stories that resonate with clients",
    video_url: "https://www.youtube.com/embed/74LcxFvsMHI",
    duration: 15,
    order: 3
  },
  {
    title: "The Concept Pitch",
    description: "Perfect your concept presentation skills for maximum impact",
    video_url: "https://www.youtube.com/embed/zkOG6Eyi9Cc",
    duration: 15,
    order: 4
  },
  {
    title: "No Comes at a Price",
    description: "Handle price objections effectively and maintain value perception",
    video_url: "https://www.youtube.com/embed/oOrz6H7XSvU",
    duration: 15,
    order: 5
  }
];

course1Data.forEach((lesson, index) => {
  const lessonId = `lesson_skool_roadmap_${index + 1}`;

  const lessonDoc = {
    lesson_id: lessonId,
    course_id: course1Id,
    title: lesson.title,
    description: lesson.description,
    video_url: lesson.video_url,
    duration: lesson.duration,
    order: lesson.order,
    created_at: new Date()
  };

  db.lessons.insertOne(lessonDoc);
  course1Lessons.push(lessonId);

  print(`  Lesson ${index + 1}: ${lesson.title}`);
});

// Update course with lessons
db.courses.updateOne(
  {course_id: course1Id},
  {$set: {lessons: course1Lessons}}
);

print(`Course 1 complete: ${course1Lessons.length} lessons`);
print("");

// Course 2: FRONT TO BACK CHALLENGE
const course2Id = "course_skool_front_to_back";
const course2Lessons = [];

let course2 = db.courses.findOne({course_id: course2Id});

if (!course2) {
  course2 = {
    course_id: course2Id,
    title: "PART 1 of The FRONT TO BACK CHALLENGE",
    description: "Front to Back Challenge - Master the complete sales process from prospecting to closing",
    thumbnail: "https://img.youtube.com/vi/default/maxresdefault.jpg",
    category: "workshop",
    min_level: 1,
    vip_only: false,
    lessons: [],
    created_at: new Date(),
    created_by: createdBy
  };
  db.courses.insertOne(course2);
  print("Created course: PART 1 of The FRONT TO BACK CHALLENGE");
} else {
  db.lessons.deleteMany({course_id: course2Id});
  print("Updated existing course: PART 1 of The FRONT TO BACK CHALLENGE");
}

// Lessons for Course 2
const course2Data = [
  {
    title: "FRONT TO BACK CHALLENGE",
    description: "Complete sales process mastery - Learn to guide prospects from initial contact to final close",
    video_url: "https://www.youtube.com/embed/HmZPlXY6Dqk",
    duration: 20,
    order: 1
  }
];

course2Data.forEach((lesson, index) => {
  const lessonId = `lesson_skool_ftb_${index + 1}`;

  const lessonDoc = {
    lesson_id: lessonId,
    course_id: course2Id,
    title: lesson.title,
    description: lesson.description,
    video_url: lesson.video_url,
    duration: lesson.duration,
    order: lesson.order,
    created_at: new Date()
  };

  db.lessons.insertOne(lessonDoc);
  course2Lessons.push(lessonId);

  print(`  Lesson ${index + 1}: ${lesson.title}`);
});

// Update course with lessons
db.courses.updateOne(
  {course_id: course2Id},
  {$set: {lessons: course2Lessons}}
);

print(`Course 2 complete: ${course2Lessons.length} lessons`);
print("");

// Summary
print("========================================");
print("SKOOL COURSES LOADED SUCCESSFULLY");
print("========================================");
print(`Total Courses: 2`);
print(`Total Lessons: ${course1Lessons.length + course2Lessons.length}`);
print("");
print("Courses List:");
print(`1. FREE RESOURCES (The RoadMAP 2026) - ${course1Lessons.length} lessons`);
print(`2. PART 1 of The FRONT TO BACK CHALLENGE - ${course2Lessons.length} lesson`);
print("");
