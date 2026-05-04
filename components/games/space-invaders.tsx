"use client"

import { useRef, useEffect, useState, useCallback } from "react"

/**
 * Space Invaders — AA themed
 * Ship = AA triangle (Unity, Service, Recovery)
 * Enemies = character defects (Fear, Resentment, Selfishness, Dishonesty, Self-Pity)
 * Bullets = spiritual principles
 */

const CANVAS_W = 360
const CANVAS_H = 480
const SHIP_SIZE = 28
const BULLET_SPEED = 6
const ENEMY_COLS = 5
const ENEMY_ROWS = 4
const ENEMY_W = 36
const ENEMY_H = 24
const ENEMY_PAD = 12

const DEFECTS = [
  // Big Book page 64: selfishness, dishonesty, resentment, fear
  "SELF",
  "LIES",
  "RESENT",
  "FEAR",
  // Seven deadly sins
  "PRIDE",
  "GREED",
  "LUST",
  "ENVY",
  "GLUT",
  "WRATH",
  "SLOTH",
  // Common AA shortcomings
  "EGO",
  "ANGER",
  "SHAME",
  "DENY",
  "BLAME",
  "GUILT",
  "DOUBT",
  "SPITE",
  "DREAD",
]

const PURPLE = "#C08ABF"
const PINK = "#D4748E"
const GOLD = "#D4A84B"
const CYAN = "#5DBAA8"
const NAVY = "#0D1B2A"

interface Bullet {
  x: number
  y: number
}
interface Enemy {
  x: number
  y: number
  alive: boolean
  label: string
  color: string
}

