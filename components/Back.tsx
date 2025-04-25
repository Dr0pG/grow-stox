import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Metrics } from "@/constants/Metrics";
import { TouchableOpacity } from "react-native";

type PropTypes = {
  onPress: () => void;
};

const Back = ({ onPress }: PropTypes) => {
  const text = useThemeColor({}, "text");

  return (
    <TouchableOpacity onPress={onPress}>
      <Ionicons
        name="arrow-back-outline"
        size={Metrics.backArrowSize}
        color={text}
      />
    </TouchableOpacity>
  );
};

export default Back;
