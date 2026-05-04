import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

export default createMiddleware(routing)

export const config = {
  // Match all pathnames except:
  // - /api (API routes)
  // - /admin (Payload CMS admin)
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - /images, /fonts, etc. (static files)
  matcher: ["/((?!api|admin|_next|_vercel|images|fonts|.*\\..*).*)"],
}
