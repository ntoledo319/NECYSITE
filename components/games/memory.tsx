"use client"

import { useRef, useEffect, useState, useCallback } from "react"

/**
 * Memory / Matching Principles — AA themed
 * 4x4 grid of 16 cards (8 pairs)
 * Each pair matches an AA principle to its related step
 * "Finding answers, one match at a time"
 */

const CANVAS_W = 360
const CANVAS_H = 360

const PURPLE = "#C08ABF"
const PINK = "#D4748E"
const GOLD = "#D4A84B"
const CYAN = "#5DBAA8"
const NAVY = "#0D1B2A"
const TEAL = "#5DBAA8"

const COLS = 6
const ROWS = 4
const CARD_W = 52
const CARD_H = 78
const PAD = 5
const OFFSET_X = (CANVAS_W - COLS * (CARD_W + PAD) + PAD) / 2
const OFFSET_Y = (CANVAS_H - ROWS * (CARD_H + PAD) + PAD) / 2

const PAIRS: [string, string, string][] = [
  ["HONESTY", "Step 1", PURPLE],
  ["HOPE", "Step 2", CYAN],
  ["FAITH", "Step 3", GOLD],
  ["COURAGE", "Step 4", PINK],
  ["INTEGRITY", "Step 5", TEAL],
  ["WILLINGNESS", "Step 6", "#f97316"],
  ["HUMILITY", "Step 7", "#a855f7"],
  ["LOVE", "Step 8", "#ec4899"],
  ["DISCIPLINE", "Step 9", PURPLE],
  ["PERSEVERANCE", "Step 10", CYAN],
  ["AWARENESS", "Step 11", GOLD],
  ["SERVICE", "Step 12", PINK],
]

interface Card {
  id: number
  pairIndex: number
  label: string
  color: string
  flipped: boolean
  matched: boolean
}

