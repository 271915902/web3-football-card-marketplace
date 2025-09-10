"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { useUserTrading } from "@/lib/web3/useUserTrading";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  DollarSign,
  Package,
  Clock,
  Edit3,
  X,
  Search,
  Wallet,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  Plus,
  XCircle,
  Calendar,
} from "lucide-react";

export default function Page() {
  const { isConnected, connectWallet, address } = useWeb3();
  const {
    userCards,
    activeListings,
    saleHistory,
    tradingStats,
    loading,
    error,
    listCard,
    cancelCardListing,
    updatePrice,
    refetch,
  } = useUserTrading(address);

  const [activeTab, setActiveTab] = useState("my-cards");
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [listingPrice, setListingPrice] = useState("");
  const [updatePriceCard, setUpdatePriceCard] = useState<number | null>(null);
  const [newPrice, setNewPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [rarityFilter, setRarityFilter] = useState("all");
  const [isListing, setIsListing] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp * 1000;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    return "刚刚";
  };

  const handleListCard = async (tokenId: number) => {
    if (!listingPrice || parseFloat(listingPrice) <= 0) {
      toast.error("请输入有效的价格");
      return;
    }

    try {
      setIsListing(true);
      await listCard(tokenId, listingPrice);
      setListingPrice("");
      setSelectedCard(null);
      toast.success("卡片已成功上架");
    } catch (err: any) {
      console.log(err, "cyiwy");
      toast.error(err.message || "上架失败，请稍后重试");
    } finally {
      setIsListing(false);
    }
  };

  const handleCancelListing = async (tokenId: number) => {
    try {
      setIsCanceling(true);
      await cancelCardListing(tokenId);
      toast.success("已取消卡片上架");
    } catch (err: any) {
      toast.error(err.message || "取消失败，请稍后重试");
    } finally {
      setIsCanceling(false);
    }
  };

  const handleUpdatePrice = async (tokenId: number) => {
    if (!newPrice || parseFloat(newPrice) <= 0) {
      toast.error("请输入有效的价格");
      return;
    }

    try {
      setIsUpdatingPrice(true);
      await updatePrice(tokenId, newPrice);
      setNewPrice("");
      setUpdatePriceCard(null);
      toast.success("价格已更新");
    } catch (err: any) {
      toast.error(err.message || "更新失败，请稍后重试");
    } finally {
      setIsUpdatingPrice(false);
    }
  };

  // 过滤用户卡片
  const filteredUserCards =
    userCards?.filter((card) => {
      const matchesSearch =
        !searchTerm ||
        card.playerCard?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        card.playerCard?.team?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRarity =
        rarityFilter === "all" || card.playerCard?.rarity === rarityFilter;

      return matchesSearch && matchesRarity;
    }) || [];

  // 如果未连接钱包
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-pitch-dark/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-2xl font-bold mb-4">请连接钱包</h2>
            <p className="text-muted-foreground mb-6">
              连接您的钱包以查看和管理您的卡片交易
            </p>
            <Button onClick={connectWallet} size="lg">
              连接钱包
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-pitch-dark/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-neon-green to-neon-cyan bg-clip-text text-transparent">
                  💼 我的交易中心
                </span>
              </h1>
              <p className="text-muted-foreground text-lg">
                管理您的卡片出售和查看交易记录
              </p>
            </div>
            <Button
              onClick={refetch}
              variant="outline"
              disabled={loading}
              className="flex items-center space-x-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span>刷新</span>
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-500/20 bg-red-500/5">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-red-500">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trading Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-neon-green/20">
            <CardContent className="p-4 text-center">
              <Package className="h-8 w-8 text-neon-green mx-auto mb-2" />
              <div className="text-2xl font-bold text-neon-green">
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : (
                  userCards?.length || 0
                )}
              </div>
              <div className="text-sm text-muted-foreground">我的卡片</div>
            </CardContent>
          </Card>
          <Card className="border-neon-blue/20">
            <CardContent className="p-4 text-center">
              <ArrowLeftRight className="h-8 w-8 text-neon-blue mx-auto mb-2" />
              <div className="text-2xl font-bold text-neon-blue">
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : (
                  tradingStats.activeListings
                )}
              </div>
              <div className="text-sm text-muted-foreground">出售中</div>
            </CardContent>
          </Card>
          <Card className="border-crypto-gold/20">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-crypto-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-crypto-gold">
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : (
                  tradingStats.totalSales
                )}
              </div>
              <div className="text-sm text-muted-foreground">已售出</div>
            </CardContent>
          </Card>
          <Card className="border-neon-purple/20">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-neon-purple mx-auto mb-2" />
              <div className="text-2xl font-bold text-neon-purple">
                {parseFloat(tradingStats.totalRevenue).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">总收益 ETH</div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-3 w-full sm:w-auto">
            <TabsTrigger value="my-cards">我的卡片</TabsTrigger>
            <TabsTrigger value="active-listings">出售中</TabsTrigger>
            <TabsTrigger value="history">交易历史</TabsTrigger>
          </TabsList>

          {/* My Cards Tab */}
          <TabsContent value="my-cards" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索我的卡片..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={rarityFilter} onValueChange={setRarityFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部稀有度</SelectItem>
                  <SelectItem value="icon">传奇</SelectItem>
                  <SelectItem value="epic">史诗</SelectItem>
                  <SelectItem value="rare">稀有</SelectItem>
                  <SelectItem value="common">普通</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredUserCards.length === 0 ? (
              <Card className="p-8 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">暂无卡片</h3>
                <p className="text-muted-foreground mb-4">
                  前往市场购买您的第一张卡片！
                </p>
                <Button>前往市场</Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUserCards?.map((card) => (
                  <Card
                    key={card.tokenId}
                    className="border-border/50 hover:border-border transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex space-x-4 mb-4">
                        <div className="w-20 h-28 shrink-0">
                          <img
                            src={card?.playerCard?.imageUrl}
                            alt={card.playerCard?.name || "Unknown Player"}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {card.playerCard?.name || "Unknown Player"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {card.playerCard?.team || "Unknown Team"} •{" "}
                            {card.playerCard?.position || "N/A"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            评分: {card.playerCard?.rating || "N/A"}
                          </p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {card.playerCard?.rarity || "common"}
                          </Badge>
                          {card.isListed && (
                            <Badge className="mt-1 ml-2 text-xs bg-neon-green/20 text-neon-green">
                              出售中
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {card.isListed && card.listingInfo && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                出售价:
                              </span>
                              <span className="text-sm font-medium text-neon-green">
                                {card.listingInfo.price} ETH
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                上架时间:
                              </span>
                              <span className="text-sm">
                                {formatTimeAgo(card.listingInfo.listedAt)}
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      {card.isListed ? (
                        <div className="space-y-2">
                          {updatePriceCard === card.tokenId ? (
                            <div className="space-y-2">
                              <Input
                                placeholder="新价格 (ETH)"
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                                type="number"
                                step="0.01"
                                min="0"
                              />
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  className="flex-1"
                                  onClick={() =>
                                    handleUpdatePrice(card.tokenId)
                                  }
                                  disabled={isUpdatingPrice || !newPrice}
                                >
                                  {isUpdatingPrice ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                  )}
                                  确认
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setUpdatePriceCard(null);
                                    setNewPrice("");
                                  }}
                                >
                                  取消
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                  setUpdatePriceCard(card.tokenId);
                                  setNewPrice(card.listingInfo?.price || "");
                                }}
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                更新价格
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-500 hover:text-red-600"
                                onClick={() =>
                                  handleCancelListing(card.tokenId)
                                }
                                disabled={isCanceling}
                              >
                                {isCanceling ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <XCircle className="h-4 w-4 mr-2" />
                                )}
                                取消出售
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Input
                            placeholder="设置价格 (ETH)"
                            value={
                              selectedCard === card.tokenId ? listingPrice : ""
                            }
                            onChange={(e) => {
                              setSelectedCard(card.tokenId);
                              setListingPrice(e.target.value);
                            }}
                            type="number"
                            step="0.01"
                            min="0"
                          />
                          <Button
                            size="sm"
                            className="w-full bg-gradient-to-r from-neon-green to-neon-cyan"
                            onClick={() => handleListCard(card.tokenId)}
                            disabled={
                              !listingPrice ||
                              selectedCard !== card.tokenId ||
                              isListing
                            }
                          >
                            {isListing ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Plus className="h-4 w-4 mr-2" />
                            )}
                            上架出售
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Active Listings Tab */}
          <TabsContent value="active-listings" className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : activeListings.length === 0 ? (
              <Card className="p-8 text-center">
                <ArrowLeftRight className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">暂无出售中的卡片</h3>
                <p className="text-muted-foreground mb-4">
                  前往"我的卡片"页面上架您的卡片！
                </p>
                <Button onClick={() => setActiveTab("my-cards")}>
                  查看我的卡片
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeListings.map((listing) => {
                  const userCard = userCards.find(
                    (card) => JSON.parse(card.tokenId) === listing.tokenId
                  );
                  console.log(userCards, "贝尔", listing);
                  const playerCard = userCard?.playerCard;

                  return (
                    <Card key={listing.tokenId} className="border-border/50">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-20 shrink-0">
                            <img
                              src={
                                playerCard?.imageUrl || "/placeholder-card.png"
                              }
                              alt={playerCard?.name || "Unknown Player"}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-lg">
                                {playerCard?.name || "Unknown Player"}
                              </h4>
                              <Badge
                                variant="secondary"
                                className="bg-neon-green/20 text-neon-green"
                              >
                                出售中
                              </Badge>
                            </div>

                            <div className="flex items-center space-x-2 mb-3">
                              <p className="text-sm text-muted-foreground">
                                {playerCard?.team || "Unknown Team"} •{" "}
                                {playerCard?.position || "N/A"} • 评分:{" "}
                                {playerCard?.rating || "N/A"}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {playerCard?.rarity || "common"}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <span className="text-sm text-muted-foreground block">
                                  出售价
                                </span>
                                <span className="font-bold text-lg text-neon-green">
                                  {listing.price} ETH
                                </span>
                              </div>
                              <div>
                                <span className="text-sm text-muted-foreground block">
                                  上架时间
                                </span>
                                <span className="font-medium">
                                  {formatTimeAgo(listing.listedAt)}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm text-muted-foreground block">
                                  Token ID
                                </span>
                                <span className="font-medium">
                                  #{listing.tokenId}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col space-y-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setUpdatePriceCard(listing.tokenId);
                                setNewPrice(listing.price);
                                setActiveTab("my-cards");
                              }}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              更新价格
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-500 hover:text-red-600"
                              onClick={() =>
                                handleCancelListing(listing.tokenId)
                              }
                              disabled={isCanceling}
                            >
                              {isCanceling ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <XCircle className="h-4 w-4 mr-2" />
                              )}
                              取消出售
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Trading History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>交易历史</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : saleHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">暂无交易历史</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {saleHistory.map((trade) => (
                      <div
                        key={`${trade.tokenId}-${trade.timestamp}`}
                        className="flex items-center space-x-4 p-4 border border-border/50 rounded-lg hover:border-border transition-colors"
                      >
                        <div className="w-12 h-16 shrink-0">
                          <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">
                              #{trade.tokenId}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge className="bg-neon-green/20 text-neon-green">
                              已售出
                            </Badge>
                            <span className="font-medium">
                              {trade.playerName || `Token #${trade.tokenId}`}
                            </span>
                            {trade.isInitialSale && (
                              <Badge variant="outline" className="text-xs">
                                初始销售
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>
                              买家: {trade.buyer.slice(0, 6)}...
                              {trade.buyer.slice(-4)}
                            </span>
                            <span>
                              <Calendar className="h-4 w-4 inline mr-1" />
                              {new Date(
                                trade.timestamp * 1000
                              ).toLocaleDateString("zh-CN")}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {trade.price} ETH
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
