/**
 * Seed Financial Demo Data for VCSA
 *
 * This script creates realistic demo data for the financial planning system:
 * - Financial goals with expenses
 * - Daily sales records (25 days)
 * - Personal attributes tracking
 * - Daily challenges
 *
 * Usage:
 *   mongosh vcsa < backend/seed_financial_demo.js
 *   OR
 *   mongo vcsa < backend/seed_financial_demo.js
 */

// Get or create demo user
let demoUser = db.users.findOne({ email: 'demo@vcsa.com' });

if (!demoUser) {
  print('Demo user not found. Creating demo user...');

  // Create demo user
  const userId = 'demo_user_' + Date.now();
  demoUser = {
    user_id: userId,
    email: 'demo@vcsa.com',
    name: 'Demo User',
    role: 'member',
    created_at: new Date(),
    updated_at: new Date()
  };

  db.users.insertOne(demoUser);
  print(`✓ Demo user created: ${demoUser.email} (${demoUser.user_id})`);
} else {
  print(`✓ Demo user found: ${demoUser.email} (${demoUser.user_id})`);
}

const userId = demoUser.user_id;
print(`Seeding financial data for user: ${userId}`);

// Clear existing financial data
db.financial_goals.deleteMany({ user_id: userId });
db.daily_sales.deleteMany({ user_id: userId });
db.daily_attributes.deleteMany({ user_id: userId });
db.daily_challenges.deleteMany({ user_id: userId });

// ============== FINANCIAL GOALS ==============

const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

const financialGoal = {
  goal_id: `fg_${userId.substring(0, 8)}_${Date.now()}`,
  user_id: userId,
  month: currentMonth,
  target_income: 15000,
  expenses: [
    { category: 'rent', amount: 1200, description: 'Monthly rent' },
    { category: 'car_payment', amount: 450, description: 'Car payment' },
    { category: 'electricity', amount: 150, description: 'Electricity bill' },
    { category: 'food', amount: 600, description: 'Groceries' },
    { category: 'water_bill', amount: 80, description: 'Water bill' },
    { category: 'credit_card', amount: 300, description: 'Credit card payment' },
    { category: 'gas', amount: 200, description: 'Gas/Fuel' },
    { category: 'insurance', amount: 250, description: 'Insurance' },
    { category: 'cell_phone', amount: 100, description: 'Cell phone' },
    { category: 'cable', amount: 80, description: 'Cable & Internet' },
    { category: 'entertainment', amount: 200, description: 'Entertainment' },
    { category: 'other', amount: 500, description: 'Savings & Miscellaneous' }
  ],
  total_expenses: 4110,
  income_gap: 10890,
  avg_sale: 1500,
  closing_rate: 20,
  tours_needed: 73,
  sales_needed: 15,
  created_at: new Date(),
  updated_at: new Date()
};

db.financial_goals.insertOne(financialGoal);
print('✓ Financial goal created');

// ============== DAILY SALES RECORDS (25 days) ==============

const customerNames = [
  'Juan Pérez', 'María García', 'Carlos López', 'Ana Rodríguez',
  'Miguel Sánchez', 'Laura González', 'Pedro Martínez', 'Carmen Flores',
  'José Rivera', 'Patricia Torres', 'Luis Herrera', 'Elena Castillo',
  'Roberto Ramírez', 'Sofia Morales', 'Francisco Reyes', 'Isabel Cruz',
  'Daniel Ortega', 'Rosa Delgado', 'Javier Vargas', 'Teresa Mendoza'
];

const managers = ['Manager A', 'Manager B', 'Manager C', 'Manager D'];

const dailyTips = [
  'Today I learned that building rapport first makes the close much easier',
  'Focusing on the benefits, not features, increased my conversion rate',
  'Following up within 24 hours is crucial for closing',
  'Active listening helped me uncover the real objection',
  'Being confident in the price increased my closing rate',
  'Using stories and social proof built trust faster',
  'Handling the money objection early saved time later',
  'Creating urgency with limited availability worked well today',
  'Asking for the referral after the sale is easier than I thought',
  'Staying positive even after 3 no\'s led to the 4th yes',
  'Pre-call research made the presentation much more targeted',
  'Involving the spouse early prevented later objections',
  'Using the assumptive close technique worked great',
  'Building value before discussing price reduced price resistance',
  'Listening more than talking (80/20 rule) improved my results',
  'Following the sales process step-by-step increased consistency',
  'Treating every tour like a $10,000 sale improved my attitude',
  'Handling objections with questions instead of statements worked better',
  'Creating a sense of family and community resonated with clients',
  'Being authentic and genuine built more trust than scripted pitches',
  'Understanding the client\'s why before presenting made all the difference',
  'Using visual aids and tours increased engagement',
  'Timing the ask when energy was high improved close rates',
  'Following up with value-added content kept me top of mind',
  'Celebrating small wins kept momentum going throughout the day'
];

