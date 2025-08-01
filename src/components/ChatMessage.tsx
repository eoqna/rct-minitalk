import type { Message } from '../types/chat'
import dayjs from 'dayjs'

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const messageTime = dayjs(message.createdAt).format('HH:mm')
  
  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return '⏳'
      case 'sent':
        return '✓'
      case 'failed':
        return '❌'
      default:
        return null
    }
  }
  
  return (
    <div 
      className={`flex ${message.isMine ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}
    >
      <div className={`max-w-[70%] ${message.isMine ? 'order-1' : 'order-2'}`}>
        <div
          className={`px-4 py-2 rounded-2xl transition-all duration-200 ${
            message.isMine
              ? 'bg-blue-500 text-white rounded-br-none animate-slide-left'
              : 'bg-gray-100 text-gray-900 rounded-bl-none animate-slide-right'
          }`}
        >
          <p className="break-words">{message.content}</p>
        </div>
        <div
          className={`flex items-center gap-1 text-xs text-gray-500 mt-1 ${
            message.isMine ? 'justify-end' : 'justify-start'
          }`}
        >
          {message.isMine && (
            <>
              {message.isRead && <span className="text-blue-500">읽음</span>}
              <span>{getStatusIcon()}</span>
            </>
          )}
          <span>{messageTime}</span>
        </div>
      </div>
    </div>
  )
} 