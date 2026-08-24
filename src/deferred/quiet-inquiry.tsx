import { quietInquiryStyles as q } from './quiet-inquiry.css';

interface QuietInquiryProps {
  question: string;
  actionLabel?: string;
  onPress: () => void;
}

export const QuietInquiry = ({
  question,
  actionLabel = '联系客户响应中心',
  onPress,
}: QuietInquiryProps) => (
  <button type="button" className={q.button} onClick={onPress}>
    {question}
    <span className={q.action}>{actionLabel}</span>
  </button>
);
