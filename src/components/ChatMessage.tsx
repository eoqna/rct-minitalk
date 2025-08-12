import styled from 'styled-components'
import type { ApiResponse } from '../types'
import dayjs from 'dayjs'
import useAppStore from '../store/useAppStore';

interface ChatMessageProps {
  message: ApiResponse.Message
}

const Container = styled.div<{ $isMine: boolean }>`
  display: flex;
  margin-bottom: 1rem;
  animation: fade-in 0.5s ease-in-out;
  ${({ $isMine }) => $isMine && 'justify-content: flex-end'}
`;

const MessageLayout = styled.div<{ $isMine: boolean }>`
  max-width: 70%;
  order: ${({ $isMine }) => $isMine ? 1 : 2};
`;

const ContentLayout = styled.div<{ $isMine: boolean }>`
  padding: 8px 10px;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
  color: black;
  ${({ $isMine }) => $isMine 
    ? 'background: yellow; animation: slide-left 0.2s ease-in-out; margin-right: 8px;'
    : 'background: white; animation: slide-right 0.2s ease-in-out; margin-left: 8px;'
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
  ${({ $isMine }) => $isMine ? 'margin-right: 8px;' : 'margin-left: 8px;'}
`;

const ConfirmedText = styled.span``;

export default function ChatMessage({ message }: ChatMessageProps) {
  const { user } = useAppStore()
  const messageTime = dayjs(message.created_at).format('HH:mm')
  
  return (
    <Container $isMine={message.user_id === user?.user_id}>
      <MessageLayout $isMine={message.user_id === user?.user_id}>
        <ContentLayout $isMine={message.user_id === user?.user_id}>
          <MessageText>{message.content}</MessageText>
        </ContentLayout>
        <SideMessageLayout $isMine={message.user_id === user?.user_id}>
          {message.user_id === user?.user_id && (
            <>
              {/* {message.isRead && <ConfirmedText>읽음</ConfirmedText>} */}
              {/* <ConfirmedText>{getStatusIcon()}</ConfirmedText> */}
            </>
          )}
          <ConfirmedText>{messageTime}</ConfirmedText>
        </SideMessageLayout>
      </MessageLayout>
    </Container>
  )
} 