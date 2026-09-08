(function(){
  "use strict";

  function money(n){
    return Number(n || 0).toLocaleString("fa-IR") + " تومان";
  }

  function reportHtml(r){
    return `
      <div class="abc-stat"><span>درآمد</span><b>${money(r.income)}</b></div>
      <div class="abc-stat"><span>هزینه</span><b>${money(r.expense)}</b></div>
      <div class="abc-stat"><span>سود خالص</span><b>${money(r.profit)}</b></div>
      <div class="abc-stat"><span>بنزین</span><b>${money(r.fuel)}</b></div>
      <div class="abc-stat"><span>استهلاک</span><b>${money(r.wear)}</b></div>
      <div class="abc-stat"><span>هزینه دیگر</span><b>${money(r.other)}</b></div>
      <div class="abc-stat"><span>تعداد سفر</span><b>${r.trips}</b></div>
      <div class="abc-stat"><span>کیلومتر</span><b>${r.km}</b></div>
      <div class="abc-stat"><span>سود هر کیلومتر</span><b>${money(r.profitPerKm)}</b></div>
      <div class="abc-stat"><span>سود هر سفر</span><b>${money(r.profitPerTrip)}</b></div>
    `;
  }

  function render(){
    const panel=document.getElementById("abcPanel");
    if(!panel || !window.RahHesabABC) return;

    const week=RahHesabABC.week();
    const month=RahHesabABC.month();

    const dayKey=RahHesabABC.todayKey();
    const today=RahHesabABC.report(dayKey,dayKey);

    const daily=panel.querySelector('[data-abc="daily"]');
    const weekly=panel.querySelector('[data-abc="weekly"]');
    const monthly=panel.querySelector('[data-abc="monthly"]');

    if(daily) daily.innerHTML=`
      <div class="abc-box">
        <div class="abc-title">📅 گزارش امروز</div>
        ${reportHtml(today)}
      </div>`;

    if(weekly) weekly.innerHTML=`
      <div class="abc-box">
        <div class="abc-title">📊 گزارش ۷ روز اخیر</div>
        ${reportHtml(week)}
      </div>`;

    if(monthly) monthly.innerHTML=`
      <div class="abc-box">
        <div class="abc-title">📆 گزارش ماه جاری</div>
        ${reportHtml(month)}
      </div>`;
  }

  window.renderABC=render;

  document.addEventListener("DOMContentLoaded",()=>{
    render();
    setInterval(render,3000);
  });
})();
