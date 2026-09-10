const pageBodies={
  "درآمد": `<p>ثبت درآمد روزانه و مشاهده مجموع درآمد.</p><label>مبلغ درآمد</label><input inputmode="numeric" placeholder="مثلاً ۲,۸۵۰,۰۰۰"><button class="primary">ذخیره درآمد</button>`,
  "هزینه": `<p>ثبت سوخت، استهلاک و سایر هزینه‌ها.</p><label>مبلغ هزینه</label><input inputmode="numeric" placeholder="مثلاً ۱,۲۳۰,۰۰۰"><button class="primary">ذخیره هزینه</button>`,
  "گزارش": `<div class="row"><b>درآمد ماه</b><span>۰ تومان</span></div><div class="row"><b>هزینه ماه</b><span>۰ تومان</span></div><div class="row"><b>سود ماه</b><span>۰ تومان</span></div>`,
  "خودرو": `<div class="row"><b>خودرو</b><span>پژو ۲۰۶</span></div><div class="row"><b>کارکرد</b><span>۱۲۰,۵۰۰ km</span></div><div class="row"><b>مصرف</b><span>۷.۲ لیتر</span></div>`,
  "اقساط و بدهی": `<p>مدیریت اقساط و بدهی‌ها.</p><input placeholder="عنوان قسط"><input inputmode="numeric" placeholder="مبلغ"><button class="primary">ثبت</button>`,
  "هدف": `<p>هدف درآمد ماهانه خود را تعیین کنید.</p><input inputmode="numeric" placeholder="هدف درآمدی"><button class="primary">ذخیره هدف</button>`,
  "تنظیمات": `<div class="row"><b>تم برنامه</b><span>روشن</span></div><div class="row"><b>اعلان‌ها</b><span>فعال</span></div>`,
  "پشتیبان‌گیری": `<p>اطلاعات برنامه را ذخیره یا بازیابی کنید.</p><button class="primary">ایجاد نسخه پشتیبان</button>`,
  "تاریخچه": `<div class="row"><b>امروز</b><span>بدون تراکنش</span></div>`,
  "یادآوری": `<p>یادآوری‌های مالی و کاری در این بخش نمایش داده می‌شوند.</p>`,
  "پروفایل": `<div class="row"><b>نام راننده</b><span>ثبت نشده</span></div><div class="row"><b>خودرو</b><span>پژو ۲۰۶</span></div>`
};

function openPage(name){
  document.getElementById('home').classList.remove('active');
  document.getElementById('page').classList.add('active');
  document.getElementById('pageTitle').textContent=name;
  document.getElementById('pageBody').innerHTML=pageBodies[name] || '<p>این بخش آماده تکمیل است.</p>';
  document.querySelectorAll('.nav').forEach(x=>x.classList.remove('active'));
  if(name==='تاریخچه') document.getElementById('n-history').classList.add('active');
  else if(name==='پروفایل') document.getElementById('n-profile').classList.add('active');
  else if(name==='یادآوری') document.getElementById('n-reminder').classList.add('active');
}
function goHome(){
  document.getElementById('page').classList.remove('active');
  document.getElementById('home').classList.add('active');
  document.querySelectorAll('.nav').forEach(x=>x.classList.remove('active'));
  document.getElementById('n-home').classList.add('active');
  scrollTo({top:0,behavior:'smooth'});
}

