const { createClient } = supabase;

const SUPABASE_URL = "https://frvseaultgcvwawfjlqz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_PNc6k2a1_qBToaIr3PEZ6Q_fQP5_RO4";

const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);