export interface Categories {
    id: number;
    name: string;
    description: string;
    parent_id: number;
    image_url: string;
    status: boolean;
    home_page: boolean;
    is_menu: boolean;
    sort_order: number;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    page_title: string;
    parent?: {
        name: string;
    };
}
