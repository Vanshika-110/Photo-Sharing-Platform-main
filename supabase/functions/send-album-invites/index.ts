import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function response(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
}

function escapeHtml(value: string) {
    return value.replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
    })[character] || character);
}

Deno.serve(async request => {
    if (request.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    if (request.method !== "POST") {
        return response({ error: "Method not allowed." }, 405);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL");
    const appUrlValue = Deno.env.get("APP_URL");

    if (!supabaseUrl || !supabaseAnonKey || !resendApiKey || !fromEmail || !appUrlValue) {
        console.error("Email invite function is missing required environment configuration.");
        return response({ error: "Email invitations are not configured on the server." }, 500);
    }

    let appUrl: URL;
    try {
        appUrl = new URL(appUrlValue);
    } catch {
        return response({ error: "The server APP_URL setting is invalid." }, 500);
    }

    if (appUrl.protocol !== "https:" &&
        !(appUrl.protocol === "http:" && ["localhost", "127.0.0.1"].includes(appUrl.hostname))) {
        return response({ error: "APP_URL must use HTTPS." }, 500);
    }

    const authorization = request.headers.get("Authorization");
    if (!authorization) {
        return response({ error: "Sign in before sending album invitations." }, 401);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { autoRefreshToken: false, persistSession: false },
        global: { headers: { Authorization: authorization } }
    });

    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData.user) {
        return response({ error: "Your session is invalid or expired. Please sign in again." }, 401);
    }

    let body: { albumId?: unknown; emails?: unknown };
    try {
        body = await request.json();
    } catch {
        return response({ error: "Request body must be valid JSON." }, 400);
    }

    if (typeof body.albumId !== "string" ||
        !Array.isArray(body.emails) ||
        body.emails.length < 1 ||
        body.emails.length > 10 ||
        body.emails.some(email => typeof email !== "string" || !emailPattern.test(email))) {
        return response({ error: "Provide an album ID and 1 to 10 valid email addresses." }, 400);
    }

    const { data: album, error: albumError } = await supabase
        .from("albums")
        .select("id, title, invite_code")
        .eq("id", body.albumId)
        .eq("owner_id", userData.user.id)
        .maybeSingle();

    if (albumError) {
        console.error("Could not verify album ownership:", albumError.message);
        return response({ error: "Could not verify that you own this album." }, 500);
    }
    if (!album) {
        return response({ error: "Album not found or you do not have permission to invite people." }, 404);
    }

    const albumTitle = escapeHtml(album.title || "A shared album");
    const inviteCode = escapeHtml(album.invite_code);
    const appLink = new URL("signup.html", appUrl).toString();
    const sent: string[] = [];
    const failed: Array<{ email: string; error: string }> = [];

    for (const email of [...new Set((body.emails as string[]).map(value => value.trim().toLowerCase()))]) {
        const emailResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${resendApiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                from: fromEmail,
                to: [email],
                subject: `You're invited to join ${album.title || "a Momento album"}`,
                text:
                    `You've been invited to join "${album.title || "a shared album"}" on Momento.\n\n` +
                    `Create an account or sign in at ${appLink}, then enter this invite code on your dashboard: ${album.invite_code}\n`,
                html:
                    `<p>You've been invited to join <strong>${albumTitle}</strong> on Momento.</p>` +
                    `<p><a href="${escapeHtml(appLink)}">Create an account or sign in</a>, then enter this invite code on your dashboard:</p>` +
                    `<p style="font-size:24px;font-weight:bold;letter-spacing:3px">${inviteCode}</p>`
            })
        });

        if (emailResponse.ok) {
            sent.push(email);
        } else {
            const providerMessage = await emailResponse.text();
            console.error("Email provider rejected an invitation:", emailResponse.status, providerMessage);
            failed.push({
                email,
                error: `Email provider rejected the message (status ${emailResponse.status}).`
            });
        }
    }

    return response({ sent, failed });
});
