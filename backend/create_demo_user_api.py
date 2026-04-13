#!/usr/bin/env python3
"""
Create demo user using the REST API
"""
import requests
import json

API_URL = "http://localhost:2345"

# Demo user data
demo_user = {
    "name": "Sarah Johnson",
    "email": "sarah.johnson@vcsa.com",
    "password": "demo123",
    "role": "member",
    "tier": "premium"
}

def create_demo_user():
    """Create demo user via registration API"""

    try:
        # Register the user
        print("📝 Creating demo user account...")
        response = requests.post(
            f"{API_URL}/api/auth/register",
            json=demo_user,
            headers={"Content-Type": "application/json"}
        )

        if response.status_code == 200:
            data = response.json()
            print("✅ User created successfully!")

            user_data = data.get('data', {}).get('user', {})
            print(f"\n👤 User Profile:")
            print(f"   Name: {user_data.get('name', 'Sarah Johnson')}")
            print(f"   Email: {user_data.get('email', 'sarah.johnson@vcsa.com')}")
            print(f"   Role: {user_data.get('role', 'member')}")
            print(f"   Tier: {user_data.get('tier', 'premium')}")

            print("\n" + "="*60)
            print("🎉 DEMO USER READY TO USE!")
            print("="*60)
            print("\n📧 Login Credentials:")
            print("   Email: sarah.johnson@vcsa.com")
            print("   Password: demo123")
            print("\n🚀 Login at: http://localhost:1234/login")
            print("\n✨ This user has:")
            print("   • Fresh account ready to explore")
            print("   • Premium tier access")
            print("   • Can test all modules")
            print("\n💡 Tip: Complete onboarding to see full dashboard")
            print("="*60)

            return True
        elif response.status_code == 400 and "already registered" in response.text:
            print("✅ Demo user already exists!")
            print("\n📧 Login Credentials:")
            print("   Email: sarah.johnson@vcsa.com")
            print("   Password: demo123")
            print("\n🚀 Login at: http://localhost:1234/login")
            return True
        else:
            print(f"❌ Error creating user: {response.status_code}")
            print(f"Response: {response.text}")
            return False

    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == '__main__':
    create_demo_user()
