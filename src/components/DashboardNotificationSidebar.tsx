'use client';

import { X, Bell, AlertTriangle, CheckCircle, Package } from 'lucide-react';

type Props = {
  show: boolean;
  onClose: () => void;
};

export default function DashboardNotificationSidebar({ show, onClose }: Props) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          show ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 border-l ${
          show ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notification list */}
          <ul className="mt-4 flex-1 overflow-y-auto space-y-4">
            <li className="flex items-start gap-3 bg-gray-50 p-3 rounded-md border border-gray-200">
              <Bell className="text-blue-600 w-5 h-5 mt-1" />
              <div>
                <p className="text-sm text-gray-800">
                  <strong>Ocean Queen</strong> has <span className="text-blue-700 font-medium">arrived</span> at <strong>Berth 5</strong>.
                </p>
                <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
              </div>
            </li>

            <li className="flex items-start gap-3 bg-gray-50 p-3 rounded-md border border-gray-200">
              <Package className="text-yellow-600 w-5 h-5 mt-1" />
              <div>
                <p className="text-sm text-gray-800">
                  Cargo <strong>loading completed</strong> at <strong>Berth 2</strong>.
                </p>
                <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
              </div>
            </li>

            <li className="flex items-start gap-3 bg-gray-50 p-3 rounded-md border border-gray-200">
              <AlertTriangle className="text-red-600 w-5 h-5 mt-1" />
              <div>
                <p className="text-sm text-gray-800">
                  <strong>Delay</strong> reported at <strong>Berth 7</strong> due to weather.
                </p>
                <p className="text-xs text-gray-400 mt-1">30 minutes ago</p>
              </div>
            </li>

            <li className="flex items-start gap-3 bg-gray-50 p-3 rounded-md border border-gray-200">
              <CheckCircle className="text-green-600 w-5 h-5 mt-1" />
              <div>
                <p className="text-sm text-gray-800">
                  <strong>Maintenance</strong> completed at <strong>Berth 3</strong>.
                </p>
                <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
              </div>
            </li>
          </ul>

          {/* Footer */}
          <div className="mt-4 border-t pt-3 text-right">
            <button
              onClick={onClose}
              className="bg-[#003049] hover:bg-[#022b3a] text-white text-sm font-medium px-4 py-2 rounded-md transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
