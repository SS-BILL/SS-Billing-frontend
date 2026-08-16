import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { isConnected, getAddress, signTransaction, requestAccess } from '@stellar/freighter-api';

export type WalletError =
  | { kind: 'not-installed'; message: string }
  | { kind: 'rejected'; message: string }
  | { kind: 'unknown'; message: string };

interface WalletState {
  address: string | null;
  connecting: boolean;
  error: WalletError | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  clearError: () => void;
  signTx: (xdr: string, networkPassphrase: string) => Promise<string>;
}

/** Freighter signals a user-declined prompt through a few different shapes. */
function isUserRejection(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? '');
  return /reject|denied|declined|cancell?ed/i.test(message);
}

export const useWallet = create<WalletState>()(
  persist(
    (set) => ({
      address: null,
      connecting: false,
      error: null,

      /**
       * Connect via Freighter.
       *
       * This used to throw on a missing extension straight out of an onClick
       * with no catch anywhere — an unhandled rejection in the console and
       * absolutely nothing on screen. The most common first-run case (no
       * wallet installed) looked identical to the button being broken.
       *
       * Failures are now captured as state so the UI can explain them, and
       * the three cases are distinguished because they need different advice:
       * install the extension, retry the prompt, or report a real fault.
       */
      connect: async () => {
        set({ connecting: true, error: null });
        try {
          const installed = await isConnected();
          if (!installed) {
            set({
              error: {
                kind: 'not-installed',
                message: 'Freighter is not installed. Install the extension to connect a wallet.',
              },
            });
            return;
          }

          await requestAccess();
          const result = await getAddress();
          if ('error' in result && result.error) throw new Error(String(result.error));

          const { address } = result as { address: string };
          if (!address) throw new Error('Freighter returned no address.');

          set({ address });
        } catch (error) {
          set({
            error: isUserRejection(error)
              ? { kind: 'rejected', message: 'Connection request was declined in Freighter.' }
              : {
                  kind: 'unknown',
                  message:
                    error instanceof Error ? error.message : 'Could not connect to Freighter.',
                },
          });
        } finally {
          /* Always clears, so a thrown error can't strand the button in a
             permanent "Connecting…" state. */
          set({ connecting: false });
        }
      },

      disconnect: () => set({ address: null, error: null }),

      clearError: () => set({ error: null }),

      signTx: async (xdr, networkPassphrase) => {
        const result = await signTransaction(xdr, { networkPassphrase });
        if ('error' in result && result.error) throw new Error(String(result.error));
        return (result as { signedTxXdr: string }).signedTxXdr;
      },
    }),
    {
      name: 'ss-billing-wallet',
      storage: createJSONStorage(() => localStorage),
      /**
       * Only the address survives a reload — never connecting/error, which
       * would restore a stale spinner or a dead error on next visit.
       *
       * The address is a public identifier, not a credential: it grants
       * nothing on its own, and every mutating call is still authorised by a
       * wallet signature.
       */
      partialize: (state) => ({ address: state.address }),
    },
  ),
);
