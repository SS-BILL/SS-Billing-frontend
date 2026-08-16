'use client';

import { Check, Copy, LogOut, Wallet } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { truncateAddress } from '../../lib/format';
import { useWallet } from '../../store/wallet.store';
import { Button } from '../ui/Button';

export function WalletButton() {
  const { address, connecting, error, connect, disconnect, clearError } = useWallet();
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Clearing the timeout on unmount stops a setState landing on a component
     that has already gone — which is what happens when someone copies an
     address and immediately navigates away. */
  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  async function handleCopy() {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard is blocked in insecure contexts and some embedded views.
         The address stays selectable, so this is a silent no-op rather than
         an error worth interrupting anyone over. */
    }
  }

  if (address) {
    return (
      <div className="flex items-center gap-1.5">
        <span
          className="hidden items-center gap-2 rounded-md border border-line bg-surface-raised px-3 h-11 sm:inline-flex"
          /* The full address is available on hover and to assistive tech;
             the truncation is a display convenience, not the value. */
          title={address}
        >
          <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-success" />
          <span className="sr-only">Connected wallet:</span>
          <span className="font-mono text-xs text-content-secondary">
            {truncateAddress(address)}
          </span>
        </span>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          aria-label={copied ? 'Address copied' : 'Copy wallet address'}
        >
          {copied ? (
            <Check aria-hidden className="h-4 w-4 text-success" />
          ) : (
            <Copy aria-hidden className="h-4 w-4" />
          )}
        </Button>

        <Button variant="ghost" size="icon" onClick={disconnect} aria-label="Disconnect wallet">
          <LogOut aria-hidden className="h-4 w-4" />
        </Button>

        {/* Announced politely so a screen reader confirms the copy without
            stealing focus from wherever the user is. */}
        <span role="status" aria-live="polite" className="sr-only">
          {copied ? 'Wallet address copied to clipboard' : ''}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <Button
        onClick={() => {
          clearError();
          void connect();
        }}
        isLoading={connecting}
        loadingText="Connecting…"
        leadingIcon={<Wallet aria-hidden className="h-4 w-4" />}
      >
        Connect wallet
      </Button>

      {error && (
        <p role="alert" className="max-w-[16rem] text-right text-xs text-danger">
          {error.message}{' '}
          {error.kind === 'not-installed' && (
            <a
              href="https://www.freighter.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-2 hover:text-content-primary"
            >
              Get Freighter
            </a>
          )}
        </p>
      )}
    </div>
  );
}
