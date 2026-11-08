import { Form, Head } from '@inertiajs/react';
import { ArrowRight, Eye, EyeOff, Lock, Mail, Shield, Sparkles, Store, User } from 'lucide-react';
import React, { useState } from 'react';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [activePersona, setActivePersona] = useState<string | null>(null);

    const fillCredentials = (email: string, pass: string, personaKey: string) => {
        setActivePersona(personaKey);
        const emailInput = document.getElementById('email') as HTMLInputElement;
        const passInput = document.getElementById('password') as HTMLInputElement;
        if (emailInput && passInput) {
            emailInput.value = email;
            passInput.value = pass;
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));
            passInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
    };

    return (
        <>
            <Head title="Sign In — Velora Market" />

            <PasskeyVerify />

            {/* Quick Demo Autofill Bar */}
            <div className="mb-6 rounded-2xl border border-blue-200/80 bg-blue-50/60 p-3.5 text-xs dark:border-blue-900/40 dark:bg-blue-950/30">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-[11px] text-[#2563EB] uppercase tracking-wider flex items-center gap-1.5 dark:text-blue-400">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>1-Click Demo Evaluation Sign In</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">pass: password123</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                    <button
                        type="button"
                        onClick={() => fillCredentials('admin@ecommerce.com', 'password123', 'admin')}
                        className={`flex items-center gap-2 rounded-xl border p-2 text-left transition-all ${
                            activePersona === 'admin'
                                ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-bold shadow-2xs dark:bg-blue-950/60 dark:text-blue-300'
                                : 'border-border bg-card text-foreground hover:border-[#2563EB] hover:text-[#2563EB]'
                        }`}
                    >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-primary">
                            <Shield className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                            <span className="block text-[11px] font-bold leading-tight">Admin Console</span>
                            <span className="block text-[9px] text-muted-foreground truncate">admin@ecommerce.com</span>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => fillCredentials('tech@ecommerce.com', 'password123', 'tech')}
                        className={`flex items-center gap-2 rounded-xl border p-2 text-left transition-all ${
                            activePersona === 'tech'
                                ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-bold shadow-2xs dark:bg-blue-950/60 dark:text-blue-300'
                                : 'border-border bg-card text-foreground hover:border-[#2563EB] hover:text-[#2563EB]'
                        }`}
                    >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                            <Store className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                            <span className="block text-[11px] font-bold leading-tight">TechNova Shop</span>
                            <span className="block text-[9px] text-muted-foreground truncate">tech@ecommerce.com</span>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => fillCredentials('fashion@ecommerce.com', 'password123', 'fashion')}
                        className={`flex items-center gap-2 rounded-xl border p-2 text-left transition-all ${
                            activePersona === 'fashion'
                                ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-bold shadow-2xs dark:bg-blue-950/60 dark:text-blue-300'
                                : 'border-border bg-card text-foreground hover:border-[#2563EB] hover:text-[#2563EB]'
                        }`}
                    >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
                            <Store className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                            <span className="block text-[11px] font-bold leading-tight">Aura Apparel</span>
                            <span className="block text-[9px] text-muted-foreground truncate">fashion@ecommerce.com</span>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => fillCredentials('customer@ecommerce.com', 'password123', 'customer')}
                        className={`flex items-center gap-2 rounded-xl border p-2 text-left transition-all ${
                            activePersona === 'customer'
                                ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-bold shadow-2xs dark:bg-blue-950/60 dark:text-blue-300'
                                : 'border-border bg-card text-foreground hover:border-[#2563EB] hover:text-[#2563EB]'
                        }`}
                    >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                            <User className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                            <span className="block text-[11px] font-bold leading-tight">Customer View</span>
                            <span className="block text-[9px] text-muted-foreground truncate">customer@ecommerce.com</span>
                        </div>
                    </button>
                </div>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-4">
                            {/* Email */}
                            <div className="grid gap-1.5">
                                <Label htmlFor="email" className="text-xs font-bold text-foreground">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                        className="h-10 pl-10 rounded-xl border border-input bg-background text-xs focus:border-primary focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            {/* Password */}
                            <div className="grid gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-xs font-bold text-foreground">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-[11px] text-primary hover:underline"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="h-10 pl-10 pr-10 rounded-xl border border-input bg-background text-xs focus:border-primary focus:ring-1 focus:ring-primary"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center space-x-2 pt-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="rounded-md border-border"
                                />
                                <Label htmlFor="remember" className="text-xs text-muted-foreground font-normal cursor-pointer">
                                    Remember my session for 30 days
                                </Label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="mt-2 h-11 w-full rounded-xl bg-[#2563EB] text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-[#1D4ED8] transition-all"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing ? (
                                    <Spinner className="mr-2" />
                                ) : (
                                    <>
                                        <span>Sign In to Your Account</span>
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="text-center text-xs text-muted-foreground pt-1">
                            Don't have an account yet?{' '}
                            <TextLink href={register()} tabIndex={5} className="font-bold text-[#2563EB] hover:underline">
                                Create an account →
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Sign In to Your Account',
    description: 'Welcome back! Select an evaluation persona or enter your credentials below.',
};
