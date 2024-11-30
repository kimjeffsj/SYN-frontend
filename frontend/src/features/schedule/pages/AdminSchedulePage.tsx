import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { Schedule, ShiftType } from "../types/schedule.type";
import {
  Calendar,
  Users,
  Filter,
  Search,
  CalendarPlus,
  SlidersHorizontal,
} from "lucide-react";
import { ScheduleCalendar } from "../components/ScheduleCalendar";
import { CreateScheduleForm } from "../components/CreateScheduleForm";
import { fetchAllSchedules } from "../slice/scheduleSlice";

interface FilterState {
  employee: string;
  shiftType: ShiftType | "";
  dateRange: {
    start: string;
    end: string;
  };
}

export const AdminSchedulePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { schedules, isLoading, error } = useSelector(
    (state: RootState) => state.schedule
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    employee: "",
    shiftType: "",
    dateRange: {
      start: "",
      end: "",
    },
  });

  useEffect(() => {
    dispatch(fetchAllSchedules());
  }, [dispatch]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Schedule Management
            </h1>
            <p className="text-gray-500 mt-1">Manage all employee schedules</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
            >
              <CalendarPlus className="w-5 h-5" />
              <span>New Schedule</span>
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg border mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Employee Filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search employee..."
                  className="pl-10 w-full border rounded-lg p-2"
                  value={filters.employee}
                  onChange={(e) =>
                    handleFilterChange("employee", e.target.value)
                  }
                />
              </div>

              {/* Shift Type Filter */}
              <select
                value={filters.shiftType}
                onChange={(e) =>
                  handleFilterChange("shiftType", e.target.value)
                }
                className="border rounded-lg p-2"
              >
                <option value="">All Shift Types</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="full_day">Full Day</option>
              </select>

              {/* Date Range Filter */}
              <div className="flex space-x-2">
                <input
                  type="date"
                  className="border rounded-lg p-2 flex-1"
                  value={filters.dateRange.start}
                  onChange={(e) =>
                    handleFilterChange("dateRange", {
                      ...filters.dateRange,
                      start: e.target.value,
                    })
                  }
                />
                <input
                  type="date"
                  className="border rounded-lg p-2 flex-1"
                  value={filters.dateRange.end}
                  onChange={(e) =>
                    handleFilterChange("dateRange", {
                      ...filters.dateRange,
                      end: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Schedule Calendar */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ScheduleCalendar />
      )}

      {/* Create Schedule Modal */}
      <CreateScheduleForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
