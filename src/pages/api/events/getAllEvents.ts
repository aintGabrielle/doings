import { NextApiRequest, NextApiResponse } from "next";

import { getXataClient } from "@/lib/xata";

type GetAllEventsInputData = {
    owner_id: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const client = getXataClient();
    const inputData = await JSON.parse(req.body) as GetAllEventsInputData;

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    
    try {
        const events = await client.db.events.filter('owner_id', inputData.owner_id).getAll()
        return res.status(200).json(events);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

export default handler;