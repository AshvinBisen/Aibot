import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes/Routes";
import { AuthProvider } from "./Hooks/useAuth";
function App() {
  return (
    <BrowserRouter>
      {/* Wrap all routes inside AuthProvider */}
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

// import React from "react";
// import { BrowserRouter } from "react-router-dom";
// import AppRoutes from "./Routes/Routes";

// function App() {
//   return (
//     <BrowserRouter>
//       <AppRoutes />
//     </BrowserRouter>
//   );
// }

// export default App;