function TouchBtn({
  label,
  ariaLabel,
  onPress,
  onRelease,
  color = PURPLE,
}: {
  label: string
  ariaLabel: string
  onPress: () => void
  onRelease: () => void
  color?: string
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onTouchStart={(e) => {
        e.preventDefault()
        onPress()
      }}
      onTouchEnd={onRelease}
      onTouchCancel={onRelease}
      onMouseDown={onPress}
      onMouseUp={onRelease}
      onMouseLeave={onRelease}
      className="flex select-none items-center justify-center rounded-xl text-lg font-bold transition-transform active:scale-95"
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

export default function SpaceInvadersGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const gameRef = useRef({
    shipX: CANVAS_W / 2,
    bullets: [] as Bullet[],
    enemies: [] as Enemy[],
    enemyDir: 1,
    enemySpeed: 0.4,
    enemyDropTimer: 0,
    keys: {} as Record<string, boolean>,
    score: 0,
    running: true,
    animId: 0,
    lastShot: 0,
  })

  const initEnemies = useCallback(() => {
    const enemies: Enemy[] = []
    const colors = [PINK, PURPLE, GOLD, CYAN]
    const startX = (CANVAS_W - ENEMY_COLS * (ENEMY_W + ENEMY_PAD)) / 2 + ENEMY_W / 2
    for (let row = 0; row < ENEMY_ROWS; row++) {
      for (let col = 0; col < ENEMY_COLS; col++) {
        enemies.push({
          x: startX + col * (ENEMY_W + ENEMY_PAD),
          y: 50 + row * (ENEMY_H + ENEMY_PAD),
          alive: true,
          label: DEFECTS[(row * ENEMY_COLS + col) % DEFECTS.length],
          color: colors[row % colors.length],
        })
      }
    }
    return enemies
  }, [])

  const resetGame = useCallback(() => {
    const g = gameRef.current
    g.shipX = CANVAS_W / 2
    g.bullets = []
    g.enemies = initEnemies()
    g.enemyDir = 1
    g.enemySpeed = 0.4
    g.enemyDropTimer = 0
    g.score = 0
    g.running = true
    g.lastShot = 0
    setScore(0)
    setGameOver(false)
    setWon(false)
  }, [initEnemies])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const g = gameRef.current
    g.enemies = initEnemies()

    const handleKeyDown = (e: KeyboardEvent) => {
      g.keys[e.key] = true
      if (["ArrowLeft", "ArrowRight", " ", "ArrowUp"].includes(e.key)) {
        e.preventDefault()
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      g.keys[e.key] = false
    }

    // Touch: drag left/right to move, tap to fire
    let touchX = 0
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      touchX = e.touches[0].clientX
      // Tap fires (respects same fire-rate limiter as keyboard)
      const now = Date.now()
      if (now - g.lastShot > 250) {
        g.bullets.push({ x: g.shipX, y: CANVAS_H - 50 })
        g.lastShot = now
      }
    }
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const newX = e.touches[0].clientX
      const dx = ((newX - touchX) / rect.width) * CANVAS_W
      g.shipX = Math.max(SHIP_SIZE / 2, Math.min(CANVAS_W - SHIP_SIZE / 2, g.shipX + dx))
      touchX = newX // update so next move is relative to current position
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false })
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false })

    function drawTriangleShip(cx: number, cy: number) {
      if (!ctx) return
      ctx.save()
      ctx.shadowColor = PURPLE
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.moveTo(cx, cy - SHIP_SIZE / 2)
      ctx.lineTo(cx - SHIP_SIZE / 2, cy + SHIP_SIZE / 2)
      ctx.lineTo(cx + SHIP_SIZE / 2, cy + SHIP_SIZE / 2)
      ctx.closePath()
      ctx.fillStyle = PURPLE
      ctx.fill()
      ctx.strokeStyle = GOLD
      ctx.lineWidth = 1.5
      ctx.stroke()
      // Inner circle
      ctx.beginPath()
      ctx.arc(cx, cy + 4, 6, 0, Math.PI * 2)
      ctx.strokeStyle = CYAN
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.restore()
    }

    function drawEnemy(e: Enemy) {
      if (!ctx || !e.alive) return
      ctx.save()
      ctx.shadowColor = e.color
      ctx.shadowBlur = 6
      // Rounded rect
      const x = e.x - ENEMY_W / 2
      const y = e.y - ENEMY_H / 2
      ctx.beginPath()
      ctx.roundRect(x, y, ENEMY_W, ENEMY_H, 4)
      ctx.fillStyle = e.color + "30"
      ctx.fill()
      ctx.strokeStyle = e.color
      ctx.lineWidth = 1.5
      ctx.stroke()
      // Label
      ctx.fillStyle = e.color
      ctx.font = "bold 8px monospace"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(e.label, e.x, e.y)
      ctx.restore()
    }

    function loop() {
      if (!ctx || !g.running) return

      // Input
      if (g.keys["ArrowLeft"] || g.keys["a"]) g.shipX = Math.max(SHIP_SIZE / 2, g.shipX - 4)
      if (g.keys["ArrowRight"] || g.keys["d"]) g.shipX = Math.min(CANVAS_W - SHIP_SIZE / 2, g.shipX + 4)

      const now = Date.now()
      if ((g.keys[" "] || g.keys["ArrowUp"]) && now - g.lastShot > 250) {
        g.bullets.push({ x: g.shipX, y: CANVAS_H - 50 })
        g.lastShot = now
      }

      // Move bullets
      g.bullets = g.bullets.filter((b) => b.y > -10)
      g.bullets.forEach((b) => {
        b.y -= BULLET_SPEED
      })

      // Move enemies
      let hitEdge = false
      g.enemies.forEach((e) => {
        if (!e.alive) return
        e.x += g.enemySpeed * g.enemyDir
        if (e.x + ENEMY_W / 2 > CANVAS_W - 10 || e.x - ENEMY_W / 2 < 10) hitEdge = true
      })
      if (hitEdge) {
        g.enemyDir *= -1
        g.enemies.forEach((e) => {
          e.y += 16
        })
        g.enemySpeed = Math.min(g.enemySpeed + 0.05, 2)
      }

      // Collision
      g.bullets.forEach((b) => {
        g.enemies.forEach((e) => {
          if (!e.alive) return
          if (Math.abs(b.x - e.x) < ENEMY_W / 2 && Math.abs(b.y - e.y) < ENEMY_H / 2) {
            e.alive = false
            b.y = -100
            g.score += 10
            setScore(g.score)
          }
        })
      })

      // Check win/lose
      const aliveEnemies = g.enemies.filter((e) => e.alive)
      if (aliveEnemies.length === 0) {
        g.running = false
        setWon(true)
        setGameOver(true)
        return
      }
      const lowestEnemy = Math.max(...aliveEnemies.map((e) => e.y + ENEMY_H / 2))
      if (lowestEnemy > CANVAS_H - 60) {
        g.running = false
        setGameOver(true)
        return
      }

      // Draw
      ctx.fillStyle = NAVY
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // Stars
      ctx.fillStyle = "rgba(255,255,255,0.15)"
      for (let i = 0; i < 40; i++) {
        const sx = (i * 97 + 13) % CANVAS_W
        const sy = (i * 53 + 7) % CANVAS_H
        ctx.fillRect(sx, sy, 1, 1)
      }

      // Enemies
      g.enemies.forEach(drawEnemy)

      // Bullets
      g.bullets.forEach((b) => {
        ctx.save()
        ctx.shadowColor = CYAN
        ctx.shadowBlur = 8
        ctx.fillStyle = CYAN
        ctx.fillRect(b.x - 1.5, b.y - 6, 3, 12)
        ctx.restore()
      })

      // Ship
      drawTriangleShip(g.shipX, CANVAS_H - 36)

      // Score HUD
      ctx.fillStyle = GOLD
      ctx.font = "bold 12px monospace"
      ctx.textAlign = "left"
      ctx.fillText(`SCORE: ${g.score}`, 10, 20)

      ctx.fillStyle = "rgba(255,255,255,0.3)"
      ctx.font = "9px monospace"
      ctx.textAlign = "right"
      ctx.fillText("← → MOVE  ↑/SPACE FIRE", CANVAS_W - 10, 20)

      g.animId = requestAnimationFrame(loop)
    }

    g.animId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchmove", handleTouchMove)
      cancelAnimationFrame(g.animId)
      g.running = false
    }
  }, [initEnemies])

  const pressKey = useCallback((key: string) => {
    gameRef.current.keys[key] = true
  }, [])
  const releaseKey = useCallback((key: string) => {
    gameRef.current.keys[key] = false
  }, [])
  const fire = useCallback(() => {
    const g = gameRef.current
    const now = Date.now()
    if (g.running && now - g.lastShot > 250) {
      g.bullets.push({ x: g.shipX, y: CANVAS_H - 50 })
      g.lastShot = now
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="rounded-xl border border-purple-500/20"
          style={{ imageRendering: "pixelated", maxWidth: "100%", height: "auto", touchAction: "none" }}
          tabIndex={0}
          // eslint-disable-next-line jsx-a11y/no-interactive-element-to-noninteractive-role -- role="application" is correct for game canvases; it tells assistive tech to pass all keystrokes through
          role="application"
          aria-roledescription="game"
          aria-label="Space Invaders game. Use arrow keys to move, space or up arrow to shoot. On mobile, drag to move and tap to fire. Destroy all character defects to win."
        />
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/70">
            <p className="mb-2 text-2xl font-black" style={{ color: won ? GOLD : PINK }}>
              {won ? "DEFECTS REMOVED!" : "GAME OVER"}
            </p>
            {won && (
              <p className="mb-3 px-4 text-center text-sm text-[var(--nec-muted)]">
                &ldquo;We were reborn.&rdquo; — Big Book, p. 63
              </p>
            )}
            <p className="mb-4 text-lg font-bold text-white">Score: {score}</p>
            <button onClick={resetGame} className="btn-primary text-sm" type="button">
              Take Another Inventory
            </button>
          </div>
        )}
      </div>
      {/* Mobile touch controls */}
      <div className="flex items-center gap-4 md:hidden" aria-label="Game controls" role="group">
        <TouchBtn
          label="←"
          ariaLabel="Move left"
          onPress={() => pressKey("ArrowLeft")}
          onRelease={() => releaseKey("ArrowLeft")}
        />
        <TouchBtn label="FIRE" ariaLabel="Fire" onPress={fire} onRelease={() => {}} color={CYAN} />
        <TouchBtn
          label="→"
          ariaLabel="Move right"
          onPress={() => pressKey("ArrowRight")}
          onRelease={() => releaseKey("ArrowRight")}
        />
      </div>
      <p className="max-w-xs text-center text-xs" style={{ color: "var(--nec-muted)" }}>
        <span className="hidden md:inline">
          The AA triangle ship fires spiritual principles at character defects. Arrow keys to move, Space to fire.
        </span>
        <span className="md:hidden">Drag to move, tap to fire. Use buttons below as an alternative.</span>
      </p>
    </div>
  )
}
