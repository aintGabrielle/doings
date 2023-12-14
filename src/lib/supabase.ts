import { createClient } from '@supabase/supabase-js'

const sp_url = process.env.NEXT_PUBLIC_SUPABASE_URL
const sp_key = process.env.NEXT_PUBLIC_SUPABASE_KEY

const $$supabase = createClient(
    sp_url as string,
    sp_key as string, {
        auth: {
            persistSession: true,
        }
    }
)

export default $$supabase