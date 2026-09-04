package ir.rahhesab.app;

import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onStart() {
        super.onStart();

        WebView webView = bridge.getWebView();
        webView.getSettings().setJavaScriptEnabled(true);
        webView.addJavascriptInterface(
            new BazaarBridge(this),
            "BazaarBridge"
        );
    }
}
