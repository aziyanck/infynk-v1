// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yowckahgoxqfikadirov.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvd2NrYWhnb3hxZmlrYWRpcm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzcxODUsImV4cCI6MjA2NjcxMzE4NX0.tw75tUlGRtnRCNF-5IXzEYd1mUxXwyLLk0NAZRjxsuQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
