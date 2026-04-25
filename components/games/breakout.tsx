"use client"

import { useRef, useEffect, useState, useCallback } from "react"

/**
 * Breakout — AA themed
 * Paddle = "Willingness"
 * Ball = "The Message"
 * Bricks = "The Wall of Denial" with AA terms
 */

const CANVAS_W = 360
const CANVAS_H = 480
const PADDLE_W = 70
const PADDLE_H = 12
const BALL_R = 6
const BRICK_ROWS = 6
const BRICK_COLS = 6
const BRICK_W = 50
const BRICK_H = 20
const BRICK_PAD = 6
const PADDLE_SPEED = 6

const PURPLE = "#C08ABF"
const PINK = "#D4748E"
const GOLD = "#D4A84B"
const CYAN = "#5DBAA8"
const NAVY = "#0D1B2A"
const TEAL = "#5DBAA8"

const DENIAL_WORDS = [
  "DENIAL",
  "FEAR",
  "PRIDE",
  "ANGER",
  "SELF",
  "BLAME",
  "LIES",
  "SHAME",
  "DOUBT",
  "WORRY",
  "EGO",
  "ENVY",
  "GREED",
  "SPITE",
  "MASK",
  "HIDE",
  "RUN",
  "NUMB",
  "AVOID",
  "WALL",
  "FAKE",
  "SHUT",
  "COLD",
  "LOST",
  "DARK",
  "STUCK",
  "RIGID",
  "BLIND",
  "DEAF",
  "ALONE",
  "STALL",
  "BLOCK",
  "CAGE",
  "FOG",
  "ICE",
  "DREAD",
]

const ROW_COLORS = [PINK, PURPLE, GOLD, CYAN, TEAL, "#f97316"]

interface Brick {
  x: number
  y: number
  alive: boolean
  label: string
  color: string
}

