import {Link} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import {useRegister} from '@/hooks/mutations/useRegister';
import {StyledAvatar} from "@/components/StyledAvatar.tsx";

const registerSchema = z.object({
    displayName: z.string().min(1, 'Display name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z
        .string()
        .min(6, {message: "Password must be at least 6 characters long"})
        .regex(/[A-Z]/, {message: "Password must contain at least one uppercase letter"})
        .regex(/[0-9]/, {message: "Password must contain at least one number"})
        .regex(/[^A-Za-z0-9]/, {message: "Password must contain at least one special character"}),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
    const registerMutation = useRegister();

    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const displayName = watch('displayName', '');

    const onSubmit = (data: RegisterFormData) => {
        registerMutation.mutate({
            displayName: data.displayName,
            email: data.email,
            password: data.password,
        });
    };

    return (
        <div className="min-h-dvh flex flex-col items-center justify-center bg-background px-4 py-8">
                <div className="flex flex-row items-center gap-3 mb-6">
                    <img
                        src="/safetransfer-logo.svg"
                        alt="SafeTransfer"
                        className="h-10 w-auto"
                    />
                    <span className="text-xl font-semibold">SafeTransfer</span>
                </div>
                <Card className="w-full max-w-md">
                <CardHeader className="space-y-4">
                    <div className="space-y-1 text-center">
                        <CardTitle className="text-2xl">Create an account</CardTitle>
                        <CardDescription>We generate the encryption keys when you create your account.</CardDescription>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <div className="flex flex-row items-center gap-3 p-3 border border-input rounded-md">
                            <StyledAvatar
                                name={displayName || 'SafeTransfer'}
                            />
                            <p className="text-sm text-muted-foreground">
                            Your avatar is generated from your display name. Others see your name, but not your email.
                        </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input
                                id="displayName"
                                type="text"
                                className="py-5"
                                placeholder="Your name"
                                {...register('displayName')}
                            />
                            {errors.displayName && (
                                <p className="text-sm text-destructive">{errors.displayName.message}</p>
                            )}
                        </div>
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
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm password</Label>
                            <Input
                                className="py-5"
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                {...register('confirmPassword')}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                        {registerMutation.isError && (
                            <div className="text-sm text-destructive text-center">
                                Registration failed. Please try again.
                            </div>
                        )}
                        <Button type="submit" className="w-full p-5" disabled={registerMutation.isPending}>
                            {registerMutation.isPending ? 'Creating account...' : 'Create account'}
                        </Button>
                        <div className="flex justify-center pt-3">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <Link to="/login"
                                      className="text-foreground underline underline-offset-4 hover:text-primary">
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </form>
                </Card>
                <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mt-6 text-center">
                    <span>A password reset can't recover files previously shared, keep it safe.</span>
                </div>
        </div>
    );
}
