import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

function SignUpPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  return <SignUp forceRedirectUrl={redirectUrl}></SignUp>;
}
export default SignUpPage;
