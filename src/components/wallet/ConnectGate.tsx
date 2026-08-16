import { Wallet } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';
import { Surface } from '../ui/Surface';
import { WalletButton } from './WalletButton';

/**
 * Shown on dashboard routes before a wallet is connected.
 *
 * Both dashboards previously rendered a bare centred sentence — "Connect
 * your wallet to view the merchant dashboard." — with no way to act on it.
 * The connect control lived only in the header the dashboards weren't
 * rendering, so the instruction pointed at a button that wasn't on screen.
 */
export function ConnectGate({ title, description }: { title: string; description: string }) {
  return (
    <Surface tone="raised" padding="none" className="mx-auto mt-12 max-w-lg">
      <EmptyState
        icon={Wallet}
        title={title}
        description={description}
        action={<WalletButton />}
      />
    </Surface>
  );
}
