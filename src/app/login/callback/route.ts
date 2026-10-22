import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/server"; // ваш серверный клиент

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // "next" — куда вернуть пользователя после входа (по умолчанию на главную)
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Важно: перенаправляем на origin, чтобы cookie установились для правильного домена
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Если что-то пошло не так — на страницу логина с ошибкой
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
