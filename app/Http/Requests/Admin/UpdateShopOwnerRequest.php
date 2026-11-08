<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateShopOwnerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var User|string|int|null $shopOwner */
        $shopOwner = $this->route('shop_owner') ?? $this->route('shopOwner');
        $shopOwnerId = $shopOwner instanceof User ? $shopOwner->id : $shopOwner;

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($shopOwnerId)],
            'phone' => ['nullable', 'string', 'max:50'],
            'password' => ['nullable', 'string', Password::default()],
        ];
    }
}
