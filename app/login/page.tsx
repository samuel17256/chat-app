import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { getAuthUser } from "@/lib/auth-server";

export default async function LoginPage() {
  const user = await getAuthUser();
  if (user) redirect("/gist");

  return <LoginForm />;
}
