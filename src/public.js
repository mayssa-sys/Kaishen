const html = `<!DOCTYPE html>
<html>
<head>
<title>Kaishen — MVP Demo</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Arial,sans-serif;background:#0a0a23;color:#fff;min-height:100vh}
.header{text-align:center;padding:20px;border-bottom:1px solid #1a1a3e}
.header h1{color:#00d4aa;font-size:28px}
.header p{color:#888;font-size:13px;margin-top:4px}
.mvp-badge{display:inline-block;background:#ff6b6b;color:#fff;padding:2px 8px;border-radius:3px;font-size:11px;margin-top:6px}
.tabs{display:flex;flex-wrap:wrap;gap:4px;padding:10px;background:#0f0f2d;justify-content:center}
.tab{padding:8px 14px;background:#1a1a3e;border:1px solid #333;border-radius:4px;cursor:pointer;color:#aaa;font-size:13px;font-weight:600}
.tab.active{background:#00d4aa;color:#0a0a23;border-color:#00d4aa}
.panel{display:none;padding:20px;max-width:600px;margin:0 auto}
.panel.active{display:block}
input,select{width:100%;padding:10px;margin:4px 0 12px;border:1px solid #333;border-radius:5px;background:#1a1a3e;color:#fff;font-size:14px}
label{color:#ddd;font-size:13px;font-weight:600}
button{width:100%;padding:14px;background:#00d4aa;color:#0a0a23;border:none;border-radius:5px;font-size:16px;cursor:pointer;font-weight:bold;margin-top:5px}
button:hover{background:#00b894}
button.secondary{background:#1a1a3e;color:#00d4aa;border:1px solid #00d4aa}
button.secondary:hover{background:#00d4aa;color:#0a0a23}
.result{margin-top:15px;padding:15px;border-radius:5px;display:none;font-size:14px;line-height:1.6}
.result.show{display:block}
.excellent{background:#00b894}.good{background:#00cec9}.fair{background:#fdcb6e;color:#333}.poor{background:#e17055}.reject{background:#d63031}
.verified{background:#00b894}.rejected{background:#d63031}
.info{background:#1a1a3e;border:1px solid #333}
.success{background:#00b894}
.card{background:#1a1a3e;border:1px solid #333;border-radius:5px;padding:15px;margin:10px 0}
.card h3{color:#00d4aa;margin-bottom:8px;font-size:15px}
.row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #222;font-size:13px}
.row:last-child{border:none}
.check.pass{color:#00d4aa}.check.fail{color:#ff6b6b}
h2.section{color:#00d4aa;font-size:18px;margin-bottom:15px}
.step{background:#1a1a3e;border-left:3px solid #00d4aa;padding:10px 15px;margin:8px 0;border-radius:0 5px 5px 0}
.step.done{border-left-color:#00b894;opacity:0.7}
.step.current{border-left-color:#fdcb6e}
.schedule-item{display:flex;justify-content:space-between;align-items:center;padding:10px;margin:5px 0;background:#1a1a3e;border-radius:5px;font-size:13px}
.schedule-item.paid{border-left:3px solid #00b894}
.schedule-item.upcoming{border-left:3px solid #fdcb6e}
.badge{display:inline-block;padding:2px 8px;border-radius:3px;font-size:11px;font-weight:bold}
.badge.paid{background:#00b894;color:#fff}
.badge.upcoming{background:#fdcb6e;color:#333}
.badge.active{background:#00cec9;color:#333}
.stat{text-align:center;padding:10px}
.stat .num{font-size:28px;color:#00d4aa;font-weight:bold}
.stat .lbl{font-size:12px;color:#888}
.stats-row{display:flex;justify-content:space-around;margin:15px 0}
</style>
</head>
<body>
<div class="header">
<h1>KAISHEN</h1>
<p>Lebanon's First AI-Driven BNPL Platform</p>
<div class="mvp-badge">MVP DEMO — Mock Data</div>
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
<p style="color:#888;font-size:13px;margin-bottom:15px">Walk through the entire Kaishen experience: Register → Verify Identity → Get Score → Shop → Pay in 3</p>

<div class="step" id="step1">
<strong>Step 1: Register</strong>
<div style="margin-top:8px">
<label>Full Name</label><input id="d-name" placeholder="Ahmad Khalil">
<label>Phone</label><input id="d-phone" placeholder="+9611234567">
<button onclick="demoRegister()">Register & Get OTP</button>
</div>
</div>
<div id="d-otp-step" style="display:none" class="step">
<strong>Step 2: Verify OTP</strong>
<div style="margin-top:8px">
<label>Enter OTP</label><input id="d-otp" placeholder="6-digit code">
<button onclick="demoVerifyOTP()">Verify</button>
</div>
</div>
<div id="d-kyc-step" style="display:none" class="step">
<strong>Step 3: Verify Identity (eKYC via iDAKTO)</strong>
<div style="margin-top:8px">
<p style="color:#888;font-size:12px;margin-bottom:8px">In the real app, you'd scan your Lebanese ID and take a selfie</p>
<button onclick="demoKYC()">Scan National ID</button>
</div>
</div>
<div id="d-score-step" style="display:none" class="step">
<strong>Step 4: Get Trust Score</strong>
<div style="margin-top:8px">
<label>Monthly Income (USD)</label><input id="d-income" type="number" placeholder="1500">
<label>Employment</label>
<select id="d-employment"><option value="salaried">Salaried</option><option value="self_employed">Self Employed</option><option value="freelance">Freelance</option></select>
<button onclick="demoScore()">Calculate My Score</button>
</div>
</div>
<div id="d-shop-step" style="display:none" class="step">
<strong>Step 5: Shop — Buy Today, Pay in 3</strong>
<div style="margin-top:8px">
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
<select id="s-employment"><option value="">-- Select --</option><option value="salaried">Salaried</option><option value="self_employed">Self Employed</option><option value="freelance">Freelance</option></select>
<button onclick="getScore()">Calculate Trust Score</button>
<div id="score-result" class="result"></div>
</div>

<!-- eKYC -->
<div id="kyc-panel" class="panel">
<h2 class="section">eKYC Identity Verification</h2>
<p style="color:#888;font-size:13px;margin-bottom:15px">Powered by iDAKTO — Government-grade ID verification</p>
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
<button onclick="loadAdmin()" class="secondary" style="margin-bottom:15px">Refresh Data</button>
<div id="admin-stats"></div>
<div id="admin-transactions"></div>
</div>

<script>
var state={user:null,token:null,merchants:[]};

function showTab(t){
document.querySelectorAll('.tab').forEach(e=>e.classList.remove('active'));
document.querySelectorAll('.panel').forEach(e=>e.classList.remove('active'));
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

// DEMO FLOW
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
var checks='';Object.entries(r.checks).forEach(function(c){checks+='<span class="check '+(c[1]?'pass':'fail')+'">'+(c[1]?'✅':'❌')+' '+c[0].replace(/_/g,' ')+'</span> ';});
document.getElementById('d-kyc-step').classList.add('done');
document.getElementById('d-score-step').style.display='block';
showResult('d-result','<strong>Identity Verified ✅</strong><br>'+checks,'success');
}else{showResult('d-result','Verification failed. Please try again.','reject');}
}
async function demoScore(){
var r=await api('/score','POST',{user_id:state.user.id,full_name:state.user.full_name,phone:state.user.phone,monthly_income:Number(document.getElementById('d-income').value),employment_type:document.getElementById('d-employment').value,credolab_id:'demo_credo'});
state.user.trust_score=r.trust_score;state.user.credit_limit=r.band.max_credit_usd;
document.getElementById('d-score-step').classList.add('done');
document.getElementById('d-shop-step').style.display='block';
await loadMerchantDropdown();
showResult('d-result','<strong>Trust Score: '+r.trust_score+'/100</strong> — '+r.band.label.toUpperCase()+'<br>Credit Limit: <strong>$'+r.band.max_credit_usd+'</strong>',r.band.label);
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
var html='<h3 style="margin-bottom:10px">Purchase Approved! ✅</h3>';
html+='<div class="row"><span>Total</span><strong>$'+r.amount_usd+'</strong></div>';
html+='<div class="row"><span>Down Payment (25%)</span><strong>$'+r.down_payment+'</strong></div>';
html+='<div class="row"><span>Remaining (3 installments)</span><strong>$'+r.remaining+'</strong></div>';
html+='<div style="margin-top:12px"><strong>Payment Schedule:</strong></div>';
r.installment_plan.forEach(function(p){
html+='<div class="schedule-item '+(p.status==='paid'?'paid':'upcoming')+'"><span>#'+p.number+' — '+p.due_date+' — $'+p.amount+'</span><span class="badge '+p.status+'">'+p.status.toUpperCase()+'</span></div>';
});
html+='<div style="margin-top:10px;font-size:12px;color:#888">Merchant payout: $'+r.merchant.payout+' (after commission)</div>';
document.getElementById('d-shop-step').classList.add('done');
showResult('d-result',html,'info');
}

// TRUST SCORE
async function getScore(){
var r=await api('/score','POST',{user_id:'web-'+Date.now(),full_name:document.getElementById('s-name').value,phone:document.getElementById('s-phone').value,monthly_income:Number(document.getElementById('s-income').value)||0,employment_type:document.getElementById('s-employment').value});
if(r.error){showResult('score-result','Error: '+r.error,'info');return}
showResult('score-result','<h3>Trust Score: '+r.trust_score+'/100</h3><p>Band: <strong>'+r.band.label.toUpperCase()+'</strong> — Max Credit: <strong>$'+r.band.max_credit_usd+'</strong></p><p style="font-size:12px;margin-top:8px;opacity:0.8">Base: '+r.breakdown.base_score+' | Completeness: +'+r.breakdown.completeness_bonus+' | Employment: +'+r.breakdown.employment_bonus+' | Income: +'+r.breakdown.income_bonus+'</p>',r.band.label);
}

// eKYC
async function verifyKYC(){
var r=await api('/kyc/verify','POST',{user_id:'web-'+Date.now(),full_name:document.getElementById('k-name').value,document_type:document.getElementById('k-doctype').value});
if(r.error){showResult('kyc-result','Error: '+r.error,'info');return}
var checks='';Object.entries(r.checks).forEach(function(c){checks+='<div class="check '+(c[1]?'pass':'fail')+'">'+(c[1]?'✅':'❌')+' '+c[0].replace(/_/g,' ')+'</div>';});
showResult('kyc-result','<h3>Status: '+r.status.toUpperCase()+'</h3><p>Doc: '+r.document_type+' — '+r.extracted_data.document_number+'</p><p>Nationality: '+r.extracted_data.nationality+'</p><div style="margin-top:8px">'+checks+'</div>',r.status);
}

// MERCHANT
async function registerMerchant(){
var r=await api('/merchants/register','POST',{business_name:document.getElementById('m-name').value,contact_name:document.getElementById('m-contact').value,phone:document.getElementById('m-phone').value,commission_rate:document.getElementById('m-rate').value||7});
if(r.error){showResult('merchant-result','Error: '+r.error,'info');return}
showResult('merchant-result','<h3>Merchant Registered ✅</h3><p><strong>'+r.business_name+'</strong></p><p>Commission: '+r.commission_rate+'%</p><p>QR Code: <code>'+r.qr_code+'</code></p><p>ID: <code style="font-size:11px">'+r.id+'</code></p>','success');
loadMerchants();
}
async function loadMerchants(){
var ms=await api('/merchants');
var el=document.getElementById('merchant-list');
if(!ms.length){el.innerHTML='<p style="color:#888;margin-top:15px">No merchants registered yet.</p>';return}
var html='<h3 style="color:#00d4aa;margin:15px 0 10px">Registered Merchants</h3>';
ms.forEach(function(m){
html+='<div class="card"><div class="row"><span>'+m.business_name+'</span><span class="badge active">'+m.status+'</span></div><div class="row"><span>Commission</span><span>'+m.commission_rate+'%</span></div><div class="row"><span>Transactions</span><span>'+m.total_transactions+'</span></div><div class="row"><span>Volume</span><span>$'+m.total_volume.toFixed(2)+'</span></div></div>';
});
el.innerHTML=html;
}

// ADMIN
async function loadAdmin(){
var txs=await api('/transactions/all');
var ms=await api('/merchants');
var totalVol=txs.reduce(function(s,t){return s+t.amount_usd},0);
var totalComm=txs.reduce(function(s,t){return s+t.commission_amount},0);
var active=txs.filter(function(t){return t.status==='active'}).length;
var html='<div class="stats-row"><div class="stat"><div class="num">'+txs.length+'</div><div class="lbl">Transactions</div></div><div class="stat"><div class="num">$'+totalVol.toFixed(0)+'</div><div class="lbl">Volume</div></div><div class="stat"><div class="num">$'+totalComm.toFixed(0)+'</div><div class="lbl">Revenue</div></div><div class="stat"><div class="num">'+ms.length+'</div><div class="lbl">Merchants</div></div></div>';
document.getElementById('admin-stats').innerHTML=html;
var txHtml='<h3 style="color:#00d4aa;margin:10px 0">Recent Transactions</h3>';
if(!txs.length)txHtml+='<p style="color:#888">No transactions yet. Run the Full Demo first!</p>';
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
