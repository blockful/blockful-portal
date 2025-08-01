'use client';

import { useWallet } from '@/hooks/useWallet';
import { Wallet, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const getChainName = (chainId: number | undefined): string => {
  if (!chainId) return 'Unknown';
  
  switch (chainId) {
    case 42161:
      return 'Arbitrum One';
    default:
      return `Chain ID: ${chainId} (Unsupported)`;
  }
};

export function WalletInfo() {
  const { address, isConnected, chainId, balance } = useWallet();
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Wallet className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <span className="text-yellow-800 dark:text-yellow-200 font-medium">
            Connect your wallet to view information
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          <span className="text-green-800 dark:text-green-200 font-medium">
            Wallet Connected
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-700 dark:text-green-300">Network:</span>
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              {getChainName(chainId)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-700 dark:text-green-300">Balance:</span>
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Loading...'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-700 dark:text-green-300">Address:</span>
            <button
              onClick={copyAddress}
              className="flex items-center space-x-1 text-sm text-green-800 dark:text-green-200 hover:text-green-900 dark:hover:text-green-100"
            >
              <span className="font-mono">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
              </span>
              {copied ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 