export type Page = {
    id: number;
    coloring_path: string;
    colored_path: string | null;
    generate_script: string;
    prompt: string;
    seed: string;
    collection_name: string;
    created_on: string;
    featured_on: string | null;
    generated_on: string;
    tags: string[];
};
