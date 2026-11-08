import type { User } from './auth';

export type Shop = {
    id: number;
    user_id: number;
    name: string;
    slug: string;
    description: string | null;
    logo: string | null;
    banner: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    owner?: User;
    shop_products_count?: number;
};

export type Product = {
    id: number;
    created_by: number;
    name: string;
    slug: string;
    sku: string;
    category: string;
    base_price: string | number;
    thumbnail: string | null;
    description: string | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    creator?: {
        id: number;
        name: string;
        role: string;
    };
    shop_products_count?: number;
};

export type ShopProduct = {
    id: number;
    shop_id: number;
    product_id: number;
    price: string | number;
    custom_title: string | null;
    custom_description: string | null;
    custom_thumbnail: string | null;
    stock: number;
    is_available: boolean;
    display_title?: string;
    display_description?: string;
    display_thumbnail?: string | null;
    created_at?: string;
    updated_at?: string;
    shop?: Shop;
    product?: Product;
};

export type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
};
