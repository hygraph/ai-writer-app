// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { gql, GraphQLClient } from "graphql-request";
import type { NextApiRequest, NextApiResponse } from "next";
import { baseUrl } from "../../../helpers/common";

const apiUrl = process.env.REPLICATE_API_URL!;
const apiToken = process.env.REPLICATE_API_TOKEN!;
const apiVersion = process.env.REPLICATE_API_VERSION!;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const updateAssetMutation = gql`
    mutation updateAssetAltText($data: AssetUpdateInput!, $id: ID!) {
        updateAsset(data: $data, where: { id: $id }) {
            id
            alternativeText
        }
    }
`;

const client = new GraphQLClient(
    process.env.HYGRAPH_CONTENT_API_ENDPOINT_WRITE as string,
    {
        headers: {
            Authorization: `Bearer ${
                process.env.HYGRAPH_MUTATION_TOKEN as string
            }`,
        },
    }
);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const assetBaseUrl = `https://media.graphassets.com`;
    const { body } = req;
    if (req.method === "POST" && body.operation === "publish") {
        const assetId = body.data.id;
        const imageUrl = `${assetBaseUrl}/${body.data.localizations[0].handle}`;
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${apiToken}`,
            },
            body: JSON.stringify({
                version: apiVersion,
                input: {
                    image: imageUrl,
                    caption: true,
                    temperature: 1,
                },
            }),
        });

        if (response.status !== 201) {
            let error = await response.json();
            res.status(500).json({ detail: error.detail });
            return;
        }

        let prediction = await response.json();
        const predictionId = prediction.id;
        let createdAltText = false;
        let updateAssetResponse;
        while (!createdAltText) {
            await sleep(1000);
            const response: any = await fetch(
                `${baseUrl}/api/assets/${predictionId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        apiToken,
                    }),
                }
            );
            prediction = await response.json();
            if (response.status !== 200) {
                console.log("error", prediction);
                res.status(500).json({ detail: prediction.detail });
                return;
            }

            if (prediction.status === "succeeded") {
                createdAltText = true;
                // update asset alt text
                console.log("Updating asset alt text...");
                updateAssetResponse = await client.request(
                    updateAssetMutation,
                    {
                        data: {
                            alternativeText: prediction.output,
                        },
                        id: assetId,
                    }
                );
                console.log("Asset alt text updated!", updateAssetResponse);
            }
        }
        return res.status(200).json(updateAssetResponse);
    } else {
        res.status(405).json({ detail: "Method not allowed" });
        return;
    }
}
