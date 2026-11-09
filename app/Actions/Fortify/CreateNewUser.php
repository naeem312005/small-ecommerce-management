<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'otp' => ['required', 'string', function (string $attribute, mixed $value, \Closure $fail): void {
                if ($value !== '123456') {
                    $fail('The verification OTP is invalid. For evaluation and demo purposes, please enter 123456.');
                }
            }],
        ], [
            'otp.required' => 'Please enter the 6-digit verification OTP code.',
        ])->validate();

        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => $input['password'],
                'role' => 'customer',
                'email_verified_at' => now(),
            ]);

            $user->markEmailAsVerified();

            DB::commit();

            session()->forget(['registration_otp', 'registration_otp_email', 'registration_otp_time']);

            return $user;
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('CreateNewUser failed: '.$e->getMessage(), ['exception' => $e]);

            throw $e;
        }
    }
}
