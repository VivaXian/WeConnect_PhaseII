import { useState } from 'react';
import { Button } from '@filament/react/button';
import { Text } from '@filament/react/text';
import { webuddyLoginStyles } from './webuddy-login-sheet.css';

interface WebuddyLoginSheetProps {
  onClose: () => void;
}

export const WebuddyLoginSheet = ({ onClose }: WebuddyLoginSheetProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const canSubmit = email.trim().length > 0 && password.length > 0;

  return (
    <div className={webuddyLoginStyles.page}>
      <div className={webuddyLoginStyles.topBar}>
        <button type="button" className={webuddyLoginStyles.backBtn} onClick={onClose} aria-label="返回">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="#1a2234" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className={webuddyLoginStyles.brandBlock}>
        <Text variant="heading-m" className={webuddyLoginStyles.brandName}>We-Buddy</Text>
      </div>
      <div className={webuddyLoginStyles.form}>
        <label className={webuddyLoginStyles.label} htmlFor="webuddy-email">邮箱</label>
        <input
          id="webuddy-email"
          className={webuddyLoginStyles.input}
          type="email"
          inputMode="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="请输入邮箱"
        />
        <label className={webuddyLoginStyles.label} htmlFor="webuddy-password">密码</label>
        <input
          id="webuddy-password"
          className={webuddyLoginStyles.input}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="请输入密码"
        />
        <div className={webuddyLoginStyles.submitRow}>
          <Button variant="primary" isDisabled={!canSubmit}>登录</Button>
        </div>
      </div>
    </div>
  );
};
