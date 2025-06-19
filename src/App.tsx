import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./page/HomePage.page";

import Layout from "./components/LayOut.component";
import DepartmentList from "./page/DepartmentList.page";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="departments" element={<DepartmentList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
