import sharp from "npm:sharp";

export function getRandomFilename(filename: string) {
    const extension = filename.split(".").pop() || "";
    const randomString = getRandomString();
    return `${randomString}.${extension}`;
}

export function getRandomString() {
    const chars =
        "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ1234567890";
    let randomString = "";
    for (let i = 0; i < 12; i++) {
        const index = Math.floor(Math.random() * chars.length);
        randomString += chars[index];
    }
    return randomString;
}

export async function convertPngToJpeg(inputPath: string, outputPath: string) {
    try {
        // Read the PNG file
        const pngBuffer = await Deno.readFile(inputPath);
        // Convert PNG to JPEG using sharp
        const jpegBuffer = await sharp(pngBuffer).jpeg().toBuffer();
        // Save the JPEG file
        await Deno.writeFile(outputPath, jpegBuffer);
    } catch (error) {
        console.error("Error during conversion:", error);
    }
}
