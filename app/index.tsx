import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Stack } from "expo-router";
import PrayerList from "../components/PrayerList";
import { Search, Bookmark, Settings } from "lucide-react-native";
// import { BannerAdComponent, AdFreeRewardComponent } from "../components/ads";
// import { rewardService } from "../services/RewardService";
// import PrivacySettingsComponent from "../components/privacy/PrivacySettingsComponent";
// import { consentService } from "../services/ConsentService";

interface Prayer {
  id: string;
  name: string;
  isFavorite: boolean;
  arabic?: string;
  meaning?: string;
}

export default function Dashboard() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  // const [isAdFree, setIsAdFree] = useState(false);
  // const [showPrivacySettings, setShowPrivacySettings] = useState(false);

  // Fetch prayers from Baserow
  useEffect(() => {
    fetchPrayers();
    // checkAdFreeStatus();
    // initializeConsent();
  }, []);

  // const checkAdFreeStatus = () => {
  //   setIsAdFree(rewardService.isAdFree());
  // };

  // const initializeConsent = async () => {
  //   try {
  //     await consentService.initialize();
  //   } catch (error) {
  //     console.error('Failed to initialize consent:', error);
  //   }
  // };

  const fetchPrayers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://api.baserow.io/api/database/rows/table/581962/?user_field_names=true",
        {
          headers: {
            Authorization: "Token E9JWNrxQYtMdmAYbpTgyanV6sYdDzzfO",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        const prayerData = data.results
          .filter(
            (row: any) =>
              row["Nama Doa"] && row["Nama Doa"] !== "Doa tidak diketahui",
          )
          .map((row: any) => ({
            id: row.id.toString(),
            name: row["Nama Doa"],
            arabic: row["Lafadz Doa"] || "",
            meaning: row["Arti Doa"] || "",
            isFavorite: favorites.has(row.id.toString()),
          }));
        setPrayers(prayerData);
      }
    } catch (error) {
      console.error("Error fetching prayers:", error);
      // Fallback to mock data if API fails
      setPrayers([
        { id: "1", name: "Doa Sebelum Makan", isFavorite: false },
        { id: "2", name: "Doa Sesudah Makan", isFavorite: false },
        { id: "3", name: "Doa Sebelum Tidur", isFavorite: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);

    setPrayers(
      prayers.map((prayer) =>
        prayer.id === id
          ? { ...prayer, isFavorite: !prayer.isFavorite }
          : prayer,
      ),
    );
  };

  // Filter prayers based on search query
  const filteredPrayers = prayers.filter((prayer) =>
    prayer.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#EBFFD8]">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#8DBCC7" />
          <Text className="text-[#8DBCC7] mt-4 text-lg">Memuat Doa...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#EBFFD8]">
      <StatusBar barStyle="dark-content" backgroundColor="#EBFFD8" />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Header */}
      <View className="bg-[#C4E1E6] px-6 py-8">
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-[#8DBCC7] text-center">
              Doa Pengayoman
            </Text>
          </View>
          {/* <TouchableOpacity
            onPress={() => setShowPrivacySettings(true)}
            className="p-2"
          >
            <Settings size={24} color="#8DBCC7" />
          </TouchableOpacity> */}
        </View>

        {/* Search Bar */}
        <View className="bg-white rounded-lg px-4 py-3 flex-row items-center">
          <Search size={20} color="#A4CCD9" />
          <TextInput
            className="flex-1 ml-3 text-gray-700"
            placeholder="Cari Doa..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Ad-Free Reward Component - Temporarily disabled */}
      {/* <AdFreeRewardComponent
        onRewardGranted={checkAdFreeStatus}
        style={{ marginHorizontal: 0, marginTop: 0, marginBottom: 16 }}
      /> */}

      {/* Prayer List */}
      <View className="flex-1 bg-white px-4 pt-6">
        <PrayerList
          prayers={filteredPrayers}
          onToggleFavorite={toggleFavorite}
        />
      </View>

      {/* Banner Ad at bottom - Temporarily disabled */}
      {/* {!isAdFree && (
        <BannerAdComponent
          style={{
            backgroundColor: 'white',
            paddingVertical: 10,
          }}
        />
      )} */}

      {/* Privacy Settings Modal - Temporarily disabled */}
      {/* <PrivacySettingsComponent
        visible={showPrivacySettings}
        onClose={() => setShowPrivacySettings(false)}
        onConsentChanged={() => {
          // Refresh ad status when consent changes
          checkAdFreeStatus();
        }}
      /> */}
    </SafeAreaView>
  );
}
