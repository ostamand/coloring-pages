import { Client } from "jsr:@db/postgres";

import { GenerationConfigs } from "../types.ts";

const getPageUniqueName = async (db: Client, name: string | null) => {
    const uniqueName = name
        ? name.toLowerCase().replaceAll(" ", "-").replaceAll("'s", "")
        : "sample";

    // check if we already have some with same name
    const result = await db.queryObject(`
        SELECT CAST(COUNT(id) AS INTEGER) AS count
        FROM pages
        WHERE unique_name LIKE '${uniqueName}%'
    `);

    const count = (result.rows[0] as { count: number }).count;

    if (count > 0) {
        return `${uniqueName}-${count + 1}`;
    }

    return uniqueName;
};

export async function addNewPage(
    db: Client,
    fullPath: string,
    thumbnailPath: string,
    generateConfig: GenerationConfigs,
) {
    const {
        generateScript,
        prompt,
        seed,
        collectionName,
        generatedOn,
        tags,
        name,
        modelName,
        promptModelName,
        height,
        width,
    } = generateConfig;

    const pageTags = tags.map((tagName) => {
        const pageTag: { name: string; id: number | null } = {
            name: tagName,
            id: null,
        };
        return pageTag;
    });

    // check if tag exists, if not create

    const tagsStr = tags.reduce((agg, tagName, index) => {
        if (index !== 0) {
            agg += ",";
        }
        agg += `'${tagName}'`;
        return agg;
    }, "");

    const resultTags = await db.queryArray(
        `SELECT id, name FROM tags WHERE name IN (${tagsStr})`,
    );

    resultTags.rows.forEach((row) => {
        const pageTag = pageTags.find((pageTag) => pageTag.name == row[1]);
        if (pageTag) {
            pageTag.id = row[0] as number;
        }
    });

    // get page unique name first

    const uniqueName = await getPageUniqueName(db, name);

    // add page

    const resultPage = await db.queryArray(
        `   INSERT INTO pages (
                    full_path, 
                    thumbnail_path, 
                    generate_script, 
                    prompt, 
                    seed, 
                    collection_name, 
                    generated_on, 
                    name, 
                    model_name, 
                    prompt_model_name,
                    height, 
                    width, 
                    unique_name
                ) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
                RETURNING id`,
        [
            fullPath,
            thumbnailPath,
            generateScript,
            prompt,
            seed,
            collectionName,
            generatedOn,
            name,
            modelName,
            promptModelName,
            height,
            width,
            uniqueName,
        ],
    );

    const pageId = resultPage.rows[0][0] as number;

    // create tags if needed
    for (const pageTag of pageTags) {
        if (!pageTag.id) {
            // need to create new tag
            const resultTag = await db.queryArray(
                `INSERT INTO tags (name) VALUES ($1) RETURNING id;`,
                [pageTag.name],
            );
            const id = resultTag.rows[0][0] as number;
            if (id) {
                pageTag.id = id;
            } else {
                throw new Error(`Could not create tag ${pageTag.name}`);
            }
        }

        // add page_tags
        const resultPageTags = await db.queryArray(
            `INSERT INTO page_tags (page_id, tag_id) VALUES ($1, $2)`,
            [pageId, pageTag.id],
        );

        if (resultPageTags.rowCount !== 1) {
            throw new Error(
                `Error assigning tag ${pageTag.name} to page id ${pageId}`,
            );
        }
    }
}

export async function getLastPrompts(db: Client, n: number) {
    const result = await db.queryArray(
        ` SELECT prompt FROM pages 
          GROUP BY prompt
          ORDER BY MAX(created_on) DESC 
          LIMIT $1;`,
        [n],
    );
    return result.rows.map((row) => row[0]);
}

export async function getPageByUniqueName(db: Client, uniqueName: string) {
    const result = await db.queryObject(
        `
        SELECT  pages.id, pages.full_path, pages.thumbnail_path, 
                pages.prompt, pages.collection_name, pages.created_on, 
                pages.featured_on, pages.name, tags, pages.overwrite_name
        FROM ( 
            SELECT pages.id, ARRAY_AGG(tags."name") AS tags FROM pages
            JOIN page_tags ON page_tags.page_id = pages.id
            JOIN tags ON page_tags.tag_id = tags.id
            WHERE pages.unique_name = $1
            GROUP BY pages.id
        ) AS page_agg_tags
        JOIN pages ON pages.id = page_agg_tags.id
        `,
        [uniqueName],
    );
    return result.rows;
}

