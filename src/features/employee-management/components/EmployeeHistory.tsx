import React, { useState } from "react";
import { Calendar, ArrowLeftRight } from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { TabPanelProps, HistoryTabProps } from "../types/employee.type";
import { StatusColor } from "@/shared/utils/status.utils";

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index} className="py-4">
      {value === index && children}
    </div>
  );
}

export const EmployeeHistory: React.FC<HistoryTabProps> = ({
  schedules,
  tradeRequests,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const renderScheduleHistory = () => (
    <div className="space-y-4">
      {schedules.map((schedule) => (
        <div
          key={schedule.id}
          className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <div className="font-medium">
                  {format(new Date(schedule.start_time), "PP")}
                </div>
                <div className="text-sm text-gray-500">
                  {format(new Date(schedule.start_time), "HH:mm")} -
                  {format(new Date(schedule.end_time), "HH:mm")}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <StatusBadge
                status={schedule.shift_type.toLowerCase() as StatusColor}
                size="sm"
              />
              <StatusBadge
                status={schedule.status.toLowerCase() as StatusColor}
                size="sm"
              />
            </div>
          </div>
        </div>
      ))}
      {schedules.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No schedule history available
        </div>
      )}
    </div>
  );

  const renderTradeHistory = () => (
    <div className="space-y-4">
      {tradeRequests.map((trade) => (
        <div
          key={trade.id}
          className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ArrowLeftRight className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <div className="font-medium">
                  {trade.type === "TRADE" ? "Shift Trade" : "Shift Giveaway"}
                </div>
                <div className="text-sm text-gray-500">
                  {format(new Date(trade.created_at), "PP")}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <StatusBadge
                status={trade.status.toLowerCase() as StatusColor}
                size="sm"
              />
              <StatusBadge
                status={trade.urgency.toLowerCase() as StatusColor}
                size="sm"
              />
            </div>
          </div>
          {trade.reason && (
            <div className="mt-2 text-sm text-gray-600">
              Reason: {trade.reason}
            </div>
          )}
        </div>
      ))}
      {tradeRequests.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No trade history available
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-6 border-t pt-6">
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveTab(0)}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            activeTab === 0
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Schedule History
        </button>
        <button
          onClick={() => setActiveTab(1)}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            activeTab === 1
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Trade History
        </button>
      </div>

      <TabPanel value={activeTab} index={0}>
        {renderScheduleHistory()}
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        {renderTradeHistory()}
      </TabPanel>
    </div>
  );
};
