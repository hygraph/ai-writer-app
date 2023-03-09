import { Wrapper } from "@graphcms/app-sdk-react";
import { Heading, Stack, Text } from "@hygraph/baukasten";

function PageElement() {
    return (
        <Stack p={16}>
            <Heading>Hygraph Boilerplate App</Heading>
            <Text>This is a test paragraph.</Text>
        </Stack>
    );
}

export default function Page() {
    return (
        <Wrapper>
            <PageElement />
        </Wrapper>
    );
}
