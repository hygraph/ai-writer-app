// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { gql, GraphQLClient } from "graphql-request";
import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI, PromptTemplate } from "langchain";

const queryBikeBySlug = gql`
    query queryBikesBySlug($slug: String!) {
        bike(where: { slug: $slug }, stage: PUBLISHED) {
            bcBikeData {
                data {
                    name
                    price
                    sku
                    images {
                        url_thumbnail
                    }
                    specs: custom_fields {
                        name
                        id
                        value
                    }
                }
            }
        }
    }
`;

const client = new GraphQLClient(
    process.env.HYGRAPH_CONTENT_API_ENDPOINT as string
);

const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY!,
    temperature: 0.9,
    maxTokens: 2000,
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const slug = req.body.slug;
    // @ts-ignore
    const { bike } = await client.request(queryBikeBySlug, { slug });
    const product = JSON.stringify(bike.bcBikeData.data);

    const template =
        "Create a JSON-lD schema for the product below:\n\n{product}.\n\nJSON-LD:\n\n";
    const prompt = new PromptTemplate({
        template: template,
        inputVariables: ["product"],
    });
    const content = await prompt.format({ product });
    const response = await model.call(content);

    console.log(response);

    res.status(200).json(response);
}
