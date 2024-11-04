import './App.css';
import './components/Matrix.js';
import Index from './components/Index.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Matrix from './components/Matrix.js';

function App() {
  return (
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/matrix" element={<Matrix />} />
      </Routes>
    </BrowserRouter>
  </>
  );
}

export default App;
