<?php

namespace App\Http\Requests\ShopOwner;

use App\Models\ShopProduct;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateShopProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();
        if (! $user || ! $user->isShopOwner()) {
            return false;
        }

        /** @var ShopProduct|string|int|null $shopProduct */
        $shopProduct = $this->route('shopProduct');

        if ($shopProduct instanceof ShopProduct) {
            return $user->shops()->where('id', $shopProduct->shop_id)->exists();
        }

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'price' => ['required', 'numeric', 'min:0'],
            'compare_at_price' => ['nullable', 'numeric', 'min:0'],
            'custom_title' => ['nullable', 'string', 'max:255'],
            'custom_description' => ['nullable', 'string'],
            'stock' => ['required', 'integer', 'min:0'],
            'is_available' => ['boolean'],
            'custom_thumbnail' => ['nullable', 'image', 'max:3072'],
            'remove_custom_thumbnail' => ['nullable', 'boolean'],
        ];
    }
}
