'use client';

import { useState } from 'react';
import { useAccount, useBalance, useSendTransaction, usePrepareSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { DollarSign, Wallet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface PaymentButtonProps {
  amount: number;
  currency: string;
  recipientAddress: string;
  reimbursementId: string;
  onPaymentSuccess?: () => void;
}

export function PaymentButton({ 
  amount, 
  currency, 
  recipientAddress, 
  reimbursementId, 
  onPaymentSuccess 
}: PaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address,
  });

  // Convert USD amount to ETH (using a more realistic conversion rate)
  // In production, you'd want to use a price oracle like Chainlink
  const getEthAmount = (usdAmount: number) => {
    // Using a more realistic ETH price (1 ETH ≈ $2500 for demo)
    // In production, use a real price feed
    const ethPrice = 2500; // USD per ETH
    return usdAmount / ethPrice;
  };

  const ethAmount = getEthAmount(amount);

  const { config } = usePrepareSendTransaction({
    to: recipientAddress,
    value: parseEther(ethAmount.toString()),
    enabled: isConnected && amount > 0,
  });

  const { sendTransaction, isPending } = useSendTransaction(config);

  const handlePayment = async () => {
    if (!isConnected) {
      setErrorMessage('Please connect your wallet first');
      setPaymentStatus('error');
      return;
    }

    if (!balance || parseFloat(balance.formatted) < ethAmount) {
      setErrorMessage('Insufficient balance');
      setPaymentStatus('error');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('idle');
    setErrorMessage('');

    try {
      const result = await sendTransaction?.();
      
      if (result?.hash) {
        setPaymentStatus('success');
        onPaymentSuccess?.();
        
        // Reset status after 3 seconds
        setTimeout(() => {
          setPaymentStatus('idle');
        }, 3000);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setErrorMessage(error.message || 'Payment failed');
      setPaymentStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const getButtonContent = () => {
    if (paymentStatus === 'success') {
      return (
        <>
          <CheckCircle className="h-4 w-4" />
          <span>Paid</span>
        </>
      );
    }

    if (paymentStatus === 'error') {
      return (
        <>
          <AlertCircle className="h-4 w-4" />
          <span>Failed</span>
        </>
      );
    }

    if (isProcessing || isPending) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing...</span>
        </>
      );
    }

    return (
      <>
        <DollarSign className="h-4 w-4" />
        <span>Pay ${amount}</span>
      </>
    );
  };

  const getButtonStyle = () => {
    if (paymentStatus === 'success') {
      return 'bg-green-600 hover:bg-green-700 text-white';
    }
    
    if (paymentStatus === 'error') {
      return 'bg-red-600 hover:bg-red-700 text-white';
    }

    if (!isConnected) {
      return 'bg-gray-400 cursor-not-allowed text-white';
    }

    return 'bg-blue-600 hover:bg-blue-700 text-white';
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handlePayment}
        disabled={!isConnected || isProcessing || isPending}
        className={`px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-colors duration-200 ${getButtonStyle()}`}
      >
        {getButtonContent()}
      </button>
      
      {errorMessage && paymentStatus === 'error' && (
        <p className="text-xs text-red-600 dark:text-red-400">{errorMessage}</p>
      )}
      
      {isConnected && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <div>Amount: {ethAmount.toFixed(6)} ETH</div>
          <div>Balance: {balance ? parseFloat(balance.formatted).toFixed(4) : '0'} ETH</div>
          <div className="truncate max-w-[120px]" title={recipientAddress}>
            To: {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}
          </div>
        </div>
      )}
      
      {!isConnected && (
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
          <Wallet className="h-3 w-3" />
          <span>Connect wallet to pay</span>
        </div>
      )}
    </div>
  );
} 