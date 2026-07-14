import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SAMGOLD_COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = currentStep > index + 1;
        const isActive = currentStep === index + 1;
        const isFuture = currentStep < index + 1;

        return (
          <React.Fragment key={`step-${index}`}>
            <View style={styles.stepWrapper}>
              <Animated.View
                style={[
                  styles.circle,
                  {
                    backgroundColor: isCompleted
                      ? SAMGOLD_COLORS.primary
                      : isActive
                      ? SAMGOLD_COLORS.background
                      : SAMGOLD_COLORS.background,
                    borderColor: isFuture ? SAMGOLD_COLORS.mutedDark : SAMGOLD_COLORS.primary,
                  },
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={16} color={SAMGOLD_COLORS.background} />
                ) : (
                  <Text
                    style={[
                      styles.number,
                      { color: isFuture ? SAMGOLD_COLORS.mutedDark : SAMGOLD_COLORS.primary },
                    ]}
                  >
                    {index + 1}
                  </Text>
                )}
              </Animated.View>
            </View>

            {index < steps.length - 1 && (
              <View style={styles.lineWrapper}>
                <Animated.View
                  style={[
                    styles.line,
                    {
                      backgroundColor: isCompleted
                        ? SAMGOLD_COLORS.primary
                        : SAMGOLD_COLORS.cardBorder,
                    },
                  ]}
                />
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse', // RTL
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 16,
  },
  stepWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 18,
  },
  lineWrapper: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
    backgroundColor: SAMGOLD_COLORS.cardBorder,
  },
  line: {
    height: '100%',
    width: '100%',
  },
});
