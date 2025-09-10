import { useState, useEffect } from 'react';
import { UserCollection, getUserCollection, PurchaseRecord } from './contract';
import { transformNFTToPlayerCard } from './dataTransform';

export const useUserCollection = (userAddress: string | null) => {
  const [collection, setCollection] = useState<UserCollection>({
    tokenIds: [],
    cards: [],
    purchaseHistory: [],
    totalValue: 0,
    totalProfit: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCollection = async () => {
    if (!userAddress) {
      setCollection({
        tokenIds: [],
        cards: [],
        purchaseHistory: [],
        totalValue: 0,
        totalProfit: 0
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getUserCollection(userAddress);
      setCollection(data);
      console.log(data,'收藏数据');
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载收藏失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollection();
  }, [userAddress]);

  // 转换为前端组件格式
  const transformedCards = collection.cards.map(transformNFTToPlayerCard).filter(Boolean);

  // 计算统计数据
  const stats = {
    totalValue: collection.totalValue,
    totalCards: collection.cards.length,
    totalProfit: collection.totalProfit,
    profitPercentage: collection.totalValue > 0 ? (collection.totalProfit / (collection.totalValue - collection.totalProfit)) * 100 : 0,
    averageRating: transformedCards.length > 0 ? transformedCards.reduce((sum, card) => sum + (card?.rating || 0), 0) / transformedCards.length : 0,
    rarityBreakdown: transformedCards.reduce((acc, card) => {
      if (card?.rarity) {
        acc[card.rarity] = (acc[card.rarity] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>)
  };

  return {
    collection,
    transformedCards,
    stats,
    loading,
    error,
    refetch: loadCollection
  };
};

// 购买记录hook
export const usePurchaseHistory = (userAddress: string | null) => {
  const [history, setHistory] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = async () => {
    if (!userAddress) {
      setHistory([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getUserPurchaseHistory(userAddress);
      // 按时间倒序排列
      const sortedData = data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setHistory(sortedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载购买记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [userAddress]);

  return {
    history,
    loading,
    error,
    refetch: loadHistory
  };
};