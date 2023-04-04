import { useFormSidebarExtension, Wrapper } from "@graphcms/app-sdk-react";
import { Button, Flex } from "@hygraph/baukasten";
import { useEffect, useState } from "react";
import { baseUrl } from "../helpers/common";

function SidebarElement() {
    const {
        installation,
        form,
        entry,
        openDialog,
        extension: { sidebarConfig },
    } = useFormSidebarExtension();
    const [isLoading, setIsLoading] = useState(false);

    // localizations.en.title
    const titleField = (sidebarConfig.TITLE_FIELD as string) || "title";

    // localizations.en.content;
    const contentField = (sidebarConfig.CONTENT_FIELD as string) || "content";

    // @ts-ignore
    const apiKey = installation?.config?.apiKey;

    const handleFieldChange = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        const response = await fetch(
            `${baseUrl}/api/generate/product-content`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const content = await response.json();
        if (!content.title || !content.content) {
            setIsLoading(false);
            alert("error!");
            return;
        }
        form.change("localizations.en.name", content.title);
        form.change("localizations.en.content", content.content);
        setIsLoading(false);
    };

    return (
        <Flex>
            <Button
                flex="1"
                onClick={handleFieldChange}
                loading={isLoading}
                loadingText="Thinking..."
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
