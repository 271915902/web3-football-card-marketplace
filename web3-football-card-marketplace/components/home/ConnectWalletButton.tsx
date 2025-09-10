"use client"
import React from "react";
import { Button } from "../ui/button";
import { Wallet, Unplug, AlertCircle } from "lucide-react";
import { useWeb3 } from "@/lib/web3/Web3Context";

function ConnectWalletButton() {
  const { 
    address, 
    balance, 
    isConnected, 
    isConnecting, 
    error, 
    connectWallet, 
    disconnectWallet 
  } = useWeb3();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (bal: string) => {
    return parseFloat(bal).toFixed(4);
  };

  if (error) {
    return (
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <span className="text-sm text-red-500">{error}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={connectWallet}
          className="border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10"
        >
          重试
        </Button>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm">
          <div className="text-neon-blue font-medium">
            {formatAddress(address)}
          </div>
          {balance && (
            <div className="text-xs text-muted-foreground">
              {formatBalance(balance)} ETH
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={disconnectWallet}
          className="border-red-500/50 text-red-500 hover:bg-red-500/10"
        >
          <Unplug className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={connectWallet}
      disabled={isConnecting}
      className="border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10"
    >
      <Wallet className="h-4 w-4 mr-2" />
      {isConnecting ? "连接中..." : "连接钱包"}
    </Button>
  );
}

export default ConnectWalletButton;