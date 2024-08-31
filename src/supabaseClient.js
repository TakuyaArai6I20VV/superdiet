// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qwhxtyfsbwiwcyemzsub.supabase.co';  // SupabaseのURL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3aHh0eWZzYndpd2N5ZW16c3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwNzE1MDAsImV4cCI6MjA0MDY0NzUwMH0.y-zwrkkULuts7hurqiuDCV0eRByn8YUqd2N8QdD4unE';  // APIキー

export const supabase = createClient(supabaseUrl, supabaseKey);