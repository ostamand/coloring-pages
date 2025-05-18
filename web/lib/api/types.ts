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
};
