import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./page/HomePage.page";

import Layout from "./components/layout/LayOut.component";
import Department from "./page/Department.page";
import Job from "./page/Job.page";
import Employee from "./page/Employee.page";
import EmployeeDetail from "./page/EmployeeDetail.page";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="departments" element={<Department />} />
          <Route path="jobs" element={<Job />} />
          <Route path="employees" element={<Employee />} />
          <Route path="employee/:employeeId" element={<EmployeeDetail />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
