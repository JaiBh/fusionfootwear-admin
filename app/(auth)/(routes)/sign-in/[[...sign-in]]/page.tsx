"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

function SignInPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  return <SignIn forceRedirectUrl={redirectUrl}></SignIn>;
}
export default SignInPage;
