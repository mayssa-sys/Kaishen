const { v4: uuidv4 } = require('uuid');

// In-memory store (replace with PostgreSQL in production)
const merchants = new Map();

function generateQR(merchantId) {
  return 'https://kaishen.onrender.com/pay/' + merchantId;
}

async function register(data) {
  const id = uuidv4();
  const merchant = {
    id,
    business_name: data.business_name,
    contact_name: data.contact_name,
    phone: data.phone,
    email: data.email || null,
    address: data.address || null,
    commission_rate: Math.min(9, Math.max(5, parseFloat(data.commission_rate) || 7)),
    qr_code: generateQR(id),
    status: 'active',
    total_transactions: 0,
    total_volume: 0,
    created_at: new Date().toISOString()
  };
  merchants.set(id, merchant);
  return merchant;
}

function getById(id) {
  return merchants.get(id) || null;
}

function getAll() {
  return Array.from(merchants.values());
}

function updateStats(merchantId, amount) {
  const m = merchants.get(merchantId);
  if (m) {
    m.total_transactions++;
    m.total_volume += amount;
  }
}

module.exports = { register, getById, getAll, updateStats, merchants };
