import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jlpdqxqgqimyhkwufynt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpscGRxeHFncWlteWhrd3VmeW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2OTY0ODMsImV4cCI6MjA4MDI3MjQ4M30.GMsAZJuMcNUa6M6NMdg0Eqv4e_rf5ilhoPxbPICt3jA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);