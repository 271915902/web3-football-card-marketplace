"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FootballCard } from "@/components/home/FootballCard";
import { 
  Trophy, 
  Crown,
  Medal,
  TrendingUp,
  Star,
  Zap,
  Users,
  Target,
  Award,
  ChevronUp,
  ChevronDown
} from "lucide-react";

// Mock leaderboard data
const topCollectors = [
  {
    id: 1,
    rank: 1,
    username: "CryptoMessi",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    totalValue: 245.7,
    cardCount: 89,
    profitPercentage: 34.2,
    favoritePlayer: "Lionel Messi",
    joinDate: "2023-03-15",
    achievements: 12
  },
  {
    id: 2,
    rank: 2,
    username: "FootballKing",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    totalValue: 198.3,
    cardCount: 67,
    profitPercentage: 28.7,
    favoritePlayer: "Kylian Mbappé",
    joinDate: "2023-02-20",
    achievements: 9
  },
  {
    id: 3,
    rank: 3,
    username: "StarCardMaster",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    totalValue: 176.9,
    cardCount: 45,
    profitPercentage: 42.1,
    favoritePlayer: "Erling Haaland",
    joinDate: "2023-04-10",
    achievements: 8
  },
  {
    id: 4,
    rank: 4,
    username: "NFTSoccer",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b932?w=150&h=150&fit=crop",
    totalValue: 156.4,
    cardCount: 78,
    profitPercentage: 19.8,
    favoritePlayer: "Kevin De Bruyne",
    joinDate: "2023-01-05",
    achievements: 11
  },
  {
    id: 5,
    rank: 5,
    username: "DigitalFootball",
    avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop",
    totalValue: 142.8,
    cardCount: 52,
    profitPercentage: 25.3,
    favoritePlayer: "Pedri",
    joinDate: "2023-05-18",
    achievements: 7
  }
];

const mostValuableCards = [
  {
    id: "1",
    name: "Lionel Messi",
    team: "Inter Miami",
    position: "RW",
    rating: 93,
    rarity: "legendary" as const,
    price: 22.8,
    priceChange: 15.2,
    imageUrl: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=600&fit=crop",
    stats: { pace: 85, shooting: 94, passing: 91, defending: 35, physicality: 68 },
    owner: "CryptoMessi",
    lastSale: 19.6
  },
  {
    id: "2", 
    name: "Kylian Mbappé",
    team: "PSG",
    position: "ST",
    rating: 91,
    rarity: "legendary" as const,
    price: 18.5,
    priceChange: 8.3,
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
    stats: { pace: 97, shooting: 89, passing: 80, defending: 36, physicality: 77 },
    owner: "FootballKing",
    lastSale: 17.1
  },
  {
    id: "3",
    name: "Cristiano Ronaldo",
    team: "Al Nassr",
    position: "ST",
    rating: 90,
    rarity: "legendary" as const,
    price: 16.2,
    priceChange: -3.1,
    imageUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=600&fit=crop",
    stats: { pace: 81, shooting: 92, passing: 82, defending: 34, physicality: 77 },
    owner: "StarCardMaster",
    lastSale: 16.7
  }
];

const topTraders = [
  {
    id: 1,
    username: "TradeGenius",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    totalTrades: 156,
    volume: 89.4,
    winRate: 78.5,
    profit: 23.7
  },
  {
    id: 2,
    username: "MarketMaster",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    totalTrades: 134,
    volume: 76.2,
    winRate: 72.1,
    profit: 18.9
  },
  {
    id: 3,
    username: "FlipKing",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop",
    totalTrades: 203,
    volume: 65.8,
    winRate: 69.8,
    profit: 15.2
  }
];