const dailySalesRecords = [];

for (let day = 1; day <= 25; day++) {
  // Simulate realistic sales pattern
  const hasSale = Math.random() > 0.4; // 60% chance of sale
  const recordDate = new Date();
  recordDate.setDate(day);

  const salesRecord = {
    record_id: `ds_${userId.substring(0, 8)}_${day}`,
    user_id: userId,
    date: recordDate.toISOString().slice(0, 10), // YYYY-MM-DD
    day_number: day,
    socio: hasSale ? customerNames[day % customerNames.length] : null,
    manager: hasSale ? managers[day % managers.length] : null,
    volume: hasSale ? Math.floor(Math.random() * 2000) + 800 : 0, // $800-2800
    enganche_pct: hasSale ? Math.floor(Math.random() * 30) + 10 : null, // 10-40%
    commission_pct: hasSale ? Math.floor(Math.random() * 5) + 3 : 0, // 3-8%
    milesingreso: hasSale ? Math.floor(Math.random() * 300) + 100 : 0, // 100-400
    daily_tip: hasSale ? dailyTips[day % dailyTips.length] : null,
    created_at: recordDate,
    updated_at: recordDate
  };

  dailySalesRecords.push(salesRecord);
}

db.daily_sales.insertMany(dailySalesRecords);
print(`✓ Created ${dailySalesRecords.length} daily sales records`);

// ============== PERSONAL ATTRIBUTES (last 7 days) ==============

const attributeTypes = ['attitude', 'courage', 'focus', 'training', 'discipline', 'persistence', 'commitment'];

const attributeNotes = {
  attitude: [
    'Maintained positive mindset despite challenges',
    'Started the day with gratitude and motivation',
    'Helped team members stay positive',
    'Reframed setbacks as learning opportunities'
  ],
  courage: [
    'Called 5 cold leads despite fear of rejection',
    'Presented to a difficult client with confidence',
    'Asked for the sale boldly',
    'Stepped out of comfort zone with new approach'
  ],
  focus: [
    'Completed 3 tasks without distractions',
    'No social media for 2 hours during work time',
    'Stayed focused on top priority goals',
    'Used time-blocking to maintain focus'
  ],
  training: [
    'Completed module 5: Objection Handling',
    'Watched 2 training videos on closing techniques',
    'Practiced elevator pitch',
    'Learned new product features and benefits'
  ],
  discipline: [
    'Followed schedule perfectly',
    'Arrived 30 minutes early every day',
    'Completed all planned follow-ups',
    'Maintained consistent daily routine'
  ],
  persistence: [
    'Did not give up after 4 objections',
    'Followed up 5 times with stubborn lead',
    'Stayed persistent through challenging day',
    'Kept calling despite multiple rejections'
  ],
  commitment: [
    'Took massive action on goals today',
    'Fully committed to hitting sales target',
    'Went above and beyond for client',
    'Demonstrated full commitment to team success'
  ]
};

// Helper function to get points for attribute type
function getAttributePoints(attrType) {
  const points = {
    attitude: 10,
    courage: 10,
    focus: 10,
    training: 15,
    discipline: 20,
    persistence: 15,
    commitment: 25
  };
  return points[attrType] || 10;
}

const dailyAttributes = [];

for (let day = 1; day <= 7; day++) {
  const attrDate = new Date();
  attrDate.setDate(attrDate.getDate() - (7 - day));

  attributeTypes.forEach(attrType => {
    // 80% chance of achieving each attribute
    const achieved = Math.random() > 0.2;

    const attribute = {
      attribute_id: `attr_${userId.substring(0, 8)}_${day}_${attrType}`,
      user_id: userId,
      date: attrDate.toISOString().slice(0, 10),
      attribute_type: attrType,
      achieved: achieved,
      notes: achieved ? attributeNotes[attrType][day % attributeNotes[attrType].length] : null,
      points_earned: achieved ? getAttributePoints(attrType) : 0,
      created_at: attrDate,
      updated_at: attrDate
    };

    dailyAttributes.push(attribute);
  });
}

db.daily_attributes.insertMany(dailyAttributes);
print(`✓ Created ${dailyAttributes.length} personal attribute records`);

// ============== DAILY CHALLENGES (last 7 days) ==============

const challengeTypes = ['monday_focus', 'tuesday_courage', 'wednesday_training', 'thursday_discipline', 'friday_persistence', 'weekly_commitment'];

