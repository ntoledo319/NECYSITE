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
      className="nec-meeting-card rounded-[1.5rem] border border-[rgba(var(--nec-purple-rgb),0.10)] bg-[rgba(var(--nec-card-rgb),0.88)] p-4 shadow-[0_16px_34px_rgba(44,24,16,0.06)]"
      style={{ background: "rgba(var(--nec-card-rgb),0.88)" }}
    >
      <div
        className="mb-4 rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--nec-text)]"
        style={{
          background: "rgba(var(--nec-purple-rgb),0.08)",
          border: "1px solid rgba(var(--nec-purple-rgb),0.18)",
        }}
      >
        {day}
      </div>

      {meetings.map((meeting, index) => (
        <div
          key={`${day}-${meeting.name}-${index}`}
          className={`${index < meetings.length - 1 ? "mb-4 border-b border-[rgba(var(--nec-purple-rgb),0.08)] pb-4" : ""}`}
        >
          <h3 className="text-base font-semibold leading-6 text-[var(--nec-text)]">
            {meeting.url ? (
              <a
                href={meeting.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[var(--nec-purple)] hover:underline"
              >
                {meeting.name}
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            ) : (
              meeting.name
            )}
          </h3>

          <div className="mt-3 space-y-2 text-sm leading-6 text-[var(--nec-muted)]">
            <p>
              <span className="font-medium text-[var(--nec-text)]">Time:</span> {meeting.time}
            </p>
            <p>
              <span className="font-medium text-[var(--nec-text)]">Location:</span> {meeting.location}
            </p>
            {meeting.address && (
              <p>
                <span className="font-medium text-[var(--nec-text)]">Address:</span> {meeting.address}
              </p>
            )}
            <p>
              <span className="font-medium text-[var(--nec-text)]">City:</span> {meeting.city}
            </p>
            {meeting.attendance && (
              <p>
                <span className="font-medium text-[var(--nec-text)]">Attendance:</span> {meeting.attendance}
              </p>
            )}
            {meeting.types && (
              <p>
                <span className="font-medium text-[var(--nec-text)]">Types:</span> {meeting.types}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
