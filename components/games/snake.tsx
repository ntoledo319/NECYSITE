"use client"

import { useRef, useEffect, useState, useCallback } from "react"

/**
 * Snake — AA themed
 * Snake = "The Journey" growing one day at a time
 * Food = Serenity tokens (prayer, acceptance, courage, wisdom)
 * "Collecting serenity, one segment at a time"
 */

const CANVAS_W = 360
const CANVAS_H = 360
const GRID = 18
const COLS = Math.floor(CANVAS_W / GRID)
const ROWS = Math.floor(CANVAS_H / GRID)

const PURPLE = "#7c3aed"
const PINK = "#c026d3"
const GOLD = "#eab308"
const CYAN = "#22d3ee"
const NAVY = "#0f0a1e"
const TEAL = "#14b8a6"

const TOKENS = [
  { label: "☮", name: "SERENITY", color: CYAN },
  { label: "♥", name: "COURAGE", color: PINK },
  { label: "✦", name: "WISDOM", color: GOLD },
  { label: "△", name: "UNITY", color: PURPLE },
  { label: "◇", name: "SERVICE", color: TEAL },
  { label: "★", name: "HOPE", color: "#f97316" },
]

interface Pos { x: number; y: number }
interface Food { pos: Pos; token: typeof TOKENS[number] }

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [_lastCollected, setLastCollected] = useState("")
  const lastCollectedRef = useRef("")
  const gameRef = useRef({
    snake: [{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }] as Pos[],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: null as Food | null,
    score: 0,
    running: true,
    tickTimer: 0,
    tickInterval: 140,
    lastTime: 0,
    animId: 0,
  })

  const placeFood = useCallback((snake: Pos[]): Food => {
    let pos: Pos
    do {
      pos = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
      }
    } while (snake.some((s) => s.x === pos.x && s.y === pos.y))
    return { pos, token: TOKENS[Math.floor(Math.random() * TOKENS.length)] }
  }, [])

  const resetGame = useCallback(() => {
    const g = gameRef.current
    const start = [{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }]
    g.snake = start
    g.dir = { x: 1, y: 0 }
    g.nextDir = { x: 1, y: 0 }
    g.food = placeFood(start)
    g.score = 0
    g.running = true
    g.tickInterval = 140
    g.tickTimer = 0
    setScore(0)
    setGameOver(false)
    setLastCollected("")
    lastCollectedRef.current = ""
  }, [placeFood])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const g = gameRef.current
    g.food = placeFood(g.snake)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!g.running) return
      switch (e.key) {
        case "ArrowUp":
        case "w":
          e.preventDefault()
          if (g.dir.y !== 1) g.nextDir = { x: 0, y: -1 }
          break
        case "ArrowDown":
        case "s":
          e.preventDefault()
          if (g.dir.y !== -1) g.nextDir = { x: 0, y: 1 }
          break
        case "ArrowLeft":
        case "a":
          e.preventDefault()
          if (g.dir.x !== 1) g.nextDir = { x: -1, y: 0 }
          break
        case "ArrowRight":
        case "d":
          e.preventDefault()
          if (g.dir.x !== -1) g.nextDir = { x: 1, y: 0 }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    function tick() {
      g.dir = { ...g.nextDir }
      const head = g.snake[0]
      const newHead = { x: head.x + g.dir.x, y: head.y + g.dir.y }

      // Wall collision (wrap around)
      if (newHead.x < 0) newHead.x = COLS - 1
      if (newHead.x >= COLS) newHead.x = 0
      if (newHead.y < 0) newHead.y = ROWS - 1
      if (newHead.y >= ROWS) newHead.y = 0

      // Self collision
      if (g.snake.some((s) => s.x === newHead.x && s.y === newHead.y)) {
        g.running = false
        setGameOver(true)
        return
      }

      g.snake.unshift(newHead)

      // Food collision
      if (g.food && newHead.x === g.food.pos.x && newHead.y === g.food.pos.y) {
        g.score += 10
        setScore(g.score)
        setLastCollected(g.food.token.name)
        lastCollectedRef.current = g.food.token.name
        g.food = placeFood(g.snake)
        g.tickInterval = Math.max(60, g.tickInterval - 3)
      } else {
        g.snake.pop()
      }
    }

    function loop(time: number) {
      if (!ctx || !g.running) return
      const delta = time - g.lastTime
      g.lastTime = time
      g.tickTimer += delta

      if (g.tickTimer > g.tickInterval) {
        g.tickTimer = 0
        tick()
        if (!g.running) return
      }

      // Draw
      ctx.fillStyle = NAVY
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // Grid
      ctx.strokeStyle = "rgba(124,58,237,0.06)"
      ctx.lineWidth = 0.5
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          ctx.strokeRect(c * GRID, r * GRID, GRID, GRID)
        }
      }

      // Snake
      g.snake.forEach((seg, i) => {
        const isHead = i === 0
        const progress = 1 - i / g.snake.length
        const alpha = 0.3 + progress * 0.7
        ctx.save()
        if (isHead) {
          ctx.shadowColor = PURPLE
          ctx.shadowBlur = 10
        }
        ctx.fillStyle = isHead ? PURPLE : `rgba(124,58,237,${alpha})`
        ctx.beginPath()
        ctx.roundRect(
          seg.x * GRID + 1,
          seg.y * GRID + 1,
          GRID - 2,
          GRID - 2,
          isHead ? 5 : 3,
        )
        ctx.fill()
        if (isHead) {
          // AA triangle on head
          ctx.fillStyle = GOLD
          ctx.font = "bold 10px sans-serif"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText("△", seg.x * GRID + GRID / 2, seg.y * GRID + GRID / 2)
        }
        ctx.restore()
      })

      // Food
      if (g.food) {
        const fx = g.food.pos.x * GRID + GRID / 2
        const fy = g.food.pos.y * GRID + GRID / 2
        ctx.save()
        ctx.shadowColor = g.food.token.color
        ctx.shadowBlur = 12
        // Glow circle
        ctx.beginPath()
        ctx.arc(fx, fy, GRID / 2.5, 0, Math.PI * 2)
        ctx.fillStyle = g.food.token.color + "25"
        ctx.fill()
        // Token
        ctx.fillStyle = g.food.token.color
        ctx.font = "bold 14px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(g.food.token.label, fx, fy)
        ctx.restore()
      }

      // HUD
      ctx.fillStyle = GOLD
      ctx.font = "bold 11px monospace"
      ctx.textAlign = "left"
      ctx.fillText(`DAYS: ${g.score / 10}`, 8, 16)
      if (lastCollectedRef.current) {
        ctx.fillStyle = "rgba(255,255,255,0.3)"
        ctx.font = "9px monospace"
        ctx.textAlign = "right"
        ctx.fillText(`+ ${lastCollectedRef.current}`, CANVAS_W - 8, 16)
      }

      ctx.fillStyle = "rgba(255,255,255,0.15)"
      ctx.font = "8px monospace"
      ctx.textAlign = "center"
      ctx.fillText("ARROW KEYS TO MOVE", CANVAS_W / 2, CANVAS_H - 6)

      g.animId = requestAnimationFrame(loop)
    }

    g.lastTime = performance.now()
    g.animId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      cancelAnimationFrame(g.animId)
      g.running = false
    }
  }, [placeFood])

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
          aria-label="Snake game. Use arrow keys to guide the journey. Collect serenity tokens to grow. Do not run into yourself."
        />
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <p className="text-2xl font-black mb-2" style={{ color: PINK }}>GAME OVER</p>
            <p className="text-sm text-gray-400 mb-3 text-center px-4">
              &ldquo;One day at a time.&rdquo;
            </p>
            <p className="text-lg font-bold text-white mb-1">
              {score / 10} day{score / 10 !== 1 ? "s" : ""} collected
            </p>
            <p className="text-sm mb-4" style={{ color: CYAN }}>Score: {score}</p>
            <button onClick={resetGame} className="btn-primary text-sm" type="button">
              Start a New Day
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-center max-w-xs" style={{ color: "var(--nec-muted)" }}>
        Collect serenity tokens. Each one adds a day to your journey.
        Arrow keys to move. Don&apos;t cross your own path.
      </p>
    </div>
  )
}
