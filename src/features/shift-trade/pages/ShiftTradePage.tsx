import { AppDispatch, RootState } from "@/app/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptGiveaway,
  cancelTradeRequest,
  createTradeResponse,
  fetchTradeRequest,
  fetchTradeRequests,
  updateResponseStatus,
} from "../slice/shiftTradeSlice";
import { TradeRequestCard } from "../components/TradeRequestCard";
import { TradeRequestModal } from "../components/TradeRequestModal";
import { Plus, Search } from "lucide-react";
import { ShiftTradeRequest } from "../types/shift-trade.type";
import { TradeDetail } from "../components/TradeDetail";
import { fetchMySchedules } from "@/features/schedule/slice/scheduleSlice";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

export default function ShiftTradePage() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { requests, isLoading, error } = useSelector(
    (state: RootState) => state.shiftTrade
  );
  const { schedules } = useSelector((state: RootState) => state.schedule);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchMySchedules());
  }, [dispatch]);

  // Filter States
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    type: "all",
  });

  // Modal States
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null
  );

  // Request Detail States
  const [selectedRequest, setSelectedRequest] =
    useState<ShiftTradeRequest | null>(null);

  // Initial data load
  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.search) params.search = filters.search;
    if (filters.status !== "all") params.status = filters.status;
    if (filters.type !== "all") params.type = filters.type;

    dispatch(fetchTradeRequests(params));
  }, [dispatch, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRespond = async (scheduleId: number) => {
    if (!selectedRequest) return;

    try {
      if (selectedRequest.type === "GIVEAWAY") {
        await dispatch(acceptGiveaway(selectedRequest.id)).unwrap();
        toast.success("Successfully accepted giveaway shift!");
      } else {
        await dispatch(
          createTradeResponse({
            tradeId: selectedRequest.id,
            data: {
              trade_request_id: selectedRequest.id,
              offered_shift_id: scheduleId,
            },
          })
        ).unwrap();
        toast.success("Successfully submitted trade response!");
      }

      await dispatch(fetchTradeRequests({}));
      setSelectedRequest(null);
    } catch (error) {
      console.error("Failed to respond to trade request: ", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to respond to trade request"
      );
    }
  };

  const handleUpdateResponseStatus = async (
    responseId: number,
    status: "ACCEPTED" | "REJECTED"
  ) => {
    console.log("ShiftTradePage - handleUpdateResponseStatus", {
      responseId,
      status,
    });

    if (!selectedRequest) {
      console.log("No selected request");
      return;
    }

    try {
      const result = await dispatch(
        updateResponseStatus({
          tradeId: selectedRequest.id,
          responseId,
          status,
        })
      ).unwrap();
      console.log("Status update dispatch result:", result);

      await dispatch(fetchTradeRequests({}));
    } catch (error) {
      console.error("Failed to update response status: ", error);
    }
  };

  const handleDeleteRequest = async (requestId: number) => {
    try {
      await dispatch(cancelTradeRequest(requestId)).unwrap();
      toast.success("Trade request deleted successfully");
      setSelectedRequest(null);
    } catch (error) {
      console.error("Failed to delete trade request: ", error);
      toast.error("Failed to delete trade request");
    }
  };

  useEffect(() => {
    const handleTradeSelection = async (tradeId: number) => {
      const found = requests.find((req) => req.id === tradeId);
      if (found) {
        setSelectedRequest(found);
      } else {
        try {
          const response = await dispatch(fetchTradeRequest(tradeId)).unwrap();
          setSelectedRequest(response);
          dispatch(fetchTradeRequests({}));
        } catch (error) {
          console.error("Failed to load trade request:", error);
          toast.error("Failed to load trade request details");
        }
      }
    };

    if (
      location.state?.from === "notification" &&
      // location.state?.id &&
      location.state?.openModal
    ) {
      handleTradeSelection(location.state.id);
    }
  }, [location.state, requests, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Shift Trade Board
              </h1>
              <p className="text-gray-500 mt-1">
                Request or respond to shift trades
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedScheduleId(1); // TODO: Replace with actual schedule ID
                setShowNewRequestModal(true);
              }}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Request
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name or date..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
            </div>
            <select
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="OPEN">Open</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <select
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20"
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="TRADE">Trade</option>
              <option value="GIVEAWAY">Giveaway</option>
            </select>
          </div>
        </div>

        {/* Request List */}
        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <p className="text-gray-500">No trade requests found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <TradeRequestCard
                key={request.id}
                request={request}
                onClick={() => setSelectedRequest(request)}
              />
            ))}
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {selectedScheduleId && (
        <TradeRequestModal
          isOpen={showNewRequestModal}
          onClose={() => {
            setShowNewRequestModal(false);
            setSelectedScheduleId(null);
          }}
          schedules={schedules}
        />
      )}
      {/* Trade Detail Modal */}
      {selectedRequest && (
        <TradeDetail
          isOpen={true}
          onClose={() => setSelectedRequest(null)}
          request={selectedRequest}
          onRespond={handleRespond}
          onUpdateStatus={handleUpdateResponseStatus}
          userSchedules={schedules}
          currentUserId={user?.id || 0}
          onDelete={handleDeleteRequest}
          onAcceptResponse={(responseId) =>
            handleUpdateResponseStatus(responseId, "ACCEPTED")
          }
          onRejectResponse={(responseId) =>
            handleUpdateResponseStatus(responseId, "REJECTED")
          }
        />
      )}
    </div>
  );
}
