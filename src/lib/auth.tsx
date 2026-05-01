import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ensureAccountSetup } from "@/lib/account.functions";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

type AuthContextValue = {
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (input: {
    company: string;
    email: string;
    password: string;
  }) => Promise<{ error?: string; needsEmailConfirmation?: boolean }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function syncAccount(
  accessToken: string,
  ensureAccount: ReturnType<typeof useServerFn<typeof ensureAccountSetup>>,
) {
  try {
    await ensureAccount({ data: { accessToken } });
  } catch (error) {
    console.error(error);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const isConfigured = isSupabaseConfigured();
  const ensureAccount = useServerFn(ensureAccountSetup);
  const syncedSessionRef = useRef<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth
      .getSession()
      .then(({ data, error: sessionError }) => {
        if (!mounted) {
          return;
        }
        if (sessionError) {
          setError(sessionError.message);
        }
        setSession(data.session);
        setIsLoading(false);
      })
      .catch((sessionError: Error) => {
        if (!mounted) {
          return;
        }
        setError(sessionError.message);
        setIsLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!session?.access_token) {
      syncedSessionRef.current = null;
      return;
    }

    if (syncedSessionRef.current === session.access_token) {
      return;
    }

    syncedSessionRef.current = session.access_token;
    void syncAccount(session.access_token, ensureAccount);
  }, [ensureAccount, session]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isLoading,
      isConfigured,
      error,
      async signIn(email, password) {
        if (!supabase) {
          return { error: "Supabase is not configured yet." };
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          return { error: error.message };
        }

        if (data.session?.access_token) {
          await syncAccount(data.session.access_token, ensureAccount);
        }

        return {};
      },
      async signUp({ company, email, password }) {
        if (!supabase) {
          return { error: "Supabase is not configured yet." };
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              company_name: company,
            },
          },
        });

        if (error) {
          return { error: error.message };
        }

        if (data.session?.access_token) {
          await syncAccount(data.session.access_token, ensureAccount);
          return {};
        }

        return { needsEmailConfirmation: true };
      },
      async signOut() {
        if (!supabase) {
          return;
        }
        await supabase.auth.signOut();
      },
    }),
    [ensureAccount, error, isConfigured, isLoading, session, supabase],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}

export function AuthGate({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { session, isLoading, isConfigured } = useAuth();

  useEffect(() => {
    if (!isLoading && isConfigured && !session) {
      void navigate({ to: "/login" });
    }
  }, [isConfigured, isLoading, navigate, session]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading workspace…
      </div>
    );
  }

  if (isConfigured && !session) {
    return null;
  }

  return <>{children}</>;
}
