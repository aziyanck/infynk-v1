import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or specify your frontend origin
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Step 0: Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Only POST allowed' }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 405,
    });
  }

  const { email, password } = await req.json();

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Step 1: Sign in
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return new Response(JSON.stringify({ error: signInError.message }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 401,
    });
  }

  const user = signInData.user;

  // Step 2: Role check
  const role = user.app_metadata?.role || null;

  if (role !== 'user') {
    return new Response(JSON.stringify({ error: 'Access denied: Not an user' }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 403,
    });
  }

  return new Response(JSON.stringify({ success: true, session: signInData.session }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
});
