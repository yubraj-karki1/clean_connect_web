import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/actions/auth-action";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}
