import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import toast from 'react-hot-toast';

const LeaveRequests = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'sick',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const queryClient = useQueryClient();

  const { data: leaves, isLoading } = useQuery({
    queryKey: ['leaves'],
    queryFn: () => api.get('/leaves').then(res => res.data)
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/leaves', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['leaves']);
      toast.success('Leave request submitted successfully');
      setShowModal(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to submit leave request');
    }
  });

  const approveMutation = useMutation({
    mutationFn: (id) => api.put(`/leaves/${id}/approve`, { comments: 'Approved' }),
    onSuccess: () => {
      queryClient.invalidateQueries(['leaves']);
      toast.success('Leave request approved');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to approve leave request');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => api.put(`/leaves/${id}/reject`, { comments: 'Rejected' }),
    onSuccess: () => {
      queryClient.invalidateQueries(['leaves']);
      toast.success('Leave request rejected');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to reject leave request');
    }
  });

  const resetForm = () => {
    setFormData({
      leaveType: 'sick',
      startDate: '',
      endDate: '',
      reason: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const canApprove = user?.role === 'admin' || user?.role === 'hr';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
          <p className="mt-1 text-sm text-gray-600">
            {canApprove ? 'Manage employee leave requests' : 'Submit and track your leave requests'}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Request Leave
        </button>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leave Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reason
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              {canApprove && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={canApprove ? 6 : 5} className="px-6 py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : leaves?.data?.length === 0 ? (
              <tr>
                <td colSpan={canApprove ? 6 : 5} className="px-6 py-4 text-center text-gray-500">
                  No leave requests found
                </td>
              </tr>
            ) : (
              leaves?.data?.map((leave) => (
                <tr key={leave._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {leave.employee?.firstName} {leave.employee?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {leave.employee?.employeeId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {leave.leaveType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {leave.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(leave.status)}`}>
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                  </td>
                  {canApprove && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {leave.status === 'pending' && (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => approveMutation.mutate(leave._id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectMutation.mutate(leave._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Request Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Request Leave</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                  <select
                    name="leaveType"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.leaveType}
                    onChange={handleChange}
                  >
                    <option value="sick">Sick Leave</option>
                    <option value="vacation">Vacation</option>
                    <option value="personal">Personal</option>
                    <option value="maternity">Maternity</option>
                    <option value="paternity">Paternity</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      value={formData.endDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  <textarea
                    name="reason"
                    rows={3}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={formData.reason}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {createMutation.isLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequests;
