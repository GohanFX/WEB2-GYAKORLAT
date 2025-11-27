import { Card } from "~/components/ui/card";
import { RegisterForm } from "~/components/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <RegisterForm />
      </Card>
    </div>
  );
}
