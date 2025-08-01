'use client';

import { useAccount, useBalance, useChainId } from 'wagmi';

export function useWallet() {
  const { address, isConnected, isConnecting, isDisconnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({
    address,
  });

  return {
    address,
    isConnected,
    isConnecting,
    isDisconnected,
    chainId,
    balance,
  };
} 