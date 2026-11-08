import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    Filter,
    Layers,
    Package,
    Plus,
    PlusCircle,
    Search,
    Shield,
    Store,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginatedData, Product, Shop } from '@/types';

type Props = {
    shop: Shop | null;
    products: PaginatedData<Product>;
    addedProductIds: number[];
    categories: string[];
    filters: {
        search?: string;
        category?: string;
        filter?: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Shop Management', href: '/shop-owner/dashboard' },
    { title: 'Shared Master Catalog', href: '/shop-owner/catalog' },
];

export default function ShopOwnerCatalogIndex({
    shop,
    products,
    addedProductIds,
    categories,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
    const [filterStatus, setFilterStatus] = useState(filters.filter || '');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Form for Adding Product to Shop
    const { data, setData, post, processing, errors, reset } = useForm({
        price: '',
        custom_title: '',
        custom_description: '',
        stock: 50,
        custom_thumbnail: null as File | null,
    });

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/shop-owner/catalog',
            {
                search: search || undefined,
                category: category || undefined,
                filter: filterStatus || undefined,
            },
            { preserveState: true }
        );
    };

    const openAddModal = (product: Product) => {
        setSelectedProduct(product);
        setData({
            price: String(product.base_price),
            custom_title: '',
            custom_description: product.description || '',
            stock: 50,
            custom_thumbnail: null,
        });
    };

    const closeAddModal = () => {
        setSelectedProduct(null);
        reset();
    };

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;

        post(`/shop-owner/catalog/${selectedProduct.id}/add`, {
            onSuccess: () => {
                setSelectedProduct(null);
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Shared Master Catalog - Shop Management" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-foreground">
                                Shared Product Catalog
                            </h1>
                            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
                                Global Master Catalog
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Products created by administrators or fellow shop owners. Select any item to list in {shop?.name ?? 'your shop'}.
                        </p>
                    </div>

                    <Link
                        href="/shop-owner/catalog/create"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-xs transition hover:opacity-90"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Create & Contribute New Product</span>
                    </Link>
                </div>

                {/* Filter and Search Bar */}
                <form
                    onSubmit={handleFilter}
                    className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search catalog by product name, SKU, or details..."
                            className="w-full rounded-xl border border-input bg-background py-2 pl-10 pr-4 text-xs text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="rounded-xl border border-input bg-background py-2 pl-3 pr-8 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                            <option value="">All Categories</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="rounded-xl border border-input bg-background py-2 pl-3 pr-8 text-xs text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                        >
                            <option value="">All Catalog Products</option>
                            <option value="not_added">Not in My Shop Yet</option>
                            <option value="added">Already in My Shop</option>
                        </select>

                        <button
                            type="submit"
                            className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 shadow-2xs"
                        >
                            Filter
                        </button>
                    </div>
                </form>

                {/* Grid */}
                <div>
                    {products.data.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                            <Layers className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-3 text-sm font-bold text-foreground">
                                No products found in shared catalog
                            </h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Try adjusting your filter terms or create a new product to add to the catalog.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.data.map((product) => {
                                const isAdded = addedProductIds.includes(product.id);
                                const isAuthorShopOwner = product.creator?.role === 'shop_owner';

                                return (
                                    <div
                                        key={product.id}
                                        className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition hover:border-primary/40 hover:shadow-md"
                                    >
                                        {/* Image */}
                                        <div className="relative aspect-square w-full overflow-hidden bg-muted/60">
                                            {product.thumbnail ? (
                                                <img
                                                    src={product.thumbnail}
                                                    alt={product.name}
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                                        if (fallback) fallback.style.display = 'flex';
                                                    }}
                                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                />
                                            ) : null}

                                            {/* Fallback Icon when no thumbnail or on load error */}
                                            <div
                                                className={`h-full w-full items-center justify-center text-muted-foreground ${product.thumbnail ? 'hidden' : 'flex'}`}
                                            >
                                                <Package className="h-12 w-12 text-muted-foreground/60" />
                                            </div>

                                            {/* Category Tag */}
                                            <span className="absolute top-3 left-3 rounded-md border border-border/80 bg-white/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground shadow-2xs backdrop-blur-xs dark:bg-slate-900/95">
                                                {product.category}
                                            </span>

                                            {/* Status Badge */}
                                            {isAdded && (
                                                <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-[#16A34A] shadow-xs dark:border-emerald-800 dark:bg-emerald-950/80">
                                                    <CheckCircle2 className="h-3 w-3" /> In Your Shop
                                                </span>
                                            )}
                                        </div>

                                        {/* Body */}
                                        <div className="flex flex-1 flex-col p-4">
                                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                                {isAuthorShopOwner ? (
                                                    <Store className="h-3 w-3 text-primary" />
                                                ) : (
                                                    <Shield className="h-3 w-3 text-primary" />
                                                )}
                                                <span>
                                                    Authored by: <strong className="text-foreground">{product.creator?.name ?? 'Admin'}</strong>
                                                </span>
                                            </div>

                                            <h3 className="mt-1.5 text-sm font-bold tracking-tight text-foreground line-clamp-2 min-h-[2.5rem]">
                                                {product.name}
                                            </h3>

                                            <span className="mt-1 font-mono text-[11px] text-muted-foreground">
                                                SKU: {product.sku}
                                            </span>

                                            <p className="mt-2 text-xs text-muted-foreground line-clamp-2 flex-1">
                                                {product.description || 'Master catalog product.'}
                                            </p>

                                            {/* Price & Action */}
                                            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                                                <div>
                                                    <span className="block text-[10px] uppercase font-semibold text-muted-foreground">
                                                        MSRP Base
                                                    </span>
                                                    <span className="text-base font-extrabold text-foreground">
                                                        ${Number(product.base_price).toFixed(2)}
                                                    </span>
                                                </div>

                                                {isAdded ? (
                                                    <Link
                                                        href="/shop-owner/products"
                                                        className="inline-flex items-center gap-1.5 rounded-xl border border-input bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted hover:border-primary transition-colors shadow-2xs"
                                                    >
                                                        <Store className="h-3.5 w-3.5 text-primary" />
                                                        <span>Manage in Shop</span>
                                                    </Link>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => openAddModal(product)}
                                                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-[#1D4ED8] transition-colors shadow-2xs"
                                                    >
                                                        <Plus className="h-3.5 w-3.5" />
                                                        <span>Add to Shop</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {products.links && products.links.length > 3 && (
                        <div className="mt-10 flex items-center justify-between border-t border-slate-200 p-4 text-xs dark:border-slate-800">
                            <span className="text-slate-500">
                                Showing {products.from ?? 0} to {products.to ?? 0} of {products.total} catalog products
                            </span>
                            <div className="flex items-center gap-1">
                                {products.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground'
                                                : !link.url
                                                  ? 'cursor-not-allowed text-slate-400'
                                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal to Add Product to Shop */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
                    <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <div>
                                <h3 className="text-base font-bold tracking-tight text-foreground">
                                    Add to {shop?.name ?? 'My Shop'}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Set your shop's initial price and stock for this catalog product.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeAddModal}
                                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Selected Product Summary */}
                        <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
                            {selectedProduct.thumbnail ? (
                                <img
                                    src={selectedProduct.thumbnail}
                                    alt={selectedProduct.name}
                                    className="h-12 w-12 rounded-lg object-cover ring-1 ring-border"
                                />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                    <Package className="h-6 w-6" />
                                </div>
                            )}
                            <div>
                                <h4 className="text-xs font-bold text-foreground">
                                    {selectedProduct.name}
                                </h4>
                                <span className="text-[11px] text-muted-foreground font-mono">
                                    Catalog Base MSRP: ${Number(selectedProduct.base_price).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={submitAdd} className="mt-5 space-y-4">
                            {/* Price & Stock */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-foreground">
                                        Your Shop Price ($) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        required
                                    />
                                    {errors.price && (
                                        <p className="mt-1 text-xs text-destructive">{errors.price}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-foreground">
                                        Initial Inventory Stock *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.stock}
                                        onChange={(e) => setData('stock', parseInt(e.target.value) || 0)}
                                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        required
                                    />
                                    {errors.stock && (
                                        <p className="mt-1 text-xs text-destructive">{errors.stock}</p>
                                    )}
                                </div>
                            </div>

                            {/* Custom Title Override */}
                            <div>
                                <label className="block text-xs font-semibold text-foreground">
                                    Custom Title (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={data.custom_title}
                                    onChange={(e) => setData('custom_title', e.target.value)}
                                    placeholder={selectedProduct.name}
                                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            {/* Custom Description Override */}
                            <div>
                                <label className="block text-xs font-semibold text-foreground">
                                    Custom Details / Description (Optional)
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.custom_description}
                                    onChange={(e) => setData('custom_description', e.target.value)}
                                    placeholder="Enter custom description or leave default..."
                                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end gap-2 border-t border-border pt-4">
                                <button
                                    type="button"
                                    onClick={closeAddModal}
                                    className="rounded-xl border border-input bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-[#1D4ED8] disabled:opacity-50 shadow-xs transition-colors"
                                >
                                    {processing ? 'Adding...' : 'Confirm & Add to Shop'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

