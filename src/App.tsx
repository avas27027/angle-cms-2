import { Route, Routes } from "react-router-dom";

import IndexPage from "./app/core/routes/index.tsx";
import Views from "./app/core/routes/views/views.tsx";
import SchemeTable from "./app/core/routes/schemeTable.tsx";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<Views />} path="/views" />
      <Route element={<SchemeTable />} path="/:path"></Route>
    </Routes>
  );
}

export default App;
