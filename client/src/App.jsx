import Journal from './pages/Journal.jsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage.jsx';
import GetStarted from './pages/GetStarted.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ChatbotPage from './pages/ChatbotPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Resources from './pages/Resources.jsx';
import DailyTasksPage from './pages/DailyTasksPage.jsx';
import MentalStatusReport from './pages/MentalStatusReport.jsx';
import ProgressActivity from './pages/ProgressActivity.jsx';

// Main App Component
function App() { 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/get-started" element={<GetStarted />} />
        
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/chatbot" 
          element={<ChatbotPage />} 
        />
        
        <Route 
          path="/journal" 
          element={
            <PrivateRoute>
              <Journal />
             </PrivateRoute>
          } 
        />

        <Route 
          path="/resources" 
          element={
            <PrivateRoute>
              <Resources />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/tasks" 
          element={
            <PrivateRoute>
              <DailyTasksPage />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/mental-status-report" 
          element={
            <PrivateRoute>
              <MentalStatusReport />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/progress-activity" 
          element={
            <PrivateRoute>
              <ProgressActivity />
            </PrivateRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;