export default function Page() {
  const [activeTab, setActiveTab] = useState("collectors");

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-crypto-gold" />;
      case 2:
        return <Medal className="h-6 w-6 text-crypto-silver" />;
      case 3:
        return <Award className="h-6 w-6 text-crypto-bronze" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "border-crypto-gold/50 bg-crypto-gold/10";
    if (rank === 2) return "border-crypto-silver/50 bg-crypto-silver/10";
    if (rank === 3) return "border-crypto-bronze/50 bg-crypto-bronze/10";
    return "border-border/50";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-pitch-dark/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-linear-to-r from-crypto-gold to-neon-purple bg-clip-text text-transparent">
              🏆 排行榜
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">查看顶级收藏家、交易者和最有价值的卡片</p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-crypto-gold/20">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-crypto-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-crypto-gold">1,234</div>
              <div className="text-sm text-muted-foreground">活跃收藏家</div>
            </CardContent>
          </Card>
          <Card className="border-neon-blue/20">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-neon-blue mx-auto mb-2" />
              <div className="text-2xl font-bold text-neon-blue">5.2M</div>
              <div className="text-sm text-muted-foreground">总交易量 ETH</div>
            </CardContent>
          </Card>
          <Card className="border-neon-green/20">
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-neon-green mx-auto mb-2" />
              <div className="text-2xl font-bold text-neon-green">25K</div>
              <div className="text-sm text-muted-foreground">卡片总数</div>
            </CardContent>
          </Card>
          <Card className="border-neon-purple/20">
            <CardContent className="p-4 text-center">
              <Zap className="h-8 w-8 text-neon-purple mx-auto mb-2" />
              <div className="text-2xl font-bold text-neon-purple">432</div>
              <div className="text-sm text-muted-foreground">日交易数</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="collectors">顶级收藏家</TabsTrigger>
            <TabsTrigger value="cards">最有价值卡片</TabsTrigger>
            <TabsTrigger value="traders">最佳交易者</TabsTrigger>
          </TabsList>

          {/* Top Collectors Tab */}
          <TabsContent value="collectors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  顶级收藏家排行榜
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCollectors.map((collector) => (
                    <Card key={collector.id} className={`${getRankBadge(collector.rank)} transition-all hover:scale-[1.02]`}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          {/* Rank */}
                          <div className="shrink-0 w-12 flex justify-center">
                            {getRankIcon(collector.rank)}
                          </div>

                          {/* Avatar */}
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={collector.avatar} />
                            <AvatarFallback>{collector.username[0]}</AvatarFallback>
                          </Avatar>

                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold truncate">{collector.username}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {collector.achievements} 成就
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              最爱球员: {collector.favoritePlayer}
                            </p>
                          </div>

                          {/* Stats */}
                          <div className="hidden md:flex space-x-8 text-center">
                            <div>
                              <div className="text-lg font-bold text-neon-blue">
                                {collector.totalValue} ETH
                              </div>
                              <div className="text-xs text-muted-foreground">总价值</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-neon-green">
                                {collector.cardCount}
                              </div>
                              <div className="text-xs text-muted-foreground">卡片数</div>
                            </div>
                            <div>
                              <div className={`text-lg font-bold flex items-center ${
                                collector.profitPercentage >= 0 ? 'text-neon-green' : 'text-red-500'
                              }`}>
                                {collector.profitPercentage >= 0 ? (
                                  <ChevronUp className="h-4 w-4 mr-1" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 mr-1" />
                                )}
                                {collector.profitPercentage.toFixed(1)}%
                              </div>
                              <div className="text-xs text-muted-foreground">收益率</div>
                            </div>
                          </div>

                          {/* Mobile Stats */}
                          <div className="md:hidden text-right">
                            <div className="text-lg font-bold text-neon-blue">
                              {collector.totalValue} ETH
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {collector.cardCount} 卡片
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Most Valuable Cards Tab */}
          <TabsContent value="cards" className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">最有价值的球星卡</h3>
              <p className="text-muted-foreground">市场上价格最高的传奇卡片</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mostValuableCards.map((card, index) => (
                <div key={card.id} className="relative">
                  {/* Rank Badge */}
                  <div className="absolute -top-2 -left-2 z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index === 0 ? 'bg-crypto-gold' :
                      index === 1 ? 'bg-crypto-silver' :
                      'bg-crypto-bronze'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* <FootballCard player={card} variant="featured" /> */}
                  
                  {/* Owner Info */}
                  <div className="mt-3 p-3 bg-card/50 rounded-lg border border-border/50">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">持有者:</span>
                      <span className="font-medium">{card.owner}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-muted-foreground">上次成交:</span>
                      <span className="text-sm">{card.lastSale} ETH</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Top Traders Tab */}
          <TabsContent value="traders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  最佳交易者排行榜
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topTraders.map((trader, index) => (
                    <Card key={trader.id} className={`${getRankBadge(index + 1)} transition-all hover:scale-[1.02]`}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          {/* Rank */}
                          <div className="shrink-0 w-12 flex justify-center">
                            {getRankIcon(index + 1)}
                          </div>

                          {/* Avatar */}
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={trader.avatar} />
                            <AvatarFallback>{trader.username[0]}</AvatarFallback>
                          </Avatar>

                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{trader.username}</h3>
                            <p className="text-sm text-muted-foreground">
                              {trader.totalTrades} 笔交易
                            </p>
                          </div>

                          {/* Trading Stats */}
                          <div className="hidden md:flex space-x-6 text-center">
                            <div>
                              <div className="text-lg font-bold text-neon-blue">
                                {trader.volume} ETH
                              </div>
                              <div className="text-xs text-muted-foreground">交易量</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-neon-green">
                                {trader.winRate}%
                              </div>
                              <div className="text-xs text-muted-foreground">胜率</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-crypto-gold">
                                +{trader.profit} ETH
                              </div>
                              <div className="text-xs text-muted-foreground">总收益</div>
                            </div>
                          </div>

                          {/* Mobile Stats */}
                          <div className="md:hidden text-right">
                            <div className="text-lg font-bold text-neon-green">
                              {trader.winRate}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              胜率
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
