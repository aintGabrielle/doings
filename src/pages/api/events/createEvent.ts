import { NextApiRequest, NextApiResponse } from "next";

import { getXataClient } from "@/lib/xata";

export type CreateEventDataInput = {
    owner_id: string;
    short_description: string;
    name: string;
    priority_range: string;
    starting_date: Date;
    ending_date: Date;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const client = getXataClient();
    const inputData = await JSON.parse(req.body) as CreateEventDataInput;

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const tasks = await client.db.events.create({
            name: inputData.name,
            owner_id: inputData.owner_id,
            ending_date: inputData.ending_date,
            starting_date: inputData.starting_date,
            priority_range: inputData.priority_range,
            short_description: inputData.short_description,
        })

        return res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

export default handler;