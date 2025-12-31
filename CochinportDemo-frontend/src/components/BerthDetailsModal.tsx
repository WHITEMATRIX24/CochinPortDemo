type Props = {
  berthId: string;
  data: any;
  loading: boolean;
  onClose: () => void;
};

export default function BerthDetailsModal({
  berthId,
  data,
  loading,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-xl p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">
          Berth {berthId} – Vessel Timeline
        </h2>

        {loading ? (
          <p className="text-center py-10">Loading vessels...</p>
        ) : (
          <>
            {/* 🟢 CURRENT */}
            <section className="mb-4">
              <h3 className="font-semibold text-green-600 mb-2">
                Current Vessel
              </h3>
              {data?.current ? (
                <p>
                  {data.current.VslID} ({data.current.CargoType})
                </p>
              ) : (
                <p className="text-sm text-gray-500">No current vessel</p>
              )}
            </section>

            {/* 🔵 FUTURE */}
            <section className="mb-4">
              <h3 className="font-semibold text-blue-600 mb-2">
                Upcoming Vessels
              </h3>
              {data?.future?.length ? (
                data.future.map((v: any, i: number) => (
                  <p key={i}>
                    {v.VslID} – ATA{" "}
                    {v.ATA ? new Date(v.ATA).toLocaleString() : "Not Available"}
                  </p>
                ))
              ) : (
                <p className="text-sm text-gray-500">No upcoming vessels</p>
              )}
            </section>

            {/* ⚫ PAST */}
            <section>
              <h3 className="font-semibold text-gray-600 mb-2">
                Past Vessels
              </h3>
              {data?.past?.length ? (
                data.past.map((v: any, i: number) => (
                  <p key={i}>
                    {v.VslID} – Departed{" "}
                    {new Date(v.ATD).toLocaleString()}
                  </p>
                ))
              ) : (
                <p className="text-sm text-gray-500">No past vessels</p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
