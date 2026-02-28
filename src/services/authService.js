const { v4: uuidv4 } = require('uuid');

// In-memory store (replace with PostgreSQL in production)
const users = new Map();
const otpStore = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateToken() {
  return 'ksh_' + uuidv4().replace(/-/g, '') + '_' + Date.now().toString(36);
}

async function register(phone, fullName) {
  if (users.has(phone)) {
    return { error: 'Phone number already registered' };
  }
  const otp = generateOTP();
  otpStore.set(phone, { otp, fullName, expiresAt: Date.now() + 5 * 60 * 1000 });
  console.log(`[auth] OTP for ${phone}: ${otp} (MVP mock — would send via SMS)`);
  return { message: 'OTP sent to ' + phone, otp_hint: otp + ' (visible in MVP only)' };
}

async function verifyOTP(phone, otp) {
  const stored = otpStore.get(phone);
  if (!stored) return { error: 'No OTP requested for this number' };
  if (Date.now() > stored.expiresAt) { otpStore.delete(phone); return { error: 'OTP expired' }; }
  if (stored.otp !== otp) return { error: 'Invalid OTP' };
  otpStore.delete(phone);
  const userId = uuidv4();
  const token = generateToken();
  const user = {
    id: userId,
    phone,
    full_name: stored.fullName,
    kyc_status: 'pending',
    trust_score: null,
    credit_limit: 0,
    created_at: new Date().toISOString()
  };
  users.set(phone, user);
  users.set(token, userId);
  return { user, token };
}

async function login(phone) {
  if (!users.has(phone)) return { error: 'User not found. Please register first.' };
  const otp = generateOTP();
  otpStore.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
  console.log(`[auth] Login OTP for ${phone}: ${otp}`);
  return { message: 'OTP sent to ' + phone, otp_hint: otp + ' (visible in MVP only)' };
}

async function verifyLogin(phone, otp) {
  const stored = otpStore.get(phone);
  if (!stored) return { error: 'No OTP requested' };
  if (Date.now() > stored.expiresAt) { otpStore.delete(phone); return { error: 'OTP expired' }; }
  if (stored.otp !== otp) return { error: 'Invalid OTP' };
  otpStore.delete(phone);
  const user = users.get(phone);
  const token = generateToken();
  users.set(token, user.id);
  return { user, token };
}

function getUserByToken(token) {
  const userId = users.get(token);
  if (!userId) return null;
  for (const [key, val] of users) {
    if (val && val.id === userId) return val;
  }
  return null;
}

function getUserById(userId) {
  for (const [key, val] of users) {
    if (val && val.id === userId) return val;
  }
  return null;
}

function updateUser(userId, updates) {
  for (const [key, val] of users) {
    if (val && val.id === userId) {
      Object.assign(val, updates);
      return val;
    }
  }
  return null;
}

module.exports = { register, verifyOTP, login, verifyLogin, getUserByToken, getUserById, updateUser, users };
