package com.thereporters.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Force-enable JavaScript and DOM storage to fix mobile web-wrapper interaction bugs
        if (this.bridge != null && this.bridge.getWebView() != null) {
            this.bridge.getWebView().getSettings().setJavaScriptEnabled(true);
            this.bridge.getWebView().getSettings().setDomStorageEnabled(true);
            this.bridge.getWebView().getSettings().setDatabaseEnabled(true);
        }
    }
}