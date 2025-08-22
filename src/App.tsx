import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import styled from 'styled-components'
import { Header } from './components'

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Login = lazy(() => import('./pages/Login'))
const Chat = lazy(() => import('./pages/Chat'))

const App = () => {
  return (
    <Router>
      <Container>
        <Suspense fallback={<div></div>}>
          <Header />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </Suspense>
      </Container>
    </Router>
  )
}

export default App
