import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log("🔍 MIDDLEWARE CHECK");
  console.log("➡️ Pathname:", req.nextUrl.pathname);
  console.log("👤 User:", user);
  console.log("⚠️ Error:", error);

  const pathname = req.nextUrl.pathname;

  const publicRoutes = ["/", "/auth/login", "/auth/register"];
  const isPublic = publicRoutes.includes(pathname);

  if (!user && !isPublic) {
    console.log("⛔ Usuario NO logueado → redirigiendo a login");
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/auth/login";
    return NextResponse.redirect(redirectUrl);
  }

  if (user && (pathname === "/auth/login" || pathname === "/auth/register")) {
    console.log("🔄 Usuario logueado intentando ir a login/register → redirigiendo a /inicio");
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/inicio";
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
