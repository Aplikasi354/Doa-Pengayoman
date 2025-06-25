import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { adMobService } from '../../services/AdMobService';

interface InterstitialAdComponentProps {
  onAdShown?: () => void;
  onAdClosed?: () => void;
  onAdFailed?: (error: string) => void;
  trigger?: 'button' | 'auto';
  autoShowDelay?: number; // in milliseconds
  children?: React.ReactNode;
  buttonText?: string;
  buttonStyle?: any;
  textStyle?: any;
}

const InterstitialAdComponent: React.FC<InterstitialAdComponentProps> = ({
  onAdShown,
  onAdClosed,
  onAdFailed,
  trigger = 'button',
  autoShowDelay = 0,
  children,
  buttonText = 'Tampilkan Iklan',
  buttonStyle,
  textStyle,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if ad is ready
    const checkAdStatus = () => {
      setIsReady(adMobService.isInterstitialReady());
    };

    checkAdStatus();
    const interval = setInterval(checkAdStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (trigger === 'auto' && isReady && autoShowDelay >= 0) {
      const timer = setTimeout(() => {
        showAd();
      }, autoShowDelay);

      return () => clearTimeout(timer);
    }
  }, [trigger, isReady, autoShowDelay]);

  const showAd = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Info', 'Iklan tidak tersedia di platform web');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      const success = await adMobService.showInterstitialAd();
      
      if (success) {
        onAdShown?.();
      } else {
        const errorMsg = 'Iklan tidak tersedia saat ini';
        onAdFailed?.(errorMsg);
        
        if (trigger === 'button') {
          Alert.alert('Info', errorMsg);
        }
      }
    } catch (error) {
      const errorMsg = 'Gagal menampilkan iklan';
      console.error('Interstitial ad error:', error);
      onAdFailed?.(errorMsg);
      
      if (trigger === 'button') {
        Alert.alert('Error', errorMsg);
      }
    } finally {
      setIsLoading(false);
      onAdClosed?.();
    }
  };

  if (trigger === 'auto') {
    return null; // Auto trigger doesn't render anything
  }

  if (children) {
    return (
      <TouchableOpacity onPress={showAd} disabled={isLoading || !isReady}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={showAd}
      disabled={isLoading || !isReady}
      style={[
        {
          backgroundColor: isReady ? '#8DBCC7' : '#A0A0A0',
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 8,
          alignItems: 'center',
          opacity: isLoading ? 0.7 : 1,
        },
        buttonStyle,
      ]}
    >
      <Text
        style={[
          {
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
          },
          textStyle,
        ]}
      >
        {isLoading ? 'Memuat...' : isReady ? buttonText : 'Iklan Tidak Siap'}
      </Text>
    </TouchableOpacity>
  );
};

export default InterstitialAdComponent;
