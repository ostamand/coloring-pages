export type Page = {
    id: number;
    full_path: string;
    thumbnail_path: string;
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
