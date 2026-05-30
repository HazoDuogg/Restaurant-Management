import { Route, Routes, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import LandingPage from "./pages/LandingPage"
import CustomerHistoryPage from "./pages/CustomerHistroryPage"
import AdminDashboardPage from "./pages/AdminDashboardPage"
import AdminMenuPage from "./pages/AdminMenuPage"
import AdminTablesPage from "./pages/AdminTablesPage"
import AdminStaffPage from "./pages/AdminStaffPage"
import AdminReportPage from "./pages/AdminReportPage"
import CustomerReservationPage from "./pages/CustomerReservationPage"
import StaffTablesPage from "./pages/StaffTablesPage"
import StaffOrderPage from "./pages/StaffOrderPage"
import StaffOrderDetailPage from "./pages/StaffOrderDetailPage"
import StaffPaymentPage from "./pages/StaffPaymentPage"
import { useAuthStore } from "./state/auth"
import AdminReservationsPage from "./pages/AdminReservationPage"

function PrivateRoute({ children }: { children: React.JSX.Element }) {
  const token = useAuthStore((e) => e.accessToken);
  if (token) {
    return children;
  }
  else {
    return <Navigate to={'/login'} replace />;
  }
}

function AuthRole({ children, roles }: { children: React.JSX.Element, roles: string[] }) {
  const token = useAuthStore((e) => e.accessToken);
  const userRole = useAuthStore((e) => e.user?.role);
  if (token && roles.includes(userRole ?? "")) {
    return children;
  }
  else {
    return <Navigate to={'/'} replace />;
  }
}

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/customer-history" element={<PrivateRoute><CustomerHistoryPage /></PrivateRoute>} />
        <Route path="/reservation" element={<PrivateRoute><CustomerReservationPage /></PrivateRoute>} />
        <Route path="/admin" element={<AuthRole roles={["ADMIN"]}><AdminDashboardPage /></AuthRole>} />
        <Route path="/admin/menu" element={<AuthRole roles={["ADMIN"]}><AdminMenuPage /></AuthRole>} />
        <Route path="/admin/tables" element={<AuthRole roles={["ADMIN"]}><AdminTablesPage /></AuthRole>} />
        <Route path="/admin/staff" element={<AuthRole roles={["ADMIN"]}><AdminStaffPage /></AuthRole>} />
        <Route path="/admin/report" element={<AuthRole roles={["ADMIN"]}><AdminReportPage /></AuthRole>} />
        <Route path="/admin/reservations" element={<AuthRole roles={["ADMIN"]}><AdminReservationsPage /></AuthRole>} />
        <Route path="/staff/tables" element={<AuthRole roles={["ADMIN", "STAFF"]}><StaffTablesPage /></AuthRole>} />
        <Route path="/staff/order" element={<AuthRole roles={["ADMIN", "STAFF"]}><StaffOrderPage /></AuthRole>} />
        <Route path="/staff/order/detail" element={<AuthRole roles={["ADMIN", "STAFF"]}><StaffOrderDetailPage /></AuthRole>} />
        <Route path="/staff/payment" element={<AuthRole roles={["ADMIN", "STAFF"]}><StaffPaymentPage /></AuthRole>} />
      </Routes>
    </div>
  )
}

export default App
