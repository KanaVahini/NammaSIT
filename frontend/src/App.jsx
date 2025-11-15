import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Interests from './pages/Interests'
import ClassResources from './pages/classResources'
import '../templatemo-electric-xtra.css'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/interests" element={<Interests />} />
        <Route path="/class-resources" element={<ClassResources />} />
      </Routes>
    </Router>
  )
}
