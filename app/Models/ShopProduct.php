<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $shop_id
 * @property int $product_id
 * @property string $price
 * @property string|null $compare_at_price
 * @property string|null $custom_title
 * @property string|null $custom_description
 * @property string|null $custom_thumbnail
 * @property int $stock
 * @property bool $is_available
 * @property-read string $display_title
 * @property-read string $display_description
 * @property-read string|null $display_thumbnail
 * @property-read string|null $effective_compare_at_price
 * @property-read bool $has_discount
 * @property-read int|null $discount_percent
 * @property-read Shop|null $shop
 * @property-read Product|null $product
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class ShopProduct extends Model
{
    /** @use HasFactory<UserFactory> */
    use HasFactory;

    protected $fillable = [
        'shop_id',
        'product_id',
        'price',
        'compare_at_price',
        'custom_title',
        'custom_description',
        'custom_thumbnail',
        'stock',
        'is_available',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'compare_at_price' => 'decimal:2',
        'stock' => 'integer',
        'is_available' => 'boolean',
    ];

    protected $appends = [
        'display_title',
        'display_description',
        'display_thumbnail',
        'effective_compare_at_price',
        'has_discount',
        'discount_percent',
    ];

    /**
     * @return BelongsTo<Shop, $this>
     */
    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getDisplayTitleAttribute(): string
    {
        if ($this->custom_title) {
            return $this->custom_title;
        }

        return $this->product instanceof Product ? $this->product->name : 'Untitled Product';
    }

    public function getDisplayDescriptionAttribute(): string
    {
        if ($this->custom_description) {
            return $this->custom_description;
        }

        return $this->product instanceof Product ? ($this->product->description ?? '') : '';
    }

    public function getDisplayThumbnailAttribute(): ?string
    {
        if ($this->custom_thumbnail) {
            return $this->custom_thumbnail;
        }

        return $this->product instanceof Product ? $this->product->thumbnail : null;
    }

    public function getEffectiveCompareAtPriceAttribute(): ?string
    {
        if ($this->compare_at_price !== null) {
            return (string) $this->compare_at_price;
        }

        if ($this->product instanceof Product && $this->product->compare_at_price !== null) {
            return (string) $this->product->compare_at_price;
        }

        return null;
    }

    public function getHasDiscountAttribute(): bool
    {
        $effective = $this->effective_compare_at_price;
        if ($effective === null) {
            return false;
        }

        return (float) $effective > (float) $this->price;
    }

    public function getDiscountPercentAttribute(): ?int
    {
        if (! $this->has_discount) {
            return null;
        }

        $effective = (float) $this->effective_compare_at_price;
        $price = (float) $this->price;

        if ($effective <= 0) {
            return null;
        }

        $percent = (int) round((($effective - $price) / $effective) * 100);

        return $percent > 0 ? $percent : null;
    }
}
