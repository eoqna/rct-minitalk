import { useState, useRef, useEffect, useCallback } from 'react'
import type { ApiResponse } from '../types'
import ChatMessage from '../components/ChatMessage'
import styled from 'styled-components'
import { supabase } from '../util/supabase'
import useAppStore from '../store/useAppStore'
import { useNavigate } from 'react-router-dom'

export const Container = styled.div`
  width: 100%;
  height: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #d0e7ff;
  min-height: -webkit-fill-available;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
`

export const MessageContainer = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #d0e7ff;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; // iOS 스크롤 부드럽게
  padding-bottom: env(safe-area-inset-bottom);
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #aaa;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`

export const MessageLayout = styled.div<{ $isMine: boolean }>`
  display: flex;
  max-width: calc(60% - 20px);
  padding: 10px;
  background-color: ${({ $isMine }) => $isMine ? 'yellow' : 'white'};
`

export const InputContainer = styled.form`
  display: flex;
  width: calc(100% - 20px);
  padding: 10px;
  background-color: #007bff;
  position: sticky;
  bottom: 0;
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
`

export const Input = styled.input`
  width: calc(100% - 16px);
  padding: 8px 12px;
  border: none;
  font-size: 16px;
  outline: none;
  margin-bottom: env(safe-area-inset-bottom);
`

interface MessageQueue {
  content: string
  timestamp: number
}

const SUBMIT_DELAY = 200 // 0.2초 디바운스

const Chat = () => {
  const { user } = useAppStore()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ApiResponse.Message[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageQueue = useRef<MessageQueue[]>([])
  const lastSubmitTime = useRef<number>(0)
  const messageContainerRef = useRef<HTMLDivElement>(null)
  const lastMessageId = useRef<number | null>(null)
  const navigate = useNavigate()

  useEffect(() =>{
    if (user?.user_id === 0) {
      navigate('/')
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getMessages = useCallback(async (isInitial: boolean = false) => {
    if (isLoading || (!hasMore && !isInitial)) return
    
    setIsLoading(true)
    try {
      let query = supabase
        .from('tb_message')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(40);

      if (!isInitial && lastMessageId.current) {
        query = query.lt('message_id', lastMessageId.current);
      }

      const { data, error } = await query;

      if (error) {
        console.error('메시지 로드 중 오류 발생:', error);
        return;
      }

      if (!data || data.length === 0) {
        setHasMore(false)
        return;
      }

      const sortedData = [...data].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      if (isInitial) {
        setMessages(sortedData)
      } else {
        setMessages(prev => [...sortedData, ...prev])
      }

      lastMessageId.current = data[data.length - 1].message_id;
      setHasMore(data.length === 40);
    } catch (error) {
      console.error('메시지 로드 중 오류 발생:', error);
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore])

  const handleScroll = useCallback(() => {
    if (!messageContainerRef.current) return;
    
    const { scrollTop } = messageContainerRef.current;
    if (scrollTop === 0 && hasMore && !isLoading) {
      getMessages(false);
    }
  }, [getMessages, hasMore, isLoading])

  useEffect(() => {
    const messageContainer = messageContainerRef.current;
    if (messageContainer) {
      messageContainer.addEventListener('scroll', handleScroll);
      return () => messageContainer.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll])

  useEffect(() => {
    // 초기 메시지 로드
    getMessages(true)

    // 실시간 구독 설정
    const channel = supabase
      .channel('realtime-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tb_message'
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as ApiResponse.Message])
          console.log(payload.new)
        }
      )
      .subscribe((status) => {
      console.log('실시간 구독 상태:', status)
      
      if (status === 'SUBSCRIBED') {
        console.log('실시간 구독이 성공적으로 시작되었습니다.')
      } else if (status === 'CLOSED') {
        console.log('실시간 구독이 종료되었습니다.')
      } else if (status === 'CHANNEL_ERROR') {
        console.error('실시간 구독 중 오류가 발생했습니다.')
      }
    })

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      console.log('구독 해제 중...')
      channel.unsubscribe()
    }
  }, [])

  // 메시지 전송 함수
  const sendMessage = async (content: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('tb_message').insert({
        content,
        user_id: user?.user_id,
        created_at: new Date().toISOString(),
      })

      if (error) {
        console.error("메시지 전송 오류:", error)
        return false
      }
      
      console.log("메시지 전송 완료")
      return true
    } catch (err) {
      console.error("예상치 못한 오류:", err)
      return false
    }
  }

  // 메시지 큐 처리 함수
  const processMessageQueue = useCallback(async () => {
    if (isSubmitting || messageQueue.current.length === 0) return

    const now = Date.now()
    const nextMessage = messageQueue.current[0]

    // 디바운스 체크
    if (now - nextMessage.timestamp < SUBMIT_DELAY) {
      setTimeout(processMessageQueue, SUBMIT_DELAY)
      return
    }

    setIsSubmitting(true)

    try {
      const success = await sendMessage(nextMessage.content)
      if (success) {
        messageQueue.current.shift() // 성공한 메시지 제거
        lastSubmitTime.current = now
      }
    } finally {
      setIsSubmitting(false)
      
      // 큐에 남은 메시지가 있으면 계속 처리
      if (messageQueue.current.length > 0) {
        setTimeout(processMessageQueue, SUBMIT_DELAY)
      }
    }
  }, [isSubmitting, user])

  // 메시지 전송 핸들러
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedMessage = message.trim()
    if (!trimmedMessage) return

    // 메시지를 큐에 추가
    messageQueue.current.push({
      content: trimmedMessage,
      timestamp: Date.now()
    })

    // 입력창 즉시 초기화 (사용자 경험 개선)
    setMessage('')

    // 큐 처리 시작
    processMessageQueue()
  }, [message, processMessageQueue])

  return (
    <Container>
      {/* 채팅 영역 */}
      <MessageContainer ref={messageContainerRef}>
        {isLoading && hasMore && <div style={{ textAlign: 'center', padding: '10px' }}>메시지를 불러오는 중...</div>}
        {messages.map(msg => (
          <ChatMessage key={msg.message_id} message={msg} />
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
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
          placeholder="메시지를 입력하세요"
        />
      </InputContainer>
    </Container>
  )
} 

export default Chat;