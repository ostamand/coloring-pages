"use client";

import styles from "./contact-form.styles.module.scss";
import stylesButton from "../../styles/button.styles.module.scss";

import { useState } from "react";
import Link from "next/link";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactForm() {
    const defaultErrors = {
        email: false,
        name: false,
        message: false,
    };

    const [errors, setErrors] = useState(defaultErrors);
    const [messageSent, setMessageSent] = useState(false);

    async function submit(formData: FormData) {
        const email = formData.get("email");
        const name = formData.get("name");
        const message = formData.get("message");

        const errors = { ...defaultErrors };

        // email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid =
            typeof email === "string" && emailRegex.test(email);
        if (!isEmailValid) {
            errors.email = true;
        }

        // name
        if (typeof name !== "string" || name.trim().length === 0) {
            errors.name = true;
        }

        // message
        if (typeof message !== "string" || message.trim().length === 0) {
            errors.message = true;
        }

        setErrors(errors);

        if (errors.email || errors.message || errors.name) {
            return;
        }

        try {
            const payload = {
                name,
                message,
                email,
            };
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/messages`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );
            if (!response.ok) {
                // TODO add logging
            }
        } catch (error) {
        } finally {
            setMessageSent(true);
        }
    }

    return (
        <div className={styles.contactFormContainer}>
            {!messageSent ? (
                <div className={styles.contactFormContent}>
                    <form action={submit}>
                        <div className={styles.labelPanel}>
                            <Label htmlFor="name">Your Name</Label>
                            {errors.name && (
                                <Label className={styles.errorLabel}>
                                    Required
                                </Label>
                            )}
                        </div>
                        <Input id="name" type="text" name="name" />
                        <div className={styles.labelPanel}>
                            <Label htmlFor="email">Your Email</Label>
                            {errors.email && (
                                <Label className={styles.errorLabel}>
                                    Not valid
                                </Label>
                            )}
                        </div>

                        <Input id="email" type="email" name="email" />

                        <div className={styles.labelPanel}>
                            <Label htmlFor="message">Your Message</Label>
                            {errors.message && (
                                <Label className={styles.errorLabel}>
                                    Required
                                </Label>
                            )}
                        </div>
                        <Textarea id="message" name="message" />
                        <button
                            type="submit"
                            className={`${styles.submitButton} ${stylesButton.actionButton}`}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            ) : (
                <div className={styles.messageSentContent}>
                    <Link href="/">
                        <img
                            src="/Logo_ColorItDaily_Smile.png"
                            alt="Coloring Pages Logo"
                            height="auto"
                            width="200px"
                        />
                    </Link>
                    <h2>Thank you!</h2>
                    <Link href="/">
                        <div
                            className={`${styles.homeButton}  ${stylesButton.actionButton} `}
                        >
                            Go Back Home
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
}
