import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ForgotPassword } from "./pages/Login/Forget";
import { ResetPassword } from "./pages/Login/Reset";
import { Homeuser } from "./pages/Admin/Home/Home";
import { DisplayEmployees } from "./pages/Admin/Employee/DisplayEmployee";
import { DisplayCCTV } from "./pages/Admin/Product/CCTV/CCTV";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignUpPage } from "./pages/SignUp/SignUpPage";
import { DisplayUsers } from "./pages/Admin/User/User";
import { OrderList } from "./pages/Admin/Order/Order";
import { DisplayEmployeesUsers } from "./pages/Users/UserEmployee";
import { HomeuserUser } from "./pages/Users/UserHome";
import { UserProduct } from "./pages/Users/UserProduct";
import { UserOrderList } from "./pages/Users/UserOrders";
import { Homeemployee } from "./pages/Employee/EmployeeHome";
import { DisplayEmployeesEmployee } from "./pages/Employee/DisplayEmployee";
import { DisplayProductEmployee } from "./pages/Employee/DisplayProduct";
import { EmployeeOrderList } from "./pages/Employee/DisplayEmployeeOrder";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/adminhome" element={<Homeuser />} />
        <Route path="/employeehome" element={<Homeemployee />} />
        <Route path="/eemployees" element={<DisplayEmployeesEmployee />} />
        <Route path="/productemployees" element={<DisplayProductEmployee />} />
        <Route path="/ordersemployees" element={<EmployeeOrderList />} />


        <Route path="/employees" element={<DisplayEmployees />} />
        <Route path="/product" element={<DisplayCCTV />} />
        <Route path="/users" element={<DisplayUsers />} />
        <Route path="/orders" element={<OrderList />} />
        <Route path="/useremployees" element={<DisplayEmployeesUsers />} />
        <Route path="/" element={<HomeuserUser />} />
        <Route path="/userproduct" element={<UserProduct />} />
        <Route path="/userorder" element={<UserOrderList />} />


      </Routes>
    </Router>
  );
}

export default App;
