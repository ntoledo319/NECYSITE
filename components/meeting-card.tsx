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
        background: "var(--nec-card)",
        border: "1px solid var(--nec-border)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
    >
      <div
        className="text-[var(--nec-text)] font-bold py-2 px-4 rounded-xl mb-3 text-sm uppercase tracking-wider"
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
          <p className="text-[var(--nec-muted)]">
            <span className="text-[var(--nec-muted)]">Time:</span> {meeting.time}
          </p>
          <p className="text-[var(--nec-muted)]">
            <span className="text-[var(--nec-muted)]">Location:</span> {meeting.location}
          </p>
          {meeting.address && (
            <p className="text-[var(--nec-muted)]">
              <span className="text-[var(--nec-muted)]">Address:</span> {meeting.address}
            </p>
          )}
          <p className="text-[var(--nec-muted)]">
            <span className="text-[var(--nec-muted)]">City:</span> {meeting.city}
          </p>
          {meeting.attendance && (
            <p className="text-[var(--nec-muted)]">
              <span className="text-[var(--nec-muted)]">Attendance:</span> {meeting.attendance}
            </p>
          )}
          {meeting.types && (
            <p className="text-[var(--nec-muted)]">
              <span className="text-[var(--nec-muted)]">Types:</span> {meeting.types}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