// rahhesab-chabok-v1
const CH_KEY='rahhesab_chabok_v1';
function chRead(){try{return JSON.parse(localStorage.getItem(CH_KEY)||'{"income":0,"cost":0,"hours":0,"km":0,"stops":[]}')}catch(e){return {income:0,cost:0,hours:0,km:0,stops:[]}}}
function chWrite(v){localStorage.setItem(CH_KEY,JSON.stringify(v));chRefresh()}
function faNum(v){return Number(v||0).toLocaleString('fa-IR')}
function chRefresh(){const d=chRead();document.getElementById('chIncome').textContent=faNum(d.income);document.getElementById('chCost').textContent=faNum(d.cost);document.getElementById('chNet').textContent=faNum(d.income-d.cost)+' تومان';document.getElementById('chHourly').textContent=faNum(d.hours?Math.round((d.income-d.cost)/d.hours):0)}
function openChabok(){document.getElementById('home').classList.remove('active');document.getElementById('page').classList.remove('active');document.querySelector('.bottom').style.display='none';document.getElementById('chabokPage').classList.add('active');chRefresh();scrollTo(0,0)}
function closeChabok(){document.getElementById('chabokPage').classList.remove('active');document.querySelector('.bottom').style.display='grid';document.getElementById('home').classList.add('active');scrollTo(0,0)}
function chabokPanel(type){
 const box=document.getElementById('chabokContent');
 const d=chRead();
 if(type==='income') box.innerHTML=`<h3>💰 مدیریت درآمد</h3><div class="ch-row"><span>مدل درآمد</span><b>حقوق / بار / سرویس / پاداش</b></div><input id="chiAmount" class="ch-input" inputmode="numeric" placeholder="مبلغ درآمد"><input id="chiCount" class="ch-input" inputmode="numeric" placeholder="تعداد بار/سرویس (اختیاری)"><button class="ch-btn" onclick="chAddIncome()">ثبت درآمد</button>`;
 else if(type==='costs') box.innerHTML=`<h3>🔧 هزینه‌های خودرو</h3><input id="chcAmount" class="ch-input" inputmode="numeric" placeholder="مبلغ هزینه"><select id="chcType" class="ch-input"><option>لاستیک</option><option>روغن</option><option>تعمیرات</option><option>سرویس</option><option>کارواش</option><option>پارکینگ</option><option>عوارض</option><option>بیمه</option><option>خلافی</option><option>معاینه فنی</option><option>اقساط خودرو</option><option>استهلاک</option><option>سایر</option></select><button class="ch-btn" onclick="chAddCost()">ثبت هزینه</button>`;
 else if(type==='fuel') box.innerHTML=`<h3>⛽ سوخت و کیلومتر</h3><input id="chfAmount" class="ch-input" inputmode="numeric" placeholder="مبلغ سوخت"><input id="chfKm" class="ch-input" inputmode="decimal" placeholder="کیلومتر کارکرد"><input id="chfHours" class="ch-input" inputmode="decimal" placeholder="ساعت کار امروز"><button class="ch-btn" onclick="chAddFuel()">ثبت</button><p class="ch-note">هزینه هر کیلومتر و درآمد ساعتی از داده‌های ثبت‌شده محاسبه می‌شود.</p>`;
 else if(type==='routes') box.innerHTML=`<h3>🛣️ چینش هوشمند مسیرها</h3><input id="chrLat" class="ch-input" inputmode="decimal" placeholder="عرض جغرافیایی مبدأ (مثلاً 35.6892)"><input id="chrLng" class="ch-input" inputmode="decimal" placeholder="طول جغرافیایی مبدأ (مثلاً 51.3890)"><button class="ch-btn dark" onclick="chUseGPS()">📍 استفاده از موقعیت فعلی</button><input id="chrName" class="ch-input" placeholder="نام مقصد"><input id="chrDLat" class="ch-input" inputmode="decimal" placeholder="عرض مقصد"><input id="chrDLng" class="ch-input" inputmode="decimal" placeholder="طول مقصد"><button class="ch-btn" onclick="chAddStop()">+ افزودن مقصد</button><div id="chStops" class="ch-list"></div><button class="ch-btn" onclick="chSortStops()">⚡ چینش پیشنهادی مسیر</button><p class="ch-note">نسخه فعلی بر اساس فاصله مستقیم مرتب می‌کند؛ برای ETA و مسیر جاده‌ای در نسخه نهایی باید سرویس مسیریابی متصل شود.</p>`;
 else if(type==='reminders') box.innerHTML=`<h3>🔔 یادآوری‌های راننده</h3>${['بیمه','لاستیک','روغن و سرویس','معاینه فنی','قسط خودرو'].map(x=>`<div class="ch-row"><span>${x}</span><button class="ch-btn dark" style="width:auto;padding:7px 10px;margin:0" onclick="alert('یادآوری ${x} ثبت شد')">ثبت</button></div>`).join('')}`;
 else if(type==='analytics') box.innerHTML=`<h3>📊 گزارش چابک</h3><div class="ch-row"><span>درآمد</span><b>${faNum(d.income)} تومان</b></div><div class="ch-row"><span>هزینه</span><b>${faNum(d.cost)} تومان</b></div><div class="ch-row"><span>خالص</span><b>${faNum(d.income-d.cost)} تومان</b></div><div class="ch-row"><span>درآمد خالص ساعتی</span><b>${faNum(d.hours?Math.round((d.income-d.cost)/d.hours):0)} تومان</b></div><div class="ch-row"><span>هزینه هر کیلومتر</span><b>${faNum(d.km?Math.round(d.cost/d.km):0)} تومان</b></div>`;
 else if(type==='car') box.innerHTML=`<h3>🚗 مدیریت خودرو</h3><input id="chCar" class="ch-input" placeholder="نام خودرو"><input id="chCarKm" class="ch-input" inputmode="numeric" placeholder="کارکرد فعلی (km)"><button class="ch-btn" onclick="localStorage.setItem('rahhesab_chabok_car',JSON.stringify({name:document.getElementById('chCar').value,km:document.getElementById('chCarKm').value}));alert('اطلاعات خودرو ذخیره شد')">ذخیره خودرو</button>`;
 else if(type==='insurance') box.innerHTML=`<h3>🛡️ بیمه و خلافی</h3><input class="ch-input" placeholder="عنوان (مثلاً بیمه شخص ثالث)"><input class="ch-input" type="date"><input class="ch-input" inputmode="numeric" placeholder="مبلغ"><button class="ch-btn" onclick="alert('مورد ثبت شد')">ثبت سررسید و هزینه</button>`;
 else if(type==='goals') box.innerHTML=`<h3>🎯 هدف درآمدی</h3><input id="chGoal" class="ch-input" inputmode="numeric" placeholder="هدف ماهانه"><button class="ch-btn" onclick="localStorage.setItem('rahhesab_chabok_goal',document.getElementById('chGoal').value);alert('هدف ذخیره شد')">ذخیره هدف</button>`;
 if(type==='routes') renderStops();
}
function cleanN(v){return Number(String(v||'').replace(/,/g,'').replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))||0}
function chAddIncome(){const d=chRead();d.income+=cleanN(document.getElementById('chiAmount').value);chWrite(d);alert('درآمد ثبت شد');chabokPanel('analytics')}
function chAddCost(){const d=chRead();d.cost+=cleanN(document.getElementById('chcAmount').value);chWrite(d);alert('هزینه ثبت شد');chabokPanel('analytics')}
function chAddFuel(){const d=chRead();d.cost+=cleanN(document.getElementById('chfAmount').value);d.km+=Number(document.getElementById('chfKm').value)||0;d.hours+=Number(document.getElementById('chfHours').value)||0;chWrite(d);alert('سوخت و کارکرد ثبت شد');chabokPanel('analytics')}
function chUseGPS(){if(!navigator.geolocation){alert('موقعیت‌یابی روی این دستگاه در دسترس نیست');return}navigator.geolocation.getCurrentPosition(p=>{document.getElementById('chrLat').value=p.coords.latitude.toFixed(6);document.getElementById('chrLng').value=p.coords.longitude.toFixed(6)},()=>alert('دسترسی موقعیت داده نشد'))}
function chAddStop(){const d=chRead();const n=document.getElementById('chrName').value.trim()||'مقصد جدید';const lat=Number(document.getElementById('chrDLat').value),lng=Number(document.getElementById('chrDLng').value);if(!Number.isFinite(lat)||!Number.isFinite(lng)){alert('مختصات مقصد را وارد کنید');return}d.stops.push({name:n,lat,lng});chWrite(d);document.getElementById('chrName').value='';document.getElementById('chrDLat').value='';document.getElementById('chrDLng').value='';renderStops()}
function dist(a,b,c,e){const R=6371,rad=Math.PI/180,dLat=(c-a)*rad,dLon=(e-b)*rad;const x=Math.sin(dLat/2)**2+Math.cos(a*rad)*Math.cos(c*rad)*Math.sin(dLon/2)**2;return 2*R*Math.asin(Math.sqrt(x))}
function chSortStops(){const d=chRead();const lat=Number(document.getElementById('chrLat').value),lng=Number(document.getElementById('chrLng').value);if(!Number.isFinite(lat)||!Number.isFinite(lng)){alert('ابتدا موقعیت مبدأ را وارد کنید یا GPS را بزنید');return}let a={lat,lng};const out=[];let left=[...d.stops];while(left.length){left.sort((x,y)=>dist(a.lat,a.lng,x.lat,x.lng)-dist(a.lat,a.lng,y.lat,y.lng));const n=left.shift();n.distance=dist(a.lat,a.lng,n.lat,n.lng);out.push(n);a=n}d.stops=out;chWrite(d);renderStops();alert('ترتیب پیشنهادی آماده شد')}
function renderStops(){const el=document.getElementById('chStops');if(!el)return;const d=chRead();el.innerHTML=d.stops.length?d.stops.map((x,i)=>`<div class="ch-stop"><div class="num">${i+1}</div><div><b>${x.name}</b><small>${x.distance?x.distance.toFixed(1)+' km از توقف قبلی':''}</small></div></div>`).join(''):'<div class="ch-note">هنوز مقصدی اضافه نشده است.</div>'}

