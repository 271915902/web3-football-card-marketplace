import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Zap, Trophy, TrendingUp, User, Wallet } from "lucide-react";
import ConnectWalletButton from "./ConnectWalletButton";
function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative">
            <Trophy className="h-8 w-8 text-neon-blue animate-glow" />
            <Zap className="absolute -top-1 -right-1 h-4 w-4 text-crypto-gold animate-pulse" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            FootballStars
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/marketplace"
            className="text-sm font-medium transition-colors hover:text-neon-blue"
          >
            市场
          </Link>
          <Link
            href="/collections"
            className="text-sm font-medium transition-colors hover:text-neon-blue"
          >
            收藏
          </Link>
          <Link
            href="/leaderboard"
            className="text-sm font-medium transition-colors hover:text-neon-blue"
          >
            排行榜
          </Link>
          <Link
            href="/trade"
            className="text-sm font-medium transition-colors hover:text-neon-blue"
          >
            交易
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
}

export default Header;
