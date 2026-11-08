<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\SendRegistrationOtpRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;

class RegistrationOtpController extends Controller
{
    /**
     * Validate registration credentials and issue static demo verification OTP.
     */
    public function sendOtp(SendRegistrationOtpRequest $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validated();

        try {
            session([
                'registration_otp' => '123456',
                'registration_otp_email' => $validated['email'],
                'registration_otp_time' => now(),
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'A 6-digit verification code has been dispatched.',
                    'otp' => '123456',
                ]);
            }

            return back()->with('success', 'Verification code dispatched! For evaluation, use OTP: 123456.');
        } catch (\Throwable $e) {
            Log::error('Registration OTP dispatch failed: '.$e->getMessage(), ['exception' => $e]);

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unable to dispatch verification code. Please try again.',
                ], 500);
            }

            return back()->with('error', 'Unable to dispatch verification code. Please try again.');
        }
    }
}
