package ir.rahhesab.app.bazaar

import androidx.activity.ComponentActivity
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.PluginMethod
import ir.cafebazaar.poolakey.Payment
import ir.cafebazaar.poolakey.config.PaymentConfiguration
import ir.cafebazaar.poolakey.config.SecurityCheck
import ir.cafebazaar.poolakey.request.PurchaseRequest

@CapacitorPlugin(name = "Bazaar")
class BazaarPlugin : Plugin() {

    private var payment: Payment? = null
    private var connection: ir.cafebazaar.poolakey.Connection? = null

    private val rsaKey =
        "MIHNMA0GCSqGSIb3DQEBAQUAA4G7ADCBtwKBrwCPqvvtjVNDFd1fzL8Yero6NBzthhXdaJaFceUPtI8wCIgIejlxe018gxdVtB+l8/Pc2cfzCXIfuivbnPEnPU1NBUzh/0Cz7GkYFtOtHKrkC3Row9HtBj3hor+59xXRc14nOYlvbePSrZqfO7kiEf/uxxYjaOuxf80eDqddi1CT76eb1Dine3kMmcwMTqSt7pxfyCiYFKxzvuwcc2K2OHZ90ZG2J59aCW6bVxanfvECAwEAAQ=="

    private val productId = "rahhesab_vip_30"

    @PluginMethod
    fun connect(call: PluginCall) {
        try {
            val config = PaymentConfiguration(
                localSecurityCheck = SecurityCheck.Enable(rsaKey),
                shouldSupportSubscription = true
            )

            payment = Payment(activity, config)

            connection = payment!!.connect {
                connectionSucceed {
                    val result = JSObject()
                    result.put("connected", true)
                    call.resolve(result)
                }

                connectionFailed {
                    call.reject("اتصال به بازار ناموفق بود", it.message)
                }

                disconnected {
                }
            }

        } catch (e: Exception) {
            call.reject("خطا در راه‌اندازی بازار", e.message)
        }
    }

    @PluginMethod
    fun subscribe(call: PluginCall) {
        val p = payment

        if (p == null) {
            call.reject("ابتدا اتصال به بازار را برقرار کنید")
            return
        }

        val host = activity

        if (host !is ComponentActivity) {
            call.reject("ActivityResultRegistry در دسترس نیست")
            return
        }

        val payload = call.getString("payload") ?: ""

        p.subscribeProduct(
            registry = host.activityResultRegistry,
            request = PurchaseRequest(
                productId = productId,
                payload = payload,
                dynamicPriceToken = null
            )
        ) {
            purchaseFlowBegan {
            }

            purchaseSucceed {
                val result = JSObject()
                result.put("purchased", true)
                result.put("productId", it.productId)
                result.put("purchaseToken", it.purchaseToken)
                result.put("purchaseTime", it.purchaseTime)
                result.put("orderId", it.orderId)
                call.resolve(result)
            }

            purchaseCanceled {
                call.reject("خرید لغو شد")
            }

            purchaseFailed {
                call.reject("خرید ناموفق بود", it.message)
            }

            failedToBeginFlow {
                call.reject("شروع فرآیند خرید ناموفق بود", it.message)
            }
        }
    }

    @PluginMethod
    fun checkSubscription(call: PluginCall) {
        val p = payment

        if (p == null) {
            call.reject("ابتدا اتصال به بازار را برقرار کنید")
            return
        }

        p.getSubscribedProducts {
            querySucceed { purchases ->
                val purchase = purchases.firstOrNull {
                    it.productId == productId
                }

                val result = JSObject()

                if (purchase != null) {
                    result.put("active", true)
                    result.put("productId", purchase.productId)
                    result.put("purchaseToken", purchase.purchaseToken)
                    result.put("purchaseTime", purchase.purchaseTime)
                    result.put("orderId", purchase.orderId)
                } else {
                    result.put("active", false)
                }

                call.resolve(result)
            }

            queryFailed {
                call.reject("بررسی اشتراک بازار ناموفق بود", it.message)
            }
        }
    }
}
