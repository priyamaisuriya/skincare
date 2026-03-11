import { ProductImages } from "./product-images";
export interface Products {
    id: number;
    name: string;
    slug: string;
    category_id: number;
    short_description: string;
    long_description: string;
    mrp: number;
    discount: number;
    amount: number;
    volume_weight: string;
    is_new: string;
    home_page: string;
    status: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    page_title: string;
    best_seller: string;
    how_to_use: string;
    shipping_return: string;
    image_url?: string;
    product_images: ProductImages[];
    related_products?: Products[];
}
