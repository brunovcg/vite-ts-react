import {
  // Navigate
  Outlet,
} from "react-router-dom";

export function AuthGuard() {
  // const isAuthenticated = localStorage.getItem('token'); // Simple check for now

  // if (!isAuthenticated) {
  //   return <Navigate to='/login' replace />;
  // }

  return <Outlet />;
}
