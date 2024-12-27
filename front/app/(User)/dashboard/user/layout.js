import PrivateRoute from "../../../components/Routes/Private";

export default function UserLayout({ children }) {
  return (
    <PrivateRoute>
      {/* Render the admin dashboard if the user is authorized */}
      {children}
    </PrivateRoute>
  );
}
