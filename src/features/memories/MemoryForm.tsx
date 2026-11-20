import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Platform, StyleSheet, Switch, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';

import { Button } from '@/components/Button';
import { IconButton } from '@/components/IconButton';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { TextField } from '@/components/TextField';
import { fonts, radii, spacing, useTheme } from '@/theme';

import type { MemoryInput } from './api';

// react-native-web paints the "on" thumb teal unless told otherwise.
const webSwitchProps = Platform.OS === 'web' ? ({ activeThumbColor: '#FFFFFF' } as object) : {};

type MemoryFormProps = {
  heading: string;
  initial?: MemoryInput;
  submitLabel: string;
  saving: boolean;
  onSubmit: (input: MemoryInput) => void;
  /** Extra content under the form, e.g. schedule info and delete. */
  children?: ReactNode;
};

export function MemoryForm({ heading, initial, submitLabel, saving, onSubmit, children }: MemoryFormProps) {
  const { colors } = useTheme();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [body, setBody] = useState(initial?.body ?? '');
  const [requireAnswer, setRequireAnswer] = useState(Boolean(initial?.answer));
  const [answer, setAnswer] = useState(initial?.answer ?? '');
  const [alternatives, setAlternatives] = useState((initial?.acceptedAnswers ?? []).join('\n'));
  const [errors, setErrors] = useState<{ title?: string; answer?: string }>({});

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

      <Animated.View entering={FadeInDown.springify().damping(16)} layout={LinearTransition} style={[styles.preview, { backgroundColor: colors.surface, borderColor: colors.border, borderBottomColor: colors.primary }]}>
        <Text variant="label" tone="primary">
          Front of card
        </Text>
        <Text variant="title" tone={title ? 'default' : 'subtle'} numberOfLines={4}>
          {title || 'What do you want to remember?'}
        </Text>
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
        multiline
        minHeight={84}
        maxLength={200}
        autoFocus={!initial}
      />

      <TextField
        label="Back: answer and explanation"
        placeholder="Shown after you answer. Add the why, an example, or a memory hook."
        value={body}
        onChangeText={setBody}
        multiline
        minHeight={140}
        maxLength={5000}
      />

      <View style={[styles.toggleRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Require a typed answer</Text>
          <Text variant="small" tone="muted">
            You get 3 tries. Miss them all and the card starts over tomorrow.
          </Text>
        </View>
        <Switch
          value={requireAnswer}
          onValueChange={setRequireAnswer}
          trackColor={{ true: colors.primary, false: colors.surfaceSunken }}
          thumbColor="#FFFFFF"
          {...webSwitchProps}
          accessibilityLabel="Require a typed answer"
        />
      </View>

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
            hint="Case, spacing and a leading “the” don’t matter."
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
  preview: { borderRadius: radii.xl, borderWidth: 1.5, borderBottomWidth: 5, padding: spacing.xl, gap: spacing.sm, minHeight: 150 },
  answerChip: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radii.pill, marginTop: spacing.xs },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderRadius: radii.lg, borderWidth: 1.5 },
  answerFields: { gap: spacing.lg },
});
