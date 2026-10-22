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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AuthState, signUp } from "@/app/actions/auth";
import { RegisterFormError } from "@/app/actions/types";

function handleRegisterSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
}

type RegisterFormProps = {
  onLoginClick: () => void;
};
const initialState: AuthState = {};

export function RegisterForm({ onLoginClick }: RegisterFormProps) {
  const [state, formAction] = useActionState(signUp, initialState);

  console.log(state);
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold">Регистрация</CardTitle>
        <CardDescription>
          Создайте аккаунт, чтобы сохранять точки на карте.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="register-email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Пароль</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="passwordRepeat">Повторите пароль</FieldLabel>
              <Input
                id="passwordRepeat"
                name="passwordRepeat"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
              />
            </Field>
            <div className="text-red-500 text-sm text-center">
              {state.error === RegisterFormError.NO_PASS
                ? "Введите пароль"
                : state.error === RegisterFormError.MISMATCH
                  ? "Пароли не совпадают"
                  : ""}
            </div>
            <Button type="submit" size="lg" className="h-10 w-full">
              Зарегистрироваться
            </Button>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="justify-center gap-1 text-sm">
        <span className="text-muted-foreground">Уже есть аккаунт?</span>
        <Button
          type="button"
          variant="link"
          className="h-auto p-0"
          onClick={onLoginClick}
        >
          Войти
        </Button>
      </CardFooter>
    </Card>
  );
}
