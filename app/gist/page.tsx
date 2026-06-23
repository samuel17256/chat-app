import { redirect } from "next/navigation";
import ChatRoom from "@/components/ChatRoom";
import { getAuthUser } from "@/lib/auth-server";

export default async function GistPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  return <ChatRoom user={user} />;
}
