import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [pin, setPin] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin.length >= 4) {
      // TODO: PIN 검증 로직 추가
      navigate('/chat')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <h1 className="text-2xl font-bold mb-8">미니톡</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <input
          type="password"
          className="input mb-4"
          placeholder="PIN 번호를 입력하세요"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength={6}
          pattern="[0-9]*"
          inputMode="numeric"
        />
        <button type="submit" className="btn btn-primary w-full">
          입장하기
        </button>
      </form>
    </div>
  )
} 