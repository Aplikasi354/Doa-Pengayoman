import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Star } from "lucide-react-native";

interface PrayerItemProps {
  id?: string;
  name?: string;
  isFavorite?: boolean;
  onPress?: () => void;
  onToggleFavorite?: () => void;
}

const PrayerItem = ({
  id = "1",
  name = "Doa Sebelum Makan",
  isFavorite = false,
  onPress = () => {},
  onToggleFavorite = () => {},
}: PrayerItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between p-4 mb-3 rounded-lg bg-[#C4E1E6] border border-[#A4CCD9]"
      style={{
        minHeight: 70,
      }}
    >
      <View className="flex-1">
        <Text className="text-lg font-medium text-black leading-6">{name}</Text>
      </View>

      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className="p-2 ml-3"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Star
          size={24}
          color={isFavorite ? "#F59E0B" : "#8DBCC7"}
          fill={isFavorite ? "#F59E0B" : "transparent"}
          strokeWidth={2}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default PrayerItem;
