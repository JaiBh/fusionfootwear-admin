import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:css|js|png|jpg|jpeg|svg|woff|woff2|ttf|eot|ico)).*)",
  ],
};
