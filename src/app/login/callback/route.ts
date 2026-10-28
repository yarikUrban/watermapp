import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/server"; // ваш серверный клиент

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is not defined");
  }
  const code = searchParams.get("code");
  // "next" — куда вернуть пользователя после входа (по умолчанию на главную)
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${baseUrl}${next}`);
    }
    // Логируем реальную ошибку, чтобы видеть её в логах Amplify
    console.error("Exchange code error:", error.message);
  }

  // Если что-то пошло не так — на страницу логина с ошибкой
  return NextResponse.redirect(`${baseUrl}/login?error=auth_callback_failed`);
}
