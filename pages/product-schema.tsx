import { useFormSidebarExtension, Wrapper } from "@graphcms/app-sdk-react";
import { Button, Flex } from "@hygraph/baukasten";
import { useEffect, useState } from "react";
import { baseUrl } from "../helpers/common";

function SidebarElement() {
    const { form } = useFormSidebarExtension();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [slug, setSlug] = useState<any>(null);
    const [bikeName, setBikeName] = useState<any>(null);

    useEffect(() => {
        form.getFieldState("slug").then((slug: any) => {
            setSlug(slug.value);
        });
        form.getFieldState("bikeName").then((name: any) => {
            setBikeName(name.value);
        });
    }, []);

    const handleProductSchema = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        const response = await fetch(`${baseUrl}/api/bikes/by-slug`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                slug,
            }),
        }).finally(() => {
            setIsLoading(false);
        });

        const data = await response.json();

        if (data.error) {
            setError(data.error);
            return;
        }

        form.change("productSchema", data.trim());
    };

    return (
        <Flex>
            <Button
                flex="1"
                onClick={handleProductSchema}
                loading={isLoading}
                loadingText="Loading..."
            >
                Generate Schema
            </Button>
        </Flex>
    );
}

export default function Sidebar() {
    return (
        <Wrapper>
            <SidebarElement />
        </Wrapper>
    );
}
