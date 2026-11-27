import { Pressable, StyleSheet, View } from 'react-native';

import { CategoryIcon } from '@/components/CategoryIcon';
import { Icon } from '@/components/Icon';
import { RichText } from '@/components/rich/RichText';
import { Text } from '@/components/Text';
import { prettyMath } from '@/features/review/prettyMath';
import { openLink } from '@/lib/openLink';
import { fallbackSearchQuery, learnMoreUrl, plainText, splitAnswer } from '@/lib/rich';
import { fonts, radii, spacing, useTheme } from '@/theme';

import type { CardDecoration, ReviewCard } from './types';

type CardFrontProps = {
  card: ReviewCard;
  decoration: CardDecoration;
  /** Typed-answer cards show a "Type it" tag. */
  typed: boolean;
  /** The line under the prompt; defaults to the review instructions. */
  hint?: string;
};

/** The question side of a study card. */
export function CardFront({ card, decoration, typed, hint }: CardFrontProps) {
  const { colors } = useTheme();
  const { look, label, badge } = decoration;
  return (
    <View style={[styles.face, { backgroundColor: colors.surface, borderColor: colors.border, borderBottomColor: look.color }]}>
      <View style={styles.faceHeader}>
        <CategoryIcon look={look} size={30} />
        <Text variant="label" color={look.color} numberOfLines={1} style={styles.flex}>
          {label}
        </Text>
        {badge ? (
          <View style={[styles.badge, { backgroundColor: `${look.color}1F` }]}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 11 }} color={look.color}>
              {badge}
            </Text>
          </View>
        ) : null}
        {typed ? (
          <View style={[styles.badge, { backgroundColor: colors.primarySoft }]}>
            <Icon name="keyboard-outline" size={14} color={colors.primary} />
            <Text style={{ fontFamily: fonts.bold, fontSize: 11 }} color={colors.primary}>
              Type it
            </Text>
          </View>
        ) : null}
      </View>
      <RichText variant={plainText(card.title).length > 90 ? 'heading' : 'title'} style={styles.prompt}>
        {card.title}
      </RichText>
      <Text variant="small" tone="subtle">
        {hint ?? (typed ? 'Type your answer below.' : 'Answer it in your head, then flip the card.')}
      </Text>
    </View>
  );
}

type CardBackProps = {
  card: ReviewCard;
  decoration: CardDecoration;
  /** How the card was answered; "revealed" just shows the answer. */
  outcome: 'correct' | 'failed' | 'revealed';
  /** Typed-answer cards show their formatted answer instead of the body's first line. */
  typed: boolean;
  /** Overrides the banner's text, e.g. "New card". */
  bannerText?: string;
  /** What the learner typed last, shown after a miss or an "I was right". */
  lastTry?: string;
  /** A schedule note under the card, e.g. "Next review in 3 days". */
  nextLine?: string | null;
};

/** The answer side: the answer boxed, then the explanation and a "Learn more" link. */
export function CardBack({ card, decoration, outcome, typed, bannerText, lastTry, nextLine }: CardBackProps) {
  const { colors } = useTheme();
  const banner =
    outcome === 'correct'
      ? { icon: 'check-circle' as const, text: 'Correct!', fg: colors.success, bg: colors.successSoft }
      : outcome === 'failed'
        ? { icon: 'close-circle' as const, text: 'The answer was', fg: colors.danger, bg: colors.dangerSoft }
        : { icon: 'lightbulb-on' as const, text: bannerText ?? 'Answer', fg: colors.primary, bg: colors.primarySoft };

  // The body's first line states the answer; typed cards show the formatted answer instead.
  const { answer: answerLine, explanation } = splitAnswer(card.body ?? '');
  const searchQuery = card.search_query || fallbackSearchQuery(card.title, card.answer, decoration.topic);

  return (
    <View style={[styles.face, { backgroundColor: colors.surface, borderColor: colors.border, borderBottomColor: banner.fg }]}>
      <View style={[styles.banner, { backgroundColor: banner.bg }]}>
        <Icon name={banner.icon} size={20} color={banner.fg} />
        <Text variant="smallStrong" color={banner.fg}>
          {banner.text}
        </Text>
      </View>
      <RichText variant="small" tone="subtle" numberOfLines={3} inline>
        {card.title}
      </RichText>
      {/* The answer, boxed so it stands out from the explanation. */}
      <View style={[styles.answerBox, { backgroundColor: banner.bg, borderColor: banner.fg }]}>
        {typed ? (
          card.answer_display ? (
            <RichText variant="title" color={outcome === 'failed' ? colors.danger : colors.text}>
              {card.answer_display}
            </RichText>
          ) : (
            <Text variant="title" color={outcome === 'failed' ? colors.danger : colors.text}>
              {prettyMath(card.answer ?? '')}
            </Text>
          )
        ) : (
          <RichText variant={plainText(answerLine).length > 70 ? 'bodyStrong' : 'heading'}>{answerLine}</RichText>
        )}
      </View>
      {lastTry ? (
        <Text variant="small" tone="muted">
          You typed: {lastTry}
        </Text>
      ) : null}
      {explanation ? <RichText variant="body">{explanation}</RichText> : null}
      <Pressable
        onPress={() => openLink(learnMoreUrl(searchQuery))}
        accessibilityRole="link"
        accessibilityLabel={`Learn more on Google: ${searchQuery}`}
        style={({ pressed }) => [styles.learnMore, { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}>
        <Icon name="google" size={16} color={colors.primary} />
        <Text variant="smallStrong" tone="primary" numberOfLines={1} style={styles.flex}>
          Learn more: {searchQuery}
        </Text>
        <Icon name="open-in-new" size={16} color={colors.textSubtle} />
      </Pressable>
      {nextLine ? (
        <View style={styles.nextLine}>
          <Icon name="calendar-arrow-right" size={16} color={colors.textSubtle} />
          <Text variant="caption" tone="subtle">
            {nextLine}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  face: {
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderBottomWidth: 6,
    padding: spacing.xxl,
    gap: spacing.md,
    minHeight: 260,
  },
  faceHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radii.pill },
  prompt: { marginTop: spacing.sm },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
  },
  answerBox: { borderWidth: 1.5, borderRadius: radii.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  learnMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  nextLine: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm },
});
