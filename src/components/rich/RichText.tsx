import type { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View, type TextStyle } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { Text, type TextProps, type TextVariant } from '@/components/Text';
import { parseBlocks, parseRich, plainText, type CalloutKind, type RichSegment } from '@/lib/rich';
import { fonts, palette, radii, spacing, useTheme } from '@/theme';

import { MathSpan } from './MathSpan';

type RichTextProps = Omit<TextProps, 'children'> & {
  children: string;
  /**
   * One flowing run of text (no boxes, lists or display blocks), for titles,
   * list rows and previews that clamp with numberOfLines.
   */
  inline?: boolean;
};

const CALLOUTS: Record<CalloutKind, { icon: IconName; color: string }> = {
  why: { icon: 'help-circle-outline', color: palette.violet },
  example: { icon: 'pencil-outline', color: palette.sky },
  watch: { icon: 'alert-outline', color: palette.coral },
  tip: { icon: 'star-four-points-outline', color: palette.teal },
  mnemonic: { icon: 'brain', color: palette.pink },
  key: { icon: 'key-variant', color: palette.orange },
};

/** Headline variants keep their own typeface for highlighted words. */
const DISPLAY_VARIANTS = new Set<TextVariant>(['hero', 'title', 'heading', 'number']);

/** A formula alone on its line (like the answer that opens a card's back) gets full-size fractions. */
function aloneOnLine(segments: RichSegment[], index: number): boolean {
  const before = segments[index - 1];
  const after = segments[index + 1];
  const startsLine = !before || (before.kind === 'text' && /\n\s*$/.test(before.text));
  const endsLine = !after || (after.kind === 'text' && /^\s*\n/.test(after.text));
  return startsLine && endsLine;
}

/**
 * Card text, typeset to be easy to read: textbook math and chemistry (KaTeX
 * on the web), code in a monospace font, highlighted key terms, callout boxes
 * ("Why:", "Example:", "Watch out:" …), lists and roomy paragraphs.
 * Markup is defined in src/lib/rich.ts and content/README.md.
 */
export function RichText({ children, inline = false, style, accessibilityLabel, ...textProps }: RichTextProps) {
  const { colors, scheme } = useTheme();
  const highlight = scheme === 'dark' ? 'rgba(255, 210, 63, 0.24)' : 'rgba(255, 214, 79, 0.5)';
  const strongFont = DISPLAY_VARIANTS.has(textProps.variant ?? 'body') ? undefined : fonts.bold;
  const label = accessibilityLabel ?? (/[$`*]/.test(children) ? plainText(children) : undefined);

  const runs = (text: string, allowDisplay: boolean): ReactNode[] => {
    const segments = parseRich(text);
    return segments.map((segment, i) => {
      if (segment.kind === 'text') {
        return segment.strong ? (
          <Text key={i} style={[{ backgroundColor: highlight, color: colors.text }, strongFont ? { fontFamily: strongFont } : null]}>
            {segment.text}
          </Text>
        ) : (
          segment.text
        );
      }
      if (segment.kind === 'math') {
        const display = allowDisplay && segments.length > 1 && aloneOnLine(segments, i);
        return <MathSpan key={i} tex={display ? `\\displaystyle ${segment.tex}` : segment.tex} />;
      }
      const code = segment.block ? segment.code.replace(/\s*\n\s*/g, ' ') : segment.code;
      return (
        <Text key={i} style={[styles.codeInline, { backgroundColor: colors.surfaceSunken, color: colors.text }]}>
          {Platform.OS === 'web' ? code : ` ${code} `}
        </Text>
      );
    });
  };

  const paragraph = (text: string, key?: number, extra?: TextStyle) => (
    <Text key={key} {...textProps} style={[style, extra]} accessibilityLabel={key === undefined ? label : undefined}>
      {runs(text, !inline)}
    </Text>
  );

  if (inline) return paragraph(children);

  const blocks = parseBlocks(children);
  if (blocks.length === 0) return paragraph('');
  if (blocks.length === 1 && blocks[0].kind === 'paragraph') return paragraph(blocks[0].text);

  return (
    <View style={styles.stack} accessibilityLabel={label}>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case 'paragraph':
            return paragraph(block.text, i);
          case 'callout': {
            const look = CALLOUTS[block.callout];
            return (
              <View key={i} style={[styles.callout, { backgroundColor: `${look.color}17`, borderLeftColor: look.color }]}>
                <View style={styles.calloutHeader}>
                  <Icon name={look.icon} size={15} color={look.color} />
                  <Text variant="label" color={look.color}>
                    {block.label}
                  </Text>
                </View>
                {paragraph(block.text, i)}
              </View>
            );
          }
          case 'list':
            return (
              <View key={i} style={styles.list}>
                {block.items.map((item, j) => (
                  <View key={j} style={styles.listItem}>
                    <Text {...textProps} style={[style, styles.marker]} color={colors.primary}>
                      {block.ordered ? `${j + 1}.` : '•'}
                    </Text>
                    {paragraph(item, j, styles.flex)}
                  </View>
                ))}
              </View>
            );
          case 'math':
            return (
              <View key={i} accessible accessibilityLabel={plainText(`$${block.tex}$`)}>
                <MathSpan tex={block.tex} display />
              </View>
            );
          case 'code':
            return (
              <View key={i} style={[styles.codeBlock, { backgroundColor: colors.surfaceSunken, borderColor: colors.border }]}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <Text style={[styles.codeBlockText, { color: colors.text }]} selectable>
                    {block.code}
                  </Text>
                </ScrollView>
              </View>
            );
        }
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing.md },
  flex: { flex: 1 },
  codeInline: {
    fontFamily: fonts.mono,
    borderRadius: 6,
    ...(Platform.OS === 'web' ? ({ paddingHorizontal: 5, paddingVertical: 1, fontSize: '0.9em' } as object) : null),
  },
  codeBlock: { borderRadius: radii.md, borderWidth: 1, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  codeBlockText: { fontFamily: fonts.mono, fontSize: 14, lineHeight: 21 },
  callout: {
    borderLeftWidth: 4,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: 4,
  },
  calloutHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  list: { gap: 6 },
  listItem: { flexDirection: 'row', gap: spacing.sm },
  marker: { minWidth: 16, fontFamily: fonts.extrabold },
});
