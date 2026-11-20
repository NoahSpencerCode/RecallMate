import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type RefreshControlProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { layout, spacing, useIsWide, useTheme } from '@/theme';

import { GradientBlobs } from './GradientBlobs';

type ScreenProps = {
  children: ReactNode;
  /** Wrap content in a ScrollView (default true). */
  scroll?: boolean;
  blobs?: boolean;
  /** Leave room for the floating tab bar on phones. */
  tabBar?: boolean;
  maxWidth?: number;
  contentStyle?: StyleProp<ViewStyle>;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  /** Pinned under the content, e.g. a save button. */
  footer?: ReactNode;
};

export function Screen({
  children,
  scroll = true,
  blobs = true,
  tabBar = false,
  maxWidth = layout.maxContentWidth,
  contentStyle,
  refreshControl,
  footer,
}: ScreenProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const isWide = useIsWide();
  const bottom = tabBar && !isWide ? layout.tabBarHeight + insets.bottom + 40 : insets.bottom + spacing.xxl;

  const content: StyleProp<ViewStyle> = [
    styles.content,
    {
      paddingTop: insets.top + (isWide ? spacing.xxxl : spacing.md),
      paddingBottom: footer ? spacing.lg : bottom,
      paddingHorizontal: isWide ? spacing.xxxl : spacing.xl,
      maxWidth,
    },
    contentStyle,
  ];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {blobs ? <GradientBlobs /> : null}
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}>
        {scroll ? (
          <ScrollView
            contentContainerStyle={content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            refreshControl={refreshControl}>
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.root, content]}>{children}</View>
        )}
        {footer ? (
          <View
            style={[
              styles.footer,
              {
                paddingBottom: insets.bottom + spacing.lg,
                paddingHorizontal: isWide ? spacing.xxxl : spacing.xl,
                maxWidth,
              },
            ]}>
            {footer}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { width: '100%', alignSelf: 'center', gap: spacing.xl },
  footer: { width: '100%', alignSelf: 'center', paddingTop: spacing.sm },
});
