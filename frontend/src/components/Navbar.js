import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import '../index.css';
import Degreeslogo from '../assets/degreeslogo.png';

const Navbar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();

    const handleLogout = () => {
        logout();
    };

    if (!user) {
        return null;
    }
    console.log(user)

    return (
        <header>
            <nav>
                {user && user.user_type && user.user_type.toLowerCase() === 'admin' && (
                   <div>
                    <div className='container'>
                        <Link to="/home">
                            <img src={Degreeslogo} width="50" alt="Degrees Logo" style={{ borderRadius: '50px' }} />
                        </Link>
                    </div>
                        <Link to="/menu">Menu</Link>
                        <Link to="/branch">Branches</Link>
                        <div className="dropdown">
                            <Link to="/reports">Reports</Link>
                        </div>
                        <div className="dropdown">
                            <Link to="/accounts">Accounts</Link>
                        </div>
                        <form className='search-form'>
                            <input className='search' type="text" placeholder="Search" />
                            <button type="submit">Search</button>
                        </form>
                    </div>
                )}
                {user && user.user_type && user.user_type.toLowerCase() === 'manager' && (
                    <div><div className='branch-container'>
                            <Link to="/branchdashboard">
                                <img src={Degreeslogo} width="50" alt="Degrees Logo" style={{ borderRadius: '50px' }} />
                            </Link>
                        </div>
                        <Link to="/branchmenu">Menu</Link>
                        <Link to="/branchsales">Sales</Link>
                        {/* <Link to="/add-cashier">Add Cashier</Link> */}
                        <div className="dropdown">
                            <Link to="/branchSalesReport">Reports</Link>
                        </div>
                        <div className="dropdown">
                            <Link to="/branchaccounts">Accounts</Link>
                        </div>
                        <Link to="/inventory">Inventory</Link>
                        <form className='search-form'>
                            <input className='search' type="text" placeholder="Search" />
                            <button type="submit">Search</button>
                        </form>
                    </div>
                )}
                {user && user.user_type && user.user_type.toLowerCase() === 'cashier' && (
                    <div>
                    <div className='cashier-container'>
                    <Link to="/home">
                        <img src={Degreeslogo} width="50" alt="Degrees Logo" style={{ borderRadius: '50px' }} />
                    </Link>
                    </div>
                    <div className='Cashier-header'>
                        <Link to="/menu">Menu</Link>
                    </div>
                    </div>
                )}
                {user && (
                    <div>
                        <button className='button-logout' onClick={handleLogout}>Logout</button>
                    </div>
                )}
                
            </nav>
        </header>
    );
};

export default Navbar;
