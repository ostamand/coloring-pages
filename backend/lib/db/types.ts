export type Page = {
    id: number;
    full_path: string;
    thumbnail_path: string;
    colored_path: string;
    generate_script: string | null;
    prompt: string;
    seed: number | null;
    collection_name: string;
    model_name: string | null;
    prompt_model_name: string | null;
    name: string | null;
    unique_name: string;
    height: number;
    width: number;
    created_on: string;
    featured_on: string | null;
    generated_on: string;
};

export type Collection = {
    id: number;
    name: string;
    display_name: string;
    heading: string;
    sub_heading: string;
    background_url: string;
    created_on: string;
};

export type Promotion = {
    id: number;
    heading: string;
    sub_heading: string;
    background_url: string;
    showcase_page_id: number;
    collection_name: string;
    active: boolean;
    created_on: string;
};
