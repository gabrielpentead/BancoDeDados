// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'your-project-id.appspot.com'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { db, bucket };
