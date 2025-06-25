import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from '../../services/AdMobService';

interface BannerAdComponentProps {
  size?: BannerAdSize;
  style?: any;
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: any) => void;
  onAdOpened?: () => void;
  onAdClosed?: () => void;
}

const BannerAdComponent: React.FC<BannerAdComponentProps> = ({
  size = BannerAdSize.BANNER,
  style,
  onAdLoaded,
  onAdFailedToLoad,
  onAdOpened,
  onAdClosed,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Don't render on web
  if (Platform.OS === 'web') {
    return null;
  }

  const handleAdLoaded = () => {
    setIsLoaded(true);
    setHasError(false);
    onAdLoaded?.();
  };

  const handleAdFailedToLoad = (error: any) => {
    console.error('Banner ad failed to load:', error);
    setIsLoaded(false);
    setHasError(true);
    onAdFailedToLoad?.(error);
  };

  const handleAdOpened = () => {
    onAdOpened?.();
  };

  const handleAdClosed = () => {
    onAdClosed?.();
  };

  // Don't render if there's an error
  if (hasError) {
    return null;
  }

  return (
    <View style={[{ alignItems: 'center', justifyContent: 'center' }, style]}>
      <BannerAd
        unitId={AD_UNIT_IDS.BANNER}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={handleAdLoaded}
        onAdFailedToLoad={handleAdFailedToLoad}
        onAdOpened={handleAdOpened}
        onAdClosed={handleAdClosed}
      />
    </View>
  );
};

export default BannerAdComponent;
