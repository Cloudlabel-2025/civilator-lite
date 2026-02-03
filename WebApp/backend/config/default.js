module.exports = {
	production: process.env.PRODUCTION,
	hostname: process.env.HOSTNAME,
	port: process.env.PORT,
	BASE_URL: process.env.BASE_URL,

	AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
	AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
	AWS_REGION: process.env.AWS_REGION,
	AWS_BUCKET: process.env.AWS_BUCKET,

	SMS_CONFIG: {
		TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
		TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
		TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
	},

	authConfig: {
		EMAIL_LENGTH: 40,
		PASSWORD_LENGTH: 25,
		NAME_LENGTH: 25,
		AUTH_SECRET: process.env.AUTH_SECRET,
		AUTH_COOKIE_EXPIRE_TIME: "1200s",
		AUTH_COOKIE_ALGORITHM: "HS384",
		ACCESS_TOKEN: process.env.ACCESS_TOKEN
	},
	aws: {
		bucket: process.env.AWS_BUCKET,
		accessKey: process.env.AWS_ACCESS_KEY,
		secretKey: process.env.AWS_SECRET_ACCESS_KEY,
		region: process.env.AWS_REGION,
	},
	reverseProxy: {
		frontendBaseUrl: "",
	},

	mongoDBConfig: {
		URI: process.env.MONGO_URI,
		DB: process.env.MONGO_DB
	},
	mongoCollections: {
		ORG: `org`,
		USERS: `users`,
		SITES: `sites`,
		ROLES: `roles`,
		VENDORS: `vendors`,
		EMPLOYEES: `employees`,
		MASTER_MATERIALS: `master_materials`,
		MASTER_BRANDS: `master_brands`,
		MASTER_LABORS: `master_labors`,
		EXPENSES: `expenses`,
		PAYMENTS: `payments`,
		PROCUREMENT: `procurement`,
		INVENTORY: `inventory`,
		TASKS: `tasks`,
		ATTENDANCES: `attendances`,
		ATTENDANC_EVENTS: `attendances_events`,
		CONTACT_US: `contact_us`
	},


};