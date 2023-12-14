import { NextApiRequest, NextApiResponse } from "next";

import { getXataClient } from "@/lib/xata";

export type RegistrationDataInput ={
    email: string;
    user_id: string;
    phone: string;
    first_name: string;
    last_name: string;
    birthday: Date;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const inputData = await JSON.parse(req.body) as RegistrationDataInput;
    const client = getXataClient()

    if (req.method === "POST") {
        try {
            const response = await client.db.users.create(inputData)
            res.status(200).json(response)
        } catch (error) {
            res.status(500).json({ error: "Error appending account details to Xata" })
        }
    } else {
        res.status(404).json({ error: "Route not found" })
    }

}

export default handler;