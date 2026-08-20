import clsx from 'clsx';
import { confirmDialogStyles as c } from './confirm-dialog.css';

interface ConfirmDialogProps {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  hideCancel?: boolean;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  title,
  message,
  confirmLabel = '确定',
  cancelLabel = '取消',
  hideCancel = false,
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <div className={c.overlay} onClick={onCancel}>
    <div className={c.card} onClick={(e) => e.stopPropagation()}>
      <div className={c.body}>
        <span className={c.title}>{title}</span>
        {message && <span className={c.message}>{message}</span>}
      </div>
      <div className={c.actions}>
        {!hideCancel && (
          <button type="button" className={clsx(c.btn, c.btnCancel)} onClick={onCancel}>
            {cancelLabel}
          </button>
        )}
        <button
          type="button"
          className={clsx(c.btn, destructive ? c.btnDanger : c.btnConfirm)}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);
