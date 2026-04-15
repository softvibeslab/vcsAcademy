#!/usr/bin/env python3
"""
VCSA MongoDB Connection Verification Script

Tests MongoDB Atlas connection and configuration
"""

import os
import sys
import asyncio
from datetime import datetime
from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError, OperationFailure

# Configuration
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'vcsa')

class Colors:
    GREEN = '\033[0;32m'
    RED = '\033[0;31m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    NC = '\033[0m'

def print_pass(message):
    print(f"{Colors.GREEN}✓ PASS{Colors.NC}: {message}")

def print_fail(message):
    print(f"{Colors.RED}✗ FAIL{Colors.NC}: {message}")

def print_warn(message):
    print(f"{Colors.YELLOW}⚠ WARN{Colors.NC}: {message}")

def print_info(message):
    print(f"{Colors.BLUE}ℹ INFO{Colors.NC}: {message}")

def print_header(message):
    print(f"\n{Colors.BLUE}{'═'*60}{Colors.NC}")
    print(f"{Colors.BLUE}  {message}{Colors.NC}")
    print(f"{Colors.BLUE}{'═'*60}{Colors.NC}\n")

async def test_connection():
    """Test 1: Database Connection"""
    print_info("Test 1: Database Connection")

    try:
        client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=5000)
        result = client.admin.command('ping')
        print_pass("Database connection successful")
        print(f"  Ping response: {result}")
        return client
    except ConnectionFailure as e:
        print_fail(f"Connection failed: {e}")
        return None
    except ServerSelectionTimeoutError as e:
        print_fail(f"Server selection timeout: {e}")
        return None
    except Exception as e:
        print_fail(f"Unexpected error: {e}")
        return None

def test_database_info(client):
    """Test 2: Database Information"""
    print_info("Test 2: Database Information")

    try:
        db = client[DB_NAME]

        # Get database stats
        stats = db.command('dbStats')
        print_pass("Database information retrieved")
        print(f"  Database: {DB_NAME}")
        print(f"  Collections: {stats.get('collections', 0)}")
        print(f"  Data size: {stats.get('dataSize', 0) / 1024 / 1024:.2f} MB")
        print(f"  Index size: {stats.get('indexSize', 0) / 1024 / 1024:.2f} MB")

        return db
    except Exception as e:
        print_fail(f"Failed to get database info: {e}")
        return None

def test_collections(db):
    """Test 3: Collections Exist"""
    print_info("Test 3: Collections Verification")

    expected_collections = [
        'users',
        'user_progress',
        'user_activity',
        'bookmarks',
        'posts',
        'comments',
        'events',
        'resources',
        'subscription_events',
        'coaching_content'
    ]

    existing_collections = db.list_collection_names()
    missing_collections = []

    for collection_name in expected_collections:
        if collection_name in existing_collections:
            count = db[collection_name].count_documents({})
            print_pass(f"Collection '{collection_name}' exists ({count} documents)")
        else:
            print_warn(f"Collection '{collection_name}' missing")
            missing_collections.append(collection_name)

    return len(missing_collections) == 0

def test_indexes(db):
    """Test 4: Indexes Verification"""
    print_info("Test 4: Indexes Verification")

    collections_to_check = ['users', 'user_progress', 'posts', 'events']
    all_indexes_ok = True

    for collection_name in collections_to_check:
        try:
            collection = db[collection_name]
            indexes = list(collection.list_indexes())
            print_pass(f"Collection '{collection_name}' has {len(indexes)} indexes")

            # Check for required indexes
            if collection_name == 'users':
                index_names = [idx['name'] for idx in indexes]
                if 'email_1' in index_names:
                    print_pass("  - Email index exists")
                if 'user_id_1' in index_names:
                    print_pass("  - User ID index exists")

        except Exception as e:
            print_fail(f"Failed to check indexes for '{collection_name}': {e}")
            all_indexes_ok = False

    return all_indexes_ok

