import { Navigate, Route, Routes } from "react-router-dom";

import IndexPage from "./app/core/routes/index.tsx";
import Views from "./app/core/routes/views/views.tsx";
import SchemeTable from "./app/core/routes/schemeTable/schemeTable.tsx";
import { DocumentProvider } from "./app/shared/context/documentContext.tsx";
import { useAuth } from "./app/shared/context/authContext.tsx";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<PrivateRoute><Views /></PrivateRoute>} path="/views" />
      <Route element={<DocumentProvider><SchemeTable /></DocumentProvider>} path="/:path"></Route>
      <Route path="/error" element={<h1>error</h1>} />
    </Routes>
  );
}

export default App;

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/error" replace />;
};