import { NextRequest, NextResponse } from "next/server";

import { $$hasUser } from "./lib/stores";
import $$supabase from "./lib/supabase";

export const middleware = async (req: NextRequest, res: NextResponse) => {
	const {data} = await $$supabase.auth.getUser()
	console.log(data)
	
	if (!data?.user) {
		if (req.nextUrl.pathname !== "/" && req.nextUrl.pathname !== "/about" && req.nextUrl.pathname !== "/login" && req.nextUrl.pathname !== "/register") {
			$$hasUser.set(false);
			return NextResponse.redirect(new URL("/login", req.url));
		}

		$$hasUser.set(false);
		return NextResponse.next();
	}

	$$hasUser.set(true);
	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
