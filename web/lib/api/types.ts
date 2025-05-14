export type Page = {
    id: number;
    coloring_path: string;
    colored_path: string | null;
    prompt: string;
    collection_name: string;
    created_on: string;
    featured_on: string | null;
    tags: string[];
    name: string;
};
