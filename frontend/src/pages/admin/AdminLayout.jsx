import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('admin_user') || 'null');

  if (!user || !user.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Orders', path: '/admin/orders' },
    { name: 'Customers', path: '/admin/users' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-lg font-black tracking-tight">Admin Panel</h2>
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-widest">Management</span>
          
          <div className="mt-8 flex items-center">
            <div className="bg-orange-600 text-white p-2 rounded transform rotate-45 flex items-center justify-center w-10 h-10 shadow-lg relative z-10 hover:rotate-[225deg] transition-transform duration-700 cursor-pointer">
              <span className="font-extrabold text-lg transform -rotate-45 block mt-0.5 hover:-rotate-[225deg] transition-transform duration-700 cursor-pointer">M</span>
            </div>
            <div className="flex flex-col ml-3">
              <span className="font-bold text-[10px] leading-tight text-gray-400 uppercase tracking-widest">MERN</span>
              <span className="font-extrabold text-xl leading-none text-white tracking-tight">STORE</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={() => {
              localStorage.removeItem('admin_token');
              localStorage.removeItem('admin_user');
              navigate('/admin/login');
            }} 
            className="w-full bg-gray-800 hover:bg-red-600 text-white font-bold text-sm py-2.5 px-4 rounded-lg transition-colors border border-gray-700 hover:border-red-500"
          >
            Sign Out Securely
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 bg-gray-50 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
