"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import Logo from "@/components/Logo";
import { loginAction } from "./actions";
import type { LoginState } from "@/lib/types";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-slate-50 via-white to-cyan-50/40">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-brand-navy/5 p-8">
          <div className="flex items-center gap-3 mb-7">
            <Logo size={42} />
            <div>
              <div className="text-xl font-bold text-brand-navy">
                Domain Guard
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Admin panel</div>
            </div>
          </div>

          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-brand-navy mb-1.5"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-brand-navy mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-white"
              />
            </div>

            {state.error && (
              <div className="px-3 py-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-navy-light disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              <LogIn size={16} />
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-[11px] text-slate-400 mt-7">
            NeXbit LTD · v0.3
          </p>
        </div>
      </div>
    </div>
  );
}
