import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Button } from '@filament/react/button';
import { Image } from '@filament/react/icons/image';
import { Send } from '@filament/react/icons/send';
import { TextField } from '@filament/react/text-field';
import type { CaseRef, ConversationAttachment } from '../types/conversation';
import type { QuickEntryPick } from './quick-entry-card';
import { QuickEntryCard } from './quick-entry-card';
import { ConfirmDialog } from './confirm-dialog';
import { composerStyles } from './message-composer.css';

const MAX_ATTACHMENTS = 6;

interface MessageComposerProps {
  relatedCase?: CaseRef;
  initialDraft?: string;
  onSend: (text: string, attachments: ConversationAttachment[]) => void;
  onQuickEntry?: (pick: QuickEntryPick) => void;
  onEndInquiry?: () => void;
}

export const MessageComposer = ({ relatedCase, initialDraft, onSend, onQuickEntry, onEndInquiry }: MessageComposerProps) => {
  const [text, setText] = useState(initialDraft ?? '');
  const [attachments, setAttachments] = useState<ConversationAttachment[]>([]);
  const [attachedCase, setAttachedCase] = useState<CaseRef | undefined>(relatedCase);
  const [isPanelOpen, setPanelOpen] = useState(false);
  const [isEndConfirmOpen, setEndConfirmOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAttachedCase(relatedCase);
  }, [relatedCase]);

  const canSend = text.trim().length > 0 || attachments.length > 0;

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const picked = Array.from(fileList)
      .slice(0, MAX_ATTACHMENTS - attachments.length)
      .map((file) => ({
        id: `att-${file.name}-${file.lastModified}`,
        fileType: 'image' as const,
        url: URL.createObjectURL(file),
        name: file.name,
      }));
    setAttachments((current) => [...current, ...picked]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((current) => {
      const target = current.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return current.filter((item) => item.id !== id);
    });
  };

  const handleSend = () => {
    if (!canSend) return;
    const prefix = attachedCase ? `【${attachedCase.deviceName} · ${attachedCase.displayNo}】` : '';
    onSend(`${prefix}${text.trim()}`, attachments);
    setText('');
    setAttachments([]);
  };

  return (
    <div className={composerStyles.composer}>
      {isPanelOpen && onQuickEntry && (
        <div className={composerStyles.actionPanel}>
          <QuickEntryCard
            hint={null}
            onClose={() => setPanelOpen(false)}
            onPick={(pick) => {
              setPanelOpen(false);
              onQuickEntry(pick);
            }}
          />
        </div>
      )}
      {isEndConfirmOpen && (
        <ConfirmDialog
          title="结束本次咨询？"
          message="结束后历史记录仍可查看，您随时可以发起新的咨询。"
          confirmLabel="结束咨询"
          onConfirm={() => {
            setEndConfirmOpen(false);
            onEndInquiry?.();
          }}
          onCancel={() => setEndConfirmOpen(false)}
        />
      )}
      {attachedCase && (
        <div className={composerStyles.contextRow}>
          <span className={composerStyles.contextChip}>
            {`${attachedCase.deviceName} · ${attachedCase.displayNo}`}
            <button
              type="button"
              className={composerStyles.contextRemove}
              onClick={() => setAttachedCase(undefined)}
              aria-label="取消关联"
            >
              ×
            </button>
          </span>
        </div>
      )}
      {attachments.length > 0 && (
        <div className={composerStyles.previewRow}>
          {attachments.map((attachment) => (
            <div key={attachment.id} className={composerStyles.previewItem}>
              <img className={composerStyles.previewImage} src={attachment.url} alt={attachment.name ?? '待发送图片'} />
              <button
                type="button"
                className={composerStyles.previewRemove}
                onClick={() => removeAttachment(attachment.id)}
                aria-label={`移除图片 ${attachment.name ?? ''}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      {(onQuickEntry || onEndInquiry) && (
        <div className={composerStyles.actionBar}>
          {onQuickEntry && (
            <button
              type="button"
              className={clsx(composerStyles.actionChip, isPanelOpen && composerStyles.actionChipActive)}
              aria-expanded={isPanelOpen}
              onClick={() => setPanelOpen((open) => !open)}
            >
              选择设备或报修单
            </button>
          )}
          {onEndInquiry && (
            <button
              type="button"
              className={composerStyles.actionChip}
              onClick={() => setEndConfirmOpen(true)}
            >
              结束咨询
            </button>
          )}
        </div>
      )}
      <div className={composerStyles.inputRow}>
        <Button
          variant="quiet"
          shape="round"
          isIconOnly
          aria-label="上传图片"
          isDisabled={attachments.length >= MAX_ATTACHMENTS}
          onPress={() => fileInputRef.current?.click()}
        >
          <Image aria-hidden="true" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className={composerStyles.hiddenInput}
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = '';
          }}
        />
        <div className={composerStyles.fieldWrapper}>
          <TextField
            aria-label="消息输入"
            placeholder="描述您的问题…"
            value={text}
            onChange={setText}
            isFullWidth
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleSend();
            }}
          />
        </div>
        <Button
          variant="primary"
          shape="round"
          isIconOnly
          aria-label="发送"
          isDisabled={!canSend}
          onPress={handleSend}
        >
          <Send aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};
