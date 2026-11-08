<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $shop_id
 * @property int $product_id
 * @property string $price
 * @property string|null $custom_title
 * @property string|null $custom_description
 * @property string|null $custom_thumbnail
 * @property int $stock
 * @property bool $is_available
 * @property-read string $display_title
 * @property-read string $display_description
 * @property-read string|null $display_thumbnail
 * @property-read Shop|null $shop
 * @property-read Product|null $product
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class ShopProduct extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;

    protected $fillable = [
        'shop_id',
        'product_id',
        'price',
        'custom_title',
        'custom_description',
        'custom_thumbnail',
        'stock',
        'is_available',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
        'is_available' => 'boolean',
    ];

    protected $appends = [
        'display_title',
        'display_description',
        'display_thumbnail',
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
}
