'use client';

import { X } from 'lucide-react';

type Props = {
  show: boolean;
  onClose: () => void;
};

export default function DashboardNotificationModal({ show, onClose }: Props) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg mx-auto rounded-xl shadow-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>

        {/* Body */}
        <ul className="space-y-2 text-sm text-gray-700">
          <li>🚢 Ship <strong>Ocean Queen</strong> arrived at <strong>Berth 5</strong>.</li>
          <li>📦 Cargo loading completed at <strong>Berth 2</strong>.</li>
          <li>⚠️ Delay reported at <strong>Berth 7</strong> due to weather.</li>
          <li>✅ Maintenance completed on <strong>Berth 3</strong>.</li>
        </ul>

        {/* Footer */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-blue-900 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
