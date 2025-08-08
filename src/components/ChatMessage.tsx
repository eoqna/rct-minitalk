import styled from 'styled-components'
import type { Message } from '../types/chat'
import dayjs from 'dayjs'

interface ChatMessageProps {
  message: Message
}

const Container = styled.div<{ $isMine: boolean }>`
  display: flex;
  margin-bottom: 4rem;
  animation: fade-in 0.5s ease-in-out;
  ${({ $isMine }) => $isMine && 'justify-content: flex-end'}
`;

const MessageLayout = styled.div<{ $isMine: boolean }>`
  max-width: 70%;
  order: ${({ $isMine }) => $isMine ? 1 : 2};
`;

const ContentLayout = styled.div<{ $isMine: boolean }>`
  padding: 8px 12px;
  border-radius: 12px;
  transition: all 0.2s ease-in-out;
  color: black;
  ${({ $isMine }) => $isMine 
    ? 'background: yellow; border-bottom-right-radius: 0; animation: slide-left 0.2s ease-in-out;'
    : 'background: white; border-bottom-left-radius: 0; animation: slide-right 0.2s ease-in-out;'
}
`;

const MessageText = styled.p``;

const SideMessageLayout = styled.div<{ $isMine: boolean }>`
  display: flex;
  margin-top: 4px;
  justify-content: ${({ $isMine }) => $isMine ? 'flex-end' : 'flex-start'};
  gap: 4px;
  font-size: 12px;
  color: #666;
`;

const ConfirmedText = styled.span``;

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
    <Container $isMine={message.isMine}>
      <MessageLayout $isMine={message.isMine}>
        <ContentLayout $isMine={message.isMine}>
          <MessageText>{message.content}</MessageText>
        </ContentLayout>
        <SideMessageLayout $isMine={message.isMine}>
          {message.isMine && (
            <>
              {message.isRead && <ConfirmedText>읽음</ConfirmedText>}
              <ConfirmedText>{getStatusIcon()}</ConfirmedText>
            </>
          )}
          <ConfirmedText>{messageTime}</ConfirmedText>
        </SideMessageLayout>
      </MessageLayout>
    </Container>
  )
} 