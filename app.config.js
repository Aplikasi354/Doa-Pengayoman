export default {
  expo: {
    name: "Doa Pengayoman",
    slug: "test-tempo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.doaapengayoman.app",
      buildNumber: "1",
      infoPlist: {
        NSUserTrackingUsageDescription: "This identifier will be used to deliver personalized ads to you.",
        GADApplicationIdentifier: "ca-app-pub-3940256099942544~1458002511",
        SKAdNetworkItems: [
          {
            SKAdNetworkIdentifier: "cstr6suwn9.skadnetwork"
          }
        ]
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.doaapengayoman.app",
      versionCode: 1,
      permissions: [
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE"
      ],
      config: {
        googleMobileAdsAppId: "ca-app-pub-3940256099942544~3347511713"
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "352a26f9-9a48-4bc6-83d1-4e64b5b08606"
      }
    }
  }
};
