import AdminRoute from "../../../components/Routes/AdminRoute"

export default function AdminLayout({ children }) {
  return (
    <AdminRoute>
      {/* Render the admin dashboard if the user is authorized */}
      {children}
    </AdminRoute>
  );
}
