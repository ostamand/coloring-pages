"use client";

import styles from "./contact-form.styles.module.scss";

import { z } from "zod";

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const formSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    message: z.string(),
});

export default function ContactForm() {
    function submit(formData: FormData) {
        console.log(formData);
    }

    return (
        <div className={styles.contactFormContainer}>
            <div className={styles.contactFormContent}>
                <form action={submit}>
                    <Label htmlFor="name">Your Name</Label>
                    <Input type="text" id="name" />
                    <Button type="submit">Submit</Button>
                </form>
            </div>
        </div>
    );
}
