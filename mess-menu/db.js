require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");

// User Schema matching the website
const UserSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  uploads: [
    {
      serverId: { type: String, required: true },
      serverName: { type: String, required: true },
      channelId: { type: String },
      channelName: { type: String },
      fileUrl: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
  mealSchedules: [
    {
      serverId: { type: String, required: true },
      roleId: { type: String },
      roleName: { type: String },
      breakfast: { type: String },
      lunch: { type: String },
      snacks: { type: String },
      dinner: { type: String },
      updatedAt: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.model("User", UserSchema);

// Connect to MongoDB
let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// Fetch menu data from Cloudinary URL
async function fetchMenuFromUrl(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching menu from URL: ${error.message}`);
    return null;
  }
}

// Get menu data for a specific server
async function getMenuForServer(serverId) {
  try {
    const users = await User.find({ "uploads.serverId": serverId });
    
    if (users.length === 0) {
      return null;
    }

    // Get the most recent upload for this server
    let latestUpload = null;
    let latestTime = new Date(0);

    for (const user of users) {
      for (const upload of user.uploads) {
        if (upload.serverId === serverId) {
          const uploadTime = new Date(upload.uploadedAt);
          if (uploadTime > latestTime) {
            latestTime = uploadTime;
            latestUpload = upload;
          }
        }
      }
    }

    if (!latestUpload) {
      return null;
    }

    const menuData = await fetchMenuFromUrl(latestUpload.fileUrl);
    
    return {
      menu: menuData,
      channelId: latestUpload.channelId,
      serverName: latestUpload.serverName,
    };
  } catch (error) {
    console.error(`Error getting menu for server: ${error.message}`);
    return null;
  }
}

// Get meal schedule for a specific server
async function getMealScheduleForServer(serverId) {
  try {
    const users = await User.find({ "mealSchedules.serverId": serverId });
    
    if (users.length === 0) {
      return null;
    }

    // Get the most recent schedule for this server
    let latestSchedule = null;
    let latestTime = new Date(0);

    for (const user of users) {
      for (const schedule of user.mealSchedules) {
        if (schedule.serverId === serverId) {
          const scheduleTime = new Date(schedule.updatedAt);
          if (scheduleTime > latestTime) {
            latestTime = scheduleTime;
            latestSchedule = schedule;
          }
        }
      }
    }

    return latestSchedule;
  } catch (error) {
    console.error(`Error getting meal schedule for server: ${error.message}`);
    return null;
  }
}

// Parse time string to cron format
// Input: "7:15 AM" (45 min before meal)
// Output: "15 7 * * *" (7:15 AM every day)
function parseTimeToCron(timeString) {
  if (!timeString) return null;
  
  try {
    const [time, period] = timeString.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    
    let hour24 = hours;
    if (period?.toUpperCase() === "PM" && hours !== 12) {
      hour24 = hours + 12;
    } else if (period?.toUpperCase() === "AM" && hours === 12) {
      hour24 = 0;
    }
    
    return `${minutes} ${hour24} * * *`;
  } catch (error) {
    console.error(`Error parsing time: ${timeString}`, error);
    return null;
  }
}

module.exports = {
  connectDB,
  getMenuForServer,
  getMealScheduleForServer,
  parseTimeToCron,
  User,
};

