# Build Instructions untuk Doa Pengayoman

## Prerequisites

1. **Install EAS CLI**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Login ke Expo**
   ```bash
   eas login
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

## Konfigurasi AdMob untuk Production

### 1. Buat AdMob Account
1. Buka [Google AdMob Console](https://admob.google.com/)
2. Buat aplikasi baru untuk "Doa Pengayoman"
3. Dapatkan App ID dan Ad Unit IDs

### 2. Update AdMob IDs
Ganti ID demo di file berikut dengan ID production Anda:

**File: `app.json`**
```json
"androidAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX",
"iosAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"
```

**File: `services/AdMobService.ts`**
```typescript
export const AD_UNIT_IDS = {
  INTERSTITIAL: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  REWARDED: __DEV__ ? TestIds.REWARDED : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  BANNER: __DEV__ ? TestIds.BANNER : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
};
```

## Build Commands

### Android AAB (Production)
```bash
# Build AAB untuk Google Play Store
eas build --platform android --profile production

# Atau gunakan script npm
npm run build:android
```

### iOS (Production)
```bash
# Build untuk App Store
eas build --platform ios --profile production

# Atau gunakan script npm
npm run build:ios
```

### Build Both Platforms
```bash
npm run build:all
```

## Submit ke Store

### Google Play Store
```bash
# Submit AAB ke Google Play Console
eas submit --platform android

# Atau gunakan script npm
npm run submit:android
```

### Apple App Store
```bash
# Submit ke App Store Connect
eas submit --platform ios

# Atau gunakan script npm
npm run submit:ios
```

## Konfigurasi Store Listing

### Google Play Store
1. **Kategori**: Lifestyle > Religion & Spirituality
2. **Content Rating**: Everyone
3. **Target Audience**: All ages
4. **Privacy Policy**: Required (buat privacy policy untuk aplikasi)

### Apple App Store
1. **Category**: Lifestyle
2. **Age Rating**: 4+
3. **Privacy Policy**: Required

## AdMob Policy Compliance

### ✅ Sudah Diimplementasi:
- [x] Interstitial ads dengan timing yang aman (setiap 3 navigasi)
- [x] Reward ads dengan value yang jelas (30 menit ad-free)
- [x] Privacy settings dan consent management
- [x] COPPA compliance (child-directed treatment: false)
- [x] Non-personalized ads option
- [x] Proper ad placement (tidak mengganggu UX)

### 📋 Checklist Sebelum Submit:
- [ ] Ganti demo AdMob IDs dengan production IDs
- [ ] Test ads di production build
- [ ] Buat Privacy Policy
- [ ] Test consent flow
- [ ] Verify ad placement tidak melanggar policy
- [ ] Test reward ads functionality

## Testing Production Build

### Local Testing
```bash
# Build preview untuk testing
eas build --platform android --profile preview

# Install dan test di device
```

### AdMob Testing
1. Gunakan test device untuk testing ads
2. Verify semua ad types berfungsi
3. Test consent flow
4. Test reward functionality

## Troubleshooting

### Common Issues:
1. **AdMob not loading**: Check internet connection dan AdMob IDs
2. **Build failed**: Check dependencies dan configuration
3. **Ads not showing**: Verify AdMob account setup dan app approval

### Support:
- [Expo Documentation](https://docs.expo.dev/)
- [AdMob Documentation](https://developers.google.com/admob)
- [React Native Google Mobile Ads](https://docs.page/invertase/react-native-google-mobile-ads)

## Production Checklist

- [ ] AdMob production IDs configured
- [ ] Privacy policy created and linked
- [ ] App icons and splash screen ready
- [ ] Store listings prepared
- [ ] Build tested on real devices
- [ ] Ad functionality verified
- [ ] Consent flow tested
- [ ] Performance optimized
- [ ] Ready for store submission
