import { Form, Head } from '@inertiajs/react';
import { Key, Shield, Store } from 'lucide-react';
import React, { useRef } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import PasskeyVerify from '@/components/passkey-verify';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const fillCredentials = (email: string, pass: string) => {
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
            <Head title="Log in" />

            <PasskeyVerify />

            {/* Quick Demo Autofill Bar */}
            <div className="mb-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-900/60">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[11px] text-slate-700 uppercase tracking-wider dark:text-slate-300">
                        Demo Account Autofill
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">pass: password123</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                    <button
                        type="button"
                        onClick={() => fillCredentials('admin@ecommerce.com', 'password123')}
                        className="rounded-xl border border-slate-200 bg-white py-1.5 px-2 text-[11px] font-bold text-slate-800 shadow-xs hover:border-indigo-400 hover:text-indigo-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                    >
                        Admin
                    </button>
                    <button
                        type="button"
                        onClick={() => fillCredentials('tech@ecommerce.com', 'password123')}
                        className="rounded-xl border border-slate-200 bg-white py-1.5 px-2 text-[11px] font-bold text-slate-800 shadow-xs hover:border-indigo-400 hover:text-indigo-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                    >
                        TechNova
                    </button>
                    <button
                        type="button"
                        onClick={() => fillCredentials('fashion@ecommerce.com', 'password123')}
                        className="rounded-xl border border-slate-200 bg-white py-1.5 px-2 text-[11px] font-bold text-slate-800 shadow-xs hover:border-indigo-400 hover:text-indigo-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                    >
                        Aura Apparel
                    </button>
                </div>
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm"
                                            tabIndex={5}
                                        >
                                            Forgot your password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Log in
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <TextLink href={register()} tabIndex={5}>
                                Sign up
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
