import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import PrayerItem from "./PrayerItem";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Bookmark } from "lucide-react-native";

interface Prayer {
  id: string;
  name: string;
  isFavorite: boolean;
  arabic?: string;
  meaning?: string;
}

interface PrayerListProps {
  prayers?: Prayer[];
  onToggleFavorite?: (id: string) => void;
}

const PrayerList = ({
  prayers = [
    { id: "1", name: "Doa Sebelum Makan", isFavorite: false },
    { id: "2", name: "Doa Sesudah Makan", isFavorite: true },
    { id: "3", name: "Doa Sebelum Tidur", isFavorite: false },
    { id: "4", name: "Doa Bangun Tidur", isFavorite: true },
    { id: "5", name: "Doa Masuk Rumah", isFavorite: false },
    { id: "6", name: "Doa Keluar Rumah", isFavorite: false },
    { id: "7", name: "Doa Masuk Masjid", isFavorite: false },
    { id: "8", name: "Doa Keluar Masjid", isFavorite: true },
    { id: "9", name: "Doa Naik Kendaraan", isFavorite: false },
    { id: "10", name: "Doa Untuk Orang Tua", isFavorite: false },
  ],
  onToggleFavorite = () => {},
}: PrayerListProps) => {
  const router = useRouter();

  const handlePrayerPress = (id: string) => {
    router.push(`/prayer/${id}`);
  };

  const handleToggleFavorite = (id: string) => {
    onToggleFavorite(id);
  };

  // Separate favorites and regular prayers
  const favoritesPrayers = prayers.filter((prayer) => prayer.isFavorite);
  const regularPrayers = prayers.filter((prayer) => !prayer.isFavorite);

  const renderPrayerItem = ({ item }: { item: Prayer }) => (
    <PrayerItem
      id={item.id}
      name={item.name}
      isFavorite={item.isFavorite}
      onPress={() => handlePrayerPress(item.id)}
      onToggleFavorite={() => handleToggleFavorite(item.id)}
    />
  );

  const renderFavoriteItem = ({ item }: { item: Prayer }) => (
    <View className="bg-[#C4E1E6] rounded-lg p-3 mb-2 mx-2">
      <Text className="text-base font-medium text-black">{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={prayers}
        renderItem={renderPrayerItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#ffffff",
  },
  listContent: {
    paddingVertical: 10,
  },
});

export default PrayerList;
