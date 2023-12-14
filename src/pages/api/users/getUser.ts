import { NextApiRequest, NextApiResponse } from "next";

import { getXataClient } from "@/lib/xata";

type GetUserInputData = {
    user_id: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const client = getXataClient();
    const inputData = await JSON.parse(req.body) as GetUserInputData;

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    
    try {
        const user = await client.db.users.filter('user_id', inputData.user_id).getFirst()
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

export default handler;