import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { RequireAuth } from './components/layout/RequireAuth'

// One lazy chunk per environment keeps the first load small.
const Discover = lazy(() => import('./pages/discover/Discover'))
const ResearchList = lazy(() => import('./pages/research/ResearchList'))
const ResearchDetail = lazy(() => import('./pages/research/ResearchDetail'))
const ProjectList = lazy(() => import('./pages/innovate/ProjectList'))
const ProjectDetail = lazy(() => import('./pages/innovate/ProjectDetail'))
const Collaborate = lazy(() => import('./pages/collaborate/Collaborate'))
const WorkspaceDetail = lazy(() => import('./pages/collaborate/WorkspaceDetail'))
const PersonDetail = lazy(() => import('./pages/collaborate/PersonDetail'))
const Knowledge = lazy(() => import('./pages/knowledge/Knowledge'))
const DisciplineDetail = lazy(() => import('./pages/knowledge/DisciplineDetail'))
const MyLayout = lazy(() => import('./pages/my/MyLayout'))
const MyOverview = lazy(() => import('./pages/my/MyOverview'))
const MySaved = lazy(() => import('./pages/my/MySaved'))
const MyProfile = lazy(() => import('./pages/my/MyProfile'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))
const LegalPage = lazy(() => import('./pages/legal/LegalPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/discover" replace />} />

        <Route path="discover" element={<Discover />} />

        <Route path="research" element={<ResearchList />} />
        <Route path="research/:id" element={<ResearchDetail />} />

        <Route path="innovate" element={<ProjectList />} />
        <Route path="innovate/:id" element={<ProjectDetail />} />

        <Route path="collaborate" element={<Collaborate />} />
        <Route path="collaborate/workspaces/:id" element={<WorkspaceDetail />} />
        <Route path="collaborate/people/:id" element={<PersonDetail />} />

        <Route path="knowledge" element={<Knowledge />} />
        <Route path="knowledge/:slug" element={<DisciplineDetail />} />

        <Route
          path="my"
          element={
            <RequireAuth>
              <MyLayout />
            </RequireAuth>
          }
        >
          <Route index element={<MyOverview />} />
          <Route path="saved" element={<MySaved />} />
          <Route path="profile" element={<MyProfile />} />
        </Route>

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="terms" element={<LegalPage doc="terms" />} />
        <Route path="privacy" element={<LegalPage doc="privacy" />} />
        <Route path="guidelines" element={<LegalPage doc="guidelines" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
