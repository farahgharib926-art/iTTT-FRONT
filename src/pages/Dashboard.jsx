// src/pages/Dashboard.jsx
import { useAuth } from "../context/AuthContext";
import CustomerDashboard from "./CustomerDashboard";
import StaffDashboard from "./StaffDashboard";

export default function Dashboard() {
  const { user } = useAuth();
  return user.role === "staff" ? <StaffDashboard /> : <CustomerDashboard />;
}
