import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ProjectsPage } from './pages/ProjectsPage';
import './i18n';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProjectProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route
                path="/architectural"
                element={<ProjectsPage title="Architectural Projects" type="architectural" />}
              />
              <Route
                path="/structural"
                element={<ProjectsPage title="Structural Projects" type="structural" />}
              />
              <Route
                path="/surveying"
                element={<ProjectsPage title="Surveying Projects" type="surveying" />}
              />
              <Route
                path="/electrical"
                element={<ProjectsPage title="Electrical Projects" type="electrical" />}
              />
              <Route
                path="/mechanical"
                element={<ProjectsPage title="Mechanical Projects" type="mechanical" />}
              />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ProjectProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
