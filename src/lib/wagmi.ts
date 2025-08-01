import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Blockful Portal',
  projectId: 'YOUR_PROJECT_ID', // Get one at https://cloud.walletconnect.com
  chains: [arbitrum],
  ssr: true, // Required for Next.js
}); 