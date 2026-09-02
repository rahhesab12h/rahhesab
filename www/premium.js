const PREMIUM_KEY="rahhesab_premium_v2";
const PREMIUM_PRICE=250000;
const PREMIUM_DAYS=30;

function premiumActive(){
  const x=JSON.parse(localStorage.getItem(PREMIUM_KEY)||"null");
  return !!(x && x.expiresAt>Date.now());
}

function activatePremium30(){
  localStorage.setItem(PREMIUM_KEY,JSON.stringify({
    active:true,
    price:PREMIUM_PRICE,
    purchasedAt:Date.now(),
    expiresAt:Date.now()+PREMIUM_DAYS*86400000
  }));
  alert("Premium برای ۳۰ روز فعال شد ⭐");
}
