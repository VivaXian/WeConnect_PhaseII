import { useState } from 'react';
import clsx from 'clsx';
import { ChevronRight } from '@filament/react/icons/chevron-right';
import type { FaqCategory } from '../types/faq';
import { FAQ_CATEGORY_LABEL } from '../types/faq';
import { MiniProgramNav } from '../components/mini-program-nav';
import { FaqAccordion } from '../components/faq-accordion';
import { useFaqSignals } from '../hooks/use-faq-signals';
import { faqData } from '../utils/faq-data';
import { rankFaq } from '../utils/faq-ranking';
import { faqPageStyles as s } from './faq-page.css';

type Filter = 'all' | FaqCategory;

const FILTERS: Filter[] = ['all', 'repair', 'work-order', 'device', 'maintenance', 'account'];

const filterLabel = (filter: Filter): string =>
  filter === 'all' ? '全部' : FAQ_CATEGORY_LABEL[filter];

interface FaqPageProps {
  onBack: () => void;
  onAskPress: () => void;
}

export const FaqPage = ({ onBack, onAskPress }: FaqPageProps) => {
  const signals = useFaqSignals();
  const [filter, setFilter] = useState<Filter>('all');

  const items = rankFaq(faqData, signals).filter(
    (item) => filter === 'all' || item.category === filter
  );

  return (
    <div className={s.page}>
      <MiniProgramNav variant="back" title="常见问题" onBack={onBack} />

      <div className={s.filterBar} role="group" aria-label="问题分类">
        {FILTERS.map((entry) => (
          <button
            key={entry}
            type="button"
            className={clsx(s.chip, filter === entry && s.chipActive)}
            aria-pressed={filter === entry}
            onClick={() => setFilter(entry)}
          >
            {filterLabel(entry)}
          </button>
        ))}
      </div>

      <div className={s.list}>
        {items.length === 0
          ? <p className={s.empty}>该分类下暂无问题</p>
          : <FaqAccordion key={filter} items={items} />}
      </div>

      <button type="button" className={s.askRow} onClick={onAskPress}>
        <span>没找到答案？联系客户响应中心</span>
        <ChevronRight className={s.askChevron} aria-hidden="true" />
      </button>
    </div>
  );
};
