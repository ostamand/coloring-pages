import { useCallback } from "react";

export const useDownloader = () => {
    const handleDownload = useCallback(
        async (pageId: number, fileUrl: string, name: string) => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/proxy?url=${fileUrl}`
                );

                if (!response.ok) {
                    //TODO display error;
                    return;
                }

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement("a");

                const fileExtension = fileUrl.split(".").pop() || "";
                const fileName = `${name}.${fileExtension}`;

                link.href = url;
                link.download = fileName;
                link.target = "_blank";

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error(error);
            }

            if (window.umami) {
                window.umami.track("download", {
                    pageId: pageId.toString(),
                    url: window.location.href,
                });
            }
        },
        []
    );

    return { handleDownload };
};
