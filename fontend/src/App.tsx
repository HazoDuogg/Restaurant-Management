import { Route, Routes, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import LandingPage from "./pages/LandingPage"
import CustomerHistoryPage from "./pages/CustomerHistroryPage"
import AdminDashboardPage from "./pages/AdminDashboardPage"
import AdminMenuPage from "./pages/AdminMenuPage"
import AdminTablesPage from "./pages/AdminTablesPage"
import AdminStaffPage from "./pages/AdminStaffPage"
import CustomerReservationPage from "./pages/CustomerReservationPage"
import { useAuthStore } from "./state/auth"

function PrivateRoute({ children }: { children: React.JSX.Element }) {
  const token = useAuthStore((e) => e.accessToken);
  if (token) {
    return children;
  }
  else {
    return <Navigate to={'/login'} replace />;
  }
}

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/customer-history" element={<CustomerHistoryPage />} />
        <Route path="/customer-reservation" element={<CustomerReservationPage />} />
        <Route path="/admin" element={<PrivateRoute><AdminDashboardPage /></PrivateRoute>} />
        <Route path="/admin/menu" element={<PrivateRoute><AdminMenuPage /></PrivateRoute>} />
        <Route path="/admin/tables" element={<PrivateRoute><AdminTablesPage /></PrivateRoute>} />
        <Route path="/admin/staff" element={<PrivateRoute><AdminStaffPage /></PrivateRoute>} />
      </Routes>
    </div>
  )
}

export default App
