'use client';

import { useActionState } from 'react';
import { signIn, type SignInState } from '../actions';

const inputClass =
  'mt-1 w-full rounded-xl border border-[#EBD9E2] bg-white px-3 py-2.5 outline-none transition ' +
  'focus:border-[#E05A8E] focus:ring-4 focus:ring-[#E05A8E]/15';

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<SignInState, FormData>(signIn, {});

  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next} />

      <label className="block text-sm font-medium">
        Email
        <input name="email" type="email" autoComplete="email" required className={inputClass} />
      </label>

      <label className="block text-sm font-medium">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </label>

      {state.error && (
        <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-[#A8275E] px-4 py-2.5 font-semibold text-white transition hover:bg-[#8F1F4F] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E05A8E]/40 disabled:opacity-60"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
