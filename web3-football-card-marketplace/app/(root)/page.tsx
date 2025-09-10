"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FootballCard } from "@/components/home/FootballCard";
import {
  Trophy,
  Zap,
  TrendingUp,
  Globe,
  Shield,
  Users,
  ArrowRight,
  Sparkles,
  Target,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { VideoPlayer } from "@/components/home/VideoPlayer";
import { useNFTs } from "@/lib/web3/useNFTs";
import { transformNFTToPlayerCard } from "@/lib/web3/dataTransform";

export default function Home() {
  const { nfts, loading, error } = useNFTs();

  // 转换 NFT 数据为球员卡格式
  const playerCards = nfts
    .map(transformNFTToPlayerCard)
    .filter(Boolean)
    .slice(0, 6); // 只显示前6张

  // 精选球星卡（价格最高的3张）
  const featuredPlayers = playerCards
    .sort((a, b) => b.price - a.price)
    .slice(0, 3);

  // 热门趋势（在售的卡片）
  const trendingPlayers = playerCards
    .filter((card) => card.isForSale)
    .sort((a, b) => a.price - b.price)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            playsInline
            className="w-full h-full object-cover scale-150"
          >
            <source src="/videos/scoreHighLights.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                FootballStars
              </span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-2xl mx-auto">
              收集、交易、拥有你最喜爱的足球明星NFT卡片
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-neon-blue hover:bg-neon-blue/80">
                开始探索
              </Button>
              {/* <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                了解更多
              </Button> */}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <ChevronDown className="w-6 h-6 text-white" />
          </div>
        </div>
      </section>

      {/* Rest of the content */}
      {/* Featured Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              <span className="bg-linear-to-r from-crypto-gold to-neon-blue bg-clip-text text-transparent">
                精选球星卡
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              发现最受欢迎和最有价值的足球明星收藏卡
            </p>
          </div>

          {/* 加载状态 */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-neon-blue" />
              <span className="ml-2 text-muted-foreground">
                加载球星卡中...
              </span>
            </div>
          )}

          {/* 错误状态 */}
          {error && (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">加载失败: {error}</p>
              <Button onClick={() => window.location.reload()}>重新加载</Button>
            </div>
          )}

          {/* 球星卡展示 */}
          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-12">
                {featuredPlayers.length > 0 ? (
                  featuredPlayers.map((player) => (
                    <FootballCard
                      key={player.id}
                      player={player}
                      variant="featured"
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-muted-foreground">暂无球星卡数据</p>
                  </div>
                )}
              </div>

              <div className="text-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-neon-purple/50 text-neon-purple hover:bg-neon-purple/10"
                >
                  查看所有精选卡片
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-20 bg-linear-to-r from-pitch-dark/30 to-transparent">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-2">
                <span className="text-neon-green">📈</span> 热门趋势
              </h2>
              <p className="text-muted-foreground">当前在售的球星卡</p>
            </div>
            <Button
              variant="ghost"
              className="text-neon-green hover:text-neon-green/80"
            >
              查看排行榜
              <TrendingUp className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {trendingPlayers.length > 0 ? (
              trendingPlayers.map((player) => (
                <FootballCard
                  key={player.id}
                  player={player}
                  variant="default"
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">暂无在售球星卡</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 其他 Section 保持不变 */}
      {/* Video Showcase Section */}

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              为什么选择
              <span className="bg-linear-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent ml-2">
                FootballStars
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              领先的Web3足球卡交易平台
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-card border border-neon-blue/20 hover:border-neon-blue/40 transition-colors">
              <div className="w-12 h-12 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-neon-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">区块链安全</h3>
              <p className="text-muted-foreground">
                基于以太坊区块链，确保每张卡片的真实性和所有权
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-card border border-neon-purple/20 hover:border-neon-purple/40 transition-colors">
              <div className="w-12 h-12 bg-neon-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-neon-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">全球市场</h3>
              <p className="text-muted-foreground">
                与世界各地的收藏家交易，24/7不间断市场
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-card border border-crypto-gold/20 hover:border-crypto-gold/40 transition-colors">
              <div className="w-12 h-12 bg-crypto-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-crypto-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-2">稀有度保证</h3>
              <p className="text-muted-foreground">
                透明的稀有度系统，每张卡片都有验证的稀有等级
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-neon-blue/10 via-neon-purple/10 to-crypto-gold/10" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              准备开始您的
              <span className="bg-linear-to-r from-neon-green to-neon-cyan bg-clip-text text-transparent ml-2">
                收藏之旅
              </span>
              了吗？
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              连接您的钱包，立即开始收集和交易独特的足球明星数字卡片
            </p>
            <Button
              size="lg"
              className="bg-linear-to-r from-neon-green to-neon-cyan hover:from-neon-cyan hover:to-neon-green text-white border-0 px-12 py-6 text-lg font-semibold"
            >
              <Users className="mr-2 h-5 w-5" />
              连接钱包开始收集
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
