
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://hgjjshzqkvhhaomctghd.supabase.co';

const supabaseKey = 'sb_publishable_uRhLC4JZXq9-Hdoe4T1wAw_WcYyi3A1';

export const supabase = createClient(supabaseUrl, supabaseKey);

