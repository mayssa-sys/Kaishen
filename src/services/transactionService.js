const { v4: uuidv4 } = require('uuid');
const merchantService = require('./merchantService');
const authService = require('./authService');

// In-memory store
const transactions = new Map();
const payments = new Map();

function createInstallmentSchedule(totalAmount, startDate) {
  const downPayment = Math.round(totalAmount * 0.25 * 100) / 100;
  const remaining = Math.round((totalAmount - downPayment) * 100) / 100;
  const perInstallment = Math.round((remaining / 3) * 100) / 100;
  const schedule = [];
  const start = new Date(startDate);

  // Installment 1: due at checkout (down payment)
  schedule.push({
    id: uuidv4(),
    number: 1,
    amount: downPayment,
    due_date: start.toISOString().split('T')[0],
    status: 'paid',
    paid_at: start.toISOString(),
    type: 'down_payment'
  });

  // Installments 2-4: spread over 12 weeks (every 4 weeks)
  for (let i = 1; i <= 3; i++) {
    const dueDate = new Date(start);
    dueDate.setDate(dueDate.getDate() + (i * 28));
    const amount = i === 3 ? Math.round((remaining - perInstallment * 2) * 100) / 100 : perInstallment;
    schedule.push({
      id: uuidv4(),
      number: i + 1,
      amount,
      due_date: dueDate.toISOString().split('T')[0],
      status: 'upcoming',
      paid_at: null,
      type: 'installment'
    });
  }

  return schedule;
}

async function initiate(userId, merchantId, amount) {
  const merchant = merchantService.getById(merchantId);
  if (!merchant) return { error: 'Merchant not found' };
  if (merchant.status !== 'active') return { error: 'Merchant is not active' };

  const user = authService.getUserById(userId);
  if (!user) return { error: 'User not found' };
  if (user.kyc_status !== 'verified') return { error: 'KYC not verified. Please complete identity verification first.' };
  if (!user.trust_score || user.trust_score < 20) return { error: 'Trust score too low for BNPL. Minimum score: 20.' };
  if (amount > user.credit_limit) return { error: 'Amount exceeds your credit limit of $' + user.credit_limit };

  const txId = uuidv4();
  const commission = Math.round(amount * (merchant.commission_rate / 100) * 100) / 100;
  const merchantPayout = Math.round((amount - commission) * 100) / 100;
  const schedule = createInstallmentSchedule(amount, new Date());

  const tx = {
    id: txId,
    user_id: userId,
    merchant_id: merchantId,
    merchant_name: merchant.business_name,
    amount_usd: amount,
    commission_rate: merchant.commission_rate,
    commission_amount: commission,
    merchant_payout: merchantPayout,
    installments: schedule,
    status: 'active',
    created_at: new Date().toISOString()
  };

  transactions.set(txId, tx);
  merchantService.updateStats(merchantId, amount);

  // Store payment references
  schedule.forEach(p => payments.set(p.id, { ...p, transaction_id: txId }));

  return {
    transaction_id: txId,
    amount_usd: amount,
    down_payment: schedule[0].amount,
    remaining: Math.round((amount - schedule[0].amount) * 100) / 100,
    installment_plan: schedule,
    merchant: { name: merchant.business_name, payout: merchantPayout },
    status: 'active'
  };
}

function getByUser(userId) {
  return Array.from(transactions.values()).filter(t => t.user_id === userId);
}

function getByMerchant(merchantId) {
  return Array.from(transactions.values()).filter(t => t.merchant_id === merchantId);
}

function getById(txId) {
  return transactions.get(txId) || null;
}

function makePayment(paymentId) {
  const payment = payments.get(paymentId);
  if (!payment) return { error: 'Payment not found' };
  if (payment.status === 'paid') return { error: 'Already paid' };
  payment.status = 'paid';
  payment.paid_at = new Date().toISOString();

  const tx = transactions.get(payment.transaction_id);
  if (tx) {
    const installment = tx.installments.find(i => i.id === paymentId);
    if (installment) {
      installment.status = 'paid';
      installment.paid_at = payment.paid_at;
    }
    const allPaid = tx.installments.every(i => i.status === 'paid');
    if (allPaid) tx.status = 'completed';
  }

  return { payment_id: paymentId, status: 'paid', paid_at: payment.paid_at };
}

function getUpcomingPayments(userId) {
  const userTxs = getByUser(userId);
  const upcoming = [];
  userTxs.forEach(tx => {
    tx.installments.forEach(i => {
      if (i.status === 'upcoming') {
        upcoming.push({ ...i, transaction_id: tx.id, merchant: tx.merchant_name });
      }
    });
  });
  return upcoming.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
}

function getAll() {
  return Array.from(transactions.values());
}

module.exports = { initiate, getByUser, getByMerchant, getById, makePayment, getUpcomingPayments, getAll };
