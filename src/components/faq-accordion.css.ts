import { style } from '@vanilla-extract/css';

export const faqAccordionStyles = {
  list: style({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minWidth: 0,
  }),
  item: style({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minWidth: 0,
  }),
  question: style({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    minWidth: 0,
    padding: '12px 16px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    textAlign: 'left',
  }),
  questionText: style({
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    lineHeight: 1.5,
    color: '#1f2937',
  }),
  chevron: style({
    flexShrink: 0,
    width: 16,
    height: 16,
    color: '#c4c9d0',
    transition: 'transform 0.18s ease',
  }),
  chevronOpen: style({
    transform: 'rotate(180deg)',
  }),
  answer: style({
    margin: 0,
    padding: '0 16px 14px',
    fontSize: 13,
    lineHeight: 1.7,
    color: '#6a7282',
  }),
};
