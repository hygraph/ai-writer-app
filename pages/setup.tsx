import { useApp, Wrapper } from "@graphcms/app-sdk-react";
import { Box, Button, Text, Heading, Stack } from "@hygraph/baukasten";

function SetupElement() {
    const { installation } = useApp();
    if (installation.status === "COMPLETED") {
        return <Configure />;
    }
    return <Install />;
}

function Install() {
    const { updateInstallation } = useApp();
    return (
        <Stack gap="12">
            <Box>
                <Heading>Hygraph Boilerplate App</Heading>
                <Text>This is an example app</Text>
                <Button
                    onClick={() =>
                        updateInstallation({ status: "COMPLETED", config: {} })
                    }
                >
                    Install App
                </Button>
            </Box>
        </Stack>
    );
}

function Configure() {
    const { updateInstallation } = useApp();
    return (
        <Stack gap="12">
            <Box>
                <Heading>Hygraph Boilerplate App</Heading>
                <Text>This is an example app</Text>
                <Button
                    onClick={() =>
                        updateInstallation({ status: "COMPLETED", config: {} })
                    }
                >
                    Save
                </Button>
            </Box>
        </Stack>
    );
}

export default function Setup() {
    return (
        <Wrapper>
            <SetupElement />
        </Wrapper>
    );
}
