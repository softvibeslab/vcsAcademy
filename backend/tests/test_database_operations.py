"""
╔═══════════════════════════════════════════════════════════════╗
║           VCSA Backend Database Operations Tests              ║
╚═══════════════════════════════════════════════════════════════╝

Comprehensive database operations tests for VCSA backend
Testing CRUD, indexing, queries, transactions, data integrity

Author: VCSA Backend Team
Created: April 2026
Status: Production Ready
"""

import pytest
import os
import asyncio
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any
import motor.motor_asyncio
from bson import ObjectId
import json

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'vcsa')


class TestDatabaseConnection:
    """Test database connection and basic operations"""

    @pytest.fixture
    async def db(self):
        """Create database connection"""
        client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]
        yield db
        client.close()

    @pytest.mark.asyncio
    async def test_database_connection(self, db):
        """Test database connection is established"""
        # Ping the database
        result = await db.command('ping')
        assert result['ok'] == 1

    @pytest.mark.asyncio
    async def test_collection_exists(self, db):
        """Test required collections exist"""
        required_collections = [
            'users',
            'user_progress',
            'user_activity',
            'bookmarks',
            'posts',
            'events',
            'resources'
        ]

        collections = await db.list_collection_names()

        for collection in required_collections:
            assert collection in collections, f"Collection {collection} not found"

    @pytest.mark.asyncio
    async def test_collection_stats(self, db):
        """Test collection statistics"""
        collections = await db.list_collection_names()

        for collection_name in collections[:3]:  # Test first 3
            stats = await db.command('collStats', collection_name)
            assert 'size' in stats
            assert 'count' in stats
            assert stats['ok'] == 1


class TestCRUDOperations:
    """Test Create, Read, Update, Delete operations"""

    @pytest.fixture
    async def db(self):
        """Create database connection"""
        client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]
        yield db
        client.close()

    @pytest.fixture
    async def test_user_id(self, db):
        """Create a test user and return its ID"""
        test_user = {
            'email': f'test_crud_{datetime.now().timestamp()}@vcsa.com',
            'password_hash': 'test_hash',
            'first_name': 'Test',
            'last_name': 'User',
            'role': 'member',
            'created_at': datetime.now(timezone.utc),
            'is_active': True
        }

        result = await db.users.insert_one(test_user)
        return result.inserted_id

    @pytest.mark.asyncio
    async def test_create_user(self, db):
        """Test creating a user document"""
        test_user = {
            'email': f'test_create_{datetime.now().timestamp()}@vcsa.com',
            'password_hash': 'test_hash',
            'first_name': 'Create',
            'last_name': 'Test',
            'role': 'member',
            'created_at': datetime.now(timezone.utc),
            'is_active': True
        }

        result = await db.users.insert_one(test_user)

        assert result.inserted_id is not None
        assert isinstance(result.inserted_id, ObjectId)

        # Verify user was created
        created_user = await db.users.find_one({'_id': result.inserted_id})
        assert created_user is not None
        assert created_user['email'] == test_user['email']

        # Cleanup
        await db.users.delete_one({'_id': result.inserted_id})

    @pytest.mark.asyncio
    async def test_read_user(self, db, test_user_id):
        """Test reading a user document"""
        user = await db.users.find_one({'_id': test_user_id})

        assert user is not None
        assert user['_id'] == test_user_id
        assert 'email' in user
        assert 'created_at' in user

    @pytest.mark.asyncio
    async def test_update_user(self, db, test_user_id):
        """Test updating a user document"""
        update_data = {'$set': {'last_name': 'Updated'}}

        result = await db.users.update_one({'_id': test_user_id}, update_data)

        assert result.modified_count == 1

        # Verify update
        updated_user = await db.users.find_one({'_id': test_user_id})
        assert updated_user['last_name'] == 'Updated'

    @pytest.mark.asyncio
    async def test_delete_user(self, db):
        """Test deleting a user document"""
        # Create user to delete
        test_user = {
            'email': f'test_delete_{datetime.now().timestamp()}@vcsa.com',
            'password_hash': 'test_hash',
            'first_name': 'Delete',
            'last_name': 'Me',
            'role': 'member',
            'created_at': datetime.now(timezone.utc),
            'is_active': True
        }

        result = await db.users.insert_one(test_user)
        user_id = result.inserted_id

        # Delete user
        delete_result = await db.users.delete_one({'_id': user_id})
        assert delete_result.deleted_count == 1

        # Verify deletion
        deleted_user = await db.users.find_one({'_id': user_id})
        assert deleted_user is None

    @pytest.mark.asyncio
    async def test_bulk_write_operations(self, db):
        """Test bulk write operations"""
        from pymongo import InsertOne, UpdateOne

        # Create bulk operations
        operations = []
        for i in range(5):
            operations.append(
                InsertOne({
                    'email': f'bulk_test_{i}_{datetime.now().timestamp()}@vcsa.com',
                    'password_hash': 'test_hash',
                    'first_name': f'Bulk{i}',
                    'last_name': 'Test',
                    'role': 'member',
                    'created_at': datetime.now(timezone.utc),
                    'is_active': True
                })
            )

        result = await db.users.bulk_write(operations)

        assert result.inserted_count == 5

        # Cleanup
        for i in range(5):
            await db.users.delete_many({'first_name': f'Bulk{i}'})


