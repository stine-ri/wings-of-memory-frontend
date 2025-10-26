import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import { Dashboard } from './Pages/Dashboard';
import { ProtectedRoute } from './Components/ProtectedRoute'; 
import { MemorialProvider } from './Contexts/MemorialContext';
import { PreviewPage } from './Pages/Preview';
import './App.css';

function App() {
  return (
    <MemorialProvider>
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Home />} />
<Route path="/preview/:memorialId" element={<PreviewPage />} />

        {/* Protected dashboard route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
    </MemorialProvider>
  );
}

export default App;
