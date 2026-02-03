const { MongoClient, ObjectId } = require('mongodb');
const config = require("config");

class MongoConnection {
    constructor() {
        this.db_config = config.get("mongoDBConfig");

        this.client = new MongoClient(
            this.db_config.URI,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        this.db = null;

        this.connect = this.connect.bind(this);
        this.connect(this.db_config.DB);
    }

    async connect(dbName) {
        if (!this.db) {
            await this.client.connect();
            this.db = this.client.db(dbName);
            console.log(`Connected to MongoDB database: ${dbName}`);
        }
        return this.db;
    }

    async close() {
        await this.client.close();
        this.db = null;
    }

    // Get a collection
    getCollection(collectionName) {
        return this.db.collection(collectionName);
    }

    // Insert one document
    async insertOne(collectionName, document) {
        const collection = this.getCollection(collectionName);
        return await collection.insertOne(document);
    }

    // Insert multiple documents
    async insertMany(collectionName, documents) {
        const collection = this.getCollection(collectionName);
        return await collection.insertMany(documents);
    }

    // Find documents with filter
    async find(collectionName, query = {}, options = {}) {

        if (Object.keys(query).includes('_id') && ObjectId.isValid(query['_id'])) {
            query['_id'] = new ObjectId(query['_id'])
        }

        if (options.page != undefined && options.limit != undefined) {
            const page = parseInt(options.page) || 1;
            const limit = parseInt(options.limit) || 10;
            const skip = (page - 1) * limit;

            const { page: _, limit: __, ...mongoOptions } = options;

            const collection = this.getCollection(collectionName);
            const cursor = collection.find(query, mongoOptions).skip(skip).limit(limit);
            let results = await cursor.toArray();

            results = results.map((item) => {
                item.id = item._id.toString();

                delete item._id;
                return item;
            });
            const totalCount = await collection.countDocuments(query);

            return {
                items: results,
                total: totalCount,
                page,
                limit,
                total_pages: Math.ceil(totalCount / limit)
            }
        }
        else {
            const collection = this.getCollection(collectionName);
            const cursor = await collection.find(query, options)
            let results = await cursor.toArray();

            results = results.map((item) => {
                item.id = item._id.toString();

                delete item._id;
                return item;
            });
            return {
                items: results,
            }
        }
    }

    // Find one document
    async findOne(collectionName, query = {}, options = {}) {
        const collection = this.getCollection(collectionName);
        return await collection.findOne(query, options);
    }

    // Update one document
    async updateOne(collectionName, filter, updateDoc, options = {}) {
        const collection = this.getCollection(collectionName);
        return await collection.updateOne(filter, updateDoc, options);
    }

    // Bulk write operations
    async bulkWrite(collectionName, operations, options = {}) {
        const collection = this.getCollection(collectionName);
        return await collection.bulkWrite(operations, options);
    }

    // Update many documents
    async updateMany(collectionName, filter, updateDoc, options = {}) {
        const collection = this.getCollection(collectionName);
        return await collection.updateMany(filter, updateDoc, options);
    }

    // Delete one document
    async deleteOne(collectionName, filter) {
        const collection = this.getCollection(collectionName);
        return await collection.deleteOne(filter);
    }

    // Delete many documents
    async deleteMany(collectionName, filter) {
        const collection = this.getCollection(collectionName);
        return await collection.deleteMany(filter);
    }

    // Count documents
    async countDocuments(collectionName, query = {}) {
        const collection = this.getCollection(collectionName);
        return await collection.countDocuments(query);
    }

    // Create index
    async createIndex(collectionName, indexSpec, options = {}) {
        const collection = this.getCollection(collectionName);
        return await collection.createIndex(indexSpec, options);
    }

    // Drop index
    async dropIndex(collectionName, indexName) {
        const collection = this.getCollection(collectionName);
        return await collection.dropIndex(indexName);
    }

    // List indexes
    async listIndexes(collectionName) {
        const collection = this.getCollection(collectionName);
        return await collection.listIndexes().toArray();
    }

    // Run aggregation pipeline
    async aggregate(collectionName, pipeline = []) {
        const collection = this.getCollection(collectionName);
        return await collection.aggregate(pipeline).toArray();
    }

    // Drop collection
    async dropCollection(collectionName) {
        const collection = this.getCollection(collectionName);
        return await collection.drop();
    }

    // List all collections
    async listCollections(filter = {}, options = {}) {
        return await this.db.listCollections(filter, options).toArray();
    }

    // Start a transaction (advanced use)
    async withTransaction(fn) {
        const session = this.client.startSession();
        try {
            let result;
            await session.withTransaction(async () => {
                result = await fn(session);
            });
            return result;
        } finally {
            await session.endSession();
        }
    }

    // Ping database
    async ping() {
        return await this.db.command({ ping: 1 });
    }
}

module.exports = MongoConnection;
