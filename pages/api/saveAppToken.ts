import { NextApiRequest, NextApiResponse } from "next/types";
import { baseUrl } from "../../helpers/common";

const managementApiUrl = "https://management.hygraph.com";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = req.body as { code: string; environmentId: string };
    const response = await fetch(`${managementApiUrl}/app-exchange-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            clientId: process.env.APP_CLIENT_ID,
            clientSecret: process.env.APP_CLIENT_SECRET,
            exchangeCode: req.body.code,
        }),
    });
    const { appToken } = (await response.json()) as { appToken: string };

    // Create Model
    // const createModel = await fetch(`${baseUrl}/api/createModel`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //         appToken,
    //     }),
    // });

    // Return App token to the browser so it can save it in localstorage
    res.status(200).json({ appToken });
}
