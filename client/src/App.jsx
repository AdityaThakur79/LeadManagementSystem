import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/login.jsx';
import MainLayout from './layout/MainLayout.jsx';
import Herosection from './pages/student/Herosection.jsx';
import Courses from './pages/student/Courses.jsx';
import MyLearning from './pages/student/MyLearning.jsx';
import Profile from './pages/student/Profile.jsx';
import Sidebar from './pages/admin/Sidebar.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import CourseTable from './pages/admin/course/CourseTable.jsx';
import AddCourse from './pages/admin/course/AddCourse.jsx';
import EditCourse from './pages/admin/course/EditCourse.jsx';
import CourseDetail from './pages/student/CourseDetail';
import CourseProgress from './pages/student/CourseProgress';
import SearchPage from './pages/student/SearchPage';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoutes';
import { ThemeProvider } from './components/ThemeProvider';
// import PurchaseCourseProtectedRoute from './components/PurchaseCourseProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import TagTable from './pages/admin/tag/TagTable';
import AddTag from './pages/admin/tag/AddTag';
import EditTag from './pages/admin/tag/EditTag';
import LeadTable from './pages/admin/lead/LeadTable';
import AddLead from './pages/admin/lead/AddLead';
import EditLead from './pages/admin/lead/EditLead';
import Leads from './pages/admin/Leads';
import { ActivityIcon } from 'lucide-react';
import ActivityLog from './pages/admin/ActivityLog';
import AgentPerformance from './pages/admin/AgentPerformance';
import Forbidden from './components/Forbidden.jsx';
import { useSelector } from 'react-redux';
import VerifyOTP from './pages/VerifyOTP';

const DeactiveUserRoute = ({ component: Component, userStatus }) => {
  if (userStatus === null) {
    return <Navigate to="/login" />
  }
  if (!userStatus) {
    return <Navigate to="/403" />;
  }
  return <Component />;
};

function App() {
  const { user } = useSelector(store => store.auth);
  const userStatus = user ? user.status : null
  return (
    <main>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<><DeactiveUserRoute component={Herosection} userStatus={userStatus} /><DeactiveUserRoute component={Courses} userStatus={userStatus} /> </>} />
              <Route path="login" element={<Login />} />
              <Route path="verify-otp" element={<VerifyOTP />} />
              <Route path="login/forgotpassword" element={<ForgotPassword />} />
              <Route path="mylearning" element={<ProtectedRoute><DeactiveUserRoute component={MyLearning} userStatus={userStatus} /></ProtectedRoute>} />
              <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="lead-detail/:leadId" element={<ProtectedRoute><DeactiveUserRoute component={CourseDetail} userStatus={userStatus} /></ProtectedRoute>} />
              {/* <Route path="course-progress/:courseId" element={<ProtectedRoute><PurchaseCourseProtectedRoute><CourseProgress /></PurchaseCourseProtectedRoute></ProtectedRoute>} /> */}
              <Route path="allleads" element={<AdminRoute><DeactiveUserRoute component={Leads} userStatus={userStatus} /></AdminRoute>} />
              <Route path="403" element={<Forbidden />} />

              <Route path="admin" element={<AdminRoute><DeactiveUserRoute component={Sidebar} userStatus={userStatus} /></AdminRoute>}>
                <Route path="dashboard" element={<DeactiveUserRoute component={Dashboard} userStatus={userStatus} />} />
                <Route path="course" element={<DeactiveUserRoute component={CourseTable} userStatus={userStatus} />} />
                <Route path="course/create" element={<DeactiveUserRoute component={AddCourse} userStatus={userStatus} />} />
                <Route path="user/:userId" element={<DeactiveUserRoute component={EditCourse} userStatus={userStatus} />} />
                <Route path="tag" element={<DeactiveUserRoute component={TagTable} userStatus={userStatus} />} />
                <Route path="tag/create" element={<DeactiveUserRoute component={AddTag} userStatus={userStatus} />} />
                <Route path="tag/:tagId" element={<DeactiveUserRoute component={EditTag} userStatus={userStatus} />} />
                <Route path="lead" element={<DeactiveUserRoute component={LeadTable} userStatus={userStatus} />} />
                <Route path="lead/create" element={<DeactiveUserRoute component={AddLead} userStatus={userStatus} />} />
                <Route path="lead/:leadId" element={<DeactiveUserRoute component={EditLead} userStatus={userStatus} />} />
                <Route path="activity-log" element={<DeactiveUserRoute component={ActivityLog} userStatus={userStatus} />} />
                <Route path="agent-performance" element={<DeactiveUserRoute component={AgentPerformance} userStatus={userStatus} />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </main>
  );
}

export default App;
