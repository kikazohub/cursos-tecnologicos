import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="bg-grid relative grid min-h-[70vh] place-items-center px-5 py-12">
      <Suspense fallback={<div className="h-72 w-full max-w-sm animate-pulse rounded-3xl bg-surface" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}