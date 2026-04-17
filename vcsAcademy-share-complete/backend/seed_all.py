#!/usr/bin/env python3
"""
Master Seed Script - Run all seeders in order
Run: docker-compose exec backend python seed_all.py
"""

import asyncio
import subprocess
import sys
import os
from pathlib import Path

ROOT_DIR = Path(__file__).parent

async def run_seeder(script_name):
    """Run a single seeder script"""
    print(f"\n{'='*60}")
    print(f"🌱 Running: {script_name}")
    print(f"{'='*60}\n")

    script_path = ROOT_DIR / script_name

    if not script_path.exists():
        print(f"⚠️  Script not found: {script_name}")
        return False

    result = subprocess.run(
        ["python", str(script_path)],
        cwd=ROOT_DIR,
        capture_output=False,
        text=True
    )

    if result.returncode != 0:
        print(f"❌ Error running {script_name}")
        return False

    print(f"✅ Completed: {script_name}")
    return True

async def main():
    """Run all seeders in sequence"""
    seeders = [
        ("seed_branding.py", "Branding Configuration"),
        ("seed_phase1_content.py", "Phase 1 Content (Tracks, Stages, Badges)"),
        ("seed_test_users.py", "Test Users"),
        ("seed_organizations.py", "Test Organization"),
        ("seed_coaching.py", "Coaching Content"),
        ("seed_knowledge_hub.py", "Knowledge Hub Content")
    ]

    print("\n" + "="*60)
    print("🌱 VCSA Master Seed Script")
    print("="*60 + "\n")

    print("This will seed the database with:")
    for i, (script, description) in enumerate(seeders, 1):
        print(f"  {i}. {description}")

    print("\n⚠️  This will clear and replace existing test data.")
    response = input("\nContinue? (y/N): ")

    if response.lower() != 'y':
        print("❌ Aborted.")
        sys.exit(0)

    failed = []
    successful = []

    for script_name, description in seeders:
        success = await run_seeder(script_name)
        if success:
            successful.append(description)
        else:
            failed.append(script_name)

    print(f"\n{'='*60}")
    print("🎉 Seeding Complete!")
    print(f"{'='*60}\n")

    print(f"✅ Successful: {len(successful)}/{len(seeders)}")
    for desc in successful:
        print(f"   ✓ {desc}")

    if failed:
        print(f"\n❌ Failed: {len(failed)}/{len(seeders)}")
        for script in failed:
            print(f"   ✗ {script}")
        sys.exit(1)
    else:
        print("\n✅ All seeders completed successfully!")
        print("\n📝 Test Credentials:")
        print("   🧑‍💼 Vendedor: sales@vcsa.com / sales123")
        print("   👑 Admin:    admin@vcsa.com / admin123")
        print("   🎨 Creator:  creator@vcsa.com / creator123")
        print("\n🚀 Access the application at:")
        print("   Frontend: http://localhost:3001")
        print("   Backend API: http://localhost:8001")
        print("   API Docs: http://localhost:8001/docs")

if __name__ == "__main__":
    asyncio.run(main())
