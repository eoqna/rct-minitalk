import { useState, useRef, useEffect } from 'react'
import type { Message } from '../types/chat'
import ChatMessage from '../components/ChatMessage'
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  width: 360px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #d0e7ff;
`

export const MessageContainer = styled.div`
  display: flex;
  width: 100%;
  height: 95%;
  background-color: #d0e7ff;
`

export const MessageLayout = styled.div<{ isMine: boolean }>`
  display: flex;
  max-width: calc(60% - 20px);
  padding: 10px;
  background-color: ${({ isMine }) => isMine ? 'yellow' : 'white'};
`

export const InputContainer = styled.form`
  display: flex;
  width: calc(100% - 20px);
  height: calc(5% - 20px);
  background-color: #007bff;
  padding: 10px;
`

export const Input = styled.input`
  width: calc(100% - 16px);
  padding: 4px 8px;
  border: none;
  font-size: 1.4vmin;
  outline: none;
`

// 테스트용 메시지 데이터
const initialMessages: Message[] = [
  {
    id: '1',
    content: '안녕하세요! 😊',
    type: 'text',
    createdAt: new Date(Date.now() - 60000 * 5),
    isMine: false,
    isRead: true,
    status: 'sent',
  },
  {
    id: '2',
    content: '안녕하세요~',
    type: 'text',
    createdAt: new Date(Date.now() - 60000 * 4),
    isMine: true,
    isRead: true,
    status: 'sent',
  },
  {
    id: '3',
    content: '😍',
    type: 'text',
    createdAt: new Date(Date.now() - 60000 * 3),
    isMine: false,
    isRead: true,
    status: 'sent',
  },
]

export default function Chat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateMessageStatus = (messageId: string) => {
    // 메시지 전송 상태 시뮬레이션
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? { ...msg, status: 'sent' as const }
            : msg
        )
      )
      // 상대방이 읽음 표시하는 것을 시뮬레이션
      setTimeout(() => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId
              ? { ...msg, isRead: true }
              : msg
          )
        )
      }, 2000)
    }, 1000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: message,
        type: 'text',
        createdAt: new Date(),
        isMine: true,
        status: 'sending',
      }
      setMessages(prev => [...prev, newMessage])
      setMessage('')
      simulateMessageStatus(newMessage.id)
    }
  }

  return (
    <Container>
      {/* 채팅 영역 */}
      <MessageContainer>
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </MessageContainer>

      {/* 입력 영역 */}
      <InputContainer onSubmit={handleSubmit}>
        <Input
          type="text"
          autoFocus
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit(e)
            }
          }}
        />
      </InputContainer>
    </Container>
  )
} 