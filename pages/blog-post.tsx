import { useFormSidebarExtension, Wrapper } from "@graphcms/app-sdk-react";
import { Button, Flex } from "@hygraph/baukasten";
import { useEffect, useState } from "react";
import { baseUrl } from "../helpers/common";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function SidebarElement() {
    const {
        installation,
        form,
        entry,
        openDialog,
        extension: { config },
    } = useFormSidebarExtension();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [title, setTitle] = useState<any>(null);

    // localizations.en.title
    const titleField = config.TITLE_FIELD || "title";

    // localizations.en.content;
    const contentField = config.CONTENT_FIELD || "content";

    // @ts-ignore
    const apiKey = installation?.config?.apiKey;

    useEffect(() => {
        form.getFieldState(titleField as string).then((data: any) => {
            setTitle(data.value);
        });
    }, []);

    const handleFieldChange = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        console.log(title);
        const response = await fetch(`${baseUrl}/api/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
            }),
        });
        const content = await response.json();
        form.change(contentField as string, content.response.trim());
        setIsLoading(false);
    };

    return (
        <Flex>
            <Button
                flex="1"
                onClick={handleFieldChange}
                loading={isLoading}
                loadingText="Loading..."
            >
                Write Content
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
