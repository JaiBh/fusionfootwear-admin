import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

function SignUpPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  return <SignUp></SignUp>;
}
export default SignUpPage;
