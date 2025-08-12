import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Container } from '../util/style'
import { supabase } from '../util/supabase'
import useAppStore from '../store/useAppStore'

const Title = styled.h1`
  font-size: 3vmin;
  font-weight: bold;
  margin-bottom: 20px;
  color: white;
`

const InputContainer = styled.form``

const Input = styled.input`
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 10px;
  border: 0.5px solid #ccc;
  border-radius: 5px;
  outline: none;
`

const Button = styled.button`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid white;
  border-radius: 5px;
  background-color: white;
  color: #007bff;
  font-size: 1.5vmin;
  font-weight: bold;
  cursor: pointer;
`

const Login = () => {
  const { setUser } = useAppStore()
  const [pin, setPin] = useState('')
  const navigate = useNavigate()

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!pin.length || pin.length < 4) {
      alert('PIN 번호를 입력해주세요.')
      return
    }

    const { data, error } = await supabase.from('tb_user').select('*').eq('pin', pin)

    if (error) {
      console.log("error: ", error)
    } else {
      setUser(data[0])
      navigate('/chat')
    }
  }, [pin, navigate])

  return (
    <Container>
      <Title>미니톡</Title>
      <InputContainer onSubmit={handleSubmit}>
        <Input
          type="password"
          placeholder="PIN 번호를 입력하세요"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength={6}
          pattern="[0-9]*"
          inputMode="numeric"
        />
        <Button type="submit">
          입장하기
        </Button>
      </InputContainer>
    </Container>
  )
} 

export default Login