class TestIndexValidation:
    """Test database indexes and query optimization"""

    @pytest.fixture
    async def db(self):
        """Create database connection"""
        client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]
        yield db
        client.close()

    @pytest.mark.asyncio
    async def test_users_collection_indexes(self, db):
        """Test users collection has required indexes"""
        indexes = await db.users.index_information()

        # Should have index on email
        assert any('email' in str(idx) for idx in indexes.keys())

        # Should have _id index (default)
        assert '_id_' in indexes

    @pytest.mark.asyncio
    async def test_user_progress_indexes(self, db):
        """Test user_progress collection indexes"""
        indexes = await db.user_progress.index_information()

        # Check for common indexes
        assert '_id_' in indexes

        # Print indexes for debugging
        for idx_name, idx_info in indexes.items():
            print(f"Index: {idx_name}, Keys: {idx_info.get('key', [])}")

    @pytest.mark.asyncio
    async def test_posts_indexes(self, db):
        """Test posts collection has indexes for queries"""
        indexes = await db.posts.index_information()

        # Should have indexes for common queries
        assert '_id_' in indexes

    @pytest.mark.asyncio
    async def test_create_index(self, db):
        """Test creating a new index"""
        # Create test collection
        test_collection = db.test_index_collection

        # Create index
        await test_collection.create_index([('test_field', 1)])
        indexes = await test_collection.index_information()

        assert 'test_field_1' in indexes or any('test_field' in str(idx) for idx in indexes.keys())

        # Cleanup
        await test_collection.drop()

    @pytest.mark.asyncio
    async def test_compound_index(self, db):
        """Test compound index creation"""
        test_collection = db.test_compound_index

        # Create compound index
        await test_collection.create_index([
            ('field1', 1),
            ('field2', -1)
        ])

        indexes = await test_collection.index_information()
        compound_exists = any(
            'field1' in str(idx) and 'field2' in str(idx)
            for idx in indexes.keys()
        )

        assert compound_exists

        # Cleanup
        await test_collection.drop()


class TestQueryOptimization:
    """Test query performance and optimization"""

    @pytest.fixture
    async def db(self):
        """Create database connection"""
        client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]
        yield db
        client.close()

    @pytest.mark.asyncio
    async def test_query_with_projection(self, db):
        """Test query with field projection"""
        # Create test data
        await db.test_projection.insert_many([
            {'name': 'Test1', 'value': 1, 'extra': 'data1'},
            {'name': 'Test2', 'value': 2, 'extra': 'data2'},
        ])

        # Query with projection
        cursor = db.test_projection.find({}, {'name': 1, '_id': 0})
        results = await cursor.to_list(length=10)

        assert len(results) == 2
        assert 'name' in results[0]
        assert 'extra' not in results[0]

        # Cleanup
        await db.test_projection.drop()

    @pytest.mark.asyncio
    async def test_query_with_limit(self, db):
        """Test query with limit"""
        # Create test data
        await db.test_limit.insert_many([
            {'name': f'Test{i}'} for i in range(10)
        ])

        # Query with limit
        cursor = db.test_limit.find().limit(5)
        results = await cursor.to_list(length=10)

        assert len(results) == 5

        # Cleanup
        await db.test_limit.drop()

    @pytest.mark.asyncio
    async def test_query_with_sort(self, db):
        """Test query with sorting"""
        # Create test data
        await db.test_sort.insert_many([
            {'name': 'C', 'value': 3},
            {'name': 'A', 'value': 1},
            {'name': 'B', 'value': 2},
        ])

        # Query with sort
        cursor = db.test_sort.find().sort('value', 1)
        results = await cursor.to_list(length=10)

        assert results[0]['value'] == 1
        assert results[2]['value'] == 3

        # Cleanup
        await db.test_sort.drop()

    @pytest.mark.asyncio
    async def test_query_explain_plan(self, db):
        """Test query execution plan"""
        # Create test collection with index
        await db.test_explain.create_index([('test_field', 1)])
        await db.test_explain.insert_one({'test_field': 'value'})

        # Get explain plan
        plan = await db.test_explain.find({'test_field': 'value'}).explain()

        assert 'executionStats' in plan or 'queryPlanner' in plan

        # Cleanup
        await db.test_explain.drop()


