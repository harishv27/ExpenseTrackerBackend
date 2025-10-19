const admin = require('firebase-admin');
const path = require('path');

// ✅ Correct path to your Firebase service account JSON file
const serviceAccount = require(path.resolve(__dirname, '../../expense-tracker-website-23755-firebase-adminsdk-fbsvc-4a84a3fbdf.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