def test_connection_pooling():
    """Test 5: Connection Pooling"""
    print_info("Test 5: Connection Pooling")

    try:
        # Test multiple concurrent connections
        import asyncio

        async def test_concurrent_connections():
            from motor.motor_asyncio import AsyncIOMotorClient

            client = AsyncIOMotorClient(
                MONGO_URL,
                maxPoolSize=100,
                minPoolSize=10,
                maxIdleTimeMS=10000
            )

            # Test concurrent connections
            tasks = []
            for i in range(20):
                task = client.admin.command('ping')
                tasks.append(task)

            results = await asyncio.gather(*tasks, return_exceptions=True)

            successful = sum(1 for r in results if isinstance(r, dict))

            if successful == 20:
                print_pass(f"Connection pooling successful ({successful}/20 connections)")
                return True
            else:
                print_warn(f"Some connections failed ({successful}/20 successful)")
                return False

            await client.close()

        return asyncio.run(test_concurrent_connections())

    except ImportError:
        print_warn("Motor not installed, skipping async connection test")
        return None
    except Exception as e:
        print_fail(f"Connection pooling test failed: {e}")
        return False

def test_read_write_operations(db):
    """Test 6: Read/Write Operations"""
    print_info("Test 6: Read/Write Operations")

    try:
        # Test read
        user_count = db.users.count_documents({})
        print_pass(f"Read operation successful ({user_count} users)")

        # Test write (in test collection)
        test_collection = db['test_connection']

        # Insert test document
        test_doc = {
            'test': True,
            'timestamp': datetime.now(),
            'connection_test': 'verification'
        }

        result = test_collection.insert_one(test_doc)
        print_pass(f"Write operation successful (inserted ID: {result.inserted_id})")

        # Clean up
        test_collection.delete_one({'_id': result.inserted_id})
        print_pass("Cleanup operation successful")

        return True

    except OperationFailure as e:
        print_fail(f"Operation failed: {e}")
        return False
    except Exception as e:
        print_fail(f"Unexpected error: {e}")
        return False

def test_backup_config():
    """Test 7: Backup Configuration"""
    print_info("Test 7: Backup Configuration (Manual Verification Required)")

    print_warn("Backup configuration must be verified in MongoDB Atlas dashboard:")
    print("  1. Navigate to Backup → Snapshot")
    print("  2. Verify 'Continuous Backup' is enabled")
    print("  3. Check retention period (should be 30 days)")
    print("  4. Verify snapshot schedule")

    # Check if we can access backup info via API (requires additional setup)
    return None

def main():
    """Main verification function"""
    print_header("MongoDB Connection Verification")
    print(f"MongoDB URL: {MONGO_URL[:30]}...")
    print(f"Database: {DB_NAME}")
    print("")

    # Run tests
    client = asyncio.run(test_connection())
    if not client:
        print_fail("Cannot continue without database connection")
        return False

    db = test_database_info(client)
    if not db:
        return False

    # Run all tests
    test_results = {
        'connection': True,
        'database_info': True,
        'collections': test_collections(db),
        'indexes': test_indexes(db),
        'connection_pooling': test_connection_pooling(),
        'read_write': test_read_write_operations(db),
        'backup': test_backup_config()
    }

    # Summary
    print_header("Verification Summary")

    passed = sum(1 for v in test_results.values() if v is True)
    failed = sum(1 for v in test_results.values() if v is False)
    warnings = sum(1 for v in test_results.values() if v is None)

    print(f"{Colors.GREEN}Passed{Colors.NC}: {passed}")
    print(f"{Colors.YELLOW}Warnings{Colors.NC}: {warnings}")
    print(f"{Colors.RED}Failed{Colors.NC}: {failed}")
    print("")

    if failed == 0:
        print_pass("All critical tests passed!")
        print_info("Next steps:")
        print("  1. Configure indexes if missing")
        print("  2. Setup backup verification")
        print("  3. Configure monitoring alerts")
        print("  4. Test with production workload")
        return True
    else:
        print_fail("Some tests failed. Please review and fix issues.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
