import type {
  PaymentChain,
} from '../../../core-ai/clawd-grok/src/utils/settings.js';

export interface WalletData {
  address: string;
  chain: PaymentChain;
  createdAt: string;
}

export interface WalletBalance {
  address: string;
  chain: PaymentChain;
  nativeSymbol: string;
  nativeBalance: string;
  usdcBalance: string;
}
