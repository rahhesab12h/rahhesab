/*
 * RahHesab VIP entitlement core
 * VIP is NOT activated locally.
 * Activation must come from verified Bazaar/Myket purchase.
 */

const VIP_KEY = "rahhesab_vip_entitlement_v1";

function getVipEntitlement() {
  try {
    const data = JSON.parse(localStorage.getItem(VIP_KEY) || "null");

    if (!data || data.status !== "active") {
      return null;
    }

    if (!Number.isFinite(data.expiresAt) || data.expiresAt <= Date.now()) {
      localStorage.removeItem(VIP_KEY);
      return null;
    }

    return data;
  } catch {
    localStorage.removeItem(VIP_KEY);
    return null;
  }
}

function isVipActive() {
  return !!getVipEntitlement();
}

function vipDaysRemaining() {
  const data = getVipEntitlement();
  if (!data) return 0;

  return Math.max(
    0,
    Math.ceil((data.expiresAt - Date.now()) / 86400000)
  );
}

/*
 * Reserved for VERIFIED store/server response only.
 * Do not call this from a purchase button directly.
 */
function applyVerifiedVip(entitlement) {
  if (!entitlement || entitlement.status !== "active") {
    throw new Error("Invalid VIP entitlement");
  }

  if (!Number.isFinite(entitlement.expiresAt) ||
      entitlement.expiresAt <= Date.now()) {
    throw new Error("Expired VIP entitlement");
  }

  localStorage.setItem(VIP_KEY, JSON.stringify({
    status: "active",
    provider: entitlement.provider || "verified",
    purchaseToken: entitlement.purchaseToken || "",
    expiresAt: entitlement.expiresAt,
    verifiedAt: Date.now()
  }));
}

function clearVip() {
  localStorage.removeItem(VIP_KEY);
}