function DPadButton({ label, ariaLabel, onTap, color = PURPLE }: { label: string; ariaLabel: string; onTap: () => void; color?: string }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onTouchStart={(e) => { e.preventDefault(); onTap() }}
      onClick={onTap}
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

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildDeck(): Card[] {
  const cards: Card[] = []
  let id = 0
  PAIRS.forEach(([principle, step, color], pairIndex) => {
    cards.push({ id: id++, pairIndex, label: principle, color, flipped: false, matched: false })
    cards.push({ id: id++, pairIndex, label: step, color, flipped: false, matched: false })
  })
  return shuffle(cards)
}

export default function MemoryGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [moves, setMoves] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const actionsRef = useRef<{ move: (dx: number, dy: number) => void; flip: () => void }>({ move: () => {}, flip: () => {} })

  const gameRef = useRef({
    cards: buildDeck(),
    cursorX: 0,
    cursorY: 0,
    selected: [] as number[],
    moves: 0,
    matchedCount: 0,
    lockInput: false,
    complete: false,
    animId: 0,
    glowPhase: 0,
    lastTime: 0,
    flipTimeout: null as ReturnType<typeof setTimeout> | null,
  })

  const resetGame = useCallback(() => {
    const g = gameRef.current
    g.cards = buildDeck()
    g.cursorX = 0
    g.cursorY = 0
    g.selected = []
    g.moves = 0
    g.matchedCount = 0
    g.lockInput = false
    g.complete = false
    g.glowPhase = 0
    setMoves(0)
    setGameComplete(false)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const g = gameRef.current

    function cardIndex(col: number, row: number) {
      return row * COLS + col
    }

    function moveCursor(dx: number, dy: number) {
      if (g.lockInput || g.complete) return
      g.cursorX = (g.cursorX + dx + COLS) % COLS
      g.cursorY = (g.cursorY + dy + ROWS) % ROWS
    }

    function flipCard() {
      if (g.lockInput || g.complete) return
      const idx = cardIndex(g.cursorX, g.cursorY)
      const card = g.cards[idx]
      if (card.flipped || card.matched) return
      if (g.selected.length >= 2) return

      card.flipped = true
      g.selected.push(idx)

      if (g.selected.length === 2) {
        g.moves++
        setMoves(g.moves)
        const a = g.cards[g.selected[0]]
        const b = g.cards[g.selected[1]]

        if (a.pairIndex === b.pairIndex) {
          // Match found
          a.matched = true
          b.matched = true
          g.matchedCount += 2
          g.selected = []
          if (g.matchedCount >= 16) {
            g.complete = true
            setGameComplete(true)
          }
        } else {
          // No match - flip back after delay
          g.lockInput = true
          const flipTimeout = setTimeout(() => {
            a.flipped = false
            b.flipped = false
            g.selected = []
            g.lockInput = false
          }, 1000)
          g.flipTimeout = flipTimeout
        }
      }
    }

    actionsRef.current = { move: moveCursor, flip: flipCard }

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp": case "w": e.preventDefault(); moveCursor(0, -1); break
        case "ArrowDown": case "s": e.preventDefault(); moveCursor(0, 1); break
        case "ArrowLeft": case "a": e.preventDefault(); moveCursor(-1, 0); break
        case "ArrowRight": case "d": e.preventDefault(); moveCursor(1, 0); break
        case "Enter": case " ": e.preventDefault(); flipCard(); break
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    function drawCard(card: Card, col: number, row: number, time: number) {
      if (!ctx) return
      const x = OFFSET_X + col * (CARD_W + PAD)
      const y = OFFSET_Y + row * (CARD_H + PAD)
      const isCursor = col === g.cursorX && row === g.cursorY

      ctx.save()

      // Card background
      if (card.matched) {
        // Matched cards glow
        const pulse = 0.3 + 0.15 * Math.sin(time * 0.003 + card.pairIndex)
        ctx.shadowColor = card.color
        ctx.shadowBlur = 12
        ctx.fillStyle = card.color + Math.round(pulse * 255).toString(16).padStart(2, "0")
        ctx.beginPath()
        ctx.roundRect(x, y, CARD_W, CARD_H, 8)
        ctx.fill()

        // Inner card
        ctx.shadowBlur = 0
        ctx.fillStyle = NAVY
        ctx.beginPath()
        ctx.roundRect(x + 3, y + 3, CARD_W - 6, CARD_H - 6, 6)
        ctx.fill()

        // Label
        ctx.fillStyle = card.color
        ctx.font = "bold 11px monospace"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        const lines = card.label.length > 7 ? wrapText(card.label, 9) : [card.label]
        lines.forEach((line, i) => {
          ctx.fillText(line, x + CARD_W / 2, y + CARD_H / 2 + (i - (lines.length - 1) / 2) * 14)
        })
      } else if (card.flipped) {
        // Flipped but not yet matched
        ctx.shadowColor = card.color
        ctx.shadowBlur = 8
        ctx.fillStyle = card.color + "30"
        ctx.beginPath()
        ctx.roundRect(x, y, CARD_W, CARD_H, 8)
        ctx.fill()

        ctx.shadowBlur = 0
        ctx.fillStyle = NAVY
        ctx.beginPath()
        ctx.roundRect(x + 2, y + 2, CARD_W - 4, CARD_H - 4, 6)
        ctx.fill()

        ctx.fillStyle = card.color
        ctx.font = "bold 11px monospace"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        const lines = card.label.length > 7 ? wrapText(card.label, 9) : [card.label]
        lines.forEach((line, i) => {
          ctx.fillText(line, x + CARD_W / 2, y + CARD_H / 2 + (i - (lines.length - 1) / 2) * 14)
        })
      } else {
        // Face-down card
        ctx.fillStyle = PURPLE + "25"
        ctx.beginPath()
        ctx.roundRect(x, y, CARD_W, CARD_H, 8)
        ctx.fill()

        // Steampunk gear border
        ctx.strokeStyle = PURPLE + "60"
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.roundRect(x + 2, y + 2, CARD_W - 4, CARD_H - 4, 6)
        ctx.stroke()

        // Corner gear accents
        const corners = [
          [x + 10, y + 10],
          [x + CARD_W - 10, y + 10],
          [x + 10, y + CARD_H - 10],
          [x + CARD_W - 10, y + CARD_H - 10],
        ]
        ctx.fillStyle = PURPLE + "40"
        corners.forEach(([cx, cy]) => {
          ctx.beginPath()
          ctx.arc(cx, cy, 3, 0, Math.PI * 2)
          ctx.fill()
        })

        // Inner line accents
        ctx.strokeStyle = PURPLE + "20"
        ctx.lineWidth = 0.5
        ctx.beginPath()
        ctx.roundRect(x + 8, y + 8, CARD_W - 16, CARD_H - 16, 4)
        ctx.stroke()

        // Question mark
        ctx.fillStyle = PURPLE + "90"
        ctx.font = "bold 24px monospace"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("?", x + CARD_W / 2, y + CARD_H / 2)
      }

      // Cursor highlight
      if (isCursor && !g.complete) {
        const cursorPulse = 0.5 + 0.3 * Math.sin(time * 0.005)
        ctx.strokeStyle = CYAN
        ctx.lineWidth = 2.5
        ctx.shadowColor = CYAN
        ctx.shadowBlur = 8 * cursorPulse
        ctx.beginPath()
        ctx.roundRect(x - 1, y - 1, CARD_W + 2, CARD_H + 2, 9)
        ctx.stroke()
      }

      ctx.restore()
    }

    function wrapText(text: string, maxLen: number): string[] {
      if (text.length <= maxLen) return [text]
      const mid = Math.ceil(text.length / 2)
      return [text.slice(0, mid), text.slice(mid)]
    }

    function loop(time: number) {
      if (!ctx) return

      // Background
      ctx.fillStyle = NAVY
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // Subtle grid lines
      ctx.strokeStyle = "rgba(124,58,237,0.04)"
      ctx.lineWidth = 0.5
      for (let i = 0; i < CANVAS_W; i += 20) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, CANVAS_H)
        ctx.stroke()
      }
      for (let i = 0; i < CANVAS_H; i += 20) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(CANVAS_W, i)
        ctx.stroke()
      }

      // Draw cards
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const idx = row * COLS + col
          drawCard(g.cards[idx], col, row, time)
        }
      }

      // HUD
      ctx.fillStyle = GOLD
      ctx.font = "bold 11px monospace"
      ctx.textAlign = "left"
      ctx.fillText(`MOVES: ${g.moves}`, 8, 14)

      ctx.fillStyle = CYAN
      ctx.textAlign = "right"
      ctx.fillText(`${g.matchedCount / 2}/${PAIRS.length} MATCHED`, CANVAS_W - 8, 14)

      ctx.fillStyle = "rgba(255,255,255,0.15)"
      ctx.font = "8px monospace"
      ctx.textAlign = "center"
      ctx.fillText("ARROWS TO MOVE \u00B7 ENTER TO FLIP", CANVAS_W / 2, CANVAS_H - 6)

      g.animId = requestAnimationFrame(loop)
    }

    g.lastTime = performance.now()
    g.animId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      cancelAnimationFrame(g.animId)
      if (g.flipTimeout) clearTimeout(g.flipTimeout)
    }
  }, [])

  const handleMove = useCallback((dx: number, dy: number) => {
    actionsRef.current.move(dx, dy)
  }, [])

  const handleFlip = useCallback(() => {
    actionsRef.current.flip()
  }, [])

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
          aria-label="Memory matching game. Use arrow keys to navigate cards and Enter or Space to flip. Match AA principles to their steps."
        />
        {gameComplete && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <p className="text-2xl font-black mb-2" style={{ color: GOLD }}>ALL MATCHED!</p>
            <p className="text-sm text-[var(--nec-muted)] mb-3 text-center px-4">
              &ldquo;Finding answers, one match at a time.&rdquo;
            </p>
            <p className="text-lg font-bold text-white mb-1">
              Completed in {moves} move{moves !== 1 ? "s" : ""}
            </p>
            <p className="text-sm mb-4" style={{ color: CYAN }}>
              {moves <= 12 ? "Perfect memory!" : moves <= 20 ? "Great recall!" : moves <= 30 ? "Well done!" : "Keep practicing!"}
            </p>
            <button onClick={resetGame} className="btn-primary text-sm" type="button">
              Play Again
            </button>
          </div>
        )}
      </div>
      {/* Mobile d-pad */}
      <div className="md:hidden flex flex-col items-center gap-1" aria-label="Game controls" role="group">
        <DPadButton label="▲" ariaLabel="Move up" onTap={() => handleMove(0, -1)} color={CYAN} />
        <div className="flex gap-1">
          <DPadButton label="◀" ariaLabel="Move left" onTap={() => handleMove(-1, 0)} />
          <DPadButton label="FLIP" ariaLabel="Flip card" onTap={handleFlip} color={GOLD} />
          <DPadButton label="▶" ariaLabel="Move right" onTap={() => handleMove(1, 0)} />
        </div>
        <DPadButton label="▼" ariaLabel="Move down" onTap={() => handleMove(0, 1)} color={GOLD} />
      </div>
      <p className="text-xs text-center max-w-xs" style={{ color: "var(--nec-muted)" }}>
        <span className="hidden md:inline">Match AA principles to their steps. Arrow keys to navigate, Enter or Space to flip a card.</span>
        <span className="md:hidden">Use the d-pad to navigate. Tap FLIP to reveal a card. Match all 8 pairs to win.</span>
      </p>
    </div>
  )
}
