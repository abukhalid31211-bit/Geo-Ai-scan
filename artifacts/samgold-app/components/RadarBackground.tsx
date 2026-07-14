import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { SAMGOLD_COLORS } from '@/constants/colors';

interface RadarBackgroundProps {
  opacity?: number;
  color?: string;
  size?: number;
}

export function RadarBackground({
  opacity = 0.05,
  color = SAMGOLD_COLORS.primary,
  size = Dimensions.get('window').height * 1.5,
}: RadarBackgroundProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 15000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const center = size / 2;
  const radiusStep = size / 10;
  
  const circles = [1, 2, 3, 4, 5].map((i) => (
    <Circle
      key={`circle-${i}`}
      cx={center}
      cy={center}
      r={radiusStep * i}
      stroke={color}
      strokeWidth={1}
      fill="none"
    />
  ));

  const lines = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i * 45 * Math.PI) / 180;
    const x2 = center + Math.cos(angle) * (size / 2);
    const y2 = center + Math.sin(angle) * (size / 2);
    return (
      <Line
        key={`line-${i}`}
        x1={center}
        y1={center}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={1}
      />
    );
  });

  return (
    <View style={[StyleSheet.absoluteFill, styles.container, { opacity }]}>
      <Animated.View style={[{ width: size, height: size }, animatedStyle]}>
        <Svg width={size} height={size}>
          {circles}
          {lines}
          <Circle
            cx={center}
            cy={center}
            r={3}
            fill={color}
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
    overflow: 'hidden',
  },
});
