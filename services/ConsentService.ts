import AsyncStorage from '@react-native-async-storage/async-storage';
import mobileAds from 'react-native-google-mobile-ads';

const CONSENT_KEY = 'user_consent_status';
const CONSENT_VERSION = '1.0';
const CONSENT_VERSION_KEY = 'consent_version';

export enum ConsentStatus {
  UNKNOWN = 'unknown',
  REQUIRED = 'required',
  NOT_REQUIRED = 'not_required',
  OBTAINED = 'obtained',
}

export interface ConsentInfo {
  status: ConsentStatus;
  canRequestAds: boolean;
  isPrivacyOptionsRequired: boolean;
  version: string;
  timestamp: number;
}

export class ConsentService {
  private static instance: ConsentService;
  private consentInfo: ConsentInfo | null = null;

  static getInstance(): ConsentService {
    if (!ConsentService.instance) {
      ConsentService.instance = new ConsentService();
    }
    return ConsentService.instance;
  }

  async initialize(): Promise<ConsentInfo> {
    try {
      // Load stored consent info
      await this.loadStoredConsent();

      // Check if we need to request consent
      if (this.shouldRequestConsent()) {
        // For demo purposes, we'll assume consent is not required
        // In a real app, you would use Google's UMP SDK
        this.consentInfo = {
          status: ConsentStatus.NOT_REQUIRED,
          canRequestAds: true,
          isPrivacyOptionsRequired: false,
          version: CONSENT_VERSION,
          timestamp: Date.now(),
        };
        
        await this.saveConsentInfo();
      }

      // Configure ads based on consent
      await this.configureAdsBasedOnConsent();

      return this.consentInfo!;
    } catch (error) {
      console.error('Failed to initialize consent:', error);
      
      // Fallback to safe defaults
      this.consentInfo = {
        status: ConsentStatus.UNKNOWN,
        canRequestAds: false,
        isPrivacyOptionsRequired: true,
        version: CONSENT_VERSION,
        timestamp: Date.now(),
      };
      
      return this.consentInfo;
    }
  }

  private async loadStoredConsent(): Promise<void> {
    try {
      const storedConsent = await AsyncStorage.getItem(CONSENT_KEY);
      const storedVersion = await AsyncStorage.getItem(CONSENT_VERSION_KEY);
      
      if (storedConsent && storedVersion === CONSENT_VERSION) {
        this.consentInfo = JSON.parse(storedConsent);
      }
    } catch (error) {
      console.error('Failed to load stored consent:', error);
    }
  }

  private shouldRequestConsent(): boolean {
    if (!this.consentInfo) return true;
    
    // Check if consent version has changed
    if (this.consentInfo.version !== CONSENT_VERSION) return true;
    
    // Check if consent is older than 1 year
    const oneYearAgo = Date.now() - (365 * 24 * 60 * 60 * 1000);
    if (this.consentInfo.timestamp < oneYearAgo) return true;
    
    return false;
  }

  private async configureAdsBasedOnConsent(): Promise<void> {
    try {
      if (!this.consentInfo) return;

      // Configure ad requests based on consent
      await mobileAds().setRequestConfiguration({
        // For COPPA compliance
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
        // Request non-personalized ads if consent not obtained
        requestNonPersonalizedAdsOnly: this.consentInfo.status !== ConsentStatus.OBTAINED,
      });
    } catch (error) {
      console.error('Failed to configure ads based on consent:', error);
    }
  }

  async grantConsent(): Promise<void> {
    try {
      this.consentInfo = {
        status: ConsentStatus.OBTAINED,
        canRequestAds: true,
        isPrivacyOptionsRequired: true,
        version: CONSENT_VERSION,
        timestamp: Date.now(),
      };
      
      await this.saveConsentInfo();
      await this.configureAdsBasedOnConsent();
    } catch (error) {
      console.error('Failed to grant consent:', error);
    }
  }

  async revokeConsent(): Promise<void> {
    try {
      this.consentInfo = {
        status: ConsentStatus.REQUIRED,
        canRequestAds: true, // Can still show non-personalized ads
        isPrivacyOptionsRequired: true,
        version: CONSENT_VERSION,
        timestamp: Date.now(),
      };
      
      await this.saveConsentInfo();
      await this.configureAdsBasedOnConsent();
    } catch (error) {
      console.error('Failed to revoke consent:', error);
    }
  }

  private async saveConsentInfo(): Promise<void> {
    try {
      if (this.consentInfo) {
        await AsyncStorage.setItem(CONSENT_KEY, JSON.stringify(this.consentInfo));
        await AsyncStorage.setItem(CONSENT_VERSION_KEY, CONSENT_VERSION);
      }
    } catch (error) {
      console.error('Failed to save consent info:', error);
    }
  }

  getConsentInfo(): ConsentInfo | null {
    return this.consentInfo;
  }

  canRequestAds(): boolean {
    return this.consentInfo?.canRequestAds ?? false;
  }

  isPrivacyOptionsRequired(): boolean {
    return this.consentInfo?.isPrivacyOptionsRequired ?? true;
  }

  async resetConsent(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CONSENT_KEY);
      await AsyncStorage.removeItem(CONSENT_VERSION_KEY);
      this.consentInfo = null;
    } catch (error) {
      console.error('Failed to reset consent:', error);
    }
  }
}

export const consentService = ConsentService.getInstance();
