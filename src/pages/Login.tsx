import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { supabase } from '../util/supabase'
import useAppStore from '../store/useAppStore'
import logo from '../assets/imgs/logo.png'
import login from '../assets/imgs/login.png'

const Login = () => {
  const { setUser } = useAppStore()
  const [pin, setPin] = useState('')
  const navigate = useNavigate()

  const handleSubmit = useCallback(async () => {
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
      <InnerContainer>
        <ContentContainer>
          <Logo src={logo} alt="logo" />
          <InputContainer>
            <Label>이용자 PIN</Label>
            <Input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
              pattern="[0-9]*"
              inputMode="numeric"
            />
            <Button onClick={handleSubmit}>
              <ButtonImage src={login} alt="login" />
            </Button>
          </InputContainer>
        </ContentContainer>
      </InnerContainer>
    </Container>
  )
} 

const Container = styled.div`
  width: 100%;
  height: calc(97.5% - 8px);
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #007bff;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left); // iOS 노치 대응
`

const InnerContainer = styled.div`
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #79d6e2;
  border-radius: 4px;
`

const ContentContainer = styled.div`
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #e6f5f3;
  border-radius: 4px;
`

const Logo = styled.img`
  width: 100%;
  object-fit: contain;
`

const InputContainer = styled.div`
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Label = styled.span`
  font-size: 1.5vmin;
  color: #000;
`

const Input = styled.input`
  width: 50%;
  padding: 10px;
  outline: none;
  border-top-width: 2px;
  border-left-width: 2px;
  border-bottom-width: 1px;
  border-right-width: 1px;
  border-color: #000;
`

const Button = styled.div`
  width: 20%;
  display: flex;
  align-items: center;
  border: none;
  cursor: pointer;
`

const ButtonImage = styled.img`
  width: 100%;
  object-fit: contain;
`

export default Login