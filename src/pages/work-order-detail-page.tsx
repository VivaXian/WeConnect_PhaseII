import { useState } from 'react';
import { WORK_ORDER_TYPE_LABEL } from '../types/work-order';
import { workOrderData } from '../utils/work-order-data';
import { wdStyles } from './work-order-detail-page.css';

type SigningState = 'idle' | 'signing' | 'signed';

interface WorkOrderDetailPageProps {
  orderId: string;
  onBack: () => void;
  onServiceEvalPress?: () => void;
}

export const WorkOrderDetailPage = ({ orderId, onBack, onServiceEvalPress }: WorkOrderDetailPageProps) => {
  const allOrders = workOrderData.flatMap((g) => g.orders);
  const order = allOrders.find((o) => o.id === orderId);
  const [signingState, setSigningState] = useState<SigningState>('idle');

  if (!order) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#6a7282' }}>
        <button className={wdStyles.backBtn} onClick={onBack}>← 返回</button>
        <p>工单不存在</p>
      </div>
    );
  }

  const isPendingSign = order.status === 'pending-sign';
  const isCompleted = order.status === 'completed';

  // Show signature canvas when user taps 确认签字
  if (signingState === 'signing') {
    return (
      <div className={wdStyles.page}>
        <div className={wdStyles.header}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button className={wdStyles.backBtn} onClick={() => setSigningState('idle')}>← 返回</button>
          </div>
          <div className={wdStyles.headerTitle}>工单详情</div>
        </div>
        <div className={wdStyles.signatureArea}>
          <div style={{ fontSize: 20, color: '#9ca3af' }}>✍️</div>
          <div className={wdStyles.signatureCanvas}>
            <span>使用手指或触控笔签名</span>
          </div>
          <div className={wdStyles.signatureLine} />
          <div className={wdStyles.signaturePrompt}>手写签名区域</div>
        </div>
        <div className={wdStyles.footer}>
          <button className={wdStyles.btnQuiet} onClick={() => setSigningState('idle')}>返回</button>
          <button className={wdStyles.btnSecondary} onClick={() => setSigningState('idle')}>清除</button>
          <button className={wdStyles.btnPrimary} onClick={() => setSigningState('signed')}>确认</button>
        </div>
      </div>
    );
  }

  return (
    <div className={wdStyles.page}>
      <div className={wdStyles.header}>
        <button className={wdStyles.backBtn} onClick={onBack}>← 返回</button>
        <div className={wdStyles.headerTitle}>工单详情</div>
      </div>

      {/* Work order meta */}
      <div className={wdStyles.woMeta}>
        <span className={wdStyles.woTag}>{WORK_ORDER_TYPE_LABEL[order.type]}</span>
        <span className={wdStyles.woNumber}>{order.workOrderNo}</span>
        {signingState === 'signed' && (
          <span className={wdStyles.signedBadge}>✓ 已签字</span>
        )}
      </div>

      {/* Document content */}
      <div className={wdStyles.docSection}>
        <div className={wdStyles.docPage}>
          <div className={wdStyles.docPagePlaceholder}>
            <div className={wdStyles.docIcon}>📄</div>
            <div>
              <div style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>{order.workOrderNo}</div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>{WORK_ORDER_TYPE_LABEL[order.type]}工单</div>
            </div>
            <div style={{ fontSize: 12, color: '#d1d5db', marginTop: 8 }}>
              {order.deviceName} · {order.hospital}
            </div>
            <div style={{ fontSize: 11, color: '#d1d5db' }}>
              请求时间：{order.requestTime}
            </div>
          </div>
        </div>
        <div className={wdStyles.docPage}>
          <div className={wdStyles.docPagePlaceholder}>
            <div style={{ fontSize: 12 }}>工单详情（第2页）</div>
            <div style={{ fontSize: 11, color: '#d1d5db' }}>服务报告内容</div>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className={wdStyles.footer}>
        {isPendingSign && signingState === 'idle' && (
          <>
            <button className={wdStyles.btnQuiet} onClick={onBack}>暂时不签</button>
            <button className={wdStyles.btnPrimary} onClick={() => setSigningState('signing')}>确认签字</button>
          </>
        )}
        {(signingState === 'signed' || isCompleted) && (
          <>
            <button
              className={wdStyles.btnSecondary}
              style={{ fontSize: 13 }}
              onClick={onServiceEvalPress}
            >
              评价服务
            </button>
            <button className={wdStyles.btnSecondary} style={{ fontSize: 13 }}>下载PDF</button>
            <button className={wdStyles.btnSecondary} style={{ fontSize: 13 }}>发送邮箱</button>
          </>
        )}
        {order.status === 'in-progress' && signingState !== 'signed' && (
          <button className={wdStyles.btnQuiet} onClick={onBack}>关闭</button>
        )}
        {order.status === 'expired' && (
          <button className={wdStyles.btnQuiet} onClick={onBack}>关闭</button>
        )}
      </div>
    </div>
  );
};
