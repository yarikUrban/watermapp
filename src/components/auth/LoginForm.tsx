"use client";
import { useActionState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AuthState, signIn, signInGoogle, signUp } from "@/app/actions/auth";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.07-1.48-.23-2.13H12v3.87h6.47c-.13 1.07-.84 2.68-2.42 3.76l-.02.14 3.51 2.72.24.02c2.24-2.07 3.54-5.12 3.54-8.38"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.79-2.94c-1.01.7-2.37 1.19-4.16 1.19-3.19 0-5.9-2.1-6.87-5.01l-.14.01-3.7 2.87-.05.13C3.22 21.33 7.31 24 12 24"
      />
      <path
        fill="#FBBC05"
        d="M5.13 14.33A7.24 7.24 0 0 1 4.75 12c0-.81.14-1.6.36-2.33l-.01-.16-3.75-2.91-.12.06A12 12 0 0 0 0 12c0 1.94.46 3.78 1.28 5.4l3.85-3.07"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c2.25 0 3.77.97 4.64 1.78l3.39-3.31C17.95 1.19 15.24 0 12 0 7.31 0 3.22 2.67 1.23 6.56l3.85 3.07C6.1 6.72 8.81 4.75 12 4.75"
      />
    </svg>
  );
}

type LoginFormProps = {
  onRegisterClick: () => void;
};

const initialState: AuthState = {};

export function LoginForm({ onRegisterClick }: LoginFormProps) {
  const [state, formAction] = useActionState(signIn, initialState);

  const handleGoogleSignIn = () => {
    signInGoogle();
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold">
          Вход в Watermap
        </CardTitle>
        <CardDescription>
          Войдите по логину или через Google, чтобы открыть карту.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction}>
          <FieldGroup>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-10 w-full"
              onClick={handleGoogleSignIn}
            >
              <GoogleIcon />
              Войти через Google
            </Button>

            <FieldSeparator>или</FieldSeparator>

            <Field>
              <FieldLabel htmlFor="email">Логин</FieldLabel>
              <Input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                placeholder="Ваш логин"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Пароль</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </Field>

            <Button type="submit" size="lg" className="h-10 w-full">
              Войти
            </Button>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="justify-center gap-1 text-sm">
        <span className="text-muted-foreground">Нет аккаунта?</span>
        <Button
          type="button"
          variant="link"
          className="h-auto p-0"
          onClick={onRegisterClick}
        >
          Зарегистрироваться
        </Button>
      </CardFooter>
    </Card>
  );
}
