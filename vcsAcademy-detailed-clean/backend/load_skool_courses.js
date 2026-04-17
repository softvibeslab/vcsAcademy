// Load Skool Courses from CSV into MongoDB
// Run with: mongosh mongodb://admin:vcsa_local_dev_2024@localhost:27019/vcsa load_skool_courses.js

// Course data from CSV
const skoolCourses = [
  {
    title: "FREE RESOURCES (The RoadMAP 2026)",
    description: "Essential training resources for vacation club sales professionals",
    category: "masterclass",
    lessons: [
      {
        title: "Breaking The Pact",
        description: "Learn how to break traditional sales patterns",
        video_url: "https://www.youtube.com/embed/yN3lahhU-4c",
        duration: 15,
        order: 1
      },
      {
        title: "First Visit Incentives",
        description: "Master first visit incentive strategies",
        video_url: "https://www.youtube.com/embed/IZFrfqD6aBY",
        duration: 15,
        order: 2
      },
      {
        title: "The Residence Story",
        description: "Learn to tell compelling residence stories",
        video_url: "https://www.youtube.com/embed/74LcxFvsMHI",
        duration: 15,
        order: 3
      },
      {
        title: "The Concept Pitch",
        description: "Perfect your concept presentation skills",
        video_url: "https://www.youtube.com/embed/zkOG6Eyi9Cc",
        duration: 15,
        order: 4
      },
      {
        title: "No Comes at a Price",
        description: "Handle price objections effectively",
        video_url: "https://www.youtube.com/embed/oOrz6H7XSvU",
        duration: 15,
        order: 5
      }
    ]
  },
  {
    title: "PART 1 of The FRONT TO BACK CHALLENGE",
    description: "Front to Back Challenge - Complete sales process mastery",
    category: "workshop",
    lessons: [
      {
        title: "FRONT TO BACK CHALLENGE",
        description: "Master the complete sales process from front to back",
        video_url: "https://www.youtube.com/embed/HmZPlXY6Dqk",
        duration: 20,
        order: 1
      }
    ]
  }
];

// Get admin user (created_by)
const adminUser = db.users.findOne({role: "admin"}) || db.users.findOne({});
const createdBy = adminUser ? adminUser.user_id : 'system';

print("📚 Loading Skool Courses...");
print("");

let totalCoursesCreated = 0;
let totalLessonsCreated = 0;

skoolCourses.forEach((courseData, index) => {
  print(`📖 Processing Course ${index + 1}: ${courseData.title}`);

  // Check if course already exists
  const existingCourse = db.courses.findOne({title: courseData.title});

  let courseId;

  if (existingCourse) {
    print(`   ✅ Course already exists: ${existingCourse.course_id}`);
    courseId = existingCourse.course_id;

    // Delete existing lessons
    const deletedLessons = db.lessons.deleteMany({course_id: courseId});
    print(`   🗑️  Deleted ${deletedLessons.deletedCount} old lessons`);
  } else {
    // Create new course
    courseId = `course_${Date.now().toString(36)}_${index}`;

    const courseDoc = {
      course_id: courseId,
      title: courseData.title,
      description: courseData.description,
      thumbnail: "https://img.youtube.com/vi/default/maxresdefault.jpg",
      category: courseData.category,
      min_level: 1,
      vip_only: false,
      lessons: [],
      created_at: new Date(),
      created_by: createdBy
    };

    db.courses.insertOne(courseDoc);
    print(`   ✅ Created course: ${courseId}`);
  }

  // Create lessons
  const lessonIds = [];

  courseData.lessons.forEach((lessonData, lessonIndex) => {
    const lessonId = `lesson_${Date.now().toString(36)}_${index}_${lessonIndex}`;

    const lessonDoc = {
      lesson_id: lessonId,
      course_id: courseId,
      title: lessonData.title,
      description: lessonData.description,
      video_url: lessonData.video_url,
      duration: lessonData.duration,
      order: lessonData.order,
      created_at: new Date()
    };

    db.lessons.insertOne(lessonDoc);
    lessonIds.push(lessonId);

    print(`   📹 Lesson ${lessonIndex + 1}: ${lessonData.title}`);
    print(`      URL: ${lessonData.video_url}`);

    totalLessonsCreated++;
  });

  // Update course with lesson IDs
  db.courses.updateOne(
    {course_id: courseId},
    {$set: {lessons: lessonIds}}
  );

  print(`   ✅ Created ${lessonIds.length} lessons`);
  print("");

  totalCoursesCreated++;
});

// Summary
print("=" * 60);
print("📊 SUMMARY");
print("=" * 60);
print(`✅ Courses processed: ${totalCoursesCreated}`);
print(`✅ Lessons created: ${totalLessonsCreated}`);
print("");

// Verification
print("🔍 VERIFICATION");
print("=" * 60);

const coursesCount = db.courses.countDocuments({});
const lessonsCount = db.lessons.countDocuments({});

print(`📚 Total courses in database: ${coursesCount}`);
print(`📹 Total lessons in database: ${lessonsCount}`);
print("");

// List all courses
print("📋 COURSES LIST:");
print("-" * 60);

const allCourses = db.courses.find({}, {_id: 0}).toArray();
allCourses.forEach(course => {
  const courseLessonsCount = db.lessons.countDocuments({course_id: course.course_id});
  print(`📖 ${course.title}`);
  print(`   ID: ${course.course_id}`);
  print(`   Category: ${course.category || 'N/A'}`);
  print(`   Lessons: ${courseLessonsCount}`);
  print(`   VIP Only: ${course.vip_only || false}`);
  print("");
});

print("✅ Skool courses loaded successfully!");
