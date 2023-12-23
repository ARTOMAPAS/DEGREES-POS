import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
import './assets/arrangeBranches'


//pages and components
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './pages/Login'
import Menu from './pages/Menu'
import Branch from './pages/Branch'
import BranchSettings from './pages/BranchSettings'
import Accounts from './pages/Accounts'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import BranchDashboard from './pages/BranchDashboard'
import BranchMenu from './pages/BranchMenu'
import DegreesMenu from './pages/DegreesMenu'
import BranchSales from './pages/BranchSales'
import BranchAccounts from './pages/BranchAccounts'
import Inventory from './pages/Inventory'
import BranchSalesReport from './pages/BranchSalesReport'

function App() {
  const { user } = useAuthContext();

  console.log(user)
  return (
    <div className="App">
        <BrowserRouter>
        <Navbar />
        <div className='pages'>
          <Routes>
            {/* Admin */}
            <Route path="/accounts" element={user && (user.user_type === 'Admin' || user.user_type === 'Manager')  ? <Accounts /> : <Navigate to="/" replace />}></Route>
            <Route path="/home" element={user && (user.user_type === 'Admin')  ? <Home /> : <Navigate to="/" replace />}></Route>
            <Route path="/branchdashboard" element={user && (user.user_type === 'Manager')  ? <BranchDashboard /> : <Navigate to="/" replace />}></Route>
            <Route path="/menu" element={user && (user.user_type === 'Admin' || user.user_type === 'Manager')  ? <Menu /> : <Navigate to="/" replace />}></Route>
            {/* Manager */}
            <Route path="/branchmenu" element={user && (user.user_type === 'Manager')  ? <BranchMenu /> : <Navigate to="/" replace />}></Route>
            <Route path="/branchSalesReport" element={user && (user.user_type === 'Manager')  ? <BranchSalesReport /> : <Navigate to="/" replace />}></Route>
            <Route path="/branchsales" element={user && (user.user_type === 'Manager')  ? <BranchSales /> : <Navigate to="/" replace />}></Route>
            <Route path="/inventory" element={user && (user.user_type === 'Manager')  ? <Inventory /> : <Navigate to="/" replace />}></Route>
            <Route path="/branch" element={user && (user.user_type === 'Admin' || user.user_type === 'Manager')  ? <Branch /> : <Navigate to="/" replace />}></Route>
            <Route path="/branchaccounts" element={user && (user.user_type === 'Manager')  ? <BranchAccounts /> : <Navigate to="/" replace />}></Route>
            <Route path="/branch/:branchId" element={user && (user.user_type === 'Admin' || user.user_type === 'Manager')  ? <BranchSettings /> : <Navigate to="/" replace />}></Route>
            <Route path="/degreesmenu" element={user && user.user_type === 'Cashier' ? <DegreesMenu /> : <Navigate to="/" replace />}></Route>
            <Route
              path="/"
              element={
                !user ? (
                  <Login />
                ) : user.user_type === 'Cashier' ? (
                  <Navigate to="/degreesmenu" replace />
                ) : user.user_type === 'Admin' ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Navigate to="/branchDashboard" replace />
                )
              }
            ></Route>
            <Route path="/forgotpassword"
              element={
                !user ? (
                  <ForgotPassword />
                ) : user.user_type === 'Cashier' ? (
                  <Navigate to="/degreesmenu" replace />
                ) : user.user_type === 'Admin' ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Navigate to="/branchDashboard" replace />
                )
              }
            ></Route>
            <Route path="/resetpassword/:id/:token"
              element={
                !user ? (
                  <ResetPassword />
                ) : user.user_type === 'Cashier' ? (
                  <Navigate to="/degreesmenu" replace />
                ) : user.user_type === 'Admin' ? (
                  <Navigate to="/home" replace />
                ) : (
                  <Navigate to="/branchDashboard" replace />
                )
              }
            ></Route>
          </Routes>
          
        </div>
        <Footer />
        </BrowserRouter>
    </div>
  );
}

export default App;
