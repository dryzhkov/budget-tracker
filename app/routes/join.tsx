import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { Header } from "~/components/header";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { getUserByEmail } from "~/models/user.server";
import { getUserId } from "~/session.server";
import { validateEmail } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  // const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 },
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 },
    );
  }

  if (password.length < 7) {
    return json(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 },
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      {
        errors: {
          email: "A user already exists with this email",
          password: null,
        },
      },
      { status: 400 },
    );
  }

  // const user = await createUser(email, password);

  // return createUserSession({
  //   redirectTo,
  //   remember: false,
  //   request,
  //   userId: user.id,
  // });

  return json(
    {
      errors: {
        email: "No new signups at this time, sorry",
        password: null,
      },
    },
    { status: 400 },
  );
};

export const meta: MetaFunction = () => [{ title: "Sign Up" }];

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Sign up for a new account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  ref={emailRef}
                  id="email"
                  required
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus={true}
                  name="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={actionData?.errors?.email ? true : undefined}
                  aria-describedby="email-error"
                />
                {actionData?.errors?.email ? (
                  <p className="text-sm text-destructive" id="email-error">
                    {actionData.errors.email}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  ref={passwordRef}
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={
                    actionData?.errors?.password ? true : undefined
                  }
                  aria-describedby="password-error"
                />
                {actionData?.errors?.password ? (
                  <p className="text-sm text-destructive" id="password-error">
                    {actionData.errors.password}
                  </p>
                ) : null}
              </div>

              <input type="hidden" name="redirectTo" value={redirectTo} />
              <Button type="submit" className="w-full">
                Create Account
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  className="text-primary underline"
                  to={{
                    pathname: "/login",
                    search: searchParams.toString(),
                  }}
                >
                  Log in
                </Link>
              </p>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
