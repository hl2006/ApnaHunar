/**
 * storage.js - LocalStorage Database Layer
 * Handles user persistence, sessions, and CRUD operations for skills, certificates, and internships.
 */

const STORAGE_KEYS = {
  USERS: 'sst_users',
  CURRENT_USER_EMAIL: 'sst_current_user_email'
};

/**
 * Fetch all registered users
 * @returns {Array} List of users
 */
function getUsers() {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
}

/**
 * Save the entire users list
 * @param {Array} users 
 */
function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

/**
 * Get current logged in user's email
 * @returns {string|null} Email or null
 */
function getCurrentUserEmail() {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_EMAIL);
}

/**
 * Set the current logged in user's email
 * @param {string} email 
 */
function setCurrentUserEmail(email) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER_EMAIL, email);
}

/**
 * Get the current user details
 * @returns {Object|null} Current user object
 */
function getCurrentUser() {
  const email = getCurrentUserEmail();
  if (!email) return null;
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Update current user data in storage
 * @param {Object} updatedUser 
 */
function saveCurrentUser(updatedUser) {
  const users = getUsers();
  const index = users.findIndex(u => u.email.toLowerCase() === updatedUser.email.toLowerCase());
  if (index !== -1) {
    users[index] = updatedUser;
    saveUsers(users);
  }
}

/**
 * Register a new user
 * @param {Object} userData 
 * @returns {boolean} Success state
 */
function registerUser(userData) {
  const users = getUsers();
  const emailExists = users.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
  
  if (emailExists) {
    return false;
  }
  
  const newUser = {
    fullName: userData.fullName,
    email: userData.email,
    mobile: userData.mobile || '',
    college: userData.college || '',
    branch: userData.branch || '',
    semester: userData.semester || '',
    password: userData.password,
    aboutMe: userData.aboutMe || 'Hey there! I am using Apna Hunar to build my career profile.',
    avatar: userData.avatar || getDefaultAvatarSVG(userData.fullName),
    skills: [],
    certificates: [],
    internships: [],
    activities: [
      {
        id: 'act_' + Date.now(),
        text: 'Account created successfully',
        timestamp: new Date().toISOString()
      }
    ],
    settings: {
      theme: 'light'
    }
  };
  
  users.push(newUser);
  saveUsers(users);
  return true;
}

/**
 * Authenticate login credentials
 * @param {string} email 
 * @param {string} password 
 * @returns {boolean} True if login succeeds
 */
function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  
  if (user) {
    setCurrentUserEmail(user.email);
    addActivity('Logged into the application', user);
    return true;
  }
  return false;
}

/**
 * Reset password for a registered user by email
 * @param {string} email 
 * @param {string} newPassword 
 * @returns {boolean} True if successfully reset
 */
function resetUserPassword(email, newPassword) {
  const users = getUsers();
  const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (index !== -1) {
    users[index].password = newPassword;
    saveUsers(users);
    addActivity('Password was successfully reset', users[index]);
    return true;
  }
  return false;
}

/**
 * Log a user action activity
 * @param {string} text 
 * @param {Object} [targetUser] optional user object if updated before save
 */
function addActivity(text, targetUser = null) {
  const user = targetUser || getCurrentUser();
  if (!user) return;
  
  if (!user.activities) {
    user.activities = [];
  }
  
  user.activities.unshift({
    id: 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    text: text,
    timestamp: new Date().toISOString()
  });
  
  // Cap activities count to 30 to preserve LocalStorage space
  if (user.activities.length > 30) {
    user.activities = user.activities.slice(0, 30);
  }
  
  if (!targetUser) {
    saveCurrentUser(user);
  }
}

/**
 * Log out user session
 */
function logout() {
  const user = getCurrentUser();
  if (user) {
    addActivity('Logged out of the session');
  }
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_EMAIL);
  window.location.href = 'login.html';
}

/**
 * Clear all data from application
 */
function resetAllData() {
  localStorage.clear();
  window.location.href = 'index.html';
}

/**
 * Generate a dynamic default SVG avatar based on initials
 * @param {string} name 
 * @returns {string} Base64 representation of SVG
 */
function getDefaultAvatarSVG(name) {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
    
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
      <linearGradient id="avatar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#avatar-grad)" />
    <text x="50%" y="55%" font-family="Poppins, Arial, sans-serif" font-weight="bold" font-size="36" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${initials}</text>
  </svg>`;
  
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}
