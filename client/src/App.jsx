import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Login from './pages/login.jsx'
import MainLayout from './layout/MainLayout.jsx'
import Herosection from './pages/student/Herosection.jsx'
import Courses from './pages/student/Courses.jsx'
import MyLearning from './pages/student/MyLearning.jsx'
import Profile from './pages/student/Profile.jsx'
import Sidebar from './pages/admin/Sidebar.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import CourseTable from './pages/admin/course/CourseTable.jsx'
import AddCourse from './pages/admin/course/AddCourse.jsx'
import EditCourse from './pages/admin/course/EditCourse.jsx'
import CourseDetail from './pages/student/CourseDetail'
import CourseProgress from './pages/student/CourseProgress'
import SearchPage from './pages/student/SearchPage'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoutes'
import { ThemeProvider } from './components/ThemeProvider'
import PurchaseCourseProtectedRoute from './components/PurchaseCourseProtectedRoute '
import ForgotPassword from './pages/ForgotPassword'
import TagTable from './pages/admin/tag/TagTable'
import AddTag from './pages/admin/tag/AddTag'
import EditTag from './pages/admin/tag/EditTag'
import LeadTable from './pages/admin/lead/LeadTable'
import AddLead from './pages/admin/lead/AddLead'
import EditLead from './pages/admin/lead/EditLead'
import Leads from './pages/admin/Leads'
import { ActivityIcon } from 'lucide-react'
import ActivityLog from './pages/admin/ActivityLog'
import AgentPerformance from './pages/admin/AgentPerformance'


const appRouter = createBrowserRouter([{
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/",
      element:
        <>
          <Herosection />
          <Courses />
        </>
    },
    {
      path: "login",
      element: <Login />
    },
    {
      path: "login/forgotpassword",
      element: <ForgotPassword />
    },
    {
      path: "mylearning",
      element: (
        <ProtectedRoute>
          <MyLearning />
        </ProtectedRoute>
      )
    },
    {
      path: "profile",
      element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      )
    },
    {
      path: "course/search",
      element: <ProtectedRoute>
        <SearchPage />
      </ProtectedRoute>
    },

    {
      path: "lead-detail/:leadId",
      element: (
        <ProtectedRoute>
          <CourseDetail />
        </ProtectedRoute>
      )
    },
    {
      path: "course-progress/:courseId",
      element: (<ProtectedRoute>
        <PurchaseCourseProtectedRoute>
          <CourseProgress />
        </PurchaseCourseProtectedRoute>
      </ProtectedRoute>)
    },
    {
      path: "allleads",
      element:
        <AdminRoute><Leads /></AdminRoute>,
    },

    {
      path: "admin",
      element: (
        <AdminRoute>
          <Sidebar />
        </AdminRoute>

      ),
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "course",
          element: <CourseTable />,
        },
        {
          path: "course/create",
          element: <AddCourse />
        },
        {
          path: "user/:userId",
          element: <EditCourse />
        },
        {
          path: "tag",
          element: <TagTable />,
        },
        {
          path: "tag/create",
          element: <AddTag />,
        },
        {
          path: "tag/:tagId",
          element: <EditTag />,
        },
        {
          path: "lead",
          element: <LeadTable />,
        },
        {
          path: "lead/create",
          element: <AddLead />,
        },
        {
          path: "lead/:leadId",
          element: <EditLead />,
        },
        {
          path: "activity-log",
          element: <ActivityLog />,
        },
        {
          path: "agent-performance",
          element: <AgentPerformance />,
        },


      ]
    }

  ]
}])

function App() {

  return (

    <main>
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  )
}

export default App