const challengeDescriptions = {
  monday_focus: 'Completa 3 tareas sin distracciones',
  tuesday_courage: 'Llama a 5 leads cold',
  wednesday_training: 'Completa 1 módulo de training',
  thursday_discipline: 'Sigue tu schedule perfectamente',
  friday_persistence: 'No te rindas hasta lograr tu meta',
  weekly_commitment: 'Cumple todos tus compromisos semanales'
};

const challengePoints = {
  monday_focus: 25,
  tuesday_courage: 25,
  wednesday_training: 25,
  thursday_discipline: 25,
  friday_persistence: 25,
  weekly_commitment: 50
};

const dailyChallenges = [];

for (let day = 1; day <= 7; day++) {
  const chalDate = new Date();
  chalDate.setDate(chalDate.getDate() - (7 - day));
  const weekday = chalDate.getDay(); // 0=Sunday, 1=Monday, etc.

  // Map weekday to challenge type
  let challengeType;
  if (weekday === 1) challengeType = 'monday_focus';
  else if (weekday === 2) challengeType = 'tuesday_courage';
  else if (weekday === 3) challengeType = 'wednesday_training';
  else if (weekday === 4) challengeType = 'thursday_discipline';
  else if (weekday === 5) challengeType = 'friday_persistence';
  else challengeType = null;

  if (challengeType) {
    const targetTasks = challengeType === 'weekly_commitment' ? 7 : 5;
    const completedTasks = Math.floor(Math.random() * (targetTasks + 1)); // 0 to targetTasks
    const completed = completedTasks >= targetTasks;

    const challenge = {
      challenge_id: `chal_${userId.substring(0, 8)}_${day}`,
      user_id: userId,
      date: chalDate.toISOString().slice(0, 10),
      challenge_type: challengeType,
      description: challengeDescriptions[challengeType],
      target_tasks: targetTasks,
      completed_tasks: completedTasks,
      points_awarded: completed ? challengePoints[challengeType] : 0,
      completed: completed,
      notes: completed ? 'Challenge completed successfully!' : 'Did not complete all tasks',
      created_at: chalDate,
      updated_at: chalDate
    };

    dailyChallenges.push(challenge);
  }
}

db.daily_challenges.insertMany(dailyChallenges);
print(`✓ Created ${dailyChallenges.length} daily challenge records`);

// ============== UPDATE USER PROGRESS ==============

// Calculate total points earned
const totalAttributePoints = dailyAttributes.reduce((sum, attr) => sum + (attr.points_earned || 0), 0);
const totalChallengePoints = dailyChallenges.reduce((sum, chal) => sum + (chal.points_awarded || 0), 0);
const totalSalesPoints = dailySalesRecords.filter(r => r.volume > 0).length * 10; // 10 points per sale
const financialGoalPoints = 25; // Points for setting financial goal

const totalPoints = totalAttributePoints + totalChallengePoints + totalSalesPoints + financialGoalPoints;

db.user_progress.updateOne(
  { user_id: userId },
  {
    $inc: {
      points: totalPoints
    },
    $set: {
      updated_at: new Date()
    }
  }
);

print(`\n=== FINANCIAL DEMO DATA SUMMARY ===`);
print(`Financial Goal: $${financialGoal.target_income.toLocaleString()}`);
print(`Total Expenses: $${financialGoal.total_expenses.toLocaleString()}`);
print(`Income Gap: $${financialGoal.income_gap.toLocaleString()}`);
print(`Sales Needed: ${financialGoal.sales_needed}`);
print(`Tours Needed: ${financialGoal.tours_needed}`);
print(`\nDaily Sales Records: ${dailySalesRecords.length} days`);
print(`Sales Made: ${dailySalesRecords.filter(r => r.volume > 0).length}`);
print(`Total Volume: $${dailySalesRecords.reduce((sum, r) => sum + (r.volume || 0), 0).toLocaleString()}`);
print(`\nPersonal Attributes: ${dailyAttributes.filter(a => a.achieved).length}/${dailyAttributes.length} achieved`);
print(`Daily Challenges: ${dailyChallenges.filter(c => c.completed).length}/${dailyChallenges.length} completed`);
print(`\nTotal Points Earned: ${totalPoints}`);
print(`  - Attribute Points: ${totalAttributePoints}`);
print(`  - Challenge Points: ${totalChallengePoints}`);
print(`  - Sales Points: ${totalSalesPoints}`);
print(`  - Financial Goal: ${financialGoalPoints}`);
print(`\n✅ Financial demo data seeded successfully!`);
