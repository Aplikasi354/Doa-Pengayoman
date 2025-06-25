import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { X, Shield, Info } from 'lucide-react-native';
import { consentService, ConsentStatus, ConsentInfo } from '../../services/ConsentService';

interface PrivacySettingsComponentProps {
  visible: boolean;
  onClose: () => void;
  onConsentChanged?: (consentInfo: ConsentInfo) => void;
}

const PrivacySettingsComponent: React.FC<PrivacySettingsComponentProps> = ({
  visible,
  onClose,
  onConsentChanged,
}) => {
  const [consentInfo, setConsentInfo] = useState<ConsentInfo | null>(null);
  const [personalizedAds, setPersonalizedAds] = useState(false);

  useEffect(() => {
    if (visible) {
      loadConsentInfo();
    }
  }, [visible]);

  const loadConsentInfo = () => {
    const info = consentService.getConsentInfo();
    setConsentInfo(info);
    setPersonalizedAds(info?.status === ConsentStatus.OBTAINED);
  };

  const handlePersonalizedAdsToggle = async (value: boolean) => {
    try {
      if (value) {
        await consentService.grantConsent();
      } else {
        await consentService.revokeConsent();
      }
      
      setPersonalizedAds(value);
      const updatedInfo = consentService.getConsentInfo();
      setConsentInfo(updatedInfo);
      
      if (updatedInfo) {
        onConsentChanged?.(updatedInfo);
      }
      
      Alert.alert(
        'Pengaturan Disimpan',
        value 
          ? 'Iklan yang dipersonalisasi telah diaktifkan.'
          : 'Iklan yang dipersonalisasi telah dinonaktifkan. Anda akan melihat iklan umum.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to update consent:', error);
      Alert.alert('Error', 'Gagal memperbarui pengaturan privasi.');
    }
  };

  const handleResetConsent = () => {
    Alert.alert(
      'Reset Pengaturan Privasi',
      'Apakah Anda yakin ingin mereset semua pengaturan privasi? Anda akan diminta untuk memberikan persetujuan lagi.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await consentService.resetConsent();
              await consentService.initialize();
              loadConsentInfo();
              Alert.alert('Berhasil', 'Pengaturan privasi telah direset.');
            } catch (error) {
              console.error('Failed to reset consent:', error);
              Alert.alert('Error', 'Gagal mereset pengaturan privasi.');
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 16,
          backgroundColor: 'white',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Shield size={24} color="#8DBCC7" />
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#1F2937',
              marginLeft: 8,
            }}>
              Pengaturan Privasi
            </Text>
          </View>
          
          <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }}>
          {/* Privacy Information */}
          <View style={{
            backgroundColor: 'white',
            margin: 16,
            padding: 16,
            borderRadius: 12,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Info size={20} color="#3B82F6" />
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#1F2937',
                marginLeft: 8,
              }}>
                Tentang Privasi Anda
              </Text>
            </View>
            
            <Text style={{
              fontSize: 14,
              color: '#6B7280',
              lineHeight: 20,
            }}>
              Kami menghormati privasi Anda. Aplikasi ini menggunakan iklan untuk mendukung pengembangan. 
              Anda dapat memilih untuk melihat iklan yang dipersonalisasi atau iklan umum.
            </Text>
          </View>

          {/* Consent Status */}
          <View style={{
            backgroundColor: 'white',
            margin: 16,
            marginTop: 0,
            padding: 16,
            borderRadius: 12,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#1F2937',
              marginBottom: 12,
            }}>
              Status Persetujuan
            </Text>
            
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 8,
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: '#1F2937',
                }}>
                  Iklan yang Dipersonalisasi
                </Text>
                <Text style={{
                  fontSize: 12,
                  color: '#6B7280',
                  marginTop: 2,
                }}>
                  Iklan berdasarkan minat dan aktivitas Anda
                </Text>
              </View>
              
              <Switch
                value={personalizedAds}
                onValueChange={handlePersonalizedAdsToggle}
                trackColor={{ false: '#E5E7EB', true: '#8DBCC7' }}
                thumbColor={personalizedAds ? '#ffffff' : '#ffffff'}
              />
            </View>
          </View>

          {/* Current Status Info */}
          {consentInfo && (
            <View style={{
              backgroundColor: 'white',
              margin: 16,
              marginTop: 0,
              padding: 16,
              borderRadius: 12,
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#1F2937',
                marginBottom: 12,
              }}>
                Informasi Status
              </Text>
              
              <View style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 14, color: '#6B7280' }}>
                  Status: <Text style={{ fontWeight: '500', color: '#1F2937' }}>
                    {consentInfo.status === ConsentStatus.OBTAINED ? 'Persetujuan Diberikan' :
                     consentInfo.status === ConsentStatus.NOT_REQUIRED ? 'Tidak Diperlukan' :
                     'Belum Diberikan'}
                  </Text>
                </Text>
              </View>
              
              <View style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 14, color: '#6B7280' }}>
                  Dapat Menampilkan Iklan: <Text style={{ fontWeight: '500', color: '#1F2937' }}>
                    {consentInfo.canRequestAds ? 'Ya' : 'Tidak'}
                  </Text>
                </Text>
              </View>
              
              <View>
                <Text style={{ fontSize: 14, color: '#6B7280' }}>
                  Terakhir Diperbarui: <Text style={{ fontWeight: '500', color: '#1F2937' }}>
                    {new Date(consentInfo.timestamp).toLocaleDateString('id-ID')}
                  </Text>
                </Text>
              </View>
            </View>
          )}

          {/* Reset Button */}
          <View style={{ margin: 16, marginTop: 0 }}>
            <TouchableOpacity
              onPress={handleResetConsent}
              style={{
                backgroundColor: '#EF4444',
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
              }}
            >
              <Text style={{
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold',
              }}>
                Reset Pengaturan Privasi
              </Text>
            </TouchableOpacity>
          </View>

          {/* Privacy Policy Link */}
          <View style={{
            margin: 16,
            marginTop: 0,
            marginBottom: 32,
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 12,
              color: '#6B7280',
              textAlign: 'center',
              lineHeight: 18,
            }}>
              Dengan menggunakan aplikasi ini, Anda menyetujui{'\n'}
              <Text style={{ color: '#3B82F6', textDecorationLine: 'underline' }}>
                Kebijakan Privasi
              </Text>
              {' '}dan{' '}
              <Text style={{ color: '#3B82F6', textDecorationLine: 'underline' }}>
                Syarat & Ketentuan
              </Text>
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default PrivacySettingsComponent;
