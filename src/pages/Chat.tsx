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
  max-width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #d0e7ff;
`

export const MessageContainer = styled.div`
  width: 100%;
  height: 95%;
  display: flex;
  flex-direction: column;
  background-color: #d0e7ff;
  overflow-y: auto;
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

interface MessageQueue {
  content: string
  timestamp: number
}

const SUBMIT_DELAY = 200 // 1초 디바운스

const Chat = () => {
  const { user } = useAppStore()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ApiResponse.Message[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageQueue = useRef<MessageQueue[]>([])
  const lastSubmitTime = useRef<number>(0)
  const navigate = useNavigate()

  useEffect(() =>{
    if (!user) {
      navigate('/')
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getMessages = useCallback(async () => {
    const { data } = await supabase.from('tb_message').select('*').order('created_at', { ascending: true })
    setMessages(data || [])
  }, [])

  useEffect(() => {
    // 초기 메시지 로드
    getMessages()

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
        async (payload) => {
          console.log('새 메시지 감지:', payload)
          
          // 새로운 메시지 데이터 가져오기
          const { data: newMessage, error } = await supabase
            .from('tb_message')
            .select('*')
            .eq('message_id', payload.new.message_id)
            .single()

          if (error) {
            console.error('새 메시지 조회 실패:', error)
            return
          }

          if (newMessage) {
            console.log(newMessage)
            setMessages(prev => [...prev, newMessage])
          }
        }
      )

    // 구독 시작
    channel.subscribe((status) => {
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
        setMessage('') // 입력창 초기화
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

    // 큐 처리 시작
    processMessageQueue()
  }, [message, processMessageQueue])

  return (
    <Container>
      {/* 채팅 영역 */}
      <MessageContainer>
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