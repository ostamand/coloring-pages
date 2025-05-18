"use client";

import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import Link from "next/link";

import styles from "./no-result-request.styles.module.scss";
import stylesButton from "../../styles/button.styles.module.scss";

export default function NoResultRequest({
    searchValue,
}: {
    searchValue: string;
}) {
    const [requestSent, setRequestSent] = useState(false);

    useEffect(() => {
        setRequestSent(false);
    }, [searchValue]);

    return (
        <div className={styles.noResultContainer}>
            {!requestSent ? (
                <div className={styles.noResultContent}>
                    <h1>
                        Oups! No Results Found for <span>{searchValue}</span>
                    </h1>
                    <h2>
                        Send a Request. Your idea could be the next{" "}
                        <span>Featured</span> Coloring Page.
                    </h2>
                    <div
                        className={styles.buttonContainer}
                        onClick={() => {
                            // TODO send request
                            setRequestSent(true);
                        }}
                    >
                        <div className={stylesButton.actionButton}>
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
                        <Send />
                    </div>
                    <h2>Search for something else</h2>
                    <Link href="/">
                        <div className={styles.buttonContainer}>
                            <div className={stylesButton.actionButton}>
                                or Go Back to Home
                            </div>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
}
