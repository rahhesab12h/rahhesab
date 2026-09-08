(function(){
  "use strict";

  const MONTHLY_PRODUCT_ID = "rahhesab_vip_30";
  const YEARLY_PRODUCT_ID = "rahhesab_vip_365";

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

    if(!result || result.active !== true){
      return false;
    }

    if(!result.purchaseToken){
      return false;
    }

    if(typeof window.applyVerifiedVip !== "function"){
      return false;
    }

    const productId = result.productId || MONTHLY_PRODUCT_ID;

    if(
      productId !== MONTHLY_PRODUCT_ID &&
      productId !== YEARLY_PRODUCT_ID
    ){
      return false;
    }

    const days =
      productId === YEARLY_PRODUCT_ID ? 365 : 30;

    const purchaseTime =
      Number(result.purchaseTime) || Date.now();

    const expiresAt =
      Number.isFinite(Number(result.expiresAt))
        ? Number(result.expiresAt)
        : purchaseTime + days * 24 * 60 * 60 * 1000;

    window.applyVerifiedVip({
      provider: "bazaar",
      productId,
      purchaseToken: result.purchaseToken,
      orderId: result.orderId || "",
      purchaseTime: result.purchaseTime || "",
      expiresAt
    });

    return true;
  }

  async function connectBazaar(){

    const Bazaar = plugin();

    if(!Bazaar){
      return false;
    }

    try{
      const result = await Bazaar.connect();

      return !!(
        result &&
        result.connected === true
      );

    }catch(e){
      console.error(e);
      return false;
    }
  }

  async function checkBazaarSubscription(){

    const Bazaar = plugin();

    if(!Bazaar){
      return false;
    }

    try{

      const result =
        await Bazaar.checkSubscription();

      if(result && result.active === true){

        return activate(result);
      }

      if(typeof window.clearVip === "function"){
        window.clearVip();
      }

      return false;

    }catch(e){
      console.error(e);
      return false;
    }
  }

  async function buyBazaarVip(productId){

    const Bazaar = plugin();

    if(!Bazaar){
      alert("نسخه بازار راه‌حساب در دسترس نیست.");
      return false;
    }

    productId =
      productId === YEARLY_PRODUCT_ID
        ? YEARLY_PRODUCT_ID
        : MONTHLY_PRODUCT_ID;

    try{

      if(!await connectBazaar()){
        alert("اتصال به بازار برقرار نشد.");
        return false;
      }

      const result =
        await Bazaar.subscribe({
          productId: productId,
          payload: productId
        });

      if(!result || result.purchased !== true){
        return false;
      }

      const ok = activate({
        active: true,
        productId: result.productId || productId,
        purchaseToken: result.purchaseToken || "",
        orderId: result.orderId || "",
        purchaseTime: result.purchaseTime || "",
        expiresAt: result.expiresAt
      });

      if(ok){
        alert(
          productId === YEARLY_PRODUCT_ID
            ? "VIP سالانه با موفقیت فعال شد ✓"
            : "VIP ماهانه با موفقیت فعال شد ✓"
        );
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

  window.connectBazaar = connectBazaar;
  window.checkBazaarSubscription = checkBazaarSubscription;
  window.buyBazaarVip = buyBazaarVip;
  window.initializeBazaarVip = initializeBazaarVip;

})();
