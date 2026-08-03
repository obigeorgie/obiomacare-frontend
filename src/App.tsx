import { Routes, Route } from 'react-router-dom'
import AnatomyLab from './pages/AnatomyLab'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AnatomyLab />} />
      <Route path="/anatomy-lab" element={<AnatomyLab />} />
    </Routes>
  )
}
