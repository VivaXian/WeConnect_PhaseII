import { useState } from 'react';
import { Button } from '@filament/react/button';
import { Text } from '@filament/react/text';
import { usernameEditStyles } from './username-edit-sheet.css';

interface UsernameEditSheetProps {
  currentUsername: string;
  onClose: () => void;
  onSave: (newUsername: string) => void;
}

export const UsernameEditSheet = ({ currentUsername, onClose, onSave }: UsernameEditSheetProps) => {
  const [value, setValue] = useState(currentUsername);
  const trimmed = value.trim();
  const isValid = trimmed.length >= 2 && trimmed.length <= 20;
  const isUnchanged = trimmed === currentUsername;

  const handleSave = () => {
    if (isValid && !isUnchanged) {
      onSave(trimmed);
      onClose();
    }
  };

  return (
    <div className={usernameEditStyles.overlay} onClick={onClose}>
      <div className={usernameEditStyles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={usernameEditStyles.handle} />
        <div className={usernameEditStyles.header}>
          <Text variant="heading-xs">修改用户名</Text>
          <button type="button" className={usernameEditStyles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div className={usernameEditStyles.body}>
          <label className={usernameEditStyles.label} htmlFor="username-input">用户名</label>
          <input
            id="username-input"
            className={usernameEditStyles.input}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={20}
            autoFocus
            placeholder="请输入用户名"
          />
          <span className={usernameEditStyles.hint}>2–20 个字符，支持中英文、数字和下划线</span>
        </div>
        <div className={usernameEditStyles.footer}>
          <Button variant="primary" isDisabled={!isValid || isUnchanged} onPress={handleSave}>
            保存
          </Button>
        </div>
      </div>
    </div>
  );
};
