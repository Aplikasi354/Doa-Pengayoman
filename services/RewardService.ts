import AsyncStorage from '@react-native-async-storage/async-storage';

const AD_FREE_KEY = 'ad_free_until';
const REWARD_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export class RewardService {
  private static instance: RewardService;
  private adFreeUntil: number = 0;

  static getInstance(): RewardService {
    if (!RewardService.instance) {
      RewardService.instance = new RewardService();
    }
    return RewardService.instance;
  }

  async initialize(): Promise<void> {
    try {
      const storedTime = await AsyncStorage.getItem(AD_FREE_KEY);
      if (storedTime) {
        this.adFreeUntil = parseInt(storedTime, 10);
      }
    } catch (error) {
      console.error('Failed to load ad-free status:', error);
    }
  }

  async grantAdFreeReward(): Promise<void> {
    try {
      const newAdFreeUntil = Date.now() + REWARD_DURATION;
      this.adFreeUntil = newAdFreeUntil;
      await AsyncStorage.setItem(AD_FREE_KEY, newAdFreeUntil.toString());
      console.log('Ad-free reward granted for 30 minutes');
    } catch (error) {
      console.error('Failed to grant ad-free reward:', error);
    }
  }

  isAdFree(): boolean {
    return Date.now() < this.adFreeUntil;
  }

  getAdFreeTimeRemaining(): number {
    if (!this.isAdFree()) return 0;
    return Math.max(0, this.adFreeUntil - Date.now());
  }

  getAdFreeTimeRemainingFormatted(): string {
    const remaining = this.getAdFreeTimeRemaining();
    if (remaining === 0) return '';
    
    const minutes = Math.floor(remaining / (60 * 1000));
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  async clearAdFreeStatus(): Promise<void> {
    try {
      this.adFreeUntil = 0;
      await AsyncStorage.removeItem(AD_FREE_KEY);
    } catch (error) {
      console.error('Failed to clear ad-free status:', error);
    }
  }
}

export const rewardService = RewardService.getInstance();
