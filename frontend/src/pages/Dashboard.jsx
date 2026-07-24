import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();

  const { data: employees, isLoading: employeesLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: () => api.get('/employees').then(res => res.data),
    enabled: user?.role === 'admin' || user?.role === 'hr'
  });

  const { data: leaves, isLoading: leavesLoading } = useQuery({
    queryKey: ['leaves'],
    queryFn: () => api.get('/leaves').then(res => res.data),
    enabled: user?.role === 'admin' || user?.role === 'hr'
  });

  const { data: payroll, isLoading: payrollLoading } = useQuery({
    queryKey: ['payroll'],
    queryFn: () => api.get('/payroll').then(res => res.data),
    enabled: user?.role === 'admin' || user?.role === 'hr'
  });

  const stats = [
    {
      name: 'Total Employees',
      value: employees?.count || 0,
      loading: employeesLoading,
      color: 'bg-blue-500'
    },
    {
      name: 'Pending Leave Requests',
      value: leaves?.data?.filter(l => l.status === 'pending').length || 0,
      loading: leavesLoading,
      color: 'bg-yellow-500'
    },
    {
      name: 'Processed Payrolls',
      value: payroll?.data?.filter(p => p.status === 'processed').length || 0,
      loading: payrollLoading,
      color: 'bg-green-500'
    },
    {
      name: 'Active Employees',
      value: employees?.data?.filter(e => e.isActive).length || 0,
      loading: employeesLoading,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {user?.name}! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-md ${stat.color} flex items-center justify-center`}>
                    <span className="text-white text-sm font-medium">•</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stat.loading ? '...' : stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Leave Management</h3>
            <p className="text-sm text-gray-600 mb-4">
              View and manage employee leave requests
            </p>
            <a
              href="/leaves"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              View Leaves
            </a>
          </div>

          {(user?.role === 'admin' || user?.role === 'hr') && (
            <>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Employee Directory</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Manage employee records and information
                </p>
                <a
                  href="/employees"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  View Employees
                </a>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Payroll Processing</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Generate and manage employee payrolls
                </p>
                <a
                  href="/payroll"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  View Payroll
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
