"use client";

import { useState, useEffect } from "react";
import { Send, FileSearch } from "lucide-react";
import Link from "next/link";

import styles from "./no-result-request.styles.module.scss";
import stylesButton from "../../styles/button.styles.module.scss";

export default function NoResultRequest({
    searchValue,
    hideHomeLink,
}: {
    searchValue: string;
    hideHomeLink?: boolean;
}) {
    const [requestSent, setRequestSent] = useState(false);

    useEffect(() => {
        setRequestSent(false);
    }, [searchValue]);

    return (
        <div className={styles.noResultContainer}>
            {!requestSent ? (
                <div className={styles.noResultContent}>
                    <div className={styles.iconWrapper}>
                        <FileSearch size={64} className={styles.mainIcon} />
                    </div>
                    <h1>
                        No results for &quot;<span>{searchValue}</span>&quot;
                    </h1>
                    <p>
                        Can&apos;t find what you&apos;re looking for? Request it and your
                        idea could be the next <span>Featured</span> page!
                    </p>
                    <div
                        className={styles.buttonContainer}
                        onClick={async () => {
                            try {
                                const response = await fetch(
                                    `${process.env.NEXT_PUBLIC_API_URL}/logs/request`,
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            request: searchValue,
                                        }),
                                    }
                                );
                                if (!response.ok) {
                                    //TODO!
                                }
                            } catch { }
                            setRequestSent(true);
                        }}
                    >
                        <div className={stylesButton.actionButton}>
                            <Send size={20} className="mr-2" />
                            Send Request
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.noResultContent}>
                    <div className={styles.requestSent}>
                        <h1>
                            Request sent for <span>{searchValue}</span>
                        </h1>
                        <Send size={32} className={styles.successIcon} />
                    </div>
                    <p className={styles.successSubtitle}>Try searching for something else!</p>
                    {!hideHomeLink && (
                        <Link href="/">
                            <div className={styles.buttonContainer}>
                                <div className={stylesButton.actionButton}>
                                    or Go Back to Home
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
