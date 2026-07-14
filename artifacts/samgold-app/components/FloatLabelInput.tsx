import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable, TextInputProps, Platform } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';
import { SAMGOLD_COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface FloatLabelInputProps extends Omit<TextInputProps, 'onChangeText'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  error?: string;
  hint?: string;
}

export function FloatLabelInput({
  label,
  value,
  onChangeText,
  secureTextEntry,
  leftIcon,
  rightIcon,
  onRightIconPress,
  error,
  hint,
  keyboardType,
  ...rest
}: FloatLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useSharedValue(value ? 1 : 0);

  React.useEffect(() => {
    animatedValue.value = withTiming(isFocused || value ? 1 : 0, { duration: 200 });
  }, [isFocused, value, animatedValue]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      borderColor: error
        ? SAMGOLD_COLORS.error
        : isFocused
        ? SAMGOLD_COLORS.primary
        : SAMGOLD_COLORS.cardBorder,
      shadowColor: isFocused && !error ? SAMGOLD_COLORS.primary : 'transparent',
      shadowOpacity: withTiming(isFocused && !error ? 0.3 : 0, { duration: 200 }),
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 0 },
      elevation: isFocused && !error ? 4 : 0,
    };
  });

  const labelStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: withTiming(animatedValue.value ? -24 : 0, { duration: 200 }) },
        { scale: withTiming(animatedValue.value ? 0.85 : 1, { duration: 200 }) },
      ],
      color: error
        ? SAMGOLD_COLORS.error
        : isFocused
        ? SAMGOLD_COLORS.primary
        : SAMGOLD_COLORS.muted,
    };
  });

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.container, containerStyle]}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Ionicons
              name={leftIcon}
              size={20}
              color={error ? SAMGOLD_COLORS.error : isFocused ? SAMGOLD_COLORS.primary : SAMGOLD_COLORS.muted}
            />
          </View>
        )}
        
        <View style={styles.inputWrapper}>
          <Animated.Text
            style={[
              styles.label,
              { left: leftIcon ? 0 : 0 },
              labelStyle,
            ]}
            pointerEvents="none"
          >
            {label}
          </Animated.Text>
          
          <TextInput
            style={[styles.input, { paddingRight: rightIcon ? 40 : 16, paddingLeft: leftIcon ? 8 : 16 }]}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            textAlign="right"
            selectionColor={SAMGOLD_COLORS.primary}
            {...rest}
          />
        </View>

        {rightIcon && (
          <Pressable onPress={onRightIconPress} style={styles.rightIconContainer}>
            <Ionicons
              name={rightIcon}
              size={20}
              color={SAMGOLD_COLORS.muted}
            />
          </Pressable>
        )}
      </Animated.View>
      
      {(error || hint) && (
        <Text style={[styles.helperText, error ? styles.errorText : styles.hintText]}>
          {error || hint}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    width: '100%',
  },
  container: {
    flexDirection: 'row-reverse', // RTL
    alignItems: 'center',
    height: 56,
    backgroundColor: SAMGOLD_COLORS.background,
    borderWidth: 1,
    borderRadius: 12,
    position: 'relative',
  },
  inputWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    height: '100%',
    color: SAMGOLD_COLORS.foreground,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    paddingTop: 16, // To make room for floated label
    textAlign: 'right', // RTL
    ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
  },
  label: {
    position: 'absolute',
    right: 16, // RTL
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    backgroundColor: SAMGOLD_COLORS.background,
    paddingHorizontal: 4,
    zIndex: 1,
  },
  leftIconContainer: {
    paddingLeft: 16,
    paddingRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    position: 'absolute',
    left: 0, // RTL
    height: '100%',
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    marginRight: 4, // RTL
    textAlign: 'right',
    fontFamily: 'Inter_400Regular',
  },
  errorText: {
    color: SAMGOLD_COLORS.error,
  },
  hintText: {
    color: SAMGOLD_COLORS.mutedDark,
  },
});
