/* eslint-disable react-hooks/rules-of-hooks */
import { redirect } from "next/navigation";
import { auth } from "@/app/shared/server/auth";

export default async function Home() {
  const session = await auth();

  if (!session) {
    // Se não autenticado, redirecionar para login
    redirect("/login");
  }

  // Se autenticado, redirecionar para employee por padrão
  // O usuário pode acessar /admin diretamente se tiver permissão
  redirect("/employee");
}
