
import { supabase } from "./supabase.js";

let isSignup = true;

const heading = document.getElementById("heading");
const subtitle = document.getElementById("subtitle");
const nameField = document.getElementById("nameField");
const submitBtn = document.getElementById("submitBtn");
const switchText = document.getElementById("switchText");
const switchLink = document.getElementById("switchLink");
const message = document.getElementById("message");
const authForm = document.getElementById("authForm");

const signupUrl = new URL("../signup.html", import.meta.url).href;
const dashboardUrl = new URL("../dashboard.html", import.meta.url).href;
// Switch between signup and login
switchLink.addEventListener("click", (event) => {
    event.preventDefault();

    isSignup = !isSignup;
    message.textContent = "";

    if (isSignup) {
        heading.textContent = "Create your account.";
        subtitle.textContent =
            "Join your people and start collecting your favourite memories together.";
        nameField.style.display = "block";
        submitBtn.textContent = "CREATE ACCOUNT ↗";
        switchText.textContent = "Already have an account?";
        switchLink.textContent = "Log in";
    } else {
        heading.textContent = "Welcome back.";
        subtitle.textContent = "Your memories are waiting for you.";
        nameField.style.display = "none";
        submitBtn.textContent = "LOG IN ↗";
        switchText.textContent = "New to Momento?";
        switchLink.textContent = "Create account";
    }
});

// Signup and login
authForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value.trim();

    submitBtn.disabled = true;
    message.textContent = "Please wait...";

    try {
        if (isSignup) {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: name },
                    emailRedirectTo: signupUrl
                }
            });

            if (error) throw error;

            message.textContent =
                "Account created successfully! You can now log in.";
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            window.location.href = dashboardUrl;
        }
    } catch (error) {
        message.textContent = error.message;
    } finally {
        submitBtn.disabled = false;
    }
});

// Handle email confirmation
const { data: { session } } = await supabase.auth.getSession();

if (session && window.location.hash.includes("access_token")) {
    window.location.replace(dashboardUrl);
}
