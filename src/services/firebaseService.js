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

const getTotalActivitiesSummary = async (userId) => {
  const userActivitiesRef = ref(db, `activities/${userId}`); // Corrected path
  const snapshot = await get(userActivitiesRef);
  if (snapshot.exists()) {
      const allData = snapshot.val();
      console.log("All Data:", allData); // Debugging log

      let activitiesSummary = {};
      let totalDaysTracked = 0;

      Object.keys(allData).forEach(date => {
          // Exclude non-date keys like 'dips', 'pushups', etc.
          if (date.match(/^\d{4}-\d{2}-\d{2}$/)) { 
              console.log(`Processing date: ${date}`, allData[date]); // Debugging log
              if (allData[date] && typeof allData[date] === 'object') {
                  totalDaysTracked++;  
                  Object.entries(allData[date]).forEach(([activity, count]) => {
                      if (activity !== 'weight') {
                          activitiesSummary[activity] = (activitiesSummary[activity] || 0) + count;
                          console.log(`Updated summary for ${activity}:`, activitiesSummary[activity]); // Debugging log
                      }
                  });
              }
          }
      });

      console.log("Final Summary:", activitiesSummary, "Total Days:", totalDaysTracked); // Debugging log
      return { activitiesSummary, totalDaysTracked };
  } else {
      console.log("No data found for user:", userId); // Debugging log
      return { activitiesSummary: {}, totalDaysTracked: 0 };
  }
};

const getWeeklyActivitiesSummary = async (userId) => {
  const userActivitiesRef = ref(db, `activities/${userId}`);
  const snapshot = await get(userActivitiesRef);
  if (snapshot.exists()) {
    const allData = snapshot.val();
    let activitiesSummary = {};
    let totalDaysTracked = 0;

    let totalWeight = 0;
    let weightEntries = 0;

    Object.keys(allData).forEach(date => {
      if (isDateInCurrentWeek(date)) {
        totalDaysTracked++;

        Object.entries(allData[date]).forEach(([activity, count]) => {
          if (activity !== 'weight') {
            activitiesSummary[activity] = (activitiesSummary[activity] || 0) + count;
          } else {
            totalWeight += count;
            weightEntries++;
          }
        });
      }
    });

    const averageWeight = weightEntries > 0 ? totalWeight / weightEntries : 0;

    return { activitiesSummary, totalDaysTracked, averageWeight };
  } else {
    return { activitiesSummary: {}, totalDaysTracked: 0, averageWeight: 0 };
  }
};


const getMonthlyActivitiesSummary = async (userId) => {
  const userActivitiesRef = ref(db, `activities/${userId}`);
  const snapshot = await get(userActivitiesRef);
  if (snapshot.exists()) {
    const allData = snapshot.val();
    let activitiesSummary = {};
    let totalDaysTracked = 0;

    let totalWeight = 0;
    let weightEntries = 0;

    Object.keys(allData).forEach(date => {
      const dateObj = new Date(date);
      if (isCurrentMonth(dateObj)) {
        totalDaysTracked++;

        Object.entries(allData[date]).forEach(([activity, count]) => {
          if (activity !== 'weight') {
            activitiesSummary[activity] = (activitiesSummary[activity] || 0) + count;
          } else {
            totalWeight += count;
            weightEntries++;
          }
        });
      }
    });

    const averageWeight = weightEntries > 0 ? totalWeight / weightEntries : 0;

    return { activitiesSummary, totalDaysTracked, averageWeight };
  } else {
    return { activitiesSummary: {}, totalDaysTracked: 0, averageWeight: 0 };
  }
};

const isCurrentWeek = (date) => {
  const now = new Date();
  const firstDayOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

  return date >= firstDayOfWeek && date <= lastDayOfWeek;
};

const isCurrentMonth = (date) => {
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

// Adjusted utility function to check if a date is in the current week
const isDateInCurrentWeek = (dateString) => {
  const date = new Date(dateString);
  return isCurrentWeek(date);
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
  fetchTodayActivities,
  getTotalActivitiesSummary,
  getWeeklyActivitiesSummary,
  getMonthlyActivitiesSummary
};
