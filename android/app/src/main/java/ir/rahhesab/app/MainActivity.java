package ir.rahhesab.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

import ir.rahhesab.app.bazaar.BazaarPlugin;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(BazaarPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
