(function(){
  "use strict";

  const PRODUCT_ID =
    typeof BAZAAR_PRODUCT_ID!=="undefined"
      ? BAZAAR_PRODUCT_ID
      : "rahhesab_vip_30";

  function plugin(){
    try{
      return window.Capacitor &&
             window.Capacitor.Plugins &&
             window.Capacitor.Plugins.Bazaar;
    }catch(e){
      return null;
    }
  }

  function activate(result){

    if(!result || result.active!==true){
      return false;
    }

    if(!result.purchaseToken){
      return false;
    }

    if(typeof window.applyVerifiedVip!=="function"){
      return false;
    }

    window.applyVerifiedVip({
      provider:"bazaar",
      productId:result.productId||PRODUCT_ID,
      purchaseToken:result.purchaseToken,
      orderId:result.orderId||"",
      purchaseTime:result.purchaseTime||"",
      expiresAt:result.expiresAt
    });

    return true;
  }

  async function connectBazaar(){

    const Bazaar=plugin();

    if(!Bazaar){
      return false;
    }

    try{
      const result=await Bazaar.connect();
      return !!(result && result.connected===true);
    }catch(e){
      console.error(e);
      return false;
    }
  }

  async function checkBazaarSubscription(){

    const Bazaar=plugin();

    if(!Bazaar){
      return false;
    }

    try{

      const result=
        await Bazaar.checkSubscription();

      if(result && result.active===true){
        activate(result);
        return true;
      }

      if(typeof window.clearVip==="function"){
        window.clearVip();
      }

      return false;

    }catch(e){
      console.error(e);
      return false;
    }
  }

  async function buyBazaarVip(){

    const Bazaar=plugin();

    if(!Bazaar){
      alert("نسخه بازار راه‌حساب در دسترس نیست.");
      return false;
    }

    try{

      if(!await connectBazaar()){
        alert("اتصال به بازار برقرار نشد.");
        return false;
      }

      const result=
        await Bazaar.subscribe({
          payload:PRODUCT_ID
        });

      if(!result || result.purchased!==true){
        return false;
      }

      const ok=activate({
        active:true,
        productId:result.productId||PRODUCT_ID,
        purchaseToken:result.purchaseToken||"",
        orderId:result.orderId||"",
        purchaseTime:result.purchaseTime||"",
        expiresAt:result.expiresAt
      });

      if(ok){
        alert("VIP با موفقیت فعال شد ✓");
      }

      return ok;

    }catch(e){
      console.error(e);
      alert("خرید VIP ناموفق بود.");
      return false;
    }
  }

  async function initializeBazaarVip(){

    if(!await connectBazaar()){
      return false;
    }

    return await checkBazaarSubscription();
  }

  window.connectBazaar=connectBazaar;
  window.checkBazaarSubscription=checkBazaarSubscription;
  window.buyBazaarVip=buyBazaarVip;
  window.initializeBazaarVip=initializeBazaarVip;

})();
