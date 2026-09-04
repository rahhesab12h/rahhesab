/*
 * RahHesab - Bazaar VIP Bridge
 * Connects the existing VIP system to the native Capacitor Bazaar plugin.
 */

(function () {
  "use strict";

  function getBazaarPlugin() {
    return window.Capacitor &&
           window.Capacitor.Plugins &&
           window.Capacitor.Plugins.Bazaar
      ? window.Capacitor.Plugins.Bazaar
      : null;
  }

  function updateBazaarVipUI() {
    if (typeof updatePremiumShop === "function") {
      updatePremiumShop();
    }

    if (typeof updatePremiumVipLock === "function") {
      updatePremiumVipLock();
    }
  }

  async function connectBazaar() {
    const Bazaar = getBazaarPlugin();

    if (!Bazaar) {
      return false;
    }

    try {
      await Bazaar.connect();
      return true;
    } catch (error) {
      console.log("Bazaar connection:", error);
      return false;
    }
  }

  async function checkBazaarSubscription() {
    const Bazaar = getBazaarPlugin();

    if (!Bazaar) {
      return false;
    }

    try {
      const result = await Bazaar.checkSubscription();

      if (!result || !result.active) {
        return false;
      }

      const purchaseTime = Number(result.purchaseTime);

      if (!Number.isFinite(purchaseTime) || purchaseTime <= 0) {
        return false;
      }

      /*
       * Current product is a 30-day subscription.
       * The native Bazaar layer confirms the subscription purchase.
       */
      const expiresAt = purchaseTime + (30 * 86400000);

      applyVerifiedVip({
        status: "active",
        provider: "bazaar",
        purchaseToken: result.purchaseToken || "",
        expiresAt: expiresAt
      });

      updateBazaarVipUI();
      return true;

    } catch (error) {
      console.log("Bazaar subscription check:", error);
      return false;
    }
  }

  window.startPremiumPurchase = async function () {
    const Bazaar = getBazaarPlugin();

    if (!Bazaar) {
      alert("برای خرید VIP، نسخه بازار راه‌حساب را نصب و اجرا کنید.");
      return;
    }

    try {
      await connectBazaar();

      const result = await Bazaar.subscribe({
        payload: "rahhesab_vip_30"
      });

      if (result && result.purchased) {
        const purchaseTime = Number(result.purchaseTime);

        if (Number.isFinite(purchaseTime) && purchaseTime > 0) {
          applyVerifiedVip({
            status: "active",
            provider: "bazaar",
            purchaseToken: result.purchaseToken || "",
            expiresAt: purchaseTime + (30 * 86400000)
          });
        }

        updateBazaarVipUI();

        alert("👑 اشتراک VIP با موفقیت فعال شد.");
      }

    } catch (error) {
      console.log("Bazaar purchase:", error);

      const message =
        error && error.message
          ? error.message
          : "پرداخت انجام نشد.";

      alert(message);
    }
  };

  async function initializeBazaarVip() {
    const connected = await connectBazaar();

    if (connected) {
      await checkBazaarSubscription();
    }

    updateBazaarVipUI();
  }

  document.addEventListener(
    "DOMContentLoaded",
    initializeBazaarVip
  );

  window.checkBazaarSubscription = checkBazaarSubscription;
  window.connectBazaar = connectBazaar;
})();
