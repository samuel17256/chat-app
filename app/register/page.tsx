import { redirect } from "next/navigation";
import RegisterForm from "@/components/RegisterForm";
import { getAuthUser } from "@/lib/auth-server";

export default async function RegisterPage() {
  const user = await getAuthUser();
  if (user) redirect("/gist");

  return <RegisterForm />;
}
