/**
 * Seed Demo Data for Goal Sheets Gamified System
 * Direct MongoDB insertion script
 */

const { MongoClient } = require('mongodb');

const MONGO_URL = 'mongodb://localhost:27019';
const DB_NAME = 'vcsa';
const DEMO_USER_EMAIL = 'demo@vcsa.com';

async function seedDemoData() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log('✅ Connected to MongoDB');

  const db = client.db(DB_NAME);
  const today = new Date();
  const currentMonth = today.toISOString().slice(0, 7); // YYYY-MM

  try {
    // Get demo user
    const demoUser = await db.collection('users').findOne({ email: DEMO_USER_EMAIL });

    if (!demoUser) {
      console.log('❌ Demo user not found');
      return;
    }

    const userId = demoUser.user_id;
    console.log(`✅ Found demo user: ${userId}`);

    // 1. Seed Financial Goal
    console.log('\n📊 Seeding Financial Goal...');
    const financialGoal = {
      goal_id: `fg_${Date.now()}_demo`,
      user_id: userId,
      month: currentMonth,
      target_income: 15000.0,
      expenses: [
        { category: 'rent', amount: 1500.0, description: 'Monthly rent' },
        { category: 'car_payment', amount: 450.0, description: 'Car payment' },
        { category: 'electricity', amount: 150.0, description: 'Electricity' },
        { category: 'food', amount: 600.0, description: 'Groceries' },
        { category: 'water_bill', amount: 80.0, description: 'Water bill' },
        { category: 'cell_phone', amount: 100.0, description: 'Cell phone' },
        { category: 'insurance', amount: 250.0, description: 'Insurance' },
        { category: 'gym', amount: 50.0, description: 'Gym' },
        { category: 'entertainment', amount: 150.0, description: 'Entertainment' }
      ],
      total_expenses: 3330.0,
      income_gap: 11670.0,
      avg_sale: 1200.0,
      closing_rate: 22.0,
      tours_needed: 45,
      sales_needed: 10,
      created_at: today,
      updated_at: today
    };

    const existingGoal = await db.collection('financial_goals').findOne({
      user_id: userId,
      month: currentMonth
    });

    if (!existingGoal) {
      await db.collection('financial_goals').insertOne(financialGoal);
      console.log('✅ Financial Goal created: $15,000 target');
    } else {
      console.log('ℹ️  Financial Goal already exists');
    }

    // 2. Seed Daily Sales
    console.log('\n📅 Seeding Daily Sales...');
    const salesCount = await db.collection('daily_sales').countDocuments({ user_id: userId });

    if (salesCount < 5) {
      for (let day = 1; day <= 10; day++) {
        const saleDate = new Date(today);
        saleDate.setDate(day);
        saleDate.setHours(today.getHours(), today.getMinutes(), today.getSeconds());

        const dailySale = {
          record_id: `ds_${Date.now()}_${day}`,
          user_id: userId,
          date: saleDate.toISOString().slice(0, 10), // YYYY-MM-DD
          day_number: day,
          socio: `Client ${day}`,
          manager: 'Sales Manager',
          volume: 1000 + (day * 100),
          enganche_pct: 20,
          commission_pct: 18.5,
          milesingreso: 185.0 + (day * 10),
          daily_tip: 'Great momentum today!',
          created_at: saleDate
        };

        await db.collection('daily_sales').insertOne(dailySale);
        console.log(`  ✓ Day ${day}: $${dailySale.volume} sold`);
      }
      console.log('✅ Daily Sales seeded: 10 days');
    } else {
      console.log(`ℹ️  Daily Sales already exist: ${salesCount} records`);
    }

    // 3. Seed Personal Attributes
    console.log('\n🏆 Seeding Personal Attributes...');
    const attrCount = await db.collection('daily_attributes').countDocuments({ user_id: userId });

    if (attrCount < 7) {
      const attributes = ['attitude', 'courage', 'focus', 'training', 'discipline', 'persistence', 'commitment'];
      const attributePoints = {
        attitude: 10,
        courage: 10,
        focus: 10,
        training: 15,
        discipline: 20,
        persistence: 15,
        commitment: 25
      };

      for (const attr of attributes) {
        const attrDate = new Date();
        attrDate.setDate(today.getDate() - 1); // Yesterday

        await db.collection('daily_attributes').insertOne({
          attribute_id: `attr_${Date.now()}_${attr}`,
          user_id: userId,
          date: attrDate.toISOString().slice(0, 10),
          attribute_type: attr,
          achieved: true,
          notes: 'Crushed it today! Great mindset and action.',
          points_earned: attributePoints[attr],
          created_at: attrDate
        });
        console.log(`  ✓ ${attr.toUpperCase()}: +${attributePoints[attr]} pts`);
      }
      console.log('✅ Personal Attributes seeded: 7/7 (DAILY COMBO!)');
    } else {
      console.log(`ℹ️  Personal Attributes already exist: ${attrCount} records`);
    }

    // 4. Update User Progress
    console.log('\n📈 Updating User Progress...');
    const totalPoints = 25 + (10 * 10) + (6 * 15) + 100; // Goal + Sales + Attributes + Combo

    await db.collection('user_progress').updateOne(
      { user_id: userId },
      {
        $set: {
          points: totalPoints,
          updated_at: today
        },
        $inc: {
          training_streak: 5
        }
      }
    );
    console.log(`✅ User Progress updated: ${totalPoints} points`);

    // 5. Add Daily Challenge
    console.log('\n🎮 Seeding Daily Challenge...');
    const weekday = today.getDay(); // 0=Sunday, 1=Monday, etc.

    const challengeTypes = {
      1: { name: 'Monday Focus', points: 25 },
      2: { name: 'Tuesday Courage', points: 25 },
      3: { name: 'Wednesday Training', points: 25 },
      4: { name: 'Thursday Discipline', points: 25 },
      5: { name: 'Friday Persistence', points: 25 }
    };

    if (weekday >= 1 && weekday <= 5) {
      const challenge = challengeTypes[weekday];
      const challengeData = {
        challenge_id: `chal_${Date.now()}_demo`,
        user_id: userId,
        date: today.toISOString().slice(0, 10),
        challenge_type: challenge.name.toLowerCase().replace(' ', '_'),
        description: `Completa 3 tareas sin distracciones`,
        target_tasks: 3,
        completed_tasks: 3,
        points_awarded: challenge.points,
        completed: true,
        notes: 'Fully focused and crushed all tasks!',
        created_at: today
      };

      await db.collection('daily_challenges').insertOne(challengeData);
      console.log(`✅ Daily Challenge seeded: ${challenge.name} (+25 pts)`);
    } else {
      console.log('ℹ️  Weekend - No daily challenge');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ DEMO DATA SEEDING COMPLETE!');
    console.log('='.repeat(60));
    console.log('\n📊 SUMMARY:');
    console.log(`  ✓ Financial Goal: $15,000 target, $11,670 gap`);
    console.log(`  ✓ Daily Sales: 10 days logged`);
    console.log(`  ✓ Personal Attributes: 7/7 → DAILY COMBO +100 pts!`);
    console.log(`  ✓ Daily Challenge: Completed`);
    console.log(`  ✓ Total Points: ~${totalPoints}`);
    console.log('\n🎮 LOGIN:');
    console.log(`  Email: ${DEMO_USER_EMAIL}`);
    console.log(`  Password: demo123`);
    console.log('\n🌐 NAVIGATE TO:');
    console.log(`  http://localhost:3001/financial`);
    console.log(`  http://localhost:3001/daily-performance`);
    console.log(`  http://localhost:3001/analytics`);
    console.log(`  http://localhost:3001/strategy`);
    console.log('\n🎨 ENJOY THE FULLY POPULATED SYSTEM!');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await client.close();
    console.log('\n✅ Database connection closed');
  }
}

seedDemoData();
