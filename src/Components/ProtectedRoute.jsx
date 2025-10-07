import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;




// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../Hooks/useAuth";

// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth();

//   // ✅ Show loading while checking localStorage
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-black text-white">
//         Loading...
//       </div>
//     );
//   }

//   // ✅ Redirect to login if no user
//   if (!user) return <Navigate to="/login" replace />;

//   return children;
// };

// export default ProtectedRoute;
