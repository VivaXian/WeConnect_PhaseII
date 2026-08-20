import type { FaqItem } from '../types/faq';

export interface FaqSignals {
  hasPendingSignOrder: boolean;
  hasActiveRepair: boolean;
  hasArchivedConversation: boolean;
  hasBoundDevice: boolean;
}

const BOOST_RULES: { id: string; isRelevant: (signals: FaqSignals) => boolean }[] = [
  { id: 'faq-5', isRelevant: (signals) => signals.hasPendingSignOrder },
  { id: 'faq-2', isRelevant: (signals) => signals.hasActiveRepair },
  { id: 'faq-8', isRelevant: (signals) => signals.hasArchivedConversation },
  { id: 'faq-4', isRelevant: (signals) => !signals.hasBoundDevice },
];

const BOOST_OFFSET = 100;

const scoreOf = (item: FaqItem, signals: FaqSignals): number => {
  const rule = BOOST_RULES.find((entry) => entry.id === item.id);
  return rule && rule.isRelevant(signals) ? item.priority - BOOST_OFFSET : item.priority;
};

export const rankFaq = (items: FaqItem[], signals: FaqSignals): FaqItem[] =>
  [...items].sort((a, b) => scoreOf(a, signals) - scoreOf(b, signals));
