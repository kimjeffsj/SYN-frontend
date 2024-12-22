import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { Search } from "lucide-react";
import { LeaveRequestList } from "../components/LeaveRequestList";
import { LeaveRequestDetail } from "../components/LeaveRequestDetail";
import { fetchLeaveRequests, processLeaveRequest } from "../slice/leaveSlice";
import { LeaveRequest, LeaveRequestUpdate } from "../types/leave.type";
import { toast } from "react-toastify";

export const AdminLeavePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { requests, isLoading, error } = useSelector(
    (state: RootState) => state.leave
  );

  // State
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"pending" | "completed">(
    "pending"
  );
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
  });

  // Initial data load
  useEffect(() => {
    dispatch(
      fetchLeaveRequests(activeTab === "pending" ? "PENDING" : undefined)
    );
  }, [dispatch, activeTab]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredRequests = requests.filter((request) => {
    // Status filter based on active tab
    if (activeTab === "completed" && request.status === "PENDING") {
      return false;
    }
    if (activeTab === "pending" && request.status !== "PENDING") {
      return false;
    }

    // Type filter
    if (
      filters.type !== "all" &&
      request.leave_type.toLowerCase() !== filters.type.toLowerCase()
    ) {
      return false;
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        request.employee.name.toLowerCase().includes(searchLower) ||
        request.employee.department?.toLowerCase().includes(searchLower) ||
        request.reason?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const handleApprove = async (id: number, comment?: string) => {
    try {
      const updateData = {
        status: "APPROVED" as const,
        comment: comment || undefined,
      };

      await dispatch(
        processLeaveRequest({
          id,
          data: updateData,
        })
      ).unwrap();

      toast.success("Leave request approved successfully");
      await dispatch(
        fetchLeaveRequests(activeTab === "pending" ? "PENDING" : undefined)
      );
    } catch (error) {
      console.error("Complete error details:", error);
      toast.error("Failed to approve request");
    }
  };

  const handleReject = async (id: number, comment?: string) => {
    try {
      const data: LeaveRequestUpdate = {
        status: "REJECTED",
        comment: comment || undefined,
      };
      await dispatch(processLeaveRequest({ id, data })).unwrap();
      toast.success("Leave request rejected successfully");
      dispatch(
        fetchLeaveRequests(activeTab === "pending" ? "PENDING" : undefined)
      );
    } catch (error) {
      toast.error("Failed to reject request");
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-500 mt-1">
            Review and manage employee leave requests
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === "pending"
                ? "bg-primary text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Pending Requests
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              activeTab === "completed"
                ? "bg-primary text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Completed Requests
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by employee name or department..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
          </div>
          <select
            className="w-full sm:w-48 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20"
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="vacation">Vacation</option>
            <option value="on_leave">On Leave</option>
          </select>
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

      {/* Leave Request Detail Modal */}
      {selectedRequest && (
        <LeaveRequestDetail
          isOpen={true}
          onClose={() => setSelectedRequest(null)}
          request={selectedRequest}
          isAdmin={true}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default AdminLeavePage;
