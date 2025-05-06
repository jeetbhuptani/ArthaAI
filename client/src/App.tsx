import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import About from './pages/About';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import SmoothScroll from './components/common/SmoothScroll';
import LearningChat from './pages/LearningChat';

function App() {
  return (
    <Router>
      <div className="w-full mx-auto p-4 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <SmoothScroll />
          <Routes>
            <Route path="/" element={<div>Welcome to Artha AI</div>} />
            <Route path="/about" element={<About />} />
            <Route path="/learning" element={<LearningChat />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;