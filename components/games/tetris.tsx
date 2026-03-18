"use client"

import { useRef, useEffect, useState, useCallback } from "react"

/**
 * Tetris — AA themed
 * Blocks = recovery building blocks with slogans
 * "Building a program, one block at a time"
 */

const COLS = 10
const ROWS = 20
const CELL = 22
const CANVAS_W = COLS * CELL
const CANVAS_H = ROWS * CELL

const PURPLE = "#7c3aed"
const PINK = "#c026d3"
const GOLD = "#eab308"
const CYAN = "#22d3ee"
const NAVY = "#0f0a1e"
const TEAL = "#14b8a6"
const ORANGE = "#f97316"

const COLORS = [PURPLE, PINK, GOLD, CYAN, TEAL, ORANGE, "#ef4444"]

const SLOGANS = [
  "ODAAT", "LET GO", "EASY", "THINK", "LISTEN",
  "TRUST", "HOW", "HALT", "HOPE", "FAITH",
  "STEP 1", "STEP 2", "STEP 3", "UNITY", "SERVICE",
]

// Standard tetromino shapes
const SHAPES = [
  [[1, 1, 1, 1]],                   // I
  [[1, 1], [1, 1]],                 // O
  [[0, 1, 0], [1, 1, 1]],           // T
  [[1, 0, 0], [1, 1, 1]],           // L
  [[0, 0, 1], [1, 1, 1]],           // J
  [[0, 1, 1], [1, 1, 0]],           // S
  [[1, 1, 0], [0, 1, 1]],           // Z
]

interface Piece {
  shape: number[][]
  x: number
  y: number
  color: string
  slogan: string
}

function rotateMatrix(matrix: number[][]): number[][] {
  const rows = matrix.length
  const cols = matrix[0].length
  const result: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0))
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      result[c][rows - 1 - r] = matrix[r][c]
    }
  }
  return result
}

function randomPiece(): Piece {
  const idx = Math.floor(Math.random() * SHAPES.length)
  const shape = SHAPES[idx].map((row) => [...row])
  return {
    shape,
    x: Math.floor((COLS - shape[0].length) / 2),
    y: 0,
    color: COLORS[idx],
    slogan: SLOGANS[Math.floor(Math.random() * SLOGANS.length)],
  }
}

export default function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const gameRef = useRef({
    board: Array.from({ length: ROWS }, () => Array(COLS).fill(null)) as (string | null)[][],
    current: randomPiece(),
    next: randomPiece(),
    score: 0,
    lines: 0,
    running: true,
    keys: {} as Record<string, boolean>,
    dropTimer: 0,
    dropInterval: 500,
    lastTime: 0,
    animId: 0,
    lockDelay: 0,
  })

  const resetGame = useCallback(() => {
    const g = gameRef.current
    g.board = Array.from({ length: ROWS }, () => Array(COLS).fill(null))
    g.current = randomPiece()
    g.next = randomPiece()
    g.score = 0
    g.lines = 0
    g.running = true
    g.dropInterval = 500
    g.dropTimer = 0
    g.lockDelay = 0
    setScore(0)
    setLines(0)
    setGameOver(false)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const g = gameRef.current

    function collides(piece: Piece, offX = 0, offY = 0): boolean {
      for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
          if (!piece.shape[r][c]) continue
          const nx = piece.x + c + offX
          const ny = piece.y + r + offY
          if (nx < 0 || nx >= COLS || ny >= ROWS) return true
          if (ny >= 0 && g.board[ny][nx]) return true
        }
      }
      return false
    }

    function lock() {
      const piece = g.current
      for (let r = 0; r < piece.shape.length; r++) {
        for (let c = 0; c < piece.shape[r].length; c++) {
          if (!piece.shape[r][c]) continue
          const ny = piece.y + r
          const nx = piece.x + c
          if (ny < 0) {
            g.running = false
            setGameOver(true)
            return
          }
          g.board[ny][nx] = piece.color
        }
      }
      // Clear lines
      let cleared = 0
      for (let r = ROWS - 1; r >= 0; r--) {
        if (g.board[r].every((cell) => cell !== null)) {
          g.board.splice(r, 1)
          g.board.unshift(Array(COLS).fill(null))
          cleared++
          r++ // recheck same row
        }
      }
      if (cleared > 0) {
        const points = [0, 100, 300, 500, 800][cleared] || 800
        g.score += points
        g.lines += cleared
        g.dropInterval = Math.max(100, 500 - g.lines * 15)
        setScore(g.score)
        setLines(g.lines)
      }
      g.current = g.next
      g.next = randomPiece()
      if (collides(g.current)) {
        g.running = false
        setGameOver(true)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!g.running) return
      switch (e.key) {
        case "ArrowLeft":
        case "a":
          e.preventDefault()
          if (!collides(g.current, -1, 0)) g.current.x--
          break
        case "ArrowRight":
        case "d":
          e.preventDefault()
          if (!collides(g.current, 1, 0)) g.current.x++
          break
        case "ArrowDown":
        case "s":
          e.preventDefault()
          if (!collides(g.current, 0, 1)) {
            g.current.y++
            g.score += 1
            setScore(g.score)
          }
          break
        case "ArrowUp":
        case "w": {
          e.preventDefault()
          const rotated = rotateMatrix(g.current.shape)
          const old = g.current.shape
          g.current.shape = rotated
          if (collides(g.current)) {
            // Wall kick attempts
            const kicks = [-1, 1, -2, 2]
            let kicked = false
            for (const kick of kicks) {
              if (!collides(g.current, kick, 0)) {
                g.current.x += kick
                kicked = true
                break
              }
            }
            if (!kicked) g.current.shape = old
          }
          break
        }
        case " ":
          e.preventDefault()
          while (!collides(g.current, 0, 1)) {
            g.current.y++
            g.score += 2
          }
          setScore(g.score)
          lock()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    function drawCell(x: number, y: number, color: string) {
      if (!ctx) return
      ctx.fillStyle = color + "40"
      ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2)
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      ctx.strokeRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2)
    }

    function loop(time: number) {
      if (!ctx || !g.running) return
      const delta = time - g.lastTime
      g.lastTime = time
      g.dropTimer += delta

      if (g.dropTimer > g.dropInterval) {
        g.dropTimer = 0
        if (!collides(g.current, 0, 1)) {
          g.current.y++
        } else {
          lock()
          if (!g.running) return
        }
      }

      // Draw
      ctx.fillStyle = NAVY
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // Grid
      ctx.strokeStyle = "rgba(124,58,237,0.08)"
      ctx.lineWidth = 0.5
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          ctx.strokeRect(c * CELL, r * CELL, CELL, CELL)
        }
      }

      // Board
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (g.board[r][c]) drawCell(c, r, g.board[r][c] as string)
        }
      }

      // Ghost piece
      let ghostY = g.current.y
      while (!collides({ ...g.current, y: ghostY + 1 }, 0, 0)) ghostY++
      if (ghostY !== g.current.y) {
        for (let r = 0; r < g.current.shape.length; r++) {
          for (let c = 0; c < g.current.shape[r].length; c++) {
            if (!g.current.shape[r][c]) continue
            const gx = g.current.x + c
            const gy = ghostY + r
            if (gy >= 0) {
              ctx.fillStyle = g.current.color + "15"
              ctx.fillRect(gx * CELL + 1, gy * CELL + 1, CELL - 2, CELL - 2)
            }
          }
        }
      }

      // Current piece
      for (let r = 0; r < g.current.shape.length; r++) {
        for (let c = 0; c < g.current.shape[r].length; c++) {
          if (!g.current.shape[r][c]) continue
          const px = g.current.x + c
          const py = g.current.y + r
          if (py >= 0) drawCell(px, py, g.current.color)
        }
      }

      // Slogan on current piece
      const centerX = (g.current.x + g.current.shape[0].length / 2) * CELL
      const centerY = (g.current.y + g.current.shape.length / 2) * CELL
      if (centerY > 0) {
        ctx.fillStyle = "rgba(255,255,255,0.5)"
        ctx.font = "bold 7px monospace"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(g.current.slogan, centerX, centerY)
      }

      g.animId = requestAnimationFrame(loop)
    }

    g.lastTime = performance.now()
    g.animId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      cancelAnimationFrame(g.animId)
      g.running = false
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Score bar */}
      <div className="flex gap-6 text-xs font-bold" style={{ fontFamily: "monospace" }}>
        <span style={{ color: GOLD }}>SCORE: {score}</span>
        <span style={{ color: CYAN }}>LINES: {lines}</span>
      </div>
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
          aria-label="Tetris game. Arrow keys to move and rotate. Space to hard drop. Build your recovery program one block at a time."
        />
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <p className="text-2xl font-black mb-1" style={{ color: PINK }}>GAME OVER</p>
            <p className="text-sm text-gray-400 mb-1">
              &ldquo;Progress, not perfection.&rdquo;
            </p>
            <p className="text-lg font-bold text-white mb-1">Score: {score}</p>
            <p className="text-sm mb-4" style={{ color: CYAN }}>Lines: {lines}</p>
            <button onClick={resetGame} className="btn-primary text-sm" type="button">
              Keep Coming Back
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-center max-w-xs" style={{ color: "var(--nec-muted)" }}>
        Build your program one block at a time. ← → move, ↑ rotate, ↓ soft drop, Space hard drop.
      </p>
    </div>
  )
}
