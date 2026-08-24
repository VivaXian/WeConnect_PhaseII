import { useRef, useState } from 'react';
import { Button } from '@filament/react/button';
import { Image } from '@filament/react/icons/image';
import { Send } from '@filament/react/icons/send';
import { TextField } from '@filament/react/text-field';
import type { ConversationAttachment } from '../types/conversation';
import { composerStyles } from './message-composer.css';

const MAX_ATTACHMENTS = 6;

interface MessageComposerProps {
  onSend: (text: string, attachments: ConversationAttachment[]) => void;
}

export const MessageComposer = ({ onSend }: MessageComposerProps) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<ConversationAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    onSend(text.trim(), attachments);
    setText('');
    setAttachments([]);
  };

  return (
    <div className={composerStyles.composer}>
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
            placeholder="回复工程师…"
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
