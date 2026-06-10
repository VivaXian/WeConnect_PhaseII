import { useState } from 'react';
import { MiniProgramNav } from '../components/mini-program-nav';
import { seStyles } from './service-evaluation-page.css';

interface Questionnaire {
  id: string;
  title: string;
  repairTime: string;
  completedTime: string;
  status: 'pending' | 'completed';
}

const QUESTIONNAIRES: Questionnaire[] = [
  {
    id: 'q1',
    title: '现场维修服务满意度调研问卷',
    repairTime: '2025-10-05 12:00:06',
    completedTime: '2025-10-10 19:50:11',
    status: 'pending',
  },
  {
    id: 'q2',
    title: '远程技术服务满意度调研问卷',
    repairTime: '2025-10-05 12:00:06',
    completedTime: '2025-10-10 19:50:11',
    status: 'pending',
  },
];

const RATING_QUESTIONS = [
  {
    id: 'nps',
    label: '基于您此次的维修服务体验，您向同行推荐飞利浦的可能性有多大？(10分)',
    required: true,
  },
  {
    id: 'reason',
    label: '促使您不推荐的理由',
    required: true,
    type: 'text',
  },
  {
    id: 'overall',
    label: '您对此次维修的满意度如何？(10分)',
    required: true,
  },
  {
    id: 'time',
    label: '您对此次维修花费的整体时间满意度如何？(10分)',
    required: true,
  },
  {
    id: 'engineer',
    label: '您对工程师服务质量的满意度如何？(10分)',
    required: true,
  },
];

interface ServiceEvaluationPageProps {
  repairId: string;
  onBack: () => void;
}

type View = 'list' | 'rating';

export const ServiceEvaluationPage = ({ repairId, onBack }: ServiceEvaluationPageProps) => {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<Questionnaire | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({ nps: 10, overall: 10, time: 10, engineer: 10 });
  const [submitted, setSubmitted] = useState(false);

  const handleQuestionnairePress = (q: Questionnaire) => {
    setSelectedQuestionnaire(q);
    setCurrentView('rating');
  };

  const handleSetPerfect = () => {
    setRatings({ nps: 10, overall: 10, time: 10, engineer: 10 });
  };

  const handleSubmit = () => setSubmitted(true);

  if (currentView === 'rating' && selectedQuestionnaire) {
    return (
      <div className={seStyles.page}>
        <MiniProgramNav variant="back" title="服务评价" onBack={() => setCurrentView('list')} />
        <div className={seStyles.metaBar}>
          <div className={seStyles.metaRepairId}>报修编号 &nbsp;{repairId}</div>
          <div className={seStyles.metaTitle}>邀您为服务评价</div>
        </div>

        {submitted ? (
          <div className={seStyles.successBanner}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#dcfce7"/><path d="M14 24l8 8 12-14" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#16a34a' }}>感谢您的评价！</div>
            <div style={{ fontSize: 14, color: '#6a7282' }}>您的反馈对我们非常重要</div>
          </div>
        ) : (
          <>
            <div className={seStyles.ratingPage}>
              {RATING_QUESTIONS.map((q) => (
                <div key={q.id} className={seStyles.ratingGroup}>
                  <div className={seStyles.ratingLabel}>
                    {q.required && <span className={seStyles.ratingRequired}>*</span>}
                    {q.label}
                  </div>
                  {q.type === 'text' ? (
                    <input
                      type="text"
                      className={seStyles.textInput}
                      placeholder="填写信息"
                    />
                  ) : (
                    <div className={seStyles.sliderWrap}>
                      <input
                        type="range"
                        min={0}
                        max={10}
                        step={1}
                        value={ratings[q.id] ?? 5}
                        onChange={(e) => setRatings({ ...ratings, [q.id]: Number(e.target.value) })}
                        className={seStyles.slider}
                        aria-label={q.label}
                      />
                      <div className={seStyles.sliderLabels}>
                        {Array.from({ length: 11 }, (_, i) => (
                          <span key={i} style={{ fontWeight: ratings[q.id] === i ? 700 : 400, color: ratings[q.id] === i ? '#0072db' : undefined }}>
                            {i}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className={seStyles.footer}>
              <button className={seStyles.btnPerfect} onClick={handleSetPerfect}>一键满分</button>
              <button className={seStyles.btnPrimary} onClick={handleSubmit}>提交</button>
              <button className={seStyles.btnQuiet} onClick={() => setCurrentView('list')}>暂不评价</button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={seStyles.page}>
      <MiniProgramNav variant="back" title="服务评价" onBack={onBack} />
      <div className={seStyles.metaBar}>
        <div className={seStyles.metaRepairId}>报修编号 &nbsp;{repairId}</div>
        <div className={seStyles.metaTitle}>服务评价</div>
      </div>

      <div className={seStyles.listSection}>
        <div className={seStyles.questionnaireCard}>
          {QUESTIONNAIRES.map((q, idx) => (
            <div key={q.id}>
              {idx > 0 && <div className={seStyles.divider} />}
              <div
                className={seStyles.questionnaireItem}
                onClick={() => handleQuestionnairePress(q)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleQuestionnairePress(q)}
              >
                <div className={seStyles.questionnaireItemLeft}>
                  <div className={seStyles.questionnaireRow}>
                    <span className={seStyles.questionnaireTitle}>{q.title}</span>
                    <span className={q.status === 'pending' ? seStyles.pendingTag : seStyles.completedTag}>
                      {q.status === 'pending' ? '待评价' : '已完成'}
                    </span>
                  </div>
                  <div className={seStyles.questionnaireTimeInfo}>
                    {`报修时间 ${q.repairTime}\n完成时间 ${q.completedTime}`}
                  </div>
                </div>
                <span className={seStyles.chevron}>›</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
