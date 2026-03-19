interface MeetingCardProps {
  day: string
  meetings: Array<{
    name: string
    time: string
    location: string
    city: string
    address: string
    types: string
    url?: string
    attendance?: string
  }>
}

export function MeetingCard({ day, meetings }: MeetingCardProps) {
  return (
    <div
      className="nec-meeting-card rounded-2xl p-4"
      style={{
        background: "linear-gradient(135deg, rgba(26,16,48,0.9) 0%, rgba(15,10,30,0.95) 100%)",
        border: "1px solid var(--nec-border)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      <div
        className="text-white font-bold py-2 px-4 rounded-xl mb-3 text-sm uppercase tracking-wider"
        style={{
          background: "rgba(124,58,237,0.12)",
          border: "1px solid rgba(124,58,237,0.25)",
        }}
      >
        {day}
      </div>

      {meetings.map((meeting, index) => (
        <div
          key={`${day}-${meeting.name}-${index}`}
          className={`${index < meetings.length - 1 ? "mb-4 pb-4 border-b" : ""}`}
          style={{ borderColor: "var(--nec-border)" }}
        >
          <h3 className="text-lg font-bold" style={{ color: "var(--nec-cyan)" }}>
            {meeting.url ? (
              <a href={meeting.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {meeting.name}<span className="sr-only"> (opens in new tab)</span>
              </a>
            ) : (
              meeting.name
            )}
          </h3>
          <p className="text-gray-300">
            <span className="text-gray-400">Time:</span> {meeting.time}
          </p>
          <p className="text-gray-300">
            <span className="text-gray-400">Location:</span> {meeting.location}
          </p>
          {meeting.address && (
            <p className="text-gray-300">
              <span className="text-gray-400">Address:</span> {meeting.address}
            </p>
          )}
          <p className="text-gray-300">
            <span className="text-gray-400">City:</span> {meeting.city}
          </p>
          {meeting.attendance && (
            <p className="text-gray-300">
              <span className="text-gray-400">Attendance:</span> {meeting.attendance}
            </p>
          )}
          {meeting.types && (
            <p className="text-gray-300">
              <span className="text-gray-400">Types:</span> {meeting.types}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
