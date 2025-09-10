import { useState, useEffect } from 'react';
import { NFTCardData, getAllNFTs, getForSaleNFTs } from './contract';

export const useNFTs = () => {
  const [nfts, setNfts] = useState<NFTCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNFTs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllNFTs();
      setNfts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNFTs();
  }, []);

  return {
    nfts,
    loading,
    error,
    refetch: loadNFTs
  };
};

export const useForSaleNFTs = () => {
  const [nfts, setNfts] = useState<NFTCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadForSaleNFTs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getForSaleNFTs();
      setNfts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForSaleNFTs();
  }, []);

  return {
    nfts,
    loading,
    error,
    refetch: loadForSaleNFTs
  };
};