import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import InsightDashboard from './components/InsightDashboard';
import AICoachChat from './components/AICoachChat';
import QuickWinsLibrary from './components/QuickWinsLibrary';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<InsightDashboard />} />
          <Route path="/chat" element={<AICoachChat />} />
          <Route path="/quick-wins" element={<QuickWinsLibrary />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
