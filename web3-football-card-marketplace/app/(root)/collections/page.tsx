"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { FootballCard } from "@/components/home/FootballCard";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { useUserCollection } from "@/lib/web3/useUserCollection";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Star,
  Wallet,
  Target,
  Award,
  Gem,
  BarChart3,
  Eye,
  Share,
  Download,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function Page() {
  const [activeTab, setActiveTab] = useState("overview");
  const { address, isConnected } = useWeb3();
  const { collection, transformedCards, stats, loading, error, refetch } =
    useUserCollection(address);

  // 如果未连接钱包
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-pitch-dark/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <Wallet className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">请连接钱包</h2>
            <p className="text-muted-foreground">
              连接您的钱包以查看您的数字足球卡收藏
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-pitch-dark/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <RefreshCw className="h-16 w-16 mx-auto mb-4 text-muted-foreground animate-spin" />
            <h2 className="text-2xl font-bold mb-2">加载中...</h2>
            <p className="text-muted-foreground">正在获取您的收藏数据</p>
          </div>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-pitch-dark/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">加载失败</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refetch}>重试</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-pitch-dark/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-linear-to-r from-neon-purple to-crypto-gold bg-clip-text text-transparent">
                📚 我的收藏
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              管理和查看您的数字足球卡收藏
            </p>
          </div>
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-neon-blue/20 bg-linear-to-br from-neon-blue/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总价值</p>
                  <p className="text-2xl font-bold text-neon-blue">
                    {stats.totalValue.toFixed(3)} ETH
                  </p>
                </div>
                <Wallet className="h-8 w-8 text-neon-blue/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-neon-green/20 bg-linear-to-br from-neon-green/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总收益</p>
                  <p
                    className={`text-2xl font-bold ${
                      stats.totalProfit >= 0
                        ? "text-neon-green"
                        : "text-red-500"
                    }`}
                  >
                    {stats.totalProfit >= 0 ? "+" : ""}
                    {stats.totalProfit.toFixed(3)} ETH
                  </p>
                  <p
                    className={`text-xs ${
                      stats.profitPercentage >= 0
                        ? "text-neon-green"
                        : "text-red-500"
                    }`}
                  >
                    {stats.profitPercentage >= 0 ? "+" : ""}
                    {stats.profitPercentage.toFixed(1)}%
                  </p>
                </div>
                {stats.totalProfit >= 0 ? (
                  <TrendingUp className="h-8 w-8 text-neon-green/60" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-red-500/60" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-crypto-gold/20 bg-linear-to-br from-crypto-gold/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">卡片数量</p>
                  <p className="text-2xl font-bold text-crypto-gold">
                    {stats.totalCards}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-crypto-gold/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-neon-purple/20 bg-linear-to-br from-neon-purple/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">平均评分</p>
                  <p className="text-2xl font-bold text-neon-purple">
                    {stats.averageRating.toFixed(0)}
                  </p>
                </div>
                <Star className="h-8 w-8 text-neon-purple/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="cards">我的卡片</TabsTrigger>
            <TabsTrigger value="history">购买记录</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Portfolio Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    稀有度分布
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(stats.rarityBreakdown).map(
                      ([rarity, count]) => {
                        
                        // 稀有度颜色和图标配置
                        const rarityConfig = {
                          icon: {
                            color: "text-yellow-500",
                            bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20",
                            borderColor: "border-yellow-200 dark:border-yellow-700",
                            icon: "👑",
                            name: "传奇"
                          },
                          "team of the season": {
                            color: "text-purple-500",
                            bgColor: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
                            borderColor: "border-purple-200 dark:border-purple-700",
                            icon: "🏆",
                            name: "赛季最佳"
                          },
                          "star performer": {
                            color: "text-blue-500",
                            bgColor: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
                            borderColor: "border-blue-200 dark:border-blue-700",
                            icon: "⭐",
                            name: "欧洲杯之星"
                          }
                        };

                        const config = rarityConfig[rarity as keyof typeof rarityConfig] || {
                          color: "text-gray-500",
                          bgColor: "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20",
                          borderColor: "border-gray-200 dark:border-gray-600",
                          icon: "🔹",
                          name: "未知"
                        };
                        const percentage = stats.totalCards > 0 ? ((count / stats.totalCards) * 100).toFixed(1) : '0';

                        return (
                          <div
                            key={rarity}
                            className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                              config.bgColor
                            } ${
                              config.borderColor
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">{config.icon}</span>
                                <span className={`text-sm font-medium capitalize ${
                                  config.color
                                }`}>
                                  {config.name}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-end justify-between">
                              <div>
                                <div className={`text-2xl font-bold ${
                                  config.color
                                }`}>
                                  {count}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {percentage}%
                                </div>
                              </div>
                              <div className={`text-xs px-2 py-1 rounded-full ${
                                config.bgColor
                              } ${
                                config.color
                              } font-medium`}>
                                {count}张
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                  
                  {/* 如果没有任何卡片，显示空状态 */}
                  {stats.totalCards === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="text-4xl mb-2">📊</div>
                      <p className="text-sm">暂无卡片数据</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>最近活动</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {collection.purchaseHistory
                      .slice(0, 5)
                      .map((record, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3"
                        >
                          <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm">
                              购买了{" "}
                              {record.playerName || `卡片 #${record.tokenId}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(record.timestamp).toLocaleDateString(
                                "zh-CN"
                              )}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="text-neon-green"
                          >
                            {record.price} ETH
                          </Badge>
                        </div>
                      ))}
                    {collection.purchaseHistory.length === 0 && (
                      <p className="text-muted-foreground text-center py-4">
                        暂无购买记录
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cards Tab */}
          <TabsContent value="cards" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                我的卡片 ({transformedCards.length})
              </h3>
            </div>

            {transformedCards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {transformedCards.map((card) => {
                  if (!card) return null;

                  // 从购买记录中找到对应的购买价格
                  const purchaseRecord = collection.purchaseHistory.find(
                    (record) => record.tokenId === card.id
                  );
                  const acquiredPrice = purchaseRecord
                    ? parseFloat(purchaseRecord.price)
                    : 0;
                  const currentProfit = card.price - acquiredPrice;

                  return (
                    <div key={card.id} className="relative">
                      <FootballCard player={card} />
                      <div className="mt-3 p-3 bg-card/50 rounded-lg border border-border/50">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            获得价格:
                          </span>
                          <span>{acquiredPrice.toFixed(3)} ETH</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-muted-foreground">
                            当前价值:
                          </span>
                          <span className="font-medium">
                            {card.price.toFixed(3)} ETH
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-muted-foreground">收益:</span>
                          <span
                            className={
                              currentProfit >= 0
                                ? "text-neon-green"
                                : "text-red-500"
                            }
                          >
                            {currentProfit >= 0 ? "+" : ""}
                            {currentProfit.toFixed(3)} ETH
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">暂无收藏</h3>
                <p className="text-muted-foreground">
                  您还没有购买任何足球卡片，去市场看看吧！
                </p>
              </div>
            )}
          </TabsContent>

          {/* Purchase History Tab */}
          <TabsContent value="history" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                购买记录 ({collection.purchaseHistory.length})
              </h3>
            </div>

            {collection.purchaseHistory.length > 0 ? (
              <div className="space-y-4">
                {collection.purchaseHistory.map((record, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-lg flex items-center justify-center">
                            <Trophy className="h-6 w-6 text-neon-blue" />
                          </div>
                          <div>
                            <h4 className="font-semibold">
                              {record?.playerName ||
                                `卡片 #${record.tokenId}`}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(record.timestamp).toLocaleString(
                                "zh-CN"
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{record.price} ETH</p>
                          <p className="text-sm text-muted-foreground">
                            Token ID: {record.tokenId}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">暂无购买记录</h3>
                <p className="text-muted-foreground">
                  您还没有购买任何足球卡片
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
