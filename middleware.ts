import { NextRequest, NextResponse } from "next/server";

const canonicalHost = "www.habidoo.com";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();
  const isProductionAlias = host === "habidoo.com" || host?.endsWith(".vercel.app");

  if (process.env.VERCEL_ENV === "production" && host !== canonicalHost && isProductionAlias) {
    const url = request.nextUrl.clone();
    url.protocol = "https";
    url.host = canonicalHost;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|manifest.json).*)"]
};
