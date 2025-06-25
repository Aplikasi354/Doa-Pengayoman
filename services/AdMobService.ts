import mobileAds, {
  AdEventType,
  InterstitialAd,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
  BannerAd,
  BannerAdSize,
  MaxAdContentRating
} from 'react-native-google-mobile-ads';
import { consentService } from './ConsentService';

// Production Ad Unit IDs - Replace with your real AdMob IDs for production
export const AD_UNIT_IDS = {
  // Use test IDs in development, demo IDs in production (replace with real IDs later)
  INTERSTITIAL: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: __DEV__ ? TestIds.REWARDED : 'ca-app-pub-3940256099942544/5224354917',
  BANNER: __DEV__ ? TestIds.BANNER : 'ca-app-pub-3940256099942544/6300978111',
};

class AdMobService {
  private interstitialAd: InterstitialAd | null = null;
  private rewardedAd: RewardedAd | null = null;
  private isInitialized = false;
  private interstitialLoaded = false;
  private rewardedLoaded = false;

  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) return;

      // Initialize consent service first
      await consentService.initialize();

      // Check if we can request ads
      if (!consentService.canRequestAds()) {
        console.log('Cannot request ads due to consent status');
        return;
      }

      // Initialize Mobile Ads SDK
      await mobileAds().initialize();

      // Get consent info for configuration
      const consentInfo = consentService.getConsentInfo();

      // Set request configuration based on consent
      await mobileAds().setRequestConfiguration({
        // Set maximum ad content rating
        maxAdContentRating: MaxAdContentRating.G,
        // Tag for child-directed treatment (COPPA compliance)
        tagForChildDirectedTreatment: false,
        // Tag for under age of consent
        tagForUnderAgeOfConsent: false,
        // Request non-personalized ads if consent not obtained
        requestNonPersonalizedAdsOnly: consentInfo?.status !== 'obtained',
      });

      this.isInitialized = true;
      console.log('AdMob initialized successfully');

      // Preload ads
      this.loadInterstitialAd();
      this.loadRewardedAd();
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
    }
  }

  private loadInterstitialAd(): void {
    try {
      const consentInfo = consentService.getConsentInfo();
      this.interstitialAd = InterstitialAd.createForAdRequest(AD_UNIT_IDS.INTERSTITIAL, {
        requestNonPersonalizedAdsOnly: consentInfo?.status !== 'obtained',
      });

      this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        this.interstitialLoaded = true;
        console.log('Interstitial ad loaded');
      });

      this.interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.error('Interstitial ad error:', error);
        this.interstitialLoaded = false;
      });

      this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('Interstitial ad closed');
        this.interstitialLoaded = false;
        // Preload next ad
        setTimeout(() => this.loadInterstitialAd(), 1000);
      });

      this.interstitialAd.load();
    } catch (error) {
      console.error('Failed to load interstitial ad:', error);
    }
  }

  private loadRewardedAd(): void {
    try {
      const consentInfo = consentService.getConsentInfo();
      this.rewardedAd = RewardedAd.createForAdRequest(AD_UNIT_IDS.REWARDED, {
        requestNonPersonalizedAdsOnly: consentInfo?.status !== 'obtained',
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        this.rewardedLoaded = true;
        console.log('Rewarded ad loaded');
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.ERROR, (error) => {
        console.error('Rewarded ad error:', error);
        this.rewardedLoaded = false;
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        console.log('User earned reward:', reward);
      });

      this.rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('Rewarded ad closed');
        this.rewardedLoaded = false;
        // Preload next ad
        setTimeout(() => this.loadRewardedAd(), 1000);
      });

      this.rewardedAd.load();
    } catch (error) {
      console.error('Failed to load rewarded ad:', error);
    }
  }

  async showInterstitialAd(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (this.interstitialLoaded && this.interstitialAd) {
        await this.interstitialAd.show();
        return true;
      } else {
        console.log('Interstitial ad not ready');
        return false;
      }
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
      return false;
    }
  }

  async showRewardedAd(): Promise<{ success: boolean; reward?: any }> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (this.rewardedLoaded && this.rewardedAd) {
        return new Promise((resolve) => {
          const rewardListener = this.rewardedAd!.addAdEventListener(
            RewardedAdEventType.EARNED_REWARD,
            (reward) => {
              resolve({ success: true, reward });
            }
          );

          const closeListener = this.rewardedAd!.addAdEventListener(
            AdEventType.CLOSED,
            () => {
              rewardListener();
              closeListener();
              resolve({ success: false });
            }
          );

          this.rewardedAd!.show();
        });
      } else {
        console.log('Rewarded ad not ready');
        return { success: false };
      }
    } catch (error) {
      console.error('Failed to show rewarded ad:', error);
      return { success: false };
    }
  }

  isInterstitialReady(): boolean {
    return this.interstitialLoaded;
  }

  isRewardedReady(): boolean {
    return this.rewardedLoaded;
  }

  getAdUnitIds() {
    return AD_UNIT_IDS;
  }
}

// Export singleton instance
export const adMobService = new AdMobService();
export default AdMobService;
