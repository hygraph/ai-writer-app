import { useApp, Wrapper } from "@graphcms/app-sdk-react";
import {
    Box,
    Button,
    Text,
    Heading,
    Stack,
    Label,
    Input,
    Inline,
} from "@hygraph/baukasten";
import { useRouter } from "next/router";
import { ChangeEventHandler, useState } from "react";

const appTitle = "Alt Text Generator";
const appDescription =
    "Generate alt text for your images using machine learning.";

function SetupElement({ code }: { code: string }) {
    const { installation } = useApp();

    if (installation.status === "COMPLETED") {
        return <Configure />;
    }

    return <Install code={code} />;
}

function Install({ code }: { code: string }) {
    const { context, updateInstallation } = useApp();
    const [isSaving, setIsSaving] = useState(false);
    const [apiKey, setApiKey] = useState("");

    const createResources = async (appToken: string, endpoint: string) => {
        fetch(`http://localhost:3001/api/createField`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                appToken,
                endpoint,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleInstall = async (e: any) => {
        setIsSaving(true);
        fetch(`http://localhost:3001/api/saveAppToken`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code,
                environmentId: context.environment.id,
            }),
        })
            .then((res) => res.json())
            .then(async (data) => {
                // await createResources(
                //     data.appToken,
                //     context.environment.endpoint
                // );
                updateInstallation({ status: "COMPLETED", config: { apiKey } });
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setIsSaving(false);
            });
    };

    const onChange = (e: any) => {
        setApiKey(e.target.value);
    };

    return (
        <Stack gap="12" width="50%">
            <Heading>{appTitle}</Heading>
            <Text>{appDescription}</Text>
            <SetupForm apiKey={apiKey} onChange={onChange} />
            <Inline>
                <Button
                    loading={isSaving}
                    loadingText="Installing..."
                    onClick={handleInstall}
                >
                    Install App
                </Button>
            </Inline>
        </Stack>
    );
}

function Configure() {
    const { updateInstallation, installation, context } = useApp();
    const [isSaving, setIsSaving] = useState(false);
    const [apiKey, setApiKey] = useState<string>(
        (installation.config.apiKey as string) || ""
    );

    const appToken = localStorage.getItem("app-token");
    const endpoint = context.environment.endpoint;

    const handleSave = async (e: any) => {
        setIsSaving(true);
        await updateInstallation({ status: "COMPLETED", config: { apiKey } });
        setIsSaving(false);
    };

    const onChange = (e: any) => {
        setApiKey(e.target.value);
    };

    return (
        <Stack gap="12" width="50%" justifyContent="flex-start">
            <Heading>{appTitle}</Heading>
            <Text>{appDescription}</Text>
            <SetupForm apiKey={apiKey} onChange={onChange} />
            <Inline>
                <Button
                    loading={isSaving}
                    loadingText="Saving..."
                    onClick={handleSave}
                >
                    Save
                </Button>
            </Inline>
        </Stack>
    );
}

const SetupForm = ({
    apiKey,
    onChange,
}: {
    apiKey: string;
    onChange: ChangeEventHandler;
}) => {
    return (
        <Stack gap="12">
            <Box>
                <Label htmlFor="api-key">API Key:</Label>
                <Input id="api-key" value={apiKey} onChange={onChange} />
            </Box>
        </Stack>
    );
};

export default function Setup() {
    const { query } = useRouter();
    return (
        <Wrapper>
            <SetupElement code={query.code as string} />
        </Wrapper>
    );
}
