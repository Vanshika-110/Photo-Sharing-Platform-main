# Album email invitations

The create-album page calls the `send-album-invites` Supabase Edge Function after saving the album. The function verifies the signed-in user owns the album and sends each invite using Resend. Invitation emails contain the app URL and album invite code; recipients sign in or create an account, then enter the code on their dashboard.

## Configure and deploy

1. Create a Resend account and verify the sender domain/address you plan to use.
2. From the project root, install/use the Supabase CLI and link it to project `hgjjshzqkvhhaomctghd`.
3. Set the function secrets (use your own Resend API key and a public HTTPS URL for the hosted app):

   ```powershell
   supabase secrets set RESEND_API_KEY=re_... RESEND_FROM_EMAIL="Momento <invites@your-domain.com>" APP_URL=https://your-app.example --project-ref hgjjshzqkvhhaomctghd
   ```

4. Deploy the function:

   ```powershell
   supabase functions deploy send-album-invites --project-ref hgjjshzqkvhhaomctghd
   ```

Supabase supplies `SUPABASE_URL` and `SUPABASE_ANON_KEY` to the function. Do not put the Resend API key or a Supabase service-role key in browser code.
