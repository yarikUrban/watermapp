"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "../lib/server";
import { redirect } from "next/navigation";
import { RegisterFormError } from "./types";

export type AuthState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function signUp(
  prevData: any,
  formData: FormData,
): Promise<AuthState> {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const passwordRepeat = formData.get("passwordRepeat") as string;

  if (!password || !passwordRepeat) {
    return { error: RegisterFormError.NO_PASS };
  } else if (password && passwordRepeat && password != passwordRepeat) {
    return { error: RegisterFormError.MISMATCH };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message, fieldErrors: {} };
  }

  revalidatePath("/");
  redirect("/");
}

export async function signIn(
  prevData: any,
  formData: FormData,
): Promise<AuthState> {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message, fieldErrors: {} };
  }

  revalidatePath("/");
  redirect("/");
}

export async function signInGoogle(): Promise<AuthState> {
  const supabase = await createClient();

  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/login/callback",
    },
  });
  if (error) {
    console.log("ERROR:", error);
    return { error: error.message, fieldErrors: {} };
  } else if (data) {
    redirect(data.url);
  }

  revalidatePath("/");
  redirect("/");
}

export async function logOut(): Promise<AuthState> {
  const supabase = await createClient();

  const signOut = await supabase.auth.signOut();
  console.log(signOut);

  revalidatePath("/");
  redirect("/");
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user || null;
}
