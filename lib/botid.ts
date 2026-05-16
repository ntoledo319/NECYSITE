import "server-only"
import { log } from "./logger"
import type { CorrelationId } from "./correlation"

/**
 * BotID verification shim. The project hasn't installed `@vercel/botid` yet;
 * this file is the contract every server action uses so that wiring real
 * BotID is a one-file change later.
 *
 * Policy:
 *  - Paid checkout: fail OPEN if BotID is unavailable (we'd rather process
 *    humans than block them).
 *  - Access code: fail CLOSED if BotID is unavailable AND BOTID_ENABLED=1
 *    (cheaper to lose an attempt than burn a code on a bot).
 *
 * Honor this contract when implementing for real.
 */

export type BotIdVerdict = "human" | "likely_bot" | "uncertain" | "unavailable"

export interface BotIdContext {
  correlationId?: CorrelationId
  /** Identifier the action is about: "checkout" | "access_code". Logged. */
  action: "checkout" | "access_code"
}

const ENABLED = (process.env.BOTID_ENABLED ?? "").toLowerCase() === "1"

export async function verifyBotId(_token: string | null | undefined, ctx: BotIdContext): Promise<BotIdVerdict> {
  if (!ENABLED) return "unavailable"
  // Real implementation goes here. Until installed, treat every call as
  // unavailable and let the policy layer decide what to do.
  log.info({ event: "botid.shim_called", correlationId: ctx.correlationId, action: ctx.action })
  return "unavailable"
}

/**
 * Convenience policy used by server actions. Returns true when the request
 * may proceed.
 */
export function shouldAllow(verdict: BotIdVerdict, ctx: BotIdContext): boolean {
  if (verdict === "human") return true
  if (verdict === "likely_bot") return false
  if (verdict === "unavailable") {
    // Fail open for paid checkout, closed for access code when enabled.
    if (ctx.action === "access_code" && ENABLED) return false
    return true
  }
  return true
}
