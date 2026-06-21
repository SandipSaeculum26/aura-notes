"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

// Minimal typing for the Google Identity Services global
type GoogleCredentialResponse = { credential: string };

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, unknown>,
          ) => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  // Label shown inside Google's button
  text?: "signin_with" | "signup_with" | "continue_with";
  onError?: (message: string) => void;
}

const GSI_SCRIPT_ID = "google-gsi-client";

export function GoogleSignInButton({ text = "continue_with", onError }: GoogleSignInButtonProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Exchange the Google ID token for a logged-in user on our backend
  const handleCredential = useCallback(
    async (response: GoogleCredentialResponse) => {
      try {
        const res = await fetch(`${API_URL}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: response.credential }),
        });

        const data = await res.json();

        if (!res.ok) {
          onError?.(data.message || "Google sign-in failed");
          return;
        }

        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard");
      } catch {
        onError?.("Something went wrong. Is the server running?");
      }
    },
    [router, onError],
  );

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      onError?.("Google sign-in is not configured (missing NEXT_PUBLIC_GOOGLE_CLIENT_ID)");
      return;
    }

    const renderGoogleButton = () => {
      if (!window.google || !containerRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredential,
      });

      window.google.accounts.id.renderButton(containerRef.current, {
        theme: "outline",
        size: "large",
        text,
        shape: "rectangular",
        width: 320,
      });
    };

    // Load the GIS script once, then render
    if (document.getElementById(GSI_SCRIPT_ID)) {
      renderGoogleButton();
      return;
    }

    const script = document.createElement("script");
    script.id = GSI_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    document.body.appendChild(script);
  }, [handleCredential, text, onError]);

  return <div ref={containerRef} className="flex w-full justify-center" />;
}
