require("dotenv").config({ path: ".env" });
const config = require("config");
const { ObjectId } = require("mongodb");
const MongoDBConnection = require("./helpers/MongoDBConnection");
const mongoDBConnection = new MongoDBConnection();
const mongoCollections = config.get("mongoCollections");

async function bootstrap() {
    try {
        console.log("Starting bootstrap process...");

        // 1. Wait for connection
        // The constructor calls connect, but we should ensure it's ready
        // Based on MongoDBConnection.js, it's an async connect call in constructor which might not be awaited
        // Let's manually trigger connect to be safe
        await mongoDBConnection.connect(config.get("mongoDBConfig.DB"));

        // 2. Check/Create Organization
        let org = await mongoDBConnection.findOne(mongoCollections.ORG, { name: "Default Org" });
        let org_id;
        if (!org) {
            console.log("Creating default organization...");
            const orgResult = await mongoDBConnection.insertOne(mongoCollections.ORG, {
                name: "Default Org",
                created_at: new Date(),
                status: 1,
            });
            org_id = orgResult.insertedId.toString();
        } else {
            org_id = org._id.toString();
        }

        // 3. Check/Create Super Admin User
        const adminEmail = "kavin@cloudheard.org";
        let admin = await mongoDBConnection.findOne(mongoCollections.USERS, { email: adminEmail });
        if (!admin) {
            console.log(`Creating super admin user: ${adminEmail}...`);
            await mongoDBConnection.insertOne(mongoCollections.USERS, {
                name: "Super Admin",
                email: adminEmail,
                phone: "",
                role_type: "admin",
                status: 1,
                onboarding_status: "1",
                org_id: org_id,
                created_at: new Date(),
                updated_at: new Date(),
            });
            console.log("Super admin created successfully.");
        } else {
            console.log("Super admin already exists.");
        }

        console.log("Bootstrap completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Bootstrap failed:", error);
        process.exit(1);
    }
}

bootstrap();
