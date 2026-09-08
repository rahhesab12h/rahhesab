(function(){
  "use strict";

  const KEY = "rahhesab_abc_requests_v1";

  function getRequests(){
    try{
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    }catch(e){
      return [];
    }
  }

  function saveRequest(type, data){
    const list = getRequests();

    list.push({
      id: "ABC-" + Date.now(),
      type,
      data,
      createdAt: new Date().toISOString(),
      status: "در انتظار بررسی پشتیبانی"
    });

    localStorage.setItem(KEY, JSON.stringify(list));
    return list[list.length - 1];
  }

  function esc(value){
    return String(value || "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }

  function showMessage(text){
    if(typeof window.showToast === "function"){
      window.showToast(text);
    }else{
      alert(text);
    }
  }

  function supportForm(prefill){
    const panel = document.querySelector('[data-abc="support"]');
    if(!panel) return;

    panel.innerHTML = `
      <div class="abc-box">
        <div class="abc-title">🎧 پشتیبانی راه‌حساب</div>

        <input id="abcSupportName"
          placeholder="نام"
          value="${esc(prefill?.name)}"
          style="width:100%;padding:12px;margin:6px 0;border-radius:10px;border:1px solid #ddd;box-sizing:border-box;">

        <input id="abcSupportPhone"
          placeholder="شماره تماس"
          value="${esc(prefill?.phone)}"
          style="width:100%;padding:12px;margin:6px 0;border-radius:10px;border:1px solid #ddd;box-sizing:border-box;">

        <textarea id="abcSupportMessage"
          placeholder="پیام یا درخواست شما"
          style="width:100%;min-height:120px;padding:12px;margin:6px 0;border-radius:10px;border:1px solid #ddd;box-sizing:border-box;"></textarea>

        <button class="abc-btn" onclick="submitABCSupport()">
          📩 ثبت درخواست
        </button>

        <button class="abc-btn" onclick="RahHesabABC.show('daily')">
          ↩️ برگشت
        </button>
      </div>
    `;
  }

  window.openABCSupport = function(prefill){
    if(window.RahHesabABC){
      RahHesabABC.show("support");
      setTimeout(() => supportForm(prefill || {}), 0);
    }
  };

  window.submitABCSupport = function(){
    const name = document.getElementById("abcSupportName")?.value.trim();
    const phone = document.getElementById("abcSupportPhone")?.value.trim();
    const message = document.getElementById("abcSupportMessage")?.value.trim();

    if(!message){
      showMessage("لطفاً پیام خود را وارد کنید.");
      return;
    }

    saveRequest("support", {
      name,
      phone,
      message
    });

    showMessage("درخواست شما ثبت شد و در صف بررسی پشتیبانی قرار گرفت.");

    if(window.RahHesabABC){
      RahHesabABC.show("daily");
    }
  };

  window.openABCAds = function(){
    const panel = document.querySelector('[data-abc="ads"]');
    if(!panel) return;

    panel.innerHTML = `
      <div class="abc-box">
        <div class="abc-title">📢 درخواست تبلیغات</div>

        <p>
          کسب‌وکارها و برنامه‌های مجاز می‌توانند درخواست تبلیغات
          در راه‌حساب را ثبت کنند.
        </p>

        <input id="abcAdName"
          placeholder="نام برنامه یا کسب‌وکار"
          style="width:100%;padding:12px;margin:6px 0;border-radius:10px;border:1px solid #ddd;box-sizing:border-box;">

        <input id="abcAdContact"
          placeholder="راه ارتباطی"
          style="width:100%;padding:12px;margin:6px 0;border-radius:10px;border:1px solid #ddd;box-sizing:border-box;">

        <select id="abcAdCategory"
          style="width:100%;padding:12px;margin:6px 0;border-radius:10px;border:1px solid #ddd;box-sizing:border-box;">
          <option value="">دسته‌بندی</option>
          <option>اپلیکیشن</option>
          <option>فروشگاه</option>
          <option>خدمات خودرو</option>
          <option>خدمات مالی</option>
          <option>سایر خدمات مجاز</option>
        </select>

        <textarea id="abcAdMessage"
          placeholder="توضیح کمپین تبلیغاتی"
          style="width:100%;min-height:100px;padding:12px;margin:6px 0;border-radius:10px;border:1px solid #ddd;box-sizing:border-box;"></textarea>

        <button class="abc-btn" onclick="submitABCAd()">
          📩 ارسال درخواست تبلیغات
        </button>

        <button class="abc-btn" onclick="RahHesabABC.show('support')">
          🎧 ارتباط با پشتیبانی
        </button>
      </div>
    `;
  };

  window.submitABCAd = function(){
    const name = document.getElementById("abcAdName")?.value.trim();
    const contact = document.getElementById("abcAdContact")?.value.trim();
    const category = document.getElementById("abcAdCategory")?.value;
    const message = document.getElementById("abcAdMessage")?.value.trim();

    if(!name || !contact || !message){
      showMessage("نام، راه ارتباطی و توضیح کمپین را کامل کنید.");
      return;
    }

    saveRequest("advertising", {
      name,
      contact,
      category,
      message,
      reviewRequired: true
    });

    showMessage("درخواست تبلیغات ثبت شد و برای بررسی پشتیبانی ارسال می‌شود.");

    RahHesabABC.show("daily");
  };

  window.openABCCharity = function(){
    const panel = document.querySelector('[data-abc="charity"]');
    if(!panel) return;

    panel.innerHTML = `
      <div class="abc-box">
        <div class="abc-title">❤️ کمک به خیریه</div>

        <p>
          راه‌حساب فقط مقصدهای خیریه تأییدشده را برای کمک مالی نمایش می‌دهد.
        </p>

        <div class="abc-stat">
          <span>وضعیت مقصدها</span>
          <b>در انتظار ثبت مقصد تأییدشده</b>
        </div>

        <p style="font-size:13px;">
          برای جلوگیری از سوءاستفاده، هیچ مقصد یا حساب پرداختی
          تأییدنشده در این بخش قرار نمی‌گیرد.
        </p>

        <button class="abc-btn" onclick="RahHesabABC.show('support')">
          🎧 درخواست اطلاعات خیریه
        </button>
      </div>
    `;
  };

  window.openABCVipPlans = function(){
    const panel = document.querySelector('[data-abc="vip"]');
    if(!panel) return;

    const vip = typeof window.isVipActive === "function"
      ? window.isVipActive()
      : false;

    panel.innerHTML = `
      <div class="abc-box">
        <div class="abc-title">⭐ VIP راه‌حساب</div>

        <div class="abc-stat">
          <span>وضعیت</span>
          <b>${vip ? "فعال" : "غیرفعال"}</b>
        </div>

        <button class="abc-btn"
          onclick="buyABCVip('rahhesab_vip_30')">
          ⭐ VIP ماهانه — ۳۰ روز
        </button>

        <button class="abc-btn"
          onclick="buyABCVip('rahhesab_vip_365')">
          👑 VIP سالانه — ۳۶۵ روز
        </button>

        <button class="abc-btn"
          onclick="checkABCVip()">
          🔄 بررسی وضعیت VIP
        </button>

        <button class="abc-btn"
          onclick="RahHesabABC.show('daily')">
          ↩️ برگشت
        </button>
      </div>
    `;
  };

  window.buyABCVip = async function(productId){
    try{
      if(typeof window.buyBazaarVip === "function"){
        const result = await window.buyBazaarVip(productId);

        if(result !== false){
          showMessage("درخواست خرید VIP ارسال شد.");
        }

        return;
      }

      showMessage("اتصال بازار در این نسخه در دسترس نیست.");
    }catch(e){
      console.error(e);
      showMessage("خرید VIP انجام نشد.");
    }
  };

  window.checkABCVip = async function(){
    try{
      if(typeof window.checkBazaarSubscription === "function"){
        await window.checkBazaarSubscription();
      }

      if(window.RahHesabABC){
        RahHesabABC.show("vip");
      }

      showMessage(
        typeof window.isVipActive === "function" &&
        window.isVipActive()
          ? "VIP فعال است."
          : "VIP فعال نیست."
      );
    }catch(e){
      console.error(e);
      showMessage("بررسی VIP انجام نشد.");
    }
  };

})();