export async function getPagesById(db: Client, ids: number[]) {
    let idsStr = ids.reduce((agg, id, idx) => {
        if (idx === 0) {
            agg += "(";
        } else {
            agg += ",";
        }
        agg += id;
        return agg;
    }, "");
    idsStr += ")";
    const result = await db.queryObject(
        `
        SELECT  pages.id, pages.full_path, pages.thumbnail_path, 
                pages.prompt, pages.collection_name, pages.created_on, 
                pages.featured_on, pages.name, tags, pages.unique_name, 
                pages.overwrite_name
        FROM ( 
            SELECT pages.id, ARRAY_AGG(tags."name") AS tags FROM pages
            JOIN page_tags ON page_tags.page_id = pages.id
            JOIN tags ON page_tags.tag_id = tags.id
            WHERE pages.id IN ${idsStr}
            GROUP BY pages.id
        ) AS page_agg_tags
        JOIN pages ON pages.id = page_agg_tags.id
        `,
    );
    return result.rows;
}

export async function getPages(db: Client, limit: number, random: boolean) {
    // only featured pages will be returned, always sorted by featured_on
    const result = await db.queryObject(
        `
        WITH page_ids AS (
            SELECT id FROM pages
            WHERE featured_on IS NOT NULL
            ${random ? "ORDER BY RANDOM()" : "ORDER BY featured_on DESC"}
            LIMIT $1
        )
        SELECT  pages.id, pages.full_path, pages.thumbnail_path, 
                pages.prompt, pages.collection_name, pages.created_on, 
                pages.featured_on, pages.name, page_tags.tags, pages.unique_name, pages.overwrite_name
        FROM (
	        SELECT page_id, ARRAY_AGG(tags.name) AS tags FROM pages
	        JOIN page_ids ON page_ids.id = pages.id
	        JOIN page_tags ON pages.id = page_tags.page_id
	        JOIN tags ON page_tags.tag_id = tags.id
	        GROUP BY page_id
        ) AS page_tags
        JOIN pages ON page_tags.page_id = pages.id
        ${random ? "ORDER BY RANDOM()" : "ORDER BY featured_on DESC"};
        `,
        [limit],
    );
    return result.rows;
}

export async function searchPages(db: Client, query: string, limit: number) {
    const result = await db.queryObject(
        `
        WITH page_ids AS (
            SELECT DISTINCT p.*
            FROM pages p
            LEFT JOIN page_tags pt ON p.id = pt.page_id
            LEFT JOIN tags t ON pt.tag_id = t.id
            WHERE 
                (p.collection_name ILIKE '%' || $1 || '%' OR
                t.name ILIKE '%' || $1 || '%' OR
                p.name ILIKE '%' || $1 || '%')
                AND featured_on IS NOT NULL
            ORDER BY featured_on DESC
            LIMIT $2
        )
        SELECT  pages.id, pages.full_path, pages.thumbnail_path, 
                pages.prompt, pages.collection_name, pages.created_on, 
                pages.featured_on, pages.name, page_tags.tags, pages.unique_name, pages.overwrite_name
        FROM (
	        SELECT page_id, ARRAY_AGG(tags.name) AS tags FROM pages
	        JOIN page_ids ON page_ids.id = pages.id
	        JOIN page_tags ON pages.id = page_tags.page_id
	        JOIN tags ON page_tags.tag_id = tags.id
	        GROUP BY page_id
        ) AS page_tags
        JOIN pages ON page_tags.page_id = pages.id
        ORDER BY featured_on DESC;
        `,
        [query, limit],
    );
    return result.rows;
}

export type PageRequest = {
    userAgent: string | null;
    referrer: string | null;
    ip: string | null;
    request: string;
};

export async function addPageRequest(
    db: Client,
    pageRequest: PageRequest,
) {
    const { request, userAgent, referrer, ip } = pageRequest;
    const result = await db.queryArray(
        `
        INSERT INTO page_requests (user_agent, referrer, ip, request) VALUES ($1, $2, $3, $4)
        RETURNING id;
        `,
        [userAgent, referrer, ip, request],
    );
    return result.rows[0][0] as number;
}

export async function getCurrentCounts(db: Client) {
    const result = await db.queryObject(
        `
        SELECT status, CAST(COUNT(id) as INTEGER), MAX(featured_on) AS last_on FROM (
	        SELECT featured_on, id, CASE WHEN featured_on IS NULL THEN 'not published' ELSE 'published' END AS status FROM pages
        )
        GROUP BY status;
    `,
    );
    return result.rows;
}
