import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = 'https://vuklvbsejfrpvcgssrzt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1a2x2YnNlamZycHZjZ3Nzcnp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MDM5MDIsImV4cCI6MjA3NTk3OTkwMn0.hHM_ADfq_2Lw7ZShtCE7OvjgmXK5Kz1HF0QTu3QJANs'

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;