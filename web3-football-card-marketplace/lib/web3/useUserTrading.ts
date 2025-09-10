import { useState, useEffect } from "react";
import {
  UserListing,
  SaleRecord,
  UserTradingStats,
  getUserOwnedCardsWithInfo,
  getUserActiveListings,
  getUserSaleHistory,
  getUserTradingStats,
  listCardForSale,
  cancelListing,
  updateListingPrice,
  NFTCardData,
} from "./contract";
import { transformNFTToPlayerCard } from "./dataTransform";
import { getUserOwnedCards, getNFTData } from "./contract";
import { useWeb3 } from "./Web3Context";

export const useUserTrading = (userAddress: string | null) => {
  const { signer } = useWeb3(); // 获取signer

  const [userCards, setUserCards] = useState<NFTCardData[]>([]);
  const [activeListings, setActiveListings] = useState<UserListing[]>([]);
  const [saleHistory, setSaleHistory] = useState<SaleRecord[]>([]);
  const [tradingStats, setTradingStats] = useState<UserTradingStats>({
    totalSales: 0,
    totalRevenue: "0",
    activeListings: 0,
    averageSalePrice: "0",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载用户拥有的卡片
  const loadUserCards = async () => {
    if (!userAddress) {
      setUserCards([]);
      return;
    }

    try {
      // 获取用户拥有的tokenId列表
      const tokenIds = await getUserOwnedCards(userAddress);

      // 获取用户的活跃上架列表
      const activeListings = await getUserActiveListings(userAddress);
      const listingMap = new Map(
        activeListings.map((listing) => [listing.tokenId, listing])
      );
      console.log(activeListings, "笑了", listingMap);
      // 为每个tokenId获取完整的NFT数据
      const cardPromises = tokenIds.map((tokenId) =>
        getNFTData(Number(tokenId))
      );
      const cardResults = await Promise.all(cardPromises);

      // 过滤掉null值并转换为前端格式
      const validCards = cardResults.filter(Boolean);
      const transformedCards = validCards.map((card) => {
        const playerCard = transformNFTToPlayerCard(card);
        const listingInfo = listingMap.get(parseInt(card.tokenId));

        return {
          tokenId: card.tokenId,
          owner: card.owner,
          price: card.price,
          isForSale: card.isForSale,
          metadata: card.metadata,
          playerCard: playerCard,
          isListed: !!listingInfo, // 检查是否在上架列表中
          listingInfo: listingInfo || null,
        };
      });
      console.log(transformedCards);
      setUserCards(transformedCards);
    } catch (err) {
      console.error("加载用户卡片失败:", err);
      throw err;
    }
  };

  // 加载活跃上架列表
  const loadActiveListings = async () => {
    if (!userAddress) {
      setActiveListings([]);
      return;
    }

    try {
      const listings = await getUserActiveListings(userAddress);
      setActiveListings(listings);
    } catch (err) {
      console.error("加载活跃上架列表失败:", err);
      throw err;
    }
  };

  // 加载销售历史
  const loadSaleHistory = async () => {
    if (!userAddress) {
      setSaleHistory([]);
      return;
    }

    try {
      const history = await getUserSaleHistory(userAddress);
      setSaleHistory(history);
    } catch (err) {
      console.error("加载销售历史失败:", err);
      throw err;
    }
  };

  // 加载交易统计
  const loadTradingStats = async () => {
    if (!userAddress) {
      setTradingStats({
        totalSales: 0,
        totalRevenue: "0",
        activeListings: 0,
        averageSalePrice: "0",
      });
      return;
    }

    try {
      const stats = await getUserTradingStats(userAddress);
      setTradingStats(stats);
    } catch (err) {
      console.error("加载交易统计失败:", err);
      throw err;
    }
  };

  // 加载所有数据
  const loadAllData = async () => {
    if (!userAddress) {
      setUserCards([]);
      setActiveListings([]);
      setSaleHistory([]);
      setTradingStats({
        totalSales: 0,
        totalRevenue: "0",
        activeListings: 0,
        averageSalePrice: "0",
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await Promise.all([
        loadUserCards(),
        loadActiveListings(),
        loadSaleHistory(),
        loadTradingStats(),
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载数据失败");
    } finally {
      setLoading(false);
    }
  };

  // 上架卡片
  const listCard = async (tokenId: number, price: string) => {
    if (!signer) {
      throw new Error("请先连接钱包");
    }

    try {
      await listCardForSale(tokenId, price, signer); // 传入signer
      // 重新加载数据
      await Promise.all([
        loadUserCards(),
        loadActiveListings(),
        loadTradingStats(),
      ]);
    } catch (err) {
      console.error("上架卡片失败:", err);
      throw err;
    }
  };

  // 取消上架
  const cancelCardListing = async (tokenId: number) => {
    if (!signer) {
      throw new Error("请先连接钱包");
    }

    try {
      await cancelListing(tokenId, signer); // 传入signer
      // 重新加载数据
      await Promise.all([
        loadUserCards(),
        loadActiveListings(),
        loadTradingStats(),
      ]);
    } catch (err) {
      console.error("取消上架失败:", err);
      throw err;
    }
  };

  // 更新价格
  const updatePrice = async (tokenId: number, newPrice: string) => {
    if (!signer) {
      throw new Error("请先连接钱包");
    }

    try {
      await updateListingPrice(tokenId, newPrice, signer); // 传入signer
      // 重新加载数据
      await Promise.all([loadActiveListings(), loadTradingStats()]);
    } catch (err) {
      console.error("更新价格失败:", err);
      throw err;
    }
  };

  useEffect(() => {
    loadAllData();
  }, [userAddress]);

  // 移除重复的转换逻辑
  // const transformedUserCards = userCards
  //   ?.map(transformNFTToPlayerCard)
  //   .filter(Boolean);

  return {
    userCards: userCards, // 直接返回userCards，因为在loadUserCards中已经转换过了
    activeListings,
    saleHistory,
    tradingStats,
    loading,
    error,
    listCard,
    cancelCardListing,
    updatePrice,
    refetch: loadAllData,
  };
};
