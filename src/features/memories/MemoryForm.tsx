import { router } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Switch, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';

import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { RichText } from '@/components/rich/RichText';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { TextField } from '@/components/TextField';
import { fonts, radii, spacing, useTheme } from '@/theme';

import type { MemoryInput } from './api';
import { clearDraft, loadDraft, saveDraft, type MemoryDraft } from './drafts';

// react-native-web paints the "on" thumb teal unless told otherwise.
const webSwitchProps = Platform.OS === 'web' ? ({ activeThumbColor: '#FFFFFF' } as object) : {};

const TITLE_MAX = 200;
const BODY_MAX = 5000;

/** A counter once a field gets near its limit, so text cut off by a paste doesn't go unnoticed. */
function limitHint(length: number, max: number): string | undefined {
  if (length < max * 0.8) return undefined;
  const count = `${length.toLocaleString('en-US')} / ${max.toLocaleString('en-US')} characters`;
  return length >= max ? `${count}: that’s the limit.` : count;
}

function fromInput(input?: MemoryInput): MemoryDraft {
  return {
    title: input?.title ?? '',
    body: input?.body ?? '',
    requireAnswer: Boolean(input?.answer),
    answer: input?.answer ?? '',
    alternatives: (input?.acceptedAnswers ?? []).join('\n'),
  };
}

type MemoryFormProps = {
  /** Unsaved text is kept under this key until it's saved or discarded. */
  draftKey: string;
  heading: string;
  initial?: MemoryInput;
  submitLabel: string;
  saving: boolean;
  onSubmit: (input: MemoryInput) => void;
  /** Extra content under the form, e.g. schedule info and delete. */
  children?: ReactNode;
};

