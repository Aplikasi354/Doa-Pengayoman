import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { Gift } from 'lucide-react-native';
import { adMobService } from '../../services/AdMobService';

interface RewardedAdComponentProps {
  onRewardEarned?: (reward: any) => void;
  onAdClosed?: () => void;
  onAdFailed?: (error: string) => void;
  children?: React.ReactNode;
  buttonText?: string;
  buttonStyle?: any;
  textStyle?: any;
  rewardDescription?: string;
  showIcon?: boolean;
}

const RewardedAdComponent: React.FC<RewardedAdComponentProps> = ({
  onRewardEarned,
  onAdClosed,
  onAdFailed,
  children,
  buttonText = 'Tonton Iklan untuk Hadiah',
  buttonStyle,
  textStyle,
  rewardDescription = 'Dapatkan hadiah dengan menonton iklan',
  showIcon = true,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if ad is ready
    const checkAdStatus = () => {
      setIsReady(adMobService.isRewardedReady());
    };

    checkAdStatus();
    const interval = setInterval(checkAdStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  const showRewardedAd = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Info', 'Iklan reward tidak tersedia di platform web');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      const result = await adMobService.showRewardedAd();
      
      if (result.success) {
        onRewardEarned?.(result.reward);
        Alert.alert(
          'Selamat!', 
          'Anda telah mendapatkan hadiah!',
          [{ text: 'OK', style: 'default' }]
        );
      } else {
        Alert.alert(
          'Info', 
          'Anda harus menonton iklan sampai selesai untuk mendapatkan hadiah'
        );
      }
    } catch (error) {
      const errorMsg = 'Gagal menampilkan iklan reward';
      console.error('Rewarded ad error:', error);
      onAdFailed?.(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setIsLoading(false);
      onAdClosed?.();
    }
  };

  if (children) {
    return (
      <TouchableOpacity onPress={showRewardedAd} disabled={isLoading || !isReady}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ alignItems: 'center', marginVertical: 10 }}>
      {rewardDescription && (
        <Text
          style={{
            fontSize: 14,
            color: '#666',
            textAlign: 'center',
            marginBottom: 10,
          }}
        >
          {rewardDescription}
        </Text>
      )}
      
      <TouchableOpacity
        onPress={showRewardedAd}
        disabled={isLoading || !isReady}
        style={[
          {
            backgroundColor: isReady ? '#F59E0B' : '#A0A0A0',
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
            flexDirection: 'row',
            opacity: isLoading ? 0.7 : 1,
            minWidth: 200,
            justifyContent: 'center',
          },
          buttonStyle,
        ]}
      >
        {showIcon && (
          <Gift 
            size={20} 
            color="white" 
            style={{ marginRight: 8 }} 
          />
        )}
        <Text
          style={[
            {
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
            },
            textStyle,
          ]}
        >
          {isLoading 
            ? 'Memuat...' 
            : isReady 
              ? buttonText 
              : 'Iklan Tidak Siap'
          }
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RewardedAdComponent;
