import { AppDispatch, RootState } from "@/app/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LeaveRequest, LeaveType } from "../types/leave.type";
import { createLeaveRequest, fetchMyLeaveRequests } from "../slice/leaveSlice";
import { toast } from "react-toastify";
import { filterLeaveRequests } from "../utils/leave.utils";
import { Plus, Search } from "lucide-react";
import { LeaveRequestList } from "../components/LeaveRequestList";
import { LeaveRequestForm } from "../components/LeaveRequestForm";
import { LeaveRequestDetail } from "../components/LeaveRequestDetail";

export const LeavePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { requests, isLoading, error } = useSelector(
    (state: RootState) => state.leave
  );

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null
  );

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    type: "all",
  });

  useEffect(() => {
    dispatch(fetchMyLeaveRequests());
  }, [dispatch]);

  const handleCreateRequest = async (data: {
    leave_type: LeaveType;
    start_date: string;
    end_date: string;
    reason: string;
  }) => {
    try {
      await dispatch(createLeaveRequest(data)).unwrap();
      toast.success("Leave request submitted successfully");
      setShowRequestModal(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit request"
      );
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredRequests = filterLeaveRequests(requests, filters);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
            <p className="text-gray-500 mt-1">
              Submit and manage your leave requests
            </p>
          </div>
          <button
            onClick={() => setShowRequestModal(true)}
            className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Request
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search requests..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-row gap-2 sm:gap-4">
            <select
              className="flex-1 sm:flex-none border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              className="flex-1 sm:flex-none border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20"
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="vacation">Vacation</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <p className="text-gray-500">No leave requests found</p>
        </div>
      ) : (
        <LeaveRequestList
          requests={filteredRequests}
          onRequestClick={(request) => setSelectedRequest(request)}
        />
      )}

      {/* Modals */}
      <LeaveRequestForm
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSubmit={handleCreateRequest}
      />

      {selectedRequest && (
        <LeaveRequestDetail
          isOpen={true}
          onClose={() => setSelectedRequest(null)}
          request={selectedRequest}
        />
      )}
    </div>
  );
};
