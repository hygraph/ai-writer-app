// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { gql, GraphQLClient } from "graphql-request";
import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI, PromptTemplate } from "langchain";
import htmlToSlateAST from "@graphcms/html-to-slate-ast";

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
    const name = req.body.name;

    const template =
        "Act as a content writer. Write one paragraph about the following category targeting bike enthusiasts. You must use an informative and friendly tone. Format content in HTML. Do not include a prefix for the description.\n\nCategory: {name}.\n\n";
    const prompt = new PromptTemplate({
        template: template,
        inputVariables: ["name"],
    });
    const content = await prompt.format({ name });
    const response = await model.call(content);

    console.log(response);

    const htmlString = response.trim();
    const ast = await htmlToSlateAST(htmlString);
    const rteContent = {
        raw: {
            children: ast,
        },
    };

    res.status(200).json({ rteContent });
}
