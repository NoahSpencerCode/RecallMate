import type { IconName } from '@/components/Icon';
import type { CategoryLook } from '@/features/packs/categories';

/** What a review needs from a card. Memories and profession cards both have these fields. */
export type ReviewCard = {
  id: string;
  title: string;
  body: string;
  answer: string | null;
  accepted_answers: string[];
  answer_display: string | null;
  search_query: string | null;
  stage: number;
};

/** How a card is presented on its face. */
export type CardDecoration = {
  look: CategoryLook;
  /** The line above the prompt, e.g. the pack or module title. */
  label: string;
  /** Extra words for the "Learn more" search when a card has no written query. */
  topic?: string | null;
  /** A small tag beside the label, e.g. "Theorem". */
  badge?: string | null;
};

/** One graded card, as sent to the server. */
export type ReviewGrade = { id: string; passed: boolean; attempts: number };

/** Called when a review fails to save (after any retries). */
export type FailureHandler = (grade: ReviewGrade, error: unknown) => void;

/** A button on the "session complete" screen. */
export type SessionAction = {
  title: string;
  icon?: IconName;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  onPress: () => void;
};
