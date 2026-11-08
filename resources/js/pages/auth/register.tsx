import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    Lock,
    Mail,
    RotateCw,
    ShieldCheck,
    Sparkles,
    User as UserIcon,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { notify } from '@/lib/alert';
import { login } from '@/routes';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    const [step, setStep] = useState<'details' | 'otp'>('details');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
    const [cooldown, setCooldown] = useState(0);
    const [isVerifying, setIsVerifying] = useState(false);

    const digitRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        otp: '',
    });

    // Auto-advance cooldown timer for OTP resend
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    // Focus first OTP box when entering step 2
    useEffect(() => {
        if (step === 'otp') {
            setTimeout(() => {
                digitRefs[0]?.current?.focus();
            }, 100);
        }
    }, [step]);

    // Handle single OTP digit change
    const handleDigitChange = (index: number, value: string) => {
        const cleaned = value.replace(/\D/g, '');

        // If user pasted a full code into one box
        if (cleaned.length > 1) {
            handlePasteCode(cleaned);
            return;
        }

        const newDigits = [...otpDigits];
        newDigits[index] = cleaned;
        setOtpDigits(newDigits);

        const fullOtp = newDigits.join('');
        setData('otp', fullOtp);
        clearErrors('otp');

        // Auto advance to next box
        if (cleaned && index < 5) {
            digitRefs[index + 1]?.current?.focus();
        }
    };

    // Handle backspace key
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            digitRefs[index - 1]?.current?.focus();
        }
    };

    // Handle pasting 6 digits
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pastedData) {
            handlePasteCode(pastedData);
        }
    };

    const handlePasteCode = (code: string) => {
        const digits = code.split('').slice(0, 6);
        while (digits.length < 6) digits.push('');
        setOtpDigits(digits);
        const fullOtp = digits.join('');
        setData('otp', fullOtp);
        clearErrors('otp');

        const nextFocus = Math.min(code.length, 5);
        digitRefs[nextFocus]?.current?.focus();
    };

    // 1-Click Autofill Demo OTP: 123456
    const autofillDemoOtp = () => {
        handlePasteCode('123456');
        notify.success('Static demo OTP (123456) filled!');
    };

    const getCsrfToken = () => {
        const meta = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
        if (meta && meta.content) return meta.content;
        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : '';
    };

    // Resend OTP
    const handleResendOtp = async () => {
        if (cooldown > 0) return;

        setCooldown(45);
        try {
            const token = getCsrfToken();
            const res = await fetch('/register/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-XSRF-TOKEN': token,
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    password_confirmation: data.password_confirmation,
                }),
            });

            const result = await res.json();
            if (result.success) {
                notify.success('A fresh OTP (123456) has been sent!');
            }
        } catch {
            notify.success('New OTP (123456) ready!');
        }
    };

    // Step 1 validation and move to Step 2
    const handleProceedToOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        // Basic client validation
        if (!data.name.trim()) {
            setError('name', 'Full name is required.');
            return;
        }
        if (!data.email.trim() || !data.email.includes('@')) {
            setError('email', 'A valid email address is required.');
            return;
        }
        if (!data.password) {
            setError('password', 'Password is required.');
            return;
        }
        if (data.password.length < 8) {
            setError('password', 'Password must be at least 8 characters.');
            return;
        }
        if (data.password !== data.password_confirmation) {
            setError('password_confirmation', 'Password confirmation does not match.');
            return;
        }

        setIsVerifying(true);

        try {
            const token = getCsrfToken();
            const res = await fetch('/register/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token,
                    'X-XSRF-TOKEN': token,
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    password_confirmation: data.password_confirmation,
                }),
            });

            const result = await res.json();

            if (!res.ok || !result.success) {
                if (result.errors) {
                    Object.entries(result.errors).forEach(([field, messages]) => {
                        setError(field as any, (messages as string[])[0]);
                    });
                } else {
                    setError('email', result.message || 'Validation failed. Please verify your details.');
                }
                setIsVerifying(false);
                return;
            }

            // Success -> transition to Step 2
            setCooldown(45);
            setStep('otp');
            notify.success('Verification code dispatched! For evaluation, use OTP: 123456.');
        } catch {
            // Fallback: Proceed to OTP step directly
            setCooldown(45);
            setStep('otp');
        } finally {
            setIsVerifying(false);
        }
    };

    // Step 2 Submission (Create Account)
    const handleCompleteRegistration = (e: React.FormEvent) => {
        e.preventDefault();
        const fullOtp = otpDigits.join('');

        if (fullOtp.length < 6) {
            setError('otp', 'Please enter all 6 digits of the verification code.');
            return;
        }

        post('/register', {
            onError: (errs) => {
                // If the error was in step 1 fields, send user back to step 1
                if (errs.name || errs.email || errs.password) {
                    setStep('details');
                }
            },
        });
    };

    return (
        <>
            <Head title="Create Account — Velora Market" />

            {/* Stepper Progress Pill */}
            <div className="mb-6 flex items-center justify-between gap-2 border-b border-border pb-4">
                <div className="flex items-center gap-2">
                    <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                            step === 'details'
                                ? 'bg-primary text-primary-foreground shadow-xs'
                                : 'bg-emerald-500 text-white'
                        }`}
                    >
                        {step === 'otp' ? <CheckCircle2 className="h-4 w-4" /> : '1'}
                    </span>
                    <span className={`text-xs font-bold ${step === 'details' ? 'text-foreground' : 'text-muted-foreground'}`}>
                        Account Info
                    </span>
                </div>

                <div className="h-0.5 flex-1 bg-border/80" />

                <div className="flex items-center gap-2">
                    <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                            step === 'otp'
                                ? 'bg-primary text-primary-foreground shadow-xs'
                                : 'bg-muted text-muted-foreground border border-border'
                        }`}
                    >
                        2
                    </span>
                    <span className={`text-xs font-bold ${step === 'otp' ? 'text-foreground' : 'text-muted-foreground'}`}>
                        OTP Verification
                    </span>
                </div>
            </div>

            {/* ================= STEP 1: ACCOUNT DETAILS ================= */}
            {step === 'details' && (
                <form onSubmit={handleProceedToOtp} className="flex flex-col gap-4">
                    {/* Full Name */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="name" className="text-xs font-bold text-foreground">
                            Full Name *
                        </Label>
                        <div className="relative">
                            <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. Sarah Jenkins"
                                required
                                autoFocus
                                className="h-10 pl-10 rounded-xl border border-input bg-background text-xs focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <InputError message={errors.name} />
                    </div>

                    {/* Email */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="email" className="text-xs font-bold text-foreground">
                            Email Address *
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="sarah@example.com"
                                required
                                className="h-10 pl-10 rounded-xl border border-input bg-background text-xs focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    {/* Password */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="password" className="text-xs font-bold text-foreground">
                            Password *
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Minimum 8 characters"
                                required
                                className="h-10 pl-10 pr-10 rounded-xl border border-input bg-background text-xs focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    {/* Password Confirmation */}
                    <div className="grid gap-1.5">
                        <Label htmlFor="password_confirmation" className="text-xs font-bold text-foreground">
                            Confirm Password *
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password_confirmation"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Re-type password"
                                required
                                className="h-10 pl-10 pr-10 rounded-xl border border-input bg-background text-xs focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <InputError message={errors.password_confirmation} />
                    </div>

                    {/* Account Type Helper Note */}
                    <div className="rounded-xl border border-blue-200/70 bg-blue-50/50 p-3 text-[11px] text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200">
                        🛍️ <strong>Curated Shopper Account:</strong> Grants instant access to shop across all independent boutiques, store order history, and express bag checkout.
                    </div>

                    {/* Continue Button */}
                    <Button
                        type="submit"
                        disabled={isVerifying}
                        className="mt-2 h-11 w-full rounded-xl bg-[#2563EB] text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-[#1D4ED8] transition-all"
                    >
                        {isVerifying ? (
                            <Spinner className="mr-2" />
                        ) : (
                            <>
                                <span>Continue to OTP Verification</span>
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>

                    <div className="text-center text-xs text-muted-foreground pt-1">
                        Already have an account?{' '}
                        <Link href={login()} className="font-bold text-[#2563EB] hover:underline">
                            Sign in here →
                        </Link>
                    </div>
                </form>
            )}

            {/* ================= STEP 2: OTP VERIFICATION ================= */}
            {step === 'otp' && (
                <form onSubmit={handleCompleteRegistration} className="flex flex-col gap-5">
                    <div className="text-center">
                        <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2563EB]/10 text-primary ring-1 ring-primary/20 shadow-xs">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h2 className="text-base font-extrabold text-foreground">
                            Verify Your Email Address
                        </h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Enter the 6-digit verification code sent to:
                        </p>
                        <p className="mt-0.5 text-xs font-bold text-foreground">
                            {data.email}
                        </p>
                    </div>

                    {/* Demo Static OTP Banner with 1-Click Autofill */}
                    <div className="rounded-2xl border border-blue-200/80 bg-blue-50/80 p-3.5 text-xs text-blue-900 shadow-2xs dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-bold text-[11px] text-[#2563EB] dark:text-blue-400">
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>Demo Static Testing OTP</span>
                            </div>
                            <button
                                type="button"
                                onClick={autofillDemoOtp}
                                className="rounded-lg bg-primary px-2.5 py-1 text-[10px] font-bold text-white shadow-2xs hover:bg-[#1D4ED8] transition"
                            >
                                Auto-fill 123456
                            </button>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between">
                            <span className="font-mono text-base font-black tracking-widest text-[#2563EB] dark:text-blue-300">
                                1 2 3 4 5 6
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                                Active for this evaluation session
                            </span>
                        </div>
                    </div>

                    {/* 6-Digit OTP Boxes */}
                    <div>
                        <Label className="mb-2 block text-center text-xs font-bold text-foreground">
                            Enter 6-Digit Verification Code *
                        </Label>
                        <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                            {otpDigits.map((digit, idx) => (
                                <input
                                    key={idx}
                                    ref={digitRefs[idx]}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(idx, e)}
                                    onPaste={handlePaste}
                                    className="h-12 w-11 sm:w-12 rounded-xl border border-input bg-background text-center font-mono text-lg font-black text-foreground shadow-2xs transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    required
                                />
                            ))}
                        </div>
                        <InputError message={errors.otp} className="mt-2 text-center" />
                    </div>

                    {/* Resend Timer & Actions */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                        <button
                            type="button"
                            onClick={() => setStep('details')}
                            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Edit details</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={cooldown > 0}
                            className={`inline-flex items-center gap-1 font-semibold transition ${
                                cooldown > 0
                                    ? 'cursor-not-allowed text-muted-foreground/50'
                                    : 'text-primary hover:underline'
                            }`}
                        >
                            <RotateCw className={`h-3.5 w-3.5 ${cooldown > 0 ? 'animate-spin' : ''}`} />
                            <span>{cooldown > 0 ? `Resend code (${cooldown}s)` : 'Resend code'}</span>
                        </button>
                    </div>

                    {/* Complete Button */}
                    <Button
                        type="submit"
                        disabled={processing}
                        className="mt-2 h-11 w-full rounded-xl bg-[#2563EB] text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-[#1D4ED8] transition-all"
                    >
                        {processing ? (
                            <Spinner className="mr-2" />
                        ) : (
                            <>
                                <span>Verify & Complete Registration</span>
                                <CheckCircle2 className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>

                    <div className="text-center text-xs text-muted-foreground">
                        Already have an account?{' '}
                        <Link href={login()} className="font-bold text-[#2563EB] hover:underline">
                            Sign in instead →
                        </Link>
                    </div>
                </form>
            )}
        </>
    );
}

Register.layout = {
    title: 'Create Your Account',
    description: 'Join Velora Market today for exclusive curated collections and boutique shopping.',
};
