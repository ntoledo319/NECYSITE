export default function MotionHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <header className={`${className} page-enter-1`}>{children}</header>
}
