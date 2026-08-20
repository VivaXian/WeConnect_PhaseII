import { useState } from 'react';
import { ChevronDown } from '@filament/react/icons/chevron-down';
import clsx from 'clsx';
import type { FaqItem } from '../types/faq';
import { faqAccordionStyles as s } from './faq-accordion.css';

interface FaqAccordionProps {
  items: FaqItem[];
}

export const FaqAccordion = ({ items }: FaqAccordionProps) => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className={s.list}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className={s.item}>
            <button
              type="button"
              className={s.question}
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              <span className={s.questionText}>{item.question}</span>
              <ChevronDown className={clsx(s.chevron, isOpen && s.chevronOpen)} aria-hidden="true" />
            </button>
            {isOpen && <p className={s.answer}>{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
};
