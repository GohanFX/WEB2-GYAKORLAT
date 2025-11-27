import { Button } from "~/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { loginSchema, type LoginData } from "~/schemas/auth";
import AuthService from "~/lib/services/auth";
import { useAuth } from "~/lib/auth-context";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginData) => {
    try {
      const response = await AuthService.login(data);
      await refreshAuth();
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    }
  };

  return (
    <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground text-balance">
            Sign in to your account
          </p>
        </div>
        
        <Field>
          <FieldLabel htmlFor="username">username</FieldLabel>
          <Input
            id="username"
            type="username"
            placeholder="Enter your username"
            {...register("username")}
            aria-invalid={errors.username ? "true" : "false"}
          />
          {errors.username && (
            <FieldDescription className="text-destructive">
              {errors.username.message}
            </FieldDescription>
          )}
        </Field>
        
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password")}
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password && (
            <FieldDescription className="text-destructive">
              {errors.password.message}
            </FieldDescription>
          )}
        </Field>
        
        <Field>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </Field>

        <FieldDescription className="text-center">
          Don&apos;t have an account? <Link to="/register" className="underline underline-offset-4">Sign up</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
