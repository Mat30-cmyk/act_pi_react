import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400
    });
  }

  const payload = await req.json()
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err: unknown) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400
    });
  }

  const eventType = evt.type;
  if (eventType === 'user.created' || eventType === 'user.updated') {
    const userData = evt.data as {
        id: string;
        email_addresses: Array<{ email_address: string; id: string }>;
        first_name: string | null;
        last_name: string | null;
        username: string | null;
    };

    const clerkUserId = userData.id;
    const email = userData.email_addresses?.[0]?.email_address || null;

    if (!clerkUserId || !email) {
      return new Response('Webhook Error: Missing user ID or email', { status: 400 });
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .upsert({
          clerk_user_id: clerkUserId,
          email: email,
        }, { onConflict: 'clerk_user_id' })
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log('Profile upserted:', data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error upserting profile (catch block):', errorMessage);
      return new Response(`Webhook Error: ${errorMessage}`, { status: 500 });
    }
  } else if (eventType === 'user.deleted') {
    const deletedUserData = evt.data as { id: string };
    const clerkUserId = deletedUserData.id;

    try {
      const { error } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('clerk_user_id', clerkUserId);

      if (error) {
        throw error;
      }
      console.log(`Profile for Clerk user ${clerkUserId} deleted.`);
    } catch (err: unknown) { 
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error deleting profile:', errorMessage);
      return new Response(`Webhook Error: ${errorMessage}`, { status: 500 });
    }
  } else {
    console.log(`Unhandled webhook event type: ${eventType}`);
    return new Response(`Unhandled webhook event type: ${eventType}`, { status: 200 });
  }

  return new Response('Webhook received', { status: 200 });
}
