import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Gift, Clock, X } from 'lucide-react-native';
import { RewardedAdComponent } from './index';
import { rewardService } from '../../services/RewardService';

interface AdFreeRewardComponentProps {
  onRewardGranted?: () => void;
  style?: any;
}

const AdFreeRewardComponent: React.FC<AdFreeRewardComponentProps> = ({
  onRewardGranted,
  style,
}) => {
  const [isAdFree, setIsAdFree] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [showRewardAd, setShowRewardAd] = useState(false);

  useEffect(() => {
    // Initialize reward service
    rewardService.initialize();
    
    // Update status every second
    const interval = setInterval(updateAdFreeStatus, 1000);
    
    // Initial check
    updateAdFreeStatus();

    return () => clearInterval(interval);
  }, []);

  const updateAdFreeStatus = () => {
    const adFreeStatus = rewardService.isAdFree();
    const remaining = rewardService.getAdFreeTimeRemainingFormatted();
    
    setIsAdFree(adFreeStatus);
    setTimeRemaining(remaining);
  };

  const handleRewardEarned = async (reward: any) => {
    try {
      await rewardService.grantAdFreeReward();
      updateAdFreeStatus();
      onRewardGranted?.();
      
      Alert.alert(
        'Selamat! 🎉',
        'Anda mendapat 30 menit bebas iklan!\n\nNikmati pengalaman membaca doa tanpa gangguan iklan.',
        [{ text: 'Terima Kasih!', style: 'default' }]
      );
    } catch (error) {
      console.error('Failed to grant reward:', error);
      Alert.alert('Error', 'Gagal memberikan hadiah. Silakan coba lagi.');
    }
  };

  const handleRemoveAdFree = async () => {
    Alert.alert(
      'Hapus Status Bebas Iklan?',
      'Apakah Anda yakin ingin menghapus status bebas iklan?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            await rewardService.clearAdFreeStatus();
            updateAdFreeStatus();
          },
        },
      ]
    );
  };

  if (isAdFree) {
    return (
      <View style={[{
        backgroundColor: '#10B981',
        padding: 16,
        borderRadius: 12,
        margin: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }, style]}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Gift size={24} color="white" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              Bebas Iklan Aktif! 🎉
            </Text>
            <Text style={{ color: 'white', fontSize: 14, opacity: 0.9 }}>
              Sisa waktu: {timeRemaining}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          onPress={handleRemoveAdFree}
          style={{ padding: 4 }}
        >
          <X size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[{
      backgroundColor: '#F3F4F6',
      padding: 16,
      borderRadius: 12,
      margin: 16,
      alignItems: 'center',
    }, style]}>
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <Gift size={32} color="#F59E0B" />
        <Text style={{ 
          fontSize: 18, 
          fontWeight: 'bold', 
          color: '#1F2937',
          marginTop: 8,
          textAlign: 'center',
        }}>
          Dapatkan 30 Menit Bebas Iklan!
        </Text>
        <Text style={{ 
          fontSize: 14, 
          color: '#6B7280',
          marginTop: 4,
          textAlign: 'center',
        }}>
          Tonton iklan reward untuk menikmati pengalaman tanpa iklan
        </Text>
      </View>

      <RewardedAdComponent
        onRewardEarned={handleRewardEarned}
        buttonText="Tonton Iklan untuk Hadiah"
        rewardDescription=""
        buttonStyle={{
          backgroundColor: '#F59E0B',
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8,
        }}
      />
    </View>
  );
};

export default AdFreeRewardComponent;
