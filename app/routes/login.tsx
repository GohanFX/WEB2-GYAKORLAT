import { Card } from "~/components/ui/card";
import { LoginForm } from "~/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <LoginForm />
      </Card>
    </div>
  );
}
