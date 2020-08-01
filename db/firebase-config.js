const admin = require("firebase-admin");
const serviceAccount = require("../credentials/firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL,
  authDomain: process.env.AUTH_DOMAIN,
});

const db = admin.firestore();

module.exports = db;
