import { Tasks, getXataClient } from "@/lib/xata";
import { NextApiRequest, NextApiResponse } from "next";

export type CreateTaskDataInput = {
    target_id: string;
    content: Tasks;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const client = getXataClient();
    const inputData = await JSON.parse(req.body) as CreateTaskDataInput;

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const tasks = await client.db.tasks.update(inputData.target_id, inputData.content)

        return res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

export default handler;