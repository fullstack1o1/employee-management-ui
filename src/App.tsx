import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./page/HomePage.page";
import DepartmentList from "./page/DepartmentList.page";
import Layout from "./components/LayOut.component";

function App() {
  return (
    <BrowserRouter>
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
