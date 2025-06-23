import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Star, ArrowLeft, ArrowRight } from "lucide-react-native";

interface Prayer {
  id: string;
  name: string;
  arabic: string;
  meaning: string;
  isFavorite: boolean;
}

export default function PrayerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch prayers from Baserow
  useEffect(() => {
    fetchPrayers();
  }, []);

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
        const prayerData = data.results.map((row: any) => ({
          id: row.id.toString(),
          name: row["Nama Doa"] || "Doa Tidak Diketahui",
          arabic: row["Lafadz Doa"] || "لَا إِلٰهَ إِلَّا اللّٰهُ",
          meaning: row["Arti Doa"] || "Tidak ada Tuhan selain Allah",
          isFavorite: false,
        }));
        setPrayers(prayerData);
      }
    } catch (error) {
      console.error("Error fetching prayers:", error);
      // Fallback to mock data if API fails
      setPrayers([
        {
          id: "1",
          name: "Doa Sebelum Makan",
          arabic:
            "اَللّٰهُمَّ بَارِكْ لَنَا فِيْمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
          meaning:
            "Ya Allah, berkahilah rezeki yang telah Engkau berikan kepada kami dan peliharalah kami dari siksa api neraka",
          isFavorite: false,
        },
        {
          id: "2",
          name: "Doa Sesudah Makan",
          arabic:
            "اَلْحَمْدُ ِللهِ الَّذِىْ اَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مِنَ الْمُسْلِمِيْنَ",
          meaning:
            "Segala puji bagi Allah yang telah memberi makan kami dan minuman kami, serta menjadikan kami sebagai orang-orang islam",
          isFavorite: false,
        },
        {
          id: "3",
          name: "Doa Sebelum Tidur",
          arabic: "بِسْمِكَ اللّٰهُمَّ اَحْيَا وَاَمُوْتُ",
          meaning: "Dengan menyebut nama-Mu ya Allah, aku hidup dan aku mati",
          isFavorite: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Find the current prayer based on id
  const currentPrayer =
    prayers.find((prayer) => prayer.id === id) || prayers[0];

  // Initialize favorite state from prayer data
  useEffect(() => {
    if (currentPrayer) {
      setIsFavorite(currentPrayer.isFavorite);
    }
  }, [currentPrayer]);

  // Handle favorite toggle
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, you would update this in your data store
  };

  // Navigate to next prayer
  const goToNextPrayer = () => {
    if (prayers.length === 0) return;

    const currentIndex = prayers.findIndex((prayer) => prayer.id === id);
    const nextIndex = (currentIndex + 1) % prayers.length;
    router.push(`/prayer/${prayers[nextIndex].id}`);
  };

  // Navigate back to prayer list
  const goBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#EBFFD8] justify-center items-center">
        <ActivityIndicator size="large" color="#8DBCC7" />
        <Text className="text-black mt-4 text-lg">Memuat Doa...</Text>
      </View>
    );
  }

  if (!currentPrayer) {
    return (
      <View className="flex-1 bg-[#EBFFD8] justify-center items-center">
        <Text className="text-black text-lg">Doa tidak ditemukan</Text>
        <TouchableOpacity
          onPress={goBack}
          className="mt-4 bg-[#C4E1E6] px-6 py-3 rounded-lg"
        >
          <Text className="text-black font-medium">Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#EBFFD8]">
      {/* Header */}
      <View className="bg-[#C4E1E6] px-4 py-6 pt-12">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={goBack} className="p-2">
            <ArrowLeft size={24} color="#8DBCC7" />
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="text-xl font-bold text-black text-center">
              {currentPrayer.name}
            </Text>
          </View>

          <TouchableOpacity onPress={toggleFavorite} className="p-2">
            <Star
              size={24}
              color={isFavorite ? "#F59E0B" : "#8DBCC7"}
              fill={isFavorite ? "#F59E0B" : "transparent"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Prayer Content */}
      <ScrollView className="flex-1 bg-white px-6 pt-8">
        {/* Arabic Text */}
        <View className="bg-[#A4CCD9] rounded-lg p-6 mb-6">
          <Text className="text-sm font-medium text-black mb-3 text-center">
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </Text>
          <Text
            className="text-2xl text-right leading-10 text-black"
            style={{
              fontFamily: "System",
              lineHeight: 50,
            }}
          >
            {currentPrayer.arabic}
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="bg-white px-6 py-4 border-t border-[#A4CCD9]">
        <TouchableOpacity
          onPress={goToNextPrayer}
          className="flex-row justify-center items-center bg-[#8DBCC7] p-4 rounded-lg mb-3"
        >
          <Text className="text-lg font-bold text-white mr-3">
            Doa Selanjutnya
          </Text>
          <ArrowRight size={20} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/")}
          className="flex-row justify-center items-center bg-[#C4E1E6] p-4 rounded-lg"
        >
          <Text className="text-lg font-bold text-black">
            Kembali ke Daftar Doa
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
