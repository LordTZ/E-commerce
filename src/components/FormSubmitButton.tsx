"use client";

import { ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type FormSubmitButtonprops = {
    children: React.ReactNode
    classname?: string
} & ComponentProps<"button">

export default function FormSubmitButton ({
    children, 
    className, 
    ...props
}: FormSubmitButtonprops) {

    const { pending } = useFormStatus();

    return (
        <button
        {...props}
        className={`btn btn-primary ${className}`}
        type="submit"
        disabled={pending}
        >
            {pending && <span className="loading loading-spinner" />}
            {children}
        </button>
    )
}
