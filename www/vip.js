(function(){
  "use strict";

  const VIP_KEY="rahhesab_vip_entitlement_v2";

  function getVipEntitlement(){
    try{
      const data=JSON.parse(
        localStorage.getItem(VIP_KEY)||"null"
      );

      if(!data || data.status!=="active"){
        return null;
      }

      if(
        Number.isFinite(Number(data.expiresAt)) &&
        Number(data.expiresAt)<=Date.now()
      ){
        localStorage.removeItem(VIP_KEY);
        return null;
      }

      return data;
    }catch(e){
      localStorage.removeItem(VIP_KEY);
      return null;
    }
  }

  function isVipActive(){
    return !!getVipEntitlement();
  }

  function applyVerifiedVip(entitlement){

    if(!entitlement || !entitlement.purchaseToken){
      throw new Error("Invalid verified purchase");
    }

    localStorage.setItem(
      VIP_KEY,
      JSON.stringify({
        status:"active",
        provider:entitlement.provider||"bazaar",
        productId:entitlement.productId||"rahhesab_vip_30",
        purchaseToken:entitlement.purchaseToken,
        orderId:entitlement.orderId||"",
        purchaseTime:entitlement.purchaseTime||"",
        expiresAt:Number.isFinite(Number(entitlement.expiresAt))
          ? Number(entitlement.expiresAt)
          : null,
        verifiedAt:Date.now()
      })
    );

    window.dispatchEvent(
      new CustomEvent("rahhesab-vip-changed",{
        detail:{active:true}
      })
    );

    return true;
  }

  function clearVip(){
    localStorage.removeItem(VIP_KEY);

    window.dispatchEvent(
      new CustomEvent("rahhesab-vip-changed",{
        detail:{active:false}
      })
    );
  }

  window.getVipEntitlement=getVipEntitlement;
  window.isVipActive=isVipActive;
  window.applyVerifiedVip=applyVerifiedVip;
  window.clearVip=clearVip;

})();
