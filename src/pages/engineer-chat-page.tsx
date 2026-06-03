import { useState, useRef, useEffect } from 'react';
import { MiniProgramNav } from '../components/mini-program-nav';
import { engineerChatStyles as s } from './engineer-chat-page.css';

interface ChatMessage {
  id: number;
  sender: 'agent' | 'user';
  text: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    sender: 'agent',
    text: '您好！我是飞利浦医疗售后客服，很高兴为您服务。请问有什么可以帮助您？',
  },
];

interface EngineerChatPageProps {
  onBack: () => void;
}

export const EngineerChatPage = ({ onBack }: EngineerChatPageProps) => {
  const [view, setView] = useState<'join' | 'chat'>('join');
  const [roomNumber, setRoomNumber] = useState('');
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const canJoin = roomNumber.trim().length > 0 && password.trim().length > 0;

  const handleJoin = () => {
    if (!canJoin) return;
    setView('chat');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'agent',
          text: '您的问题已收到，工程师将尽快为您回复。如需紧急支持，请拨打服务热线 400-800-8888。',
        },
      ]);
    }, 1000);
  };

  if (view === 'join') {
    return (
      <div className={s.page}>
        <MiniProgramNav variant="back" title="工程师助手" onBack={onBack} />
        <div className={s.joinBackdrop}>
          <div className={s.joinBannerArea}>
            <div className={s.joinBannerIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className={s.joinBannerTitle}>对话工程师</span>
            <span className={s.joinBannerSub}>飞利浦医疗售后服务</span>
          </div>
        </div>
        <div className={s.joinPanel}>
          <span className={s.joinPanelTitle}>加入聊天室</span>
          <span className={s.joinPanelSub}>请输入短信中收到的聊天室号和密码</span>
          <div className={s.joinField}>
            <label className={s.joinLabel}>聊天室号</label>
            <input
              className={s.joinInput}
              type="text"
              placeholder="请输入聊天室号"
              value={roomNumber}
              onChange={e => setRoomNumber(e.target.value)}
              aria-label="聊天室号"
            />
          </div>
          <div className={s.joinField}>
            <label className={s.joinLabel}>密码</label>
            <input
              className={s.joinInput}
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleJoin(); }}
              aria-label="密码"
            />
          </div>
          <button className={s.joinSubmitBtn} onClick={handleJoin} disabled={!canJoin}>
            进入聊天室
          </button>
          <button className={s.joinCancelLink} onClick={onBack}>取消</button>
        </div>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <MiniProgramNav variant="back" title="对话工程师" onBack={onBack} />
      <div className={s.statusRow}>
        <span className={s.onlineDot} />
        <span className={s.statusText}>客服在线 · 聊天室 {roomNumber}</span>
      </div>

      <div className={s.messages}>
        {messages.map(msg => (
          <div key={msg.id} className={msg.sender === 'user' ? s.userBubbleWrap : s.agentBubbleWrap}>
            <span className={msg.sender === 'user' ? s.userBubble : s.agentBubble}>
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={s.inputArea}>
        <input
          className={s.inputField}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          placeholder="输入消息..."
          aria-label="消息输入"
        />
        <button className={s.sendBtn} onClick={handleSend}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};
