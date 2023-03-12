import { useFormSidebarExtension, Wrapper } from "@graphcms/app-sdk-react";
import { Button, Flex } from "@hygraph/baukasten";
import { useEffect, useState } from "react";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function SidebarElement() {
    const { installation, form, entry } = useFormSidebarExtension();
    const [isLoading, setIsLoading] = useState(false);
    const [predictions, setPredictions] = useState<any>([]);
    const [error, setError] = useState<any>(null);

    // @ts-ignore
    const imageUrl = entry?.localizations[0].url;
    const apiKey = installation?.config?.apiKey;

    useEffect(() => {
        // form.subscribeToFieldState(
        //     "altText",
        //     (fieldState) => {
        //         // console.log(fieldState);
        //     },
        //     { dirty: true, invalid: true }
        // );
    });

    const handleFieldChange = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        const response = await fetch("http://localhost:3001/api/predictions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                imageUrl,
                apiKey,
            }),
        });
        let prediction = await response.json();

        if (response.status !== 201) {
            console.log("error", prediction.detail);
            return;
        }

        while (
            prediction.status !== "succeeded" &&
            prediction.status !== "failed"
        ) {
            await sleep(1000);
            const response: any = await fetch(
                `http://localhost:3001/api/predictions/${prediction.id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        apiKey,
                    }),
                }
            );
            prediction = await response.json();
            if (response.status !== 200) {
                setIsLoading(false);
                setError(prediction);
                console.log("error", prediction);
                return;
            }

            if (prediction.status === "succeeded") {
                setIsLoading(false);
                console.log("alttext:", prediction);
                form.change("alternativeText", prediction.output);
            }
        }
    };

    return (
        <Flex>
            <Button
                flex="1"
                onClick={handleFieldChange}
                loading={isLoading}
                loadingText="Loading..."
            >
                Generate Alt Text
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
