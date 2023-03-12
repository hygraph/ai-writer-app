import { useFormSidebarExtension, Wrapper } from "@graphcms/app-sdk-react";
import htmlToSlateAST from "@graphcms/html-to-slate-ast";
import { Button, Flex } from "@hygraph/baukasten";
import { useEffect, useState } from "react";

function SidebarElement() {
    const { installation, form, entry } = useFormSidebarExtension();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [name, setName] = useState<any>(null);

    useEffect(() => {
        form.getFieldState("name").then((name: any) => {
            setName(name.value);
        });
    }, []);

    const handleGenerateDescription = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        const response = await fetch(
            "http://localhost:3001/api/bikes/category-description",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                }),
            }
        ).finally(() => {
            setIsLoading(false);
        });

        const data = await response.json();

        if (data.error) {
            setError(data.error);
            return;
        }

        form.change("description", data.rteContent);
    };

    return (
        <Flex>
            <Button
                flex="1"
                onClick={handleGenerateDescription}
                loading={isLoading}
                loadingText="Thinking..."
            >
                Generate Description
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
