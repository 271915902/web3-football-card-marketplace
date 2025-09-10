"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { FootballCard } from "@/components/home/FootballCard";
import { PurchaseButton } from "@/components/marketplace/PurchaseButton";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  TrendingDown,
  Star,
  MapPin,
  Users,
  Clock,
  Trophy,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useForSaleNFTs } from "@/lib/web3/useNFTs";
import { transformNFTToPlayerCard } from "@/lib/web3/dataTransform";
import { useWeb3 } from "@/lib/web3/Web3Context";

// 根据实际数据更新筛选选项
const rarities = [
  "all",
  "common",
  "rare",
  "star performer",
  "epic",
  "icon",
  "team of the season",
];
const positions = [
  "all",
  "GK",
  "CB",
  "LB",
  "RB",
  "CDM",
  "CM",
  "CAM",
  "LW",
  "RW",
  "ST",
  "CF",
  "LM",
  "RM",
];
const leagues = [
  "all",
  "Premier League",
  "LaLiga",
  "Bundesliga",
  "Serie A",
  "Ligue 1",
  "Major League Soccer",
  "ROSHN Saudi League",
  "Eredivisie",
  "Liga Portugal",
  "Super League",
];

export default function Marketplace() {
  const { nfts, loading, error, refetch } = useForSaleNFTs();
  const { isConnected, connectWallet } = useWeb3();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [selectedLeague, setSelectedLeague] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 20]);
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // 转换NFT数据为前端需要的格式 - 简化这部分
  const transformedPlayers = nfts
    .map((nft) => {
      const playerCard = transformNFTToPlayerCard(nft);
      if (!playerCard) return null;

      return {
        ...playerCard,
        priceChange: Math.random() * 20 - 10, // 模拟价格变化，实际应该从历史数据获取
      };
    })
    .filter(Boolean);

  // 筛选和排序逻辑
  const filteredPlayers = transformedPlayers
    .filter((player: any) => {
      if (
        searchTerm &&
        !player.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !player.team?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      if (selectedRarity !== "all" && player.rarity !== selectedRarity)
        return false;
      if (selectedPosition !== "all" && player.position !== selectedPosition)
        return false;
      if (selectedLeague !== "all" && player.league !== selectedLeague)
        return false;
      if (player.price < priceRange[0] || player.price > priceRange[1])
        return false;
      return true;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "price-high":
          return b.price - a.price;
        case "price-low":
          return a.price - b.price;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "trending":
          return (b.priceChange || 0) - (a.priceChange || 0);
        default:
          return 0;
      }
    });

  // 计算市场统计数据
  const marketStats = {
    totalCards: nfts.length,
    totalVolume: nfts.reduce((sum, nft) => sum + parseFloat(nft.price), 0),
    averagePrice:
      nfts.length > 0
        ? nfts.reduce((sum, nft) => sum + parseFloat(nft.price), 0) /
          nfts.length
        : 0,
    activeUsers: Math.floor(Math.random() * 2000) + 500, // 模拟数据
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-pitch-dark/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-linear-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                🏪 交易市场
              </span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              连接钱包以查看和购买足球明星数字收藏卡
            </p>
            <Button
              onClick={connectWallet}
              size="lg"
              className="bg-neon-blue hover:bg-neon-blue/80"
            >
              连接钱包
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-pitch-dark/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-linear-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              🏪 交易市场
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            发现和购买独特的足球明星数字收藏卡
          </p>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-neon-blue/20 hover:border-neon-blue/40 transition-colors cursor-pointer group">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-neon-blue/30 transition-colors">
                <TrendingUp className="h-4 w-4 text-neon-blue" />
              </div>
              <div className="text-2xl font-bold text-neon-blue">
                {marketStats.totalCards}
              </div>
              <div className="text-sm text-muted-foreground">可售卡片</div>
              <div className="text-xs text-neon-green mt-1">实时数据</div>
            </CardContent>
          </Card>
          <Card className="border-neon-green/20 hover:border-neon-green/40 transition-colors cursor-pointer group">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-neon-green/30 transition-colors">
                <Users className="h-4 w-4 text-neon-green" />
              </div>
              <div className="text-2xl font-bold text-neon-green">
                {marketStats.totalVolume.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">总交易量 ETH</div>
              <div className="text-xs text-neon-green mt-1">链上数据</div>
            </CardContent>
          </Card>
          <Card className="border-crypto-gold/20 hover:border-crypto-gold/40 transition-colors cursor-pointer group">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-crypto-gold/20 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-crypto-gold/30 transition-colors">
                <Star className="h-4 w-4 text-crypto-gold" />
              </div>
              <div className="text-2xl font-bold text-crypto-gold">
                {marketStats.averagePrice.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">均价 ETH</div>
              <div className="text-xs text-neon-green mt-1">实时计算</div>
            </CardContent>
          </Card>
          <Card className="border-neon-purple/20 hover:border-neon-purple/40 transition-colors cursor-pointer group">
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-neon-purple/20 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-neon-purple/30 transition-colors">
                <MapPin className="h-4 w-4 text-neon-purple" />
              </div>
              <div className="text-2xl font-bold text-neon-purple">
                {marketStats.activeUsers}
              </div>
              <div className="text-sm text-muted-foreground">活跃用户</div>
              <div className="text-xs text-neon-green mt-1">在线统计</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-xs">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    筛选条件
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedRarity("all");
                      setSelectedPosition("all");
                      setSelectedLeague("all");
                      setPriceRange([0, 20]);
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    重置
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">搜索</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索球员或球队..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Rarity Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    稀有度
                  </label>
                  <Select
                    value={selectedRarity}
                    onValueChange={setSelectedRarity}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部稀有度</SelectItem>
                      <SelectItem value="common">普通</SelectItem>
                      <SelectItem value="rare">稀有</SelectItem>
                      <SelectItem value="epic">史诗</SelectItem>
                      <SelectItem value="icon">传奇</SelectItem>
                      <SelectItem value="star performer">欧洲杯之星</SelectItem>
                      <SelectItem value="team of the season">
                        赛季最佳
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Position Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">位置</label>
                  <Select
                    value={selectedPosition}
                    onValueChange={setSelectedPosition}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部位置</SelectItem>
                      {positions.slice(1).map((pos) => (
                        <SelectItem key={pos} value={pos}>
                          {pos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* League Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">联赛</label>
                  <Select
                    value={selectedLeague}
                    onValueChange={setSelectedLeague}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部联赛</SelectItem>
                      {leagues.slice(1).map((league) => (
                        <SelectItem key={league} value={league}>
                          {league}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    价格范围: {priceRange[0]} - {priceRange[1]} ETH
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={20}
                    min={0}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  显示 {filteredPlayers.length} 张卡片
                </span>
                <Badge variant="secondary">{filteredPlayers.length}</Badge>
                {loading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    加载中...
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Refresh Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refetch}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "刷新"
                  )}
                </Button>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">按评分排序</SelectItem>
                    <SelectItem value="price-high">价格: 高到低</SelectItem>
                    <SelectItem value="price-low">价格: 低到高</SelectItem>
                    <SelectItem value="trending">热门趋势</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <Card className="p-6 mb-6 border-red-500/20 bg-red-500/5">
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="h-5 w-5" />
                  <span>加载失败: {error}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refetch}
                    className="ml-auto"
                  >
                    重试
                  </Button>
                </div>
              </Card>
            )}

            {/* Real-time Market Indicators */}
            <div className="bg-linear-to-r from-neon-blue/5 to-neon-purple/5 rounded-lg p-4 mb-6 border border-neon-blue/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">
                      区块链实时数据
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-neon-green/20 text-neon-green"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    链上同步
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  最后更新: 刚刚
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && nfts.length === 0 ? (
              <div className="text-center py-20">
                <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-neon-blue" />
                <h3 className="text-lg font-medium mb-2">加载NFT数据中...</h3>
                <p className="text-sm text-muted-foreground">
                  正在从区块链获取最新数据
                </p>
              </div>
            ) : filteredPlayers.length === 0 ? (
              <Card className="p-8 text-center border-dashed border-2 border-border/50">
                <div className="text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    {nfts.length === 0
                      ? "暂无在售NFT"
                      : "没有找到符合条件的卡片"}
                  </h3>
                  <p className="text-sm mb-4">
                    {nfts.length === 0
                      ? "当前没有球员卡在市场上出售"
                      : "尝试调整筛选条件或搜索其他球员"}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedRarity("all");
                      setSelectedPosition("all");
                      setSelectedLeague("all");
                      setPriceRange([0, 20]);
                    }}
                  >
                    清除所有筛选
                  </Button>
                </div>
              </Card>
            ) : (
              <>
                {/* Cards Grid */}
                <div
                  className={`grid gap-6 transition-all duration-300 ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {filteredPlayers.map((player: any, index) => (
                    <div key={player.id} className="group space-y-3">
                      <FootballCard
                        player={player}
                        variant={viewMode === "list" ? "compact" : "default"}
                      />

                      {/* 购买按钮组件 */}
                      <PurchaseButton
                        player={player}
                        variant={viewMode === "list" ? "compact" : "default"}
                        onPurchaseSuccess={(playerId) => {
                          // 购买成功后刷新数据
                          refetch();
                        }}
                        className={viewMode === "list" ? "" : "px-4"}
                      />
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {filteredPlayers.length > 0 && (
                  <div className="text-center mt-8">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10"
                      onClick={refetch}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          刷新数据
                        </>
                      ) : (
                        "刷新市场数据"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
