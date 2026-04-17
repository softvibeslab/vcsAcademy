// Create Admin User in MongoDB
// Run with: mongo localhost:27019/vcsa create_admin.js

db.users.insertOne({
  user_id: "user_admin_local_001",
  email: "admin@vcsa.com",
  password_hash: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYCWwivcDvW", // admin123
  name: "Admin User",
  picture: null,
  role: "admin",
  membership: "vip",
  level: 10,
  points: 9999,
  created_at: new Date().toISOString(),
  is_active: true,
  email_verified: true
});

print("✅ Admin user created successfully!");
print("📧 Email: admin@vcsa.com");
print("🔑 Password: admin123");
