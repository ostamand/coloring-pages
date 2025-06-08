export type Page = {
    id: number;
    full_path: string;
    thumbnail_path: string;
    prompt: string;
    collection_name: string;
    created_on: string;
    featured_on: string | null;
    tags: string[];
    name: string;
    unique_name: string;
    overwrite_name: string;
};

export type Promotion = {
    id: number;
    heading: string;
    sub_heading: string;
    background_url: string;
    collection_name: string;
    active: boolean;
    activated_on: string;
    created_on: string;
    pages: Page[];
};
