(function () {
  "use strict";

  const DURATION = 3000;
  const start = Date.now();

  const overlay = document.createElement("div");

  overlay.id = "abcStartup";

  overlay.innerHTML = `
    <div class="abc-startup-logo">راه‌حساب</div>
    <div class="abc-startup-sub">حسابدار مالی رانندگان</div>
    <div class="abc-progress">
      <div id="abcProgressBar"></div>
    </div>
    <div id="abcProgressText">۰٪</div>
  `;

  const style = document.createElement("style");

  style.textContent = `
    #abcStartup{
      position:fixed;
      inset:0;
      z-index:999999;
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      background:#fff;
      text-align:center;
    }

    .abc-startup-logo{
      font-size:42px;
      font-weight:900;
      margin-bottom:8px;
    }

    .abc-startup-sub{
      font-size:16px;
      margin-bottom:30px;
    }

    .abc-progress{
      width:75%;
      max-width:320px;
      height:10px;
      background:#eee;
      border-radius:20px;
      overflow:hidden;
    }

    #abcProgressBar{
      width:0%;
      height:100%;
      background:#222;
      transition:width .05s linear;
    }

    #abcProgressText{
      margin-top:12px;
      font-size:18px;
      font-weight:800;
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(overlay);

  function fa(n){
    return String(n).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
  }

  function tick(){
    const elapsed = Date.now() - start;
    const percent = Math.min(100, Math.floor(elapsed / DURATION * 100));

    const bar = document.getElementById("abcProgressBar");
    const text = document.getElementById("abcProgressText");

    if(bar) bar.style.width = percent + "%";
    if(text) text.textContent = fa(percent) + "٪";

    if(elapsed < DURATION){
      requestAnimationFrame(tick);
    }else{
      if(bar) bar.style.width = "100%";
      if(text) text.textContent = "۱۰۰٪";

      setTimeout(() => {
        overlay.remove();
      }, 120);
    }
  }

  requestAnimationFrame(tick);
})();