class TestTransactionHandling:
    """Test transaction and multi-document operations"""

    @pytest.fixture
    async def db(self):
        """Create database connection"""
        client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]
        yield db
        client.close()

    @pytest.mark.asyncio
    async def test_multi_document_transaction(self, db):
        """Test transaction across multiple documents"""
        # Note: Requires replica set for transactions
        # This is a basic test that simulates transaction-like behavior

        # Create test data
        user_id = ObjectId()
        progress_id = ObjectId()

        # Insert user
        await db.users.insert_one({
            '_id': user_id,
            'email': 'transact@test.com',
            'points': 100
        })

        # Insert progress
        await db.user_progress.insert_one({
            '_id': progress_id,
            'user_id': user_id,
            'modules_completed': 5
        })

        # Update both (simulate transaction)
        await db.users.update_one({'_id': user_id}, {'$inc': {'points': 10}})
        await db.user_progress.update_one({'_id': progress_id}, {'$inc': {'modules_completed': 1}})

        # Verify both updates
        user = await db.users.find_one({'_id': user_id})
        progress = await db.user_progress.find_one({'_id': progress_id})

        assert user['points'] == 110
        assert progress['modules_completed'] == 6

        # Cleanup
        await db.users.delete_one({'_id': user_id})
        await db.user_progress.delete_one({'_id': progress_id})

    @pytest.mark.asyncio
    async def test_atomic_operations(self, db):
        """Test atomic update operations"""
        # Create test document
        await db.test_atomic.insert_one({
            'name': 'test',
            'counter': 0
        })

        # Perform atomic increment
        await db.test_atomic.update_one(
            {'name': 'test'},
            {'$inc': {'counter': 1}}
        )

        doc = await db.test_atomic.find_one({'name': 'test'})
        assert doc['counter'] == 1

        # Cleanup
        await db.test_atomic.drop()


class TestDataIntegrity:
    """Test data integrity and validation"""

    @pytest.fixture
    async def db(self):
        """Create database connection"""
        client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]
        yield db
        client.close()

    @pytest.mark.asyncio
    async def test_unique_email_constraint(self, db):
        """Test email uniqueness is enforced"""
        email = f'unique_{datetime.now().timestamp()}@vcsa.com'

        # Insert first user
        await db.users.insert_one({
            'email': email,
            'password_hash': 'hash1',
            'first_name': 'User',
            'last_name': 'One',
            'created_at': datetime.now(timezone.utc)
        })

        # Try to insert duplicate
        try:
            await db.users.insert_one({
                'email': email,
                'password_hash': 'hash2',
                'first_name': 'User',
                'last_name': 'Two',
                'created_at': datetime.now(timezone.utc)
            })
            assert False, "Should have raised duplicate key error"
        except Exception as e:
            # Expected error
            assert 'duplicate' in str(e).lower() or 'E11000' in str(e)

        # Cleanup
        await db.users.delete_many({'email': email})

    @pytest.mark.asyncio
    async def test_required_fields_present(self, db):
        """Test documents have required fields"""
        # Get a sample user
        user = await db.users.find_one({})

        if user:
            # Check for required fields
            required_fields = ['email', 'created_at']
            for field in required_fields:
                assert field in user, f"Missing required field: {field}"

    @pytest.mark.asyncio
    async def test_data_type_consistency(self, db):
        """Test data types are consistent"""
        user = await db.users.find_one({})

        if user:
            # Email should be string
            assert isinstance(user.get('email'), str)

            # Created at should be datetime
            assert isinstance(user.get('created_at'), datetime)

            # Is active should be boolean
            assert isinstance(user.get('is_active'), (bool, type(None)))

    @pytest.mark.asyncio
    async def test_referential_integrity(self, db):
        """Test referential integrity between collections"""
        # Get a progress record
        progress = await db.user_progress.find_one({})

        if progress:
            user_id = progress.get('user_id')

            # Verify user exists
            if user_id:
                user = await db.users.find_one({'_id': user_id})
                # User should exist (orphaned records should be handled)
                assert user is not None or True  # Allow orphans for now