function DPadButton({
  label,
  ariaLabel,
  onDown,
  onUp,
  color = PURPLE,
}: {
  label: string
  ariaLabel: string
  onDown: () => void
  onUp: () => void
  color?: string
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onTouchStart={(e) => {
        e.preventDefault()
        onDown()
      }}
      onTouchEnd={(e) => {
        e.preventDefault()
        onUp()
      }}
      onTouchCancel={(e) => {
        e.preventDefault()
        onUp()
      }}
      onMouseDown={onDown}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      className="flex select-none items-center justify-center rounded-xl text-lg font-bold transition-transform active:scale-90"
      style={{
        width: 64,
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

function LaunchButton({
  label,
  ariaLabel,
  onTap,
  color = CYAN,
}: {
  label: string
  ariaLabel: string
  onTap: () => void
  color?: string
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onTouchStart={(e) => {
        e.preventDefault()
        onTap()
      }}
      onClick={onTap}
      className="flex select-none items-center justify-center rounded-xl text-xs font-bold uppercase tracking-wide transition-transform active:scale-90"
      style={{
        width: 80,
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

export default function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [_lives, setLives] = useState(3)
  const gameRef = useRef({
    paddleX: CANVAS_W / 2 - PADDLE_W / 2,
    ballX: CANVAS_W / 2,
    ballY: CANVAS_H - 60,
    ballDX: 3,
    ballDY: -3,
    bricks: [] as Brick[],
    score: 0,
    lives: 3,
    running: true,
    launched: false,
    keys: {} as Record<string, boolean>,
    mouseX: CANVAS_W / 2,
    paddleDir: 0, // -1 left, 0 none, 1 right (for d-pad)
    animId: 0,
  })

  const initBricks = useCallback(() => {
    const bricks: Brick[] = []
    const totalW = BRICK_COLS * (BRICK_W + BRICK_PAD) - BRICK_PAD
    const startX = (CANVAS_W - totalW) / 2
    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        bricks.push({
          x: startX + c * (BRICK_W + BRICK_PAD),
          y: 50 + r * (BRICK_H + BRICK_PAD),
          alive: true,
          label: DENIAL_WORDS[(r * BRICK_COLS + c) % DENIAL_WORDS.length],
          color: ROW_COLORS[r % ROW_COLORS.length],
        })
      }
    }
    return bricks
  }, [])

  const resetGame = useCallback(() => {
    const g = gameRef.current
    g.paddleX = CANVAS_W / 2 - PADDLE_W / 2
    g.ballX = CANVAS_W / 2
    g.ballY = CANVAS_H - 60
    g.ballDX = 3
    g.ballDY = -3
    g.bricks = initBricks()
    g.score = 0
    g.lives = 3
    g.running = true
    g.launched = false
    g.paddleDir = 0
    setScore(0)
    setLives(3)
    setGameOver(false)
    setWon(false)
  }, [initBricks])

  const launchBall = useCallback(() => {
    const g = gameRef.current
    if (!g.launched) g.launched = true
  }, [])

  const setPaddleDir = useCallback((dir: number) => {
    gameRef.current.paddleDir = dir
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const g = gameRef.current
    g.bricks = initBricks()

    const handleKeyDown = (e: KeyboardEvent) => {
      g.keys[e.key] = true
      if (["ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault()
      if (e.key === " " && !g.launched) g.launched = true
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      g.keys[e.key] = false
    }
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      g.mouseX = ((e.clientX - rect.left) / rect.width) * CANVAS_W
    }
    const handleClick = () => {
      if (!g.launched) g.launched = true
    }

    // Touch: immediately set paddle position on touchstart AND touchmove
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      g.mouseX = ((e.touches[0].clientX - rect.left) / rect.width) * CANVAS_W
      // Immediately snap paddle to touch position
      g.paddleX = g.mouseX - PADDLE_W / 2
      g.paddleX = Math.max(0, Math.min(CANVAS_W - PADDLE_W, g.paddleX))
    }
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      g.mouseX = ((e.touches[0].clientX - rect.left) / rect.width) * CANVAS_W
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("click", handleClick)
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false })
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false })

    function resetBall() {
      g.ballX = g.paddleX + PADDLE_W / 2
      g.ballY = CANVAS_H - 60
      g.ballDX = 3 * (Math.random() > 0.5 ? 1 : -1)
      g.ballDY = -3
      g.launched = false
    }

    function loop() {
      if (!ctx || !g.running) return

      // Paddle movement — keyboard
      if (g.keys["ArrowLeft"] || g.keys["a"]) g.paddleX -= PADDLE_SPEED
      if (g.keys["ArrowRight"] || g.keys["d"]) g.paddleX += PADDLE_SPEED

      // Paddle movement — d-pad buttons
      if (g.paddleDir !== 0) g.paddleX += g.paddleDir * PADDLE_SPEED

      // Mouse/touch follow (smooth)
      const targetX = g.mouseX - PADDLE_W / 2
      g.paddleX += (targetX - g.paddleX) * 0.15

      g.paddleX = Math.max(0, Math.min(CANVAS_W - PADDLE_W, g.paddleX))

      if (!g.launched) {
        g.ballX = g.paddleX + PADDLE_W / 2
        g.ballY = CANVAS_H - 40 - BALL_R - PADDLE_H
      } else {
        g.ballX += g.ballDX
        g.ballY += g.ballDY

        // Wall bounces
        if (g.ballX - BALL_R < 0 || g.ballX + BALL_R > CANVAS_W) g.ballDX *= -1
        if (g.ballY - BALL_R < 0) g.ballDY *= -1

        // Paddle bounce
        if (
          g.ballY + BALL_R > CANVAS_H - 40 - PADDLE_H &&
          g.ballY + BALL_R < CANVAS_H - 40 + PADDLE_H &&
          g.ballX > g.paddleX - BALL_R &&
          g.ballX < g.paddleX + PADDLE_W + BALL_R &&
          g.ballDY > 0
        ) {
          g.ballDY *= -1
          // Angle based on hit position
          const hitPos = (g.ballX - g.paddleX) / PADDLE_W - 0.5
          g.ballDX = hitPos * 6
          // Speed up slightly
          const speed = Math.sqrt(g.ballDX ** 2 + g.ballDY ** 2)
          const newSpeed = Math.min(speed + 0.05, 7)
          const ratio = newSpeed / speed
          g.ballDX *= ratio
          g.ballDY *= ratio
        }

        // Ball lost
        if (g.ballY > CANVAS_H + 20) {
          g.lives--
          setLives(g.lives)
          if (g.lives <= 0) {
            g.running = false
            setGameOver(true)
            return
          }
          resetBall()
        }

        // Brick collision
        g.bricks.forEach((brick) => {
          if (!brick.alive) return
          if (
            g.ballX + BALL_R > brick.x &&
            g.ballX - BALL_R < brick.x + BRICK_W &&
            g.ballY + BALL_R > brick.y &&
            g.ballY - BALL_R < brick.y + BRICK_H
          ) {
            brick.alive = false
            g.ballDY *= -1
            g.score += 10
            setScore(g.score)
          }
        })

        // Win check
        if (g.bricks.every((b) => !b.alive)) {
          g.running = false
          setWon(true)
          setGameOver(true)
          return
        }
      }

      // Draw
      ctx.fillStyle = NAVY
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // Bricks
      g.bricks.forEach((brick) => {
        if (!brick.alive) return
        ctx.save()
        ctx.shadowColor = brick.color
        ctx.shadowBlur = 4
        ctx.beginPath()
        ctx.roundRect(brick.x, brick.y, BRICK_W, BRICK_H, 3)
        ctx.fillStyle = brick.color + "35"
        ctx.fill()
        ctx.strokeStyle = brick.color
        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.fillStyle = brick.color
        ctx.font = "bold 7px monospace"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(brick.label, brick.x + BRICK_W / 2, brick.y + BRICK_H / 2)
        ctx.restore()
      })

      // Paddle
      ctx.save()
      ctx.shadowColor = PURPLE
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.roundRect(g.paddleX, CANVAS_H - 40, PADDLE_W, PADDLE_H, 6)
      ctx.fillStyle = PURPLE
      ctx.fill()
      ctx.strokeStyle = GOLD
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.restore()

      // Ball
      ctx.save()
      ctx.shadowColor = CYAN
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.arc(g.ballX, g.ballY, BALL_R, 0, Math.PI * 2)
      ctx.fillStyle = CYAN
      ctx.fill()
      ctx.restore()

      // HUD
      ctx.fillStyle = GOLD
      ctx.font = "bold 11px monospace"
      ctx.textAlign = "left"
      ctx.fillText(`SCORE: ${g.score}`, 10, 20)
      ctx.textAlign = "right"
      ctx.fillStyle = PINK
      ctx.fillText(`${"♥".repeat(g.lives)}`, CANVAS_W - 10, 20)

      if (!g.launched) {
        ctx.fillStyle = "rgba(255,255,255,0.5)"
        ctx.font = "10px monospace"
        ctx.textAlign = "center"
        ctx.fillText("CLICK or SPACE to launch", CANVAS_W / 2, CANVAS_H - 60)
      }

      // "THE WALL OF DENIAL" title
      ctx.fillStyle = "rgba(255,255,255,0.08)"
      ctx.font = "bold 11px monospace"
      ctx.textAlign = "center"
      ctx.fillText("THE WALL OF DENIAL", CANVAS_W / 2, 38)

      g.animId = requestAnimationFrame(loop)
    }

    g.animId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("click", handleClick)
      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchmove", handleTouchMove)
      cancelAnimationFrame(g.animId)
      g.running = false
    }
  }, [initBricks])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="rounded-xl border border-purple-500/20"
          style={{ maxWidth: "100%", height: "auto", touchAction: "none" }}
          tabIndex={0}
          // eslint-disable-next-line jsx-a11y/no-interactive-element-to-noninteractive-role -- role="application" is correct for game canvases; it tells assistive tech to pass all keystrokes through
          role="application"
          aria-roledescription="game"
          aria-label="Breakout game. Use arrow keys or mouse to move the paddle. Break through the Wall of Denial. Space or click to launch the ball."
        />
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/70">
            <p className="mb-2 text-2xl font-black" style={{ color: won ? GOLD : PINK }}>
              {won ? "WALL BROKEN!" : "GAME OVER"}
            </p>
            {won && (
              <p className="mb-3 px-4 text-center text-sm text-[var(--nec-muted)]">
                &ldquo;We will comprehend the word serenity.&rdquo; — The Promises
              </p>
            )}
            <p className="mb-4 text-lg font-bold text-white">Score: {score}</p>
            <button onClick={resetGame} className="btn-primary text-sm" type="button">
              {won ? "Break It Again" : "Try Again"}
            </button>
          </div>
        )}
      </div>
      {/* Mobile d-pad: left, launch, right */}
      <div className="flex items-center gap-2 md:hidden" aria-label="Game controls" role="group">
        <DPadButton label="◀" ariaLabel="Move left" onDown={() => setPaddleDir(-1)} onUp={() => setPaddleDir(0)} />
        <LaunchButton label="LAUNCH" ariaLabel="Launch ball" onTap={launchBall} color={CYAN} />
        <DPadButton
          label="▶"
          ariaLabel="Move right"
          onDown={() => setPaddleDir(1)}
          onUp={() => setPaddleDir(0)}
          color={GOLD}
        />
      </div>
      <p className="max-w-xs text-center text-xs" style={{ color: "var(--nec-muted)" }}>
        <span className="hidden md:inline">Break through the Wall of Denial. ← → to move, SPACE to launch.</span>
        <span className="md:hidden">Use the buttons below to move and launch.</span>
      </p>
    </div>
  )
}
