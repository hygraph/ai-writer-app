import { useFieldExtension, Wrapper } from "@graphcms/app-sdk-react";
import { Flex, Input } from "@hygraph/baukasten";

function FieldElement() {
    const { value, onChange } = useFieldExtension();
    return (
        <Flex>
            <Input
                placeholder="Type something here"
                value={value || ""}
                onChange={(e: any) => onChange(e.target.value)}
            />
        </Flex>
    );
}

export default function Field() {
    return (
        <Wrapper>
            <FieldElement />
        </Wrapper>
    );
}
