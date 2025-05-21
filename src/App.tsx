import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PatientRegistration from './pages/PatientRegistration.tsx';
import PatientQuery from './pages/PatientQuery.tsx';
import PatientList from './pages/PatientList.tsx';
import { DatabaseProvider } from './context/DatabaseContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <DatabaseProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="register" element={<PatientRegistration />} />
              <Route path="query" element={<PatientQuery />} />
              <Route path="patients" element={<PatientList />} />
            </Route>
          </Routes>
        </Router>
      </DatabaseProvider>
    </ThemeProvider>
  );
}

export default App;