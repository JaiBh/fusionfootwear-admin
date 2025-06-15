"use client";

import { SignIn, SignInButton, useAuth } from "@clerk/nextjs";

function SignInDropdown() {
  const { isSignedIn } = useAuth();
  return <>{!isSignedIn && <SignInButton></SignInButton>}</>;
}
export default SignInDropdown;
