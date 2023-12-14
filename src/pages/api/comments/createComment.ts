import { NextApiRequest, NextApiResponse } from "next";

import { getXataClient } from "@/lib/xata";

export type CreateCommentDataInput = {
    user_id: string;
    task_id: string;
    content: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const client = getXataClient();
    const inputData = await JSON.parse(req.body) as CreateCommentDataInput;

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const comments = await client.db.comments.create({
            user_id: inputData.user_id,
            task_id: inputData.task_id,
            content: inputData.content,
        })

        return res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

export default handler;