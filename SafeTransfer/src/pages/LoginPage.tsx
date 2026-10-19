import {Link} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {useLogin} from '@/hooks/mutations/useLogin';
import { Lock } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" })
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
    const login = useLogin();

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormData) => {
        login.mutate(data);
    };

    return (
        <div className="min-h-dvh flex flex-col items-center justify-center bg-background px-4">
            <div className="flex flex-row items-center gap-3 mb-6">
                <img
                    src="/safetransfer-logo.svg"
                    alt="SafeTransfer"
                    className="h-10 w-auto"
                />
                <span className="text-xl font-semibold">SafeTransfer</span>
            </div>
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2">
                    <div className="space-y-1 text-center">
                        <CardTitle className="text-2xl">Sign in</CardTitle>
                        <CardDescription>Enter your credentials to continue</CardDescription>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                className="py-5"
                                placeholder="you@example.com"
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                className="py-5"
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password.message}</p>
                            )}
                        </div>
                        {login.isError && (
                            <div className="text-sm text-destructive text-center">
                                Invalid email or password
                            </div>
                        )}
                        <Button type="submit" className="w-full p-5" disabled={login.isPending}>
                            {login.isPending ? 'Signing in...' : 'Sign in'}
                        </Button>
                        <div className="flex justify-center pt-3">
                            <p className="text-sm text-muted-foreground">
                                No account yet?{' '}
                                <Link to="/register"
                                      className="text-foreground underline underline-offset-4 hover:text-primary">
                                    Create one
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </form>
            </Card>
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mt-6 text-center">
                <Lock className="size-4 shrink-0" />
                <span>Your password also unlocks your post-quantum key.</span>
            </div>
        </div>
    );
}
