// firebaseService.js

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, get, update, child } = require('firebase/database');

// Function to get the current date in EST
const getTodayInEST = () => {
  const currentDate = new Date();
  const offset = -4; // EST
  const estDate = new Date(currentDate.getTime() + offset * 3600 * 1000).toISOString().split('T')[0];
  return estDate;
};

if (!process.env.FIREBASE_API_KEY) {
  throw new Error('Environment variables for Firebase are not set');
}

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const recordActivity = async (userId, activity, value) => {
  const today = getTodayInEST(); // Using EST date
  const userRef = ref(db, `activities/${userId}/${today}`);
  
  // Fetch existing data
  const snapshot = await get(child(userRef, activity));
  
  let newActivityCount = Number(value);
  
  if (snapshot.exists()) {
    // Accumulate with existing count if it exists
    newActivityCount += Number(snapshot.val());
  }
  
  // Update or set new count
  await update(userRef, { [activity]: newActivityCount });
  
  return newActivityCount; // Return the updated count for the response message
};

const fetchTodayActivities = async (userId, date) => {
  const refPath = `activities/${userId}/${date}`;
  const activityRef = ref(db, refPath);
  const snapshot = await get(activityRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return {};
};

// Clear a specific activity for the user for today
const clearActivity = async (userId, activity) => {
  const today = getTodayInEST(); // Using EST date
  const activityRef = ref(db, `activities/${userId}/${today}/${activity}`);
  
  await set(activityRef, 0);
};

module.exports = {
  recordActivity,
  clearActivity,
  fetchTodayActivities
};
