const { COLORS, LOGO_SVG, LOGO_ICON_SVG } = require('./assets/brand');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<title>Kaishen — Lebanon's First AI-Driven BNPL</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${encodeURIComponent(LOGO_ICON_SVG.replace(/\n/g,'').trim())}">
<style>
:root {
  --primary: ${COLORS.primary};
  --secondary: ${COLORS.secondary};
  --accent: ${COLORS.accent};
  --surface: ${COLORS.surface};
  --muted: ${COLORS.muted};
  --text: ${COLORS.text};
  --text-dim: ${COLORS.textDim};
  --success: ${COLORS.success};
  --warning: ${COLORS.warning};
  --danger: ${COLORS.danger};
  --gold-grad: linear-gradient(135deg, #C9A84C 0%, #E8D48B 50%, #C9A84C 100%);
  --navy-grad: linear-gradient(180deg, #0B1D3A 0%, #111B2E 100%);
  --radius: 8px;
  --radius-lg: 12px;
  --shadow: 0 4px 24px rgba(0,0,0,0.3);
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.2);
  --font: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: var(--font);
  background: var(--navy-grad);
  color: var(--text);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}
.header {
  text-align: center;
  padding: 28px 20px 22px;
  background: var(--primary);
  border-bottom: 1px solid rgba(201,168,76,0.15);
  position: relative;
}
.header::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: var(--gold-grad);
  opacity: 0.5;
}
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-bottom: 6px;
}
.logo-icon { width: 48px; height: 48px; }
.logo-icon svg { width: 100%; height: 100%; }
.header h1 {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 6px;
  background: var(--gold-grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.header .tagline {
  color: var(--text-dim);
  font-size: 13px;
  margin-top: 4px;
  letter-spacing: 1px;
}
.mvp-badge {
  display: inline-block;
  background: rgba(201,168,76,0.15);
  color: var(--secondary);
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 11px;
  margin-top: 8px;
  border: 1px solid rgba(201,168,76,0.3);
  letter-spacing: 1px;
  font-weight: 600;
}
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 12px 10px;
  background: rgba(11,29,58,0.8);
  justify-content: center;
  border-bottom: 1px solid rgba(58,74,107,0.3);
}
.tab {
  padding: 9px 16px;
  background: var(--surface);
  border: 1px solid var(--muted);
  border-radius: var(--radius);
  cursor: pointer;
  color: var(--text-dim);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
}
.tab:hover { color: var(--text); border-color: var(--secondary); }
.tab.active {
  background: var(--gold-grad);
  color: var(--primary);
  border-color: transparent;
}
.panel { display: none; padding: 24px 20px; max-width: 620px; margin: 0 auto; }
.panel.active { display: block; }
label {
  color: var(--text-dim);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  display: block;
  margin-bottom: 4px;
}
input, select {
  width: 100%;
  padding: 11px 14px;
  margin-bottom: 14px;
  border: 1px solid var(--muted);
  border-radius: var(--radius);
  background: var(--surface);
  color: var(--text);
  font-size: 14px;
  font-family: var(--font);
  transition: border-color 0.2s;
}
input:focus, select:focus {
  outline: none;
  border-color: var(--secondary);
  box-shadow: 0 0 0 3px rgba(201,168,76,0.1);
}
input::placeholder { color: var(--muted); }
button {
  width: 100%;
  padding: 14px;
  background: var(--gold-grad);
  color: var(--primary);
  border: none;
  border-radius: var(--radius);
  font-size: 15px;
  cursor: pointer;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-top: 4px;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}
button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}
button.secondary {
  background: transparent;
  color: var(--secondary);
  border: 1px solid var(--secondary);
  box-shadow: none;
}
button.secondary:hover {
  background: rgba(201,168,76,0.1);
  transform: none;
}
.result {
  margin-top: 16px;
  padding: 16px;
  border-radius: var(--radius-lg);
  display: none;
  font-size: 14px;
  line-height: 1.7;
  box-shadow: var(--shadow-sm);
}
.result.show { display: block; }
.excellent { background: var(--success); color: #fff; }
.good { background: #0891b2; color: #fff; }
.fair { background: var(--warning); color: var(--primary); }
.poor { background: #e07040; color: #fff; }
.reject { background: var(--danger); color: #fff; }
.verified { background: var(--success); color: #fff; }
.rejected { background: var(--danger); color: #fff; }
.info { background: var(--surface); border: 1px solid var(--muted); }
.success { background: var(--success); color: #fff; }
.card {
  background: var(--surface);
  border: 1px solid rgba(58,74,107,0.4);
  border-radius: var(--radius-lg);
  padding: 16px;
  margin: 10px 0;
  box-shadow: var(--shadow-sm);
}
.card h3 {
  color: var(--secondary);
  margin-bottom: 10px;
  font-size: 15px;
  font-weight: 600;
}
.row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid rgba(58,74,107,0.3);
  font-size: 13px;
}
.row:last-child { border: none; }
.check.pass { color: var(--success); }
.check.fail { color: var(--danger); }
.badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.badge.paid { background: var(--success); color: #fff; }
.badge.upcoming { background: var(--warning); color: var(--primary); }
.badge.active { background: var(--accent); color: var(--primary); }
h2.section {
  color: var(--secondary);
  font-size: 20px;
  margin-bottom: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.step {
  background: var(--surface);
  border-left: 3px solid var(--secondary);
  padding: 14px 18px;
  margin: 10px 0;
  border-radius: 0 var(--radius) var(--radius) 0;
  box-shadow: var(--shadow-sm);
}
.step strong { color: var(--text); }
.step.done { border-left-color: var(--success); opacity: 0.6; }
.step.current { border-left-color: var(--warning); }
.schedule-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  margin: 5px 0;
  background: var(--surface);
  border-radius: var(--radius);
  font-size: 13px;
}
.schedule-item.paid { border-left: 3px solid var(--success); }
.schedule-item.upcoming { border-left: 3px solid var(--warning); }
.stat { text-align: center; padding: 12px; }
.stat .num {
  font-size: 30px;
  font-weight: 700;
  background: var(--gold-grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.stat .lbl { font-size: 11px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
.stats-row {
  display: flex;
  justify-content: space-around;
  margin: 16px 0;
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 8px 0;
  border: 1px solid rgba(58,74,107,0.3);
}
.footer {
  text-align: center;
  padding: 20px;
  color: var(--muted);
  font-size: 11px;
  letter-spacing: 0.5px;
  border-top: 1px solid rgba(58,74,107,0.2);
  margin-top: 40px;
}
.footer a { color: var(--secondary); text-decoration: none; }
@media (max-width: 480px) {
  .header h1 { font-size: 24px; letter-spacing: 4px; }
  .logo-icon { width: 38px; height: 38px; }
  .tabs { gap: 3px; padding: 8px 6px; }
  .tab { padding: 7px 10px; font-size: 12px; }
  .stats-row { flex-wrap: wrap; }
  .stat { flex: 0 0 50%; }
}
</style>
</head>
<body>

<div class="header">
  <div class="logo-container">
    <div class="logo-icon">${LOGO_SVG.replace(/\n/g,'').trim()}</div>
    <h1>KAISHEN</h1>
  </div>
  <div class="tagline">Lebanon's First AI-Driven BNPL Platform</div>
  <div class="mvp-badge">MVP DEMO &mdash; MOCK DATA</div>
</div>

<div class="tabs">
  <div class="tab active" onclick="showTab('demo')">Full Demo</div>
  <div class="tab" onclick="showTab('score')">Trust Score</div>
  <div class="tab" onclick="showTab('kyc')">eKYC</div>
  <div class="tab" onclick="showTab('merchant')">Merchant</div>
  <div class="tab" onclick="showTab('admin')">Admin</div>
</div>

<!-- FULL DEMO -->
<div id="demo-panel" class="panel active">
<h2 class="section">Complete BNPL Flow</h2>
<p style="color:var(--text-dim);font-size:13px;margin-bottom:16px">Walk through the entire Kaishen experience: Register &rarr; Verify &rarr; Score &rarr; Shop &rarr; Pay in 3</p>

<div class="step" id="step1">
<strong>Step 1: Register</strong>
<div style="margin-top:10px">
<label>Full Name</label><input id="d-name" placeholder="Ahmad Khalil">
<label>Phone</label><input id="d-phone" placeholder="+9611234567">
<button onclick="demoRegister()">Register &amp; Get OTP</button>
</div>
</div>
<div id="d-otp-step" style="display:none" class="step">
<strong>Step 2: Verify OTP</strong>
<div style="margin-top:10px">
<label>Enter OTP</label><input id="d-otp" placeholder="6-digit code">
<button onclick="demoVerifyOTP()">Verify</button>
</div>
</div>
<div id="d-kyc-step" style="display:none" class="step">
<strong>Step 3: Verify Identity (eKYC via iDAKTO)</strong>
<div style="margin-top:10px">
<p style="color:var(--text-dim);font-size:12px;margin-bottom:10px">In the real app, you'd scan your Lebanese ID and take a selfie</p>
<button onclick="demoKYC()">Scan National ID</button>
</div>
</div>
<div id="d-score-step" style="display:none" class="step">
<strong>Step 4: Get Trust Score</strong>
<div style="margin-top:10px">
<label>Monthly Income (USD)</label><input id="d-income" type="number" placeholder="1500">
<label>Employment</label>
<select id="d-employment"><option value="salaried">Salaried</option><option value="self_employed">Self Employed</option><option value="freelance">Freelance</option></select>
<button onclick="demoScore()">Calculate My Score</button>
</div>
</div>
<div id="d-shop-step" style="display:none" class="step">
<strong>Step 5: Shop &mdash; Buy Today, Pay in 3</strong>
<div style="margin-top:10px">
<label>Purchase Amount (USD)</label><input id="d-amount" type="number" placeholder="400">
<label>Merchant</label><select id="d-merchant"></select>
<button onclick="demoPurchase()">Pay with Kaishen</button>
</div>
</div>
<div id="d-result" class="result"></div>
</div>

<!-- TRUST SCORE -->
<div id="score-panel" class="panel">
<h2 class="section">Trust Score Engine</h2>
<label>Full Name</label><input id="s-name" placeholder="Ahmad Khalil">
<label>Phone</label><input id="s-phone" placeholder="+9611234567">
<label>Monthly Income (USD)</label><input id="s-income" type="number" placeholder="1500">
<label>Employment Type</label>
<select id="s-employment"><option value="">&mdash; Select &mdash;</option><option value="salaried">Salaried</option><option value="self_employed">Self Employed</option><option value="freelance">Freelance</option></select>
<button onclick="getScore()">Calculate Trust Score</button>
<div id="score-result" class="result"></div>
</div>

<!-- eKYC -->
<div id="kyc-panel" class="panel">
<h2 class="section">eKYC Identity Verification</h2>
<p style="color:var(--text-dim);font-size:13px;margin-bottom:16px">Powered by iDAKTO &mdash; Government-grade ID verification</p>
<label>Full Name</label><input id="k-name" placeholder="Ahmad Khalil">
<label>Document Type</label>
<select id="k-doctype"><option value="national_id">Lebanese National ID</option><option value="passport">Passport</option><option value="driving_license">Driving License</option></select>
<button onclick="verifyKYC()">Verify Identity</button>
<div id="kyc-result" class="result"></div>
</div>

<!-- MERCHANT -->
<div id="merchant-panel" class="panel">
<h2 class="section">Merchant Portal</h2>
<div class="card">
<h3>Register New Merchant</h3>
<label>Business Name</label><input id="m-name" placeholder="TechZone Beirut">
<label>Contact Person</label><input id="m-contact" placeholder="Ali Hassan">
<label>Phone</label><input id="m-phone" placeholder="+9611234567">
<label>Commission Rate (%)</label><input id="m-rate" type="number" placeholder="7" min="5" max="9">
<button onclick="registerMerchant()">Register Merchant</button>
</div>
<div id="merchant-result" class="result"></div>
<div id="merchant-list"></div>
</div>

<!-- ADMIN -->
<div id="admin-panel" class="panel">
<h2 class="section">Admin Dashboard</h2>
<button onclick="loadAdmin()" class="secondary" style="margin-bottom:16px">Refresh Data</button>
<div id="admin-stats"></div>
<div id="admin-transactions"></div>
</div>

<div class="footer">
  &copy; 2026 <a href="mailto:hello@kaishen.com">Kaishen</a> &mdash; Buy Today, Pay in 3 &middot; 0% Interest &middot; Sharia-Compliant
</div>

<script>
var state={user:null,token:null,merchants:[]};

function showTab(t){
document.querySelectorAll('.tab').forEach(function(e){e.classList.remove('active')});
document.querySelectorAll('.panel').forEach(function(e){e.classList.remove('active')});
document.getElementById(t+'-panel').classList.add('active');
event.target.classList.add('active');
if(t==='merchant')loadMerchants();
if(t==='admin')loadAdmin();
}

async function api(path,method,body){
var opts={method:method||'GET',headers:{'Content-Type':'application/json'}};
if(state.token)opts.headers['Authorization']=state.token;
if(body)opts.body=JSON.stringify(body);
var r=await fetch('/api/v1'+path,opts);
return r.json();
}

async function demoRegister(){
var r=await api('/auth/register','POST',{phone:document.getElementById('d-phone').value,full_name:document.getElementById('d-name').value});
if(r.error){showResult('d-result','Error: '+r.error,'info');return}
document.getElementById('d-otp').value=r.otp_hint.split(' ')[0];
document.getElementById('step1').classList.add('done');
document.getElementById('d-otp-step').style.display='block';
showResult('d-result','OTP sent! Code: <strong>'+r.otp_hint+'</strong>','info');
}
async function demoVerifyOTP(){
var r=await api('/auth/verify-otp','POST',{phone:document.getElementById('d-phone').value,otp:document.getElementById('d-otp').value});
if(r.error){showResult('d-result','Error: '+r.error,'info');return}
state.user=r.user;state.token=r.token;
document.getElementById('d-otp-step').classList.add('done');
document.getElementById('d-kyc-step').style.display='block';
showResult('d-result','Welcome <strong>'+r.user.full_name+'</strong>! Now verify your identity.','success');
}
async function demoKYC(){
var r=await api('/kyc/verify','POST',{user_id:state.user.id,full_name:state.user.full_name,document_type:'national_id'});
if(r.status==='verified'){
state.user.kyc_status='verified';
var checks='';Object.entries(r.checks).forEach(function(c){checks+='<span class="check '+(c[1]?'pass':'fail')+'">'+(c[1]?'\\u2705':'\\u274C')+' '+c[0].replace(/_/g,' ')+'</span> ';});
document.getElementById('d-kyc-step').classList.add('done');
document.getElementById('d-score-step').style.display='block';
showResult('d-result','<strong>Identity Verified \\u2705</strong><br>'+checks,'success');
}else{showResult('d-result','Verification failed. Please try again.','reject');}
}
async function demoScore(){
var r=await api('/score','POST',{user_id:state.user.id,full_name:state.user.full_name,phone:state.user.phone,monthly_income:Number(document.getElementById('d-income').value),employment_type:document.getElementById('d-employment').value,credolab_id:'demo_credo'});
state.user.trust_score=r.trust_score;state.user.credit_limit=r.band.max_credit_usd;
document.getElementById('d-score-step').classList.add('done');
document.getElementById('d-shop-step').style.display='block';
await loadMerchantDropdown();
showResult('d-result','<strong>Trust Score: '+r.trust_score+'/100</strong> \\u2014 '+r.band.label.toUpperCase()+'<br>Credit Limit: <strong>$'+r.band.max_credit_usd+'</strong>',r.band.label);
}
async function loadMerchantDropdown(){
var ms=await api('/merchants');state.merchants=ms;
var sel=document.getElementById('d-merchant');sel.innerHTML='';
if(ms.length===0){
await api('/merchants/register','POST',{business_name:'TechZone Beirut',contact_name:'Ali Hassan',phone:'+9613456789',commission_rate:7});
await api('/merchants/register','POST',{business_name:'ABC Mall',contact_name:'Sara Khoury',phone:'+9611111111',commission_rate:6});
ms=await api('/merchants');state.merchants=ms;
}
ms.forEach(function(m){sel.innerHTML+='<option value="'+m.id+'">'+m.business_name+' ('+m.commission_rate+'%)</option>';});
}
async function demoPurchase(){
var amt=Number(document.getElementById('d-amount').value);
var mid=document.getElementById('d-merchant').value;
var r=await api('/transactions/initiate','POST',{user_id:state.user.id,merchant_id:mid,amount:amt});
if(r.error){showResult('d-result','Error: '+r.error,'info');return}
var html='<h3 style="margin-bottom:10px">Purchase Approved! \\u2705</h3>';
html+='<div class="row"><span>Total</span><strong>$'+r.amount_usd+'</strong></div>';
html+='<div class="row"><span>Down Payment (25%)</span><strong>$'+r.down_payment+'</strong></div>';
html+='<div class="row"><span>Remaining (3 installments)</span><strong>$'+r.remaining+'</strong></div>';
html+='<div style="margin-top:12px"><strong>Payment Schedule:</strong></div>';
r.installment_plan.forEach(function(p){
html+='<div class="schedule-item '+(p.status==='paid'?'paid':'upcoming')+'"><span>#'+p.number+' \\u2014 '+p.due_date+' \\u2014 $'+p.amount+'</span><span class="badge '+p.status+'">'+p.status.toUpperCase()+'</span></div>';
});
html+='<div style="margin-top:10px;font-size:12px;color:var(--text-dim)">Merchant payout: $'+r.merchant.payout+' (after commission)</div>';
document.getElementById('d-shop-step').classList.add('done');
showResult('d-result',html,'info');
}

async function getScore(){
var r=await api('/score','POST',{user_id:'web-'+Date.now(),full_name:document.getElementById('s-name').value,phone:document.getElementById('s-phone').value,monthly_income:Number(document.getElementById('s-income').value)||0,employment_type:document.getElementById('s-employment').value});
if(r.error){showResult('score-result','Error: '+r.error,'info');return}
showResult('score-result','<h3>Trust Score: '+r.trust_score+'/100</h3><p>Band: <strong>'+r.band.label.toUpperCase()+'</strong> \\u2014 Max Credit: <strong>$'+r.band.max_credit_usd+'</strong></p><p style="font-size:12px;margin-top:8px;opacity:0.8">Base: '+r.breakdown.base_score+' | Completeness: +'+r.breakdown.completeness_bonus+' | Employment: +'+r.breakdown.employment_bonus+' | Income: +'+r.breakdown.income_bonus+'</p>',r.band.label);
}

async function verifyKYC(){
var r=await api('/kyc/verify','POST',{user_id:'web-'+Date.now(),full_name:document.getElementById('k-name').value,document_type:document.getElementById('k-doctype').value});
if(r.error){showResult('kyc-result','Error: '+r.error,'info');return}
var checks='';Object.entries(r.checks).forEach(function(c){checks+='<div class="check '+(c[1]?'pass':'fail')+'">'+(c[1]?'\\u2705':'\\u274C')+' '+c[0].replace(/_/g,' ')+'</div>';});
showResult('kyc-result','<h3>Status: '+r.status.toUpperCase()+'</h3><p>Doc: '+r.document_type+' \\u2014 '+r.extracted_data.document_number+'</p><p>Nationality: '+r.extracted_data.nationality+'</p><div style="margin-top:8px">'+checks+'</div>',r.status);
}

async function registerMerchant(){
var r=await api('/merchants/register','POST',{business_name:document.getElementById('m-name').value,contact_name:document.getElementById('m-contact').value,phone:document.getElementById('m-phone').value,commission_rate:document.getElementById('m-rate').value||7});
if(r.error){showResult('merchant-result','Error: '+r.error,'info');return}
showResult('merchant-result','<h3>Merchant Registered \\u2705</h3><p><strong>'+r.business_name+'</strong></p><p>Commission: '+r.commission_rate+'%</p><p>QR Code: <code>'+r.qr_code+'</code></p><p>ID: <code style="font-size:11px">'+r.id+'</code></p>','success');
loadMerchants();
}
async function loadMerchants(){
var ms=await api('/merchants');
var el=document.getElementById('merchant-list');
if(!ms.length){el.innerHTML='<p style="color:var(--text-dim);margin-top:15px">No merchants registered yet.</p>';return}
var html='<h3 style="color:var(--secondary);margin:16px 0 10px">Registered Merchants</h3>';
ms.forEach(function(m){
html+='<div class="card"><div class="row"><span>'+m.business_name+'</span><span class="badge active">'+m.status+'</span></div><div class="row"><span>Commission</span><span>'+m.commission_rate+'%</span></div><div class="row"><span>Transactions</span><span>'+m.total_transactions+'</span></div><div class="row"><span>Volume</span><span>$'+m.total_volume.toFixed(2)+'</span></div></div>';
});
el.innerHTML=html;
}

async function loadAdmin(){
var txs=await api('/transactions/all');
var ms=await api('/merchants');
var totalVol=txs.reduce(function(s,t){return s+t.amount_usd},0);
var totalComm=txs.reduce(function(s,t){return s+t.commission_amount},0);
var html='<div class="stats-row"><div class="stat"><div class="num">'+txs.length+'</div><div class="lbl">Transactions</div></div><div class="stat"><div class="num">$'+totalVol.toFixed(0)+'</div><div class="lbl">Volume</div></div><div class="stat"><div class="num">$'+totalComm.toFixed(0)+'</div><div class="lbl">Revenue</div></div><div class="stat"><div class="num">'+ms.length+'</div><div class="lbl">Merchants</div></div></div>';
document.getElementById('admin-stats').innerHTML=html;
var txHtml='<h3 style="color:var(--secondary);margin:12px 0">Recent Transactions</h3>';
if(!txs.length)txHtml+='<p style="color:var(--text-dim)">No transactions yet. Run the Full Demo first!</p>';
txs.slice(-10).reverse().forEach(function(t){
txHtml+='<div class="card"><div class="row"><span>'+t.merchant_name+'</span><span class="badge '+(t.status==='active'?'active':'paid')+'">'+t.status.toUpperCase()+'</span></div><div class="row"><span>Amount</span><span>$'+t.amount_usd+'</span></div><div class="row"><span>Commission</span><span>$'+t.commission_amount+' ('+t.commission_rate+'%)</span></div><div class="row"><span>Merchant Payout</span><span>$'+t.merchant_payout+'</span></div></div>';
});
document.getElementById('admin-transactions').innerHTML=txHtml;
}

function showResult(id,html,cls){var r=document.getElementById(id);r.innerHTML=html;r.className='result show '+(cls||'info');}
</script>
</body>
</html>`;
module.exports = html;