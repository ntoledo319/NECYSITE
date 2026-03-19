"use client"

import { useRef, useEffect, useState, useCallback } from "react"

/**
 * Pong — AA themed
 * "Carrying the Message" — keep the message going back and forth
 * Left paddle = "Speaker" (you)
 * Right paddle = "Newcomer" (AI)
 * Ball = "The Message"
 */

const CANVAS_W = 360
const CANVAS_H = 400
const PADDLE_W = 10
const PADDLE_H = 60
const BALL_R = 7
const PADDLE_MARGIN = 20
const PADDLE_SPEED = 5
const AI_SPEED = 3.2
const WIN_SCORE = 7

const PURPLE = "#7c3aed"
const PINK = "#c026d3"
const GOLD = "#eab308"
const CYAN = "#22d3ee"
const NAVY = "#0f0a1e"

const SLOGANS = [
  "CARRY THE MESSAGE",
  "KEEP COMING BACK",
  "IT WORKS IF YOU WORK IT",
  "ONE DAY AT A TIME",
  "EASY DOES IT",
  "FIRST THINGS FIRST",
  "LET GO AND LET GOD",
  "THINK THINK THINK",
  "HOW: HONEST OPEN WILLING",
  "LIVE AND LET LIVE",
]

function DPadButton({ label, ariaLabel, onDown, onUp, color = PURPLE }: { label: string; ariaLabel: string; onDown: () => void; onUp: () => void; color?: string }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onTouchStart={(e) => { e.preventDefault(); onDown() }}
      onTouchEnd={(e) => { e.preventDefault(); onUp() }}
      onTouchCancel={onUp}
      onMouseDown={onDown}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      className="flex items-center justify-center rounded-xl text-lg font-bold select-none active:scale-90 transition-transform"
      style={{
        width: 52,
        height: 52,
        background: color + "20",
        border: `2px solid ${color}50`,
        color,
        touchAction: "none",
      }}
    >
      {label}
    </button>
  )
}

function ServeButton({ onTap, color = GOLD }: { onTap: () => void; color?: string }) {
  return (
    <button
      type="button"
      aria-label="Serve the ball"
      onTouchStart={(e) => { e.preventDefault(); onTap() }}
      onClick={onTap}
      className="flex items-center justify-center rounded-xl text-xs font-bold select-none active:scale-90 transition-transform uppercase tracking-wide"
      style={{
        width: 72,
        height: 52,
        background: color + "20",
        border: `2px solid ${color}50`,
        color,
        touchAction: "none",
      }}
    >
      SERVE
    </button>
  )
}

export default function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playerScore, setPlayerScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [currentSlogan, setCurrentSlogan] = useState(SLOGANS[0])
  const gameRef = useRef({
    playerY: CANVAS_H / 2 - PADDLE_H / 2,
    aiY: CANVAS_H / 2 - PADDLE_H / 2,
    ballX: CANVAS_W / 2,
    ballY: CANVAS_H / 2,
    ballDX: 4,
    ballDY: 2,
    playerScore: 0,
    aiScore: 0,
    running: true,
    keys: {} as Record<string, boolean>,
    mouseY: -1,          // -1 means "not tracking"
    usingMouse: false,   // only follow mouse when actively on canvas
    rallyCount: 0,
    animId: 0,
    serveDelay: 0,
    serving: true,
    paddleDir: 0,        // d-pad: -1 up, 1 down, 0 none
  })

  const resetBall = useCallback((direction: number) => {
    const g = gameRef.current
    g.ballX = CANVAS_W / 2
    g.ballY = CANVAS_H / 2
    g.ballDX = 4 * direction
    g.ballDY = (Math.random() - 0.5) * 4
    g.rallyCount = 0
    g.serving = true
    g.serveDelay = 60
  }, [])

  const resetGame = useCallback(() => {
    const g = gameRef.current
    g.playerY = CANVAS_H / 2 - PADDLE_H / 2
    g.aiY = CANVAS_H / 2 - PADDLE_H / 2
    g.playerScore = 0
    g.aiScore = 0
    g.running = true
    g.rallyCount = 0
    g.mouseY = -1
    g.usingMouse = false
    g.paddleDir = 0
    setPlayerScore(0)
    setAiScore(0)
    setGameOver(false)
    setWon(false)
    setCurrentSlogan(SLOGANS[0])
    resetBall(1)
  }, [resetBall])

  const handleServe = useCallback(() => {
    const g = gameRef.current
    if (g.serving && g.serveDelay > 0) {
      g.serveDelay = 0
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const g = gameRef.current
    resetBall(1)

    const handleKeyDown = (e: KeyboardEvent) => {
      g.keys[e.key] = true
      if (["ArrowUp", "ArrowDown"].includes(e.key)) e.preventDefault()
      // Pressing a key disables mouse tracking so they don't fight
      if (["ArrowUp", "ArrowDown", "w", "s"].includes(e.key)) {
        g.usingMouse = false
      }
      // Space/Enter to serve
      if ((e.key === " " || e.key === "Enter") && g.serving) {
        e.preventDefault()
        handleServe()
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => { g.keys[e.key] = false }
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      g.mouseY = ((e.clientY - rect.top) / rect.height) * CANVAS_H
      g.usingMouse = true
    }
    const handleMouseLeave = () => {
      g.usingMouse = false
    }
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length === 0) return
      const rect = canvas.getBoundingClientRect()
      g.mouseY = ((e.touches[0].clientY - rect.top) / rect.height) * CANVAS_H
      g.usingMouse = true
    }
    const handleTouchEnd = () => {
      g.usingMouse = false
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)
    canvas.addEventListener("touchstart", handleTouch, { passive: true })
    canvas.addEventListener("touchmove", handleTouch, { passive: true })
    canvas.addEventListener("touchend", handleTouchEnd, { passive: true })
    canvas.addEventListener("touchcancel", handleTouchEnd, { passive: true })

    function loop() {
      if (!ctx || !g.running) return

      // Player input — keyboard
      if (g.keys["ArrowUp"] || g.keys["w"]) g.playerY -= PADDLE_SPEED
      if (g.keys["ArrowDown"] || g.keys["s"]) g.playerY += PADDLE_SPEED

      // Player input — d-pad buttons
      if (g.paddleDir !== 0) {
        g.playerY += g.paddleDir * PADDLE_SPEED
      }

      // Player input — mouse/touch (only when actively on canvas)
      if (g.usingMouse && g.mouseY >= 0) {
        const targetY = g.mouseY - PADDLE_H / 2
        g.playerY += (targetY - g.playerY) * 0.12
      }

      g.playerY = Math.max(0, Math.min(CANVAS_H - PADDLE_H, g.playerY))

      // AI
      const aiCenter = g.aiY + PADDLE_H / 2
      const targetAi = g.ballDX > 0 ? g.ballY : CANVAS_H / 2
      const aiDiff = targetAi - aiCenter
      const adjustedSpeed = AI_SPEED + Math.min(g.rallyCount * 0.1, 2)
      if (Math.abs(aiDiff) > 4) {
        g.aiY += Math.sign(aiDiff) * Math.min(adjustedSpeed, Math.abs(aiDiff))
      }
      g.aiY = Math.max(0, Math.min(CANVAS_H - PADDLE_H, g.aiY))

      // Serve delay
      if (g.serving) {
        g.serveDelay--
        if (g.serveDelay <= 0) g.serving = false
        // Don't move ball during serve
      } else {
        // Ball movement
        g.ballX += g.ballDX
        g.ballY += g.ballDY

        // Top/bottom bounce
        if (g.ballY - BALL_R < 0 || g.ballY + BALL_R > CANVAS_H) {
          g.ballDY *= -1
          g.ballY = Math.max(BALL_R, Math.min(CANVAS_H - BALL_R, g.ballY))
        }

        // Player paddle collision
        if (
          g.ballX - BALL_R < PADDLE_MARGIN + PADDLE_W &&
          g.ballX + BALL_R > PADDLE_MARGIN &&
          g.ballY > g.playerY &&
          g.ballY < g.playerY + PADDLE_H &&
          g.ballDX < 0
        ) {
          g.ballDX = Math.abs(g.ballDX) * 1.03
          const hitPos = (g.ballY - g.playerY) / PADDLE_H - 0.5
          g.ballDY = hitPos * 6
          g.rallyCount++
          setCurrentSlogan(SLOGANS[g.rallyCount % SLOGANS.length])
        }

        // AI paddle collision
        if (
          g.ballX + BALL_R > CANVAS_W - PADDLE_MARGIN - PADDLE_W &&
          g.ballX - BALL_R < CANVAS_W - PADDLE_MARGIN &&
          g.ballY > g.aiY &&
          g.ballY < g.aiY + PADDLE_H &&
          g.ballDX > 0
        ) {
          g.ballDX = -Math.abs(g.ballDX) * 1.03
          const hitPos = (g.ballY - g.aiY) / PADDLE_H - 0.5
          g.ballDY = hitPos * 6
          g.rallyCount++
          setCurrentSlogan(SLOGANS[g.rallyCount % SLOGANS.length])
        }

        // Scoring
        if (g.ballX < -20) {
          g.aiScore++
          setAiScore(g.aiScore)
          if (g.aiScore >= WIN_SCORE) {
            g.running = false
            setGameOver(true)
            return
          }
          resetBall(1)
        }
        if (g.ballX > CANVAS_W + 20) {
          g.playerScore++
          setPlayerScore(g.playerScore)
          if (g.playerScore >= WIN_SCORE) {
            g.running = false
            setWon(true)
            setGameOver(true)
            return
          }
          resetBall(-1)
        }

        // Speed cap
        const speed = Math.sqrt(g.ballDX ** 2 + g.ballDY ** 2)
        if (speed > 10) {
          g.ballDX *= 10 / speed
          g.ballDY *= 10 / speed
        }
      }

      // Draw
      ctx.fillStyle = NAVY
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // Center line
      ctx.setLineDash([6, 8])
      ctx.strokeStyle = "rgba(124,58,237,0.15)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(CANVAS_W / 2, 0)
      ctx.lineTo(CANVAS_W / 2, CANVAS_H)
      ctx.stroke()
      ctx.setLineDash([])

      // Center circle
      ctx.beginPath()
      ctx.arc(CANVAS_W / 2, CANVAS_H / 2, 40, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(124,58,237,0.08)"
      ctx.lineWidth = 1.5
      ctx.stroke()

      // AA triangle in center
      ctx.save()
      ctx.globalAlpha = 0.06
      ctx.beginPath()
      ctx.moveTo(CANVAS_W / 2, CANVAS_H / 2 - 25)
      ctx.lineTo(CANVAS_W / 2 - 22, CANVAS_H / 2 + 15)
      ctx.lineTo(CANVAS_W / 2 + 22, CANVAS_H / 2 + 15)
      ctx.closePath()
      ctx.strokeStyle = GOLD
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.restore()

      // Player paddle
      ctx.save()
      ctx.shadowColor = PURPLE
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.roundRect(PADDLE_MARGIN, g.playerY, PADDLE_W, PADDLE_H, 5)
      ctx.fillStyle = PURPLE
      ctx.fill()
      ctx.restore()

      // AI paddle
      ctx.save()
      ctx.shadowColor = PINK
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.roundRect(CANVAS_W - PADDLE_MARGIN - PADDLE_W, g.aiY, PADDLE_W, PADDLE_H, 5)
      ctx.fillStyle = PINK
      ctx.fill()
      ctx.restore()

      // Ball
      ctx.save()
      ctx.shadowColor = CYAN
      ctx.shadowBlur = 14
      ctx.beginPath()
      ctx.arc(g.ballX, g.ballY, BALL_R, 0, Math.PI * 2)
      ctx.fillStyle = CYAN
      ctx.fill()
      ctx.restore()

      // Ball trail
      if (!g.serving) {
        ctx.save()
        ctx.globalAlpha = 0.15
        ctx.beginPath()
        ctx.arc(g.ballX - g.ballDX * 2, g.ballY - g.ballDY * 2, BALL_R * 0.7, 0, Math.PI * 2)
        ctx.fillStyle = CYAN
        ctx.fill()
        ctx.restore()
      }

      // Scores
      ctx.fillStyle = PURPLE
      ctx.font = "bold 28px monospace"
      ctx.textAlign = "center"
      ctx.fillText(String(g.playerScore), CANVAS_W / 2 - 40, 36)
      ctx.fillStyle = PINK
      ctx.fillText(String(g.aiScore), CANVAS_W / 2 + 40, 36)

      // Labels
      ctx.fillStyle = "rgba(255,255,255,0.2)"
      ctx.font = "8px monospace"
      ctx.textAlign = "left"
      ctx.fillText("SPEAKER", PADDLE_MARGIN, CANVAS_H - 8)
      ctx.textAlign = "right"
      ctx.fillText("NEWCOMER", CANVAS_W - PADDLE_MARGIN, CANVAS_H - 8)

      // Rally slogan
      if (g.rallyCount > 0) {
        ctx.fillStyle = `rgba(234,179,8,${Math.min(0.4, 0.1 + g.rallyCount * 0.03)})`
        ctx.font = "bold 9px monospace"
        ctx.textAlign = "center"
        ctx.fillText(currentSlogan, CANVAS_W / 2, CANVAS_H - 8)
      }

      g.animId = requestAnimationFrame(loop)
    }

    g.animId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      canvas.removeEventListener("touchstart", handleTouch)
      canvas.removeEventListener("touchmove", handleTouch)
      canvas.removeEventListener("touchend", handleTouchEnd)
      canvas.removeEventListener("touchcancel", handleTouchEnd)
      cancelAnimationFrame(g.animId)
      g.running = false
    }
  }, [resetBall, currentSlogan, handleServe])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="rounded-xl border border-purple-500/20"
          style={{ maxWidth: "100%", height: "auto" }}
          tabIndex={0}
          // eslint-disable-next-line jsx-a11y/no-interactive-element-to-noninteractive-role -- role="application" is correct for game canvases; it tells assistive tech to pass all keystrokes through
          role="application"
          aria-roledescription="game"
          aria-label="Pong game. Use arrow keys or mouse to move your paddle. Keep the message going back and forth. First to 7 wins."
        />
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <p className="text-2xl font-black mb-2" style={{ color: won ? GOLD : PINK }}>
              {won ? "MESSAGE CARRIED!" : "GAME OVER"}
            </p>
            <p className="text-sm text-gray-300 mb-3 text-center px-4">
              {won
                ? "\u201CWe carry the message to the alcoholic who still suffers.\u201D"
                : "\u201CKeep coming back. It works if you work it.\u201D"}
            </p>
            <p className="text-lg font-bold text-white mb-4">
              {playerScore} – {aiScore}
            </p>
            <button onClick={resetGame} className="btn-primary text-sm" type="button">
              {won ? "Carry It Again" : "Try Again"}
            </button>
          </div>
        )}
      </div>
      {/* Mobile d-pad */}
      <div className="md:hidden flex items-center justify-center gap-3" aria-label="Game controls" role="group">
        <DPadButton
          label="&#9650;"
          ariaLabel="Move paddle up"
          onDown={() => { gameRef.current.paddleDir = -1 }}
          onUp={() => { gameRef.current.paddleDir = 0 }}
          color={CYAN}
        />
        <ServeButton onTap={handleServe} color={GOLD} />
        <DPadButton
          label="&#9660;"
          ariaLabel="Move paddle down"
          onDown={() => { gameRef.current.paddleDir = 1 }}
          onUp={() => { gameRef.current.paddleDir = 0 }}
          color={CYAN}
        />
      </div>
      <p className="text-xs text-center max-w-xs" style={{ color: "var(--nec-muted)" }}>
        <span className="hidden md:inline">Keep the message going. &#8593; &#8595; or mouse to move. Space to serve. First to {WIN_SCORE} wins.</span>
        <span className="md:hidden">Use the buttons below to move your paddle. First to {WIN_SCORE} wins.</span>
      </p>
    </div>
  )
}
