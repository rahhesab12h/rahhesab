/*
 * RahHesab - Bazaar VIP Bridge
 *
 * Flow:
 *
 * UI
 *  ↓
 * buyBazaarVip()
 *  ↓
 * Native Bazaar Plugin
 *  ↓
 * Poolakey
 *  ↓
 * Bazaar verified purchase
 *  ↓
 * VIP entitlement
 */

(function () {

    "use strict";

    const PRODUCT_ID =
        typeof BAZAAR_PRODUCT_ID !== "undefined"
            ? BAZAAR_PRODUCT_ID
            : "rahhesab_vip_30";


    function getBazaarPlugin() {

        try {

            if (
                window.Capacitor &&
                window.Capacitor.Plugins &&
                window.Capacitor.Plugins.Bazaar
            ) {
                return window.Capacitor.Plugins.Bazaar;
            }

        } catch (_) {}

        return null;
    }


    function updateBazaarVipUI(active) {

        try {

            window.dispatchEvent(
                new CustomEvent("rahhesab-vip-changed", {
                    detail: {
                        active: !!active,
                        provider: "bazaar",
                        productId: PRODUCT_ID
                    }
                })
            );

        } catch (_) {}


        try {

            if (typeof window.updateVipUI === "function") {
                window.updateVipUI();
            }

        } catch (_) {}
    }


    function activateVerifiedPurchase(result) {

        if (!result || result.active !== true) {
            return false;
        }


        const entitlement = {

            provider: "bazaar",

            productId:
                result.productId || PRODUCT_ID,

            purchaseToken:
                result.purchaseToken || "",

            orderId:
                result.orderId || "",

            purchaseTime:
                result.purchaseTime || ""
        };


        /*
         * Use existing RahHesab VIP core.
         *
         * We intentionally do NOT create a fake local
         * purchase. Activation only happens after Native
         * Bazaar confirms the purchase.
         */

        try {

            if (
                typeof window.activateVipFromPurchase ===
                "function"
            ) {

                window.activateVipFromPurchase(
                    entitlement
                );

                return true;
            }


            if (
                typeof window.setVipEntitlement ===
                "function"
            ) {

                window.setVipEntitlement(
                    entitlement
                );

                return true;
            }

        } catch (error) {

            console.error(
                "VIP entitlement activation failed:",
                error
            );
        }


        console.warn(
            "RahHesab VIP activation function was not found."
        );

        return false;
    }


    async function connectBazaar() {

        const Bazaar =
            getBazaarPlugin();


        if (!Bazaar) {

            console.warn(
                "Bazaar native plugin is not available."
            );

            return false;
        }


        try {

            const result =
                await Bazaar.connect();


            return !!(
                result &&
                result.connected === true
            );

        } catch (error) {

            console.error(
                "Bazaar connection failed:",
                error
            );

            return false;
        }
    }


    async function checkBazaarSubscription() {

        const Bazaar =
            getBazaarPlugin();


        if (!Bazaar) {
            return false;
        }


        try {

            const result =
                await Bazaar.checkSubscription();


            const active =
                !!(
                    result &&
                    result.active === true
                );


            if (active) {

                activateVerifiedPurchase(
                    result
                );
            }


            updateBazaarVipUI(active);


            return active;

        } catch (error) {

            console.error(
                "Bazaar subscription check failed:",
                error
            );

            updateBazaarVipUI(false);

            return false;
        }
    }


    async function buyBazaarVip() {

        const Bazaar =
            getBazaarPlugin();


        if (!Bazaar) {

            console.warn(
                "Bazaar native plugin is not available."
            );

            return false;
        }


        try {

            const connected =
                await connectBazaar();


            if (!connected) {
                return false;
            }


            const result =
                await Bazaar.subscribe({
                    payload: PRODUCT_ID
                });


            if (
                !result ||
                result.purchased !== true
            ) {

                return false;
            }


            /*
             * Native Poolakey has already confirmed
             * successful Bazaar purchase.
             */

            const verifiedResult = {

                active: true,

                productId:
                    result.productId ||
                    PRODUCT_ID,

                purchaseToken:
                    result.purchaseToken ||
                    "",

                orderId:
                    result.orderId ||
                    "",

                purchaseTime:
                    result.purchaseTime ||
                    ""
            };


            const activated =
                activateVerifiedPurchase(
                    verifiedResult
                );


            updateBazaarVipUI(
                activated
            );


            return activated;

        } catch (error) {

            console.error(
                "Bazaar purchase failed:",
                error
            );

            return false;
        }
    }


    async function initializeBazaarVip() {

        const connected =
            await connectBazaar();


        if (!connected) {

            updateBazaarVipUI(false);

            return false;
        }


        return await checkBazaarSubscription();
    }


    /*
     * Public API
     */

    window.connectBazaar =
        connectBazaar;

    window.checkBazaarSubscription =
        checkBazaarSubscription;

    window.buyBazaarVip =
        buyBazaarVip;

    window.initializeBazaarVip =
        initializeBazaarVip;

})();