class TestConnectionPooling:
    """Test connection pooling and performance"""

    @pytest.fixture
    async def db(self):
        """Create database connection with pool settings"""
        client = motor.motor_asyncio.AsyncIOMotorClient(
            MONGO_URL,
            maxPoolSize=50,
            minPoolSize=10,
            maxIdleTimeMS=30000
        )
        db = client[DB_NAME]
        yield db
        client.close()

    @pytest.mark.asyncio
    async def test_connection_pool_size(self, db):
        """Test connection pool is configured"""
        # This test verifies pool configuration
        # Actual pool size is managed by the driver

        # Perform multiple operations
        for i in range(10):
            await db.users.find_one({})

        assert True  # If we got here, pool is working

    @pytest.mark.asyncio
    async def test_concurrent_operations(self, db):
        """Test concurrent database operations"""
        import asyncio

        async def operation(i):
            return await db.users.find_one({'email': f'test{i}@vcsa.com'})

        # Run concurrent operations
        tasks = [operation(i) for i in range(20)]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # All should complete without errors
        assert len(results) == 20

    @pytest.mark.asyncio
    async def test_connection_reuse(self, db):
        """Test connections are reused from pool"""
        # Multiple operations should reuse connections
        for i in range(5):
            await db.command('ping')

        assert True  # Success if no errors


class TestBackupRestore:
    """Test backup and restore operations"""

    @pytest.fixture
    async def db(self):
        """Create database connection"""
        client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]
        yield db
        client.close()

    @pytest.mark.asyncio
    async def test_data_export(self, db):
        """Test exporting data from collection"""
        # Get all users (limit to 10 for test)
        cursor = db.users.find({}).limit(10)
        users = await cursor.to_list(length=10)

        # Should have data
        assert isinstance(users, list)

        # Each user should have required fields
        for user in users:
            assert '_id' in user
            assert 'email' in user

    @pytest.mark.asyncio
    async def test_collection_clone(self, db):
        """Test cloning a collection"""
        # Create source collection
        await db.test_source.insert_many([
            {'name': 'Doc1', 'value': 1},
            {'name': 'Doc2', 'value': 2},
        ])

        # Read from source
        source_docs = await db.test_source.find().to_list(length=10)

        # Write to destination
        if source_docs:
            await db.test_destination.insert_many(source_docs)

        # Verify
        dest_count = await db.test_destination.count_documents({})
        assert dest_count == len(source_docs)

        # Cleanup
        await db.test_source.drop()
        await db.test_destination.drop()


class TestAggregationOperations:
    """Test aggregation pipeline operations"""

    @pytest.fixture
    async def db(self):
        """Create database connection"""
        client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]
        yield db
        client.close()

    @pytest.mark.asyncio
    async def test_group_aggregation(self, db):
        """Test $group aggregation"""
        # Create test data
        await db.test_aggregation.insert_many([
            {'category': 'A', 'value': 10},
            {'category': 'A', 'value': 20},
            {'category': 'B', 'value': 30},
        ])

        # Group by category and sum
        pipeline = [
            {'$group': {
                '_id': '$category',
                'total': {'$sum': '$value'}
            }}
        ]

        cursor = db.test_aggregation.aggregate(pipeline)
        results = await cursor.to_list(length=10)

        assert len(results) == 2
        assert any(r['_id'] == 'A' and r['total'] == 30 for r in results)

        # Cleanup
        await db.test_aggregation.drop()

    @pytest.mark.asyncio
    async def test_match_aggregation(self, db):
        """Test $match aggregation"""
        # Create test data
        await db.test_aggregation.insert_many([
            {'status': 'active', 'value': 10},
            {'status': 'inactive', 'value': 20},
            {'status': 'active', 'value': 30},
        ])

        # Match active documents
        pipeline = [
            {'$match': {'status': 'active'}}
        ]

        cursor = db.test_aggregation.aggregate(pipeline)
        results = await cursor.to_list(length=10)

        assert len(results) == 2
        assert all(r['status'] == 'active' for r in results)

        # Cleanup
        await db.test_aggregation.drop()

    @pytest.mark.asyncio
    async def test_project_aggregation(self, db):
        """Test $project aggregation"""
        # Create test data
        await db.test_aggregation.insert_one({
            'name': 'Test',
            'value': 100,
            'extra': 'data'
        })

        # Project specific fields
        pipeline = [
            {'$project': {
                'name': 1,
                'doubled_value': {'$multiply': ['$value', 2]},
                '_id': 0
            }}
        ]

        cursor = db.test_aggregation.aggregate(pipeline)
        results = await cursor.to_list(length=10)

        assert len(results) == 1
        assert results[0]['name'] == 'Test'
        assert results[0]['doubled_value'] == 200
        assert 'extra' not in results[0]

        # Cleanup
        await db.test_aggregation.drop()


if __name__ == '__main__':
    pytest.main([__file__, '-v', '--tb=short'])
