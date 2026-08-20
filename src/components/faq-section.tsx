import { ChevronRight } from '@filament/react/icons/chevron-right';
import { Text } from '@filament/react/text';
import { useFaqSignals } from '../hooks/use-faq-signals';
import { faqData } from '../utils/faq-data';
import { rankFaq } from '../utils/faq-ranking';
import { FaqAccordion } from './faq-accordion';
import { faqSectionStyles as s } from './faq-section.css';

const VISIBLE_COUNT = 3;

interface FaqSectionProps {
  onSeeAllPress: () => void;
}

export const FaqSection = ({ onSeeAllPress }: FaqSectionProps) => {
  const signals = useFaqSignals();
  const items = rankFaq(faqData, signals).slice(0, VISIBLE_COUNT);

  return (
    <section className={s.section}>
      <div className={s.header}>
        <Text variant="body-m" weight="bold">常见问题</Text>
      </div>
      <FaqAccordion items={items} />
      <button type="button" className={s.askRow} onClick={onSeeAllPress}>
        <span>全部问题</span>
        <ChevronRight className={s.askChevron} aria-hidden="true" />
      </button>
    </section>
  );
};
