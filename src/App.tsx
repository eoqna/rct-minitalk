import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'

const Login = lazy(() => import('./pages/Login'))
const Chat = lazy(() => import('./pages/Chat'))

function App() {
  return (
    <Router>
      <div className="container-mobile">
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  )
}

export default App
