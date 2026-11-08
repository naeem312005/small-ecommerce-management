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

            {/* Quick Demo Helper Box */}
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
                <div className="flex items-center gap-1.5 font-bold mb-2">
                    <Key className="h-3.5 w-3.5 text-amber-600" />
                    <span>Quick Demo Credentials (Click to fill):</span>
                </div>
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
                    <button
                        type="button"
                        onClick={() => fillCredentials('admin@ecommerce.com', 'password123')}
                        className="flex items-center justify-center gap-1 rounded-lg border border-indigo-200 bg-white py-1.5 px-2 text-[11px] font-semibold text-indigo-700 shadow-xs hover:bg-indigo-50 dark:bg-slate-800 dark:border-slate-700 dark:text-indigo-300"
                    >
                        <Shield className="h-3 w-3" />
                        <span>Admin</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => fillCredentials('tech@ecommerce.com', 'password123')}
                        className="flex items-center justify-center gap-1 rounded-lg border border-emerald-200 bg-white py-1.5 px-2 text-[11px] font-semibold text-emerald-700 shadow-xs hover:bg-emerald-50 dark:bg-slate-800 dark:border-slate-700 dark:text-emerald-300"
                    >
                        <Store className="h-3 w-3" />
                        <span>Tech Shop</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => fillCredentials('fashion@ecommerce.com', 'password123')}
                        className="flex items-center justify-center gap-1 rounded-lg border border-violet-200 bg-white py-1.5 px-2 text-[11px] font-semibold text-violet-700 shadow-xs hover:bg-violet-50 dark:bg-slate-800 dark:border-slate-700 dark:text-violet-300"
                    >
                        <Store className="h-3 w-3" />
                        <span>Fashion Shop</span>
                    </button>
                </div>
                <div className="mt-2 text-[10px] text-amber-800 dark:text-amber-300">
                    Password for all demo accounts: <code className="font-mono font-bold">password123</code>
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
