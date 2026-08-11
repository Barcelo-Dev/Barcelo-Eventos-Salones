import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return res;
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return req.cookies.getAll(); },
      setAll(list) {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  const path = req.nextUrl.pathname;
  if (path.startsWith("/personal") && path !== "/personal/login" && !user) {
    const to = req.nextUrl.clone(); to.pathname = "/personal/login";
    return NextResponse.redirect(to);
  }
  if (path === "/personal/login" && user) {
    const to = req.nextUrl.clone(); to.pathname = "/personal";
    return NextResponse.redirect(to);
  }
  return res;
}
export const config = { matcher: ["/personal/:path*"] };
