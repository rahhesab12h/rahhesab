package ir.rahhesab.app;

import android.webkit.JavascriptInterface;
import android.app.Activity;
import ir.cafebazaar.poolakey.Connection;
import ir.cafebazaar.poolakey.Payment;
import ir.cafebazaar.poolakey.config.PaymentConfiguration;

public class BazaarBridge {

    private final Activity activity;
    private Payment payment;
    private Connection connection;

    public BazaarBridge(Activity activity) {
        this.activity = activity;
    }

    @JavascriptInterface
    public void connect() {
        activity.runOnUiThread(() -> {
            try {
                PaymentConfiguration config =
                    new PaymentConfiguration(
                        "MIHNMA0GCSqGSIb3DQEBAQUAA4G7ADCBtwKBrwCPqvvtjVNDFd1fzL8Yero6NBzthhXdaJaFceUPtI8wCIgIejlxe018gxdVtB+l8/Pc2cfzCXIfuivbnPEnPU1NBUzh/0Cz7GkYFtOtHKrkC3Row9HtBj3hor+59xXRc14nOYlvbePSrZqfO7kiEf/uxxYjaOuxf80eDqddi1CT76eb1Dine3kMmcwMTqSt7pxfyCiYFKxzvuwcc2K2OHZ90ZG2J59aCW6bVxanfvECAwEAAQ=="
                    );

                payment = new Payment(activity, config);

                connection = payment.connect(
                    () -> activity.runOnUiThread(() ->
                        activity.getWindow().getDecorView().post(() ->
                            activity.getWindow().getDecorView()
                                .setContentDescription("BAZAAR_CONNECTED")
                        )
                    ),
                    () -> {},
                    () -> {}
                );

            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    @JavascriptInterface
    public void subscribe() {
        if (payment == null) return;

        activity.runOnUiThread(() -> {
            try {
                payment.subscribeProduct(
                    "rahhesab_vip_30",
                    "rahhesab_vip_30"
                );
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }
}
