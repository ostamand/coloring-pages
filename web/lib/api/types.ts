export type Page = {
    id: number;
    full_path: string;
    thumbnail_path: string;
    colored_path: string | null;
    prompt: string;
    collection_name: string;
    created_on: string;
    featured_on: string | null;
    tags: string[];
    name: string;
    unique_name: string;
    overwrite_name: string;
    upd_collection_name: string;
};

export type Promotion = {
    id: number;
    heading: string;
    heading_url: string | null;
    sub_heading: string;
    background_url: string;
    background_color: string;
    showcase_page_id: number;
    collection_name: string;
    active: boolean;
    created_on: string;
    page: Page;
};

export type Collection = {
    name: string;
    display_name: string;
    heading: string | null;
    sub_heading: string | null;
    background_url: string;
    created_on: string;
};
