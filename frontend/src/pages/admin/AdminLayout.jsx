import { NavLink, Outlet, Navigate } from 'react-router-dom';

export default function AdminLayout() {
  const user = JSON.parse(localStorage.getItem('mern_user') || 'null');

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
    <div className="flex min-h-[calc(100vh-180px)]">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-lg font-black tracking-tight">Admin Panel</h2>
          <span className="text-xs text-gray-500 font-semibold uppercase tracking-widest">Management</span>
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
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 bg-gray-50 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
