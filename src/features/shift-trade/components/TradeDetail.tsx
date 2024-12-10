import React, { useState } from "react";
import {
  Clock,
  User,
  MessageSquare,
  CheckCircle,
  XCircle,
  History,
} from "lucide-react";

interface TimelineEvent {
  id: number;
  type: "create" | "update" | "approve" | "reject" | "comment";
  user: {
    name: string;
    position?: string;
  };
  timestamp: string;
  content: string;
}

interface RequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  requestType: "SHIFT_TRADE" | "LEAVE" | "OTHER";
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestor: {
    name: string;
    position?: string;
    avatar?: string;
  };
  timeline: TimelineEvent[];
  content: React.ReactNode;
  onApprove?: () => void;
  onReject?: () => void;
  onComment?: (comment: string) => void;
}

export default function RequestDetailModal({
  isOpen,
  onClose,
  title,
  requestType,
  status,
  requestor,
  timeline,
  content,
  onApprove,
  onReject,
  onComment,
}: RequestDetailModalProps) {
  const [comment, setComment] = useState("");
  const [showTimeline, setShowTimeline] = useState(false);

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "";
  };

  const getTimelineIcon = (type: TimelineEvent["type"]) => {
    const icons = {
      create: MessageSquare,
      update: Clock,
      approve: CheckCircle,
      reject: XCircle,
      comment: MessageSquare,
    };
    const Icon = icons[type];
    return <Icon className="w-4 h-4" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <div className="flex items-center mt-1 space-x-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(
                    status
                  )}`}
                >
                  {status}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-500 text-sm">
                  {requestType.replace("_", " ")}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <XCircle className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Requestor Info */}
            <div className="flex items-center space-x-4 mb-6">
              {requestor.avatar ? (
                <img
                  src={requestor.avatar}
                  alt={requestor.name}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
              )}
              <div>
                <h3 className="font-medium text-gray-900">{requestor.name}</h3>
                {requestor.position && (
                  <p className="text-gray-500">{requestor.position}</p>
                )}
              </div>
            </div>

            {/* Request Content */}
            <div className="mb-6">{content}</div>

            {/* Actions */}
            {status === "PENDING" && (
              <div className="border-t pt-6">
                <div className="flex space-x-4">
                  {onApprove && (
                    <button
                      onClick={onApprove}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </button>
                  )}
                  {onReject && (
                    <button
                      onClick={onReject}
                      className="flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Comment Section */}
            {onComment && (
              <div className="border-t pt-6 mt-6">
                <h4 className="font-medium text-gray-900 mb-4">Add Comment</h4>
                <div className="space-y-4">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border rounded-lg p-3 min-h-[100px]"
                    placeholder="Add your comment here..."
                  />
                  <button
                    onClick={() => {
                      onComment(comment);
                      setComment("");
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    Submit Comment
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Timeline Sidebar */}
          <div
            className={`border-l w-80 overflow-y-auto transition-all ${
              showTimeline ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Timeline</h3>
                <button
                  onClick={() => setShowTimeline(!showTimeline)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <History className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-6">
                {timeline.map((event) => (
                  <div key={event.id} className="relative">
                    <div className="flex items-start">
                      <div
                        className={`
                        p-2 rounded-full mr-3
                        ${
                          event.type === "approve"
                            ? "bg-green-100 text-green-600"
                            : event.type === "reject"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                        }
                      `}
                      >
                        {getTimelineIcon(event.type)}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-sm">
                            {event.user.name}
                          </span>
                          {event.user.position && (
                            <>
                              <span className="mx-1 text-gray-300">•</span>
                              <span className="text-gray-500 text-sm">
                                {event.user.position}
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          {event.content}
                        </p>
                        <span className="text-gray-400 text-xs mt-1">
                          {event.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