export function MemoryForm({ draftKey, heading, initial, submitLabel, saving, onSubmit, children }: MemoryFormProps) {
  const { colors } = useTheme();
  const [saved] = useState(() => fromInput(initial));
  const [restored, setRestored] = useState(() => loadDraft(draftKey));
  const start = restored ?? saved;
  const [title, setTitle] = useState(start.title);
  const [body, setBody] = useState(start.body);
  const [requireAnswer, setRequireAnswer] = useState(start.requireAnswer);
  const [answer, setAnswer] = useState(start.answer);
  const [alternatives, setAlternatives] = useState(start.alternatives);
  const [errors, setErrors] = useState<{ title?: string; answer?: string }>({});

  // Keep unsaved changes so an accidental back or swipe doesn't lose them.
  useEffect(() => {
    const draft = { title, body, requireAnswer, answer, alternatives };
    const changed = (Object.keys(draft) as (keyof MemoryDraft)[]).some((key) => draft[key] !== saved[key]);
    if (changed) saveDraft(draftKey, draft);
    else clearDraft(draftKey);
  }, [draftKey, saved, title, body, requireAnswer, answer, alternatives]);

  function discardDraft() {
    setTitle(saved.title);
    setBody(saved.body);
    setRequireAnswer(saved.requireAnswer);
    setAnswer(saved.answer);
    setAlternatives(saved.alternatives);
    setErrors({});
    setRestored(null);
  }

  function submit() {
    const next: typeof errors = {};
    if (!title.trim()) next.title = 'Write the question or prompt for the front of the card.';
    if (requireAnswer && !answer.trim()) next.answer = 'Add the exact answer, or turn off typed answers.';
    setErrors(next);
    if (next.title || next.answer) return;
    onSubmit({
      title,
      body,
      answer: requireAnswer ? answer : null,
      acceptedAnswers: requireAnswer ? alternatives.split('\n') : [],
    });
  }

  return (
    <Screen
      maxWidth={680}
      footer={<Button title={submitLabel} icon="check-bold" fullWidth loading={saving} onPress={submit} />}>
      <View style={styles.top}>
        <IconButton
          icon="close"
          accessibilityLabel="Close"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        />
        <Text variant="heading">{heading}</Text>
        <View style={styles.spacer} />
      </View>

      {restored ? (
        <Animated.View entering={FadeIn} style={[styles.restored, { backgroundColor: colors.primarySoft }]}>
          <Icon name="history" size={18} color={colors.primary} />
          <Text variant="smallStrong" tone="primary" style={styles.flex}>
            Picked up your unsaved changes.
          </Text>
          <Button title="Discard" variant="ghost" size="sm" onPress={discardDraft} />
        </Animated.View>
      ) : null}

      <Animated.View entering={FadeInDown.springify().damping(16)} layout={LinearTransition} style={[styles.preview, { backgroundColor: colors.surface, borderColor: colors.border, borderBottomColor: colors.primary }]}>
        <Text variant="label" tone="primary">
          Front of card
        </Text>
        <RichText variant="title" tone={title ? 'default' : 'subtle'} numberOfLines={4} inline>
          {title || 'What do you want to remember?'}
        </RichText>
        {requireAnswer && answer ? (
          <Animated.View entering={FadeIn} style={[styles.answerChip, { backgroundColor: colors.primarySoft }]}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 13 }} tone="primary">
              Typed answer: {answer}
            </Text>
          </Animated.View>
        ) : null}
      </Animated.View>

      <TextField
        label="Front: question or prompt"
        placeholder="e.g. What does the Golgi apparatus do?"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          if (errors.title) setErrors((e) => ({ ...e, title: undefined }));
        }}
        error={errors.title}
        hint={limitHint(title.length, TITLE_MAX)}
        multiline
        minHeight={84}
        maxLength={TITLE_MAX}
        autoFocus={!initial && !restored}
      />

      <TextField
        label="Back: answer and explanation"
        placeholder="Shown after you answer. Add the why, an example, or a memory hook."
        value={body}
        onChangeText={setBody}
        hint={limitHint(body.length, BODY_MAX) ?? 'Format math with $…$ (like $x^2$) and code with `backticks`.'}
        multiline
        minHeight={140}
        maxLength={BODY_MAX}
      />

      {/* The whole row is the control; the switch inside just shows its state. */}
      <Pressable
        onPress={() => setRequireAnswer((value) => !value)}
        accessibilityRole="switch"
        aria-checked={requireAnswer}
        accessibilityLabel="Require a typed answer"
        style={[styles.toggleRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Require a typed answer</Text>
          <Text variant="small" tone="muted">
            You get 3 tries. Miss them all and the card starts over tomorrow.
          </Text>
        </View>
        <View style={styles.switchShield} aria-hidden>
          <Switch
            value={requireAnswer}
            trackColor={{ true: colors.primary, false: colors.surfaceSunken }}
            thumbColor="#FFFFFF"
            {...webSwitchProps}
          />
        </View>
      </Pressable>

      {requireAnswer ? (
        <Animated.View entering={FadeInDown.springify().damping(16)} exiting={FadeOut.duration(150)} style={styles.answerFields}>
          <TextField
            label="Exact answer"
            placeholder="e.g. Golgi apparatus"
            value={answer}
            onChangeText={(text) => {
              setAnswer(text);
              if (errors.answer) setErrors((e) => ({ ...e, answer: undefined }));
            }}
            error={errors.answer}
            hint="Case, spacing, a leading “the” and how numbers are written (1,5 or 1.5) don’t matter."
            autoCapitalize="none"
            maxLength={200}
          />
          <TextField
            label="Also accept (one per line)"
            placeholder={'Golgi body\nGolgi complex'}
            value={alternatives}
            onChangeText={setAlternatives}
            multiline
            minHeight={90}
            autoCapitalize="none"
          />
        </Animated.View>
      ) : null}

      {children}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  spacer: { width: 44 },
  flex: { flex: 1 },
  restored: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: radii.lg,
  },
  preview: { borderRadius: radii.xl, borderWidth: 1.5, borderBottomWidth: 5, padding: spacing.xl, gap: spacing.sm, minHeight: 150 },
  answerChip: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radii.pill, marginTop: spacing.xs },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderRadius: radii.lg, borderWidth: 1.5 },
  switchShield: { pointerEvents: 'none' },
  answerFields: { gap: spacing.lg },
});
