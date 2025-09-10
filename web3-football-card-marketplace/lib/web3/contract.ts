import { ethers } from "ethers";
import FootballCardNFTABI from "./FootballCardNFT.json"; // 需要导入合约 ABI

// 合约配置
const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0xF7aFbaC5A69E8ba1A7BfAD31E14F1BF05F8e4199";
const IPFS_GATEWAY =
  process.env.NEXT_PUBLIC_IPFS_GATEWAY || "https://ipfs.io/ipfs/";

// 获取合约实例（ethers v6）
export const getContract = (provider?: ethers.Provider) => {
  const defaultProvider =
    provider ||
    new ethers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL || "http://localhost:8545"
    );

  return new ethers.Contract(
    CONTRACT_ADDRESS,
    FootballCardNFTABI,
    defaultProvider
  );
};

// IPFS URI 转换
export const ipfsToHttp = (ipfsUri: string): string => {
  //  已经是http格式 无需转换
  return ipfsUri;
};

// 获取元数据
export const fetchMetadata = async (metadataUri: string) => {
  console.log(metadataUri, "url");
  try {
    const response = await fetch(metadataUri);
    return await response.json();
  } catch (error) {
    console.error("获取元数据失败:", error);
    return null;
  }
};

// 球星卡数据类型
export interface NFTCardData {
  tokenId: string;
  owner: string;
  price: string;
  isForSale: boolean;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  } | null;
  isUserListing?: boolean; // 添加这个字段
}

// 获取单个 NFT 数据
export const getNFTData = async (
  tokenId: number
): Promise<NFTCardData | null> => {
  try {
    const contract = getContract();

    // 并行获取基本信息
    const [owner, tokenURI, cardInfo, isForSale, userListing] = await Promise.all([
      contract.ownerOf(tokenId),
      contract.tokenURI(tokenId),
      contract.cardInfo(tokenId),
      contract.isForSale(tokenId),
      contract.getCardListing(tokenId), // 获取用户上架信息
    ]);

    // 获取元数据
    const metadata = await fetchMetadata(tokenURI);

    // 确定价格和是否为用户上架
    let finalPrice;
    let isUserListing = false;
    
    if (userListing && userListing.isActive) {
      finalPrice = ethers.formatEther(userListing.price);
      isUserListing = true; // 标记为用户上架
    } else {
      finalPrice = ethers.formatEther(cardInfo.price);
      isUserListing = false; // 标记为初始库存
    }

    return {
      tokenId: tokenId.toString(),
      owner,
      price: finalPrice,
      isForSale,
      metadata,
      isUserListing, // 添加这个字段
    };
  } catch (error) {
    console.error(`获取 NFT ${tokenId} 数据失败:`, error);
    return null;
  }
};

// 获取所有 NFT 数据
export const getAllNFTs = async (): Promise<NFTCardData[]> => {
  try {
    const contract = getContract();
    const totalSupply = await contract.totalSupply();
    const totalCount = Number(totalSupply); // v6 中 BigInt 转换为 Number

    if (totalCount === 0) {
      console.log("当前没有铸造的 NFT");
      return [];
    }

    const promises = [];
    for (let i = 1; i <= totalCount; i++) {
      promises.push(getNFTData(i));
    }

    const results = await Promise.all(promises);
    return results.filter(Boolean) as NFTCardData[];
  } catch (error) {
    console.error("获取所有 NFT 失败:", error);
    return [];
  }
};

// 获取在售 NFT
export const getForSaleNFTs = async (): Promise<NFTCardData[]> => {
  const allNFTs = await getAllNFTs();
  return allNFTs.filter((nft) => nft.isForSale);
};

// 购买NFT函数
export const buyNFT = async (
  tokenId: number,
  price: string,
  signer: ethers.Signer
): Promise<{ success: boolean; error?: string; txHash?: string }> => {
  try {
    const contract = getContract().connect(signer);

    // 将价格转换为wei
    const priceInWei = ethers.parseEther(price);

    // 调用合约的buyInitialCard函数
    const tx = await contract.buyInitialCard(tokenId, {
      value: priceInWei,
      gasLimit: 300000, // 设置gas限制
    });

    console.log("购买交易已发送:", tx.hash);

    // 等待交易确认
    const receipt = await tx.wait();

    if (receipt.status === 1) {
      console.log("购买成功!", receipt);
      return {
        success: true,
        txHash: tx.hash,
      };
    } else {
      return {
        success: false,
        error: "交易失败",
      };
    }
  } catch (error: any) {
    console.error("购买NFT失败:", error);

    let errorMessage = "购买失败";

    if (error.code === "ACTION_REJECTED") {
      errorMessage = "用户取消了交易";
    } else if (error.code === "INSUFFICIENT_FUNDS") {
      errorMessage = "余额不足";
    } else if (error.message?.includes("execution reverted")) {
      errorMessage = "合约执行失败，可能是NFT已被购买或价格不正确";
    } else if (error.message?.includes("user rejected")) {
      errorMessage = "用户拒绝了交易";
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

// 检查NFT是否仍然在售
export const checkNFTAvailability = async (
  tokenId: number
): Promise<boolean> => {
  try {
    const contract = getContract();
    return await contract.isForSale(tokenId);
  } catch (error) {
    console.error("检查NFT可用性失败:", error);
    return false;
  }
};

// 购买记录数据类型
export interface PurchaseRecord {
  tokenId: string;
  buyer: string;
  price: string;
  timestamp: string;
  playerName: string;
}

// 用户收藏数据类型
export interface UserCollection {
  tokenIds: string[];
  cards: NFTCardData[];
  purchaseHistory: PurchaseRecord[];
  totalValue: number;
  totalProfit: number;
}

// 获取用户购买记录
export const getUserPurchaseHistory = async (
  userAddress: string
): Promise<PurchaseRecord[]> => {
  try {
    const contract = getContract();
    const records = await contract.getUserPurchaseHistory(userAddress);

    // 为每个购买记录获取NFT元数据以获取球员姓名
    const recordsWithPlayerNames = await Promise.all(
      records.map(async (record: any) => {
        let playerName = "";
        try {
          // 通过tokenId获取NFT数据
          const nftData = await getNFTData(Number(record.tokenId));
          if (nftData?.metadata?.name) {
            playerName = nftData.metadata.name;
          }
        } catch (error) {
          console.warn(`获取Token ${record.tokenId}的元数据失败:`, error);
        }

        return {
          tokenId: record.tokenId.toString(),
          buyer: record.buyer,
          price: ethers.formatEther(record.price),
          timestamp: new Date(Number(record.timestamp) * 1000).toISOString(),
          playerName: playerName || `卡片 #${record.tokenId}`, // 如果获取不到球员姓名，使用默认格式
        };
      })
    );

    return recordsWithPlayerNames;
  } catch (error) {
    console.error("获取购买记录失败:", error);
    return [];
  }
};

// 获取用户拥有的卡片ID
export const getUserOwnedCards = async (
  userAddress: string
): Promise<string[]> => {
  try {
    const contract = getContract();
    const tokenIds = await contract.getUserOwnedCards(userAddress);
    return tokenIds.map((id: any) => id.toString());
  } catch (error) {
    console.error("获取用户卡片失败:", error);
    return [];
  }
};

// 获取用户拥有的卡片详细信息
export const getUserOwnedCardsWithInfo = async (
  userAddress: string
): Promise<{ tokenIds: string[]; cards: any[] }> => {
  try {
    const contract = getContract();
    const [tokenIds, cardInfos] = await contract.getUserOwnedCardsWithInfo(
      userAddress
    );

    return {
      tokenIds: tokenIds.map((id: any) => id.toString()),
      cards: cardInfos,
    };
  } catch (error) {
    console.error("获取用户卡片详细信息失败:", error);
    return { tokenIds: [], cards: [] };
  }
};

// 获取用户完整收藏数据
export const getUserCollection = async (
  userAddress: string
): Promise<UserCollection> => {
  try {
    const [purchaseHistory, ownedTokenIds] = await Promise.all([
      getUserPurchaseHistory(userAddress),
      getUserOwnedCards(userAddress),
    ]);

    // 获取拥有卡片的详细信息
    const cardPromises = ownedTokenIds.map((tokenId) =>
      getNFTData(Number(tokenId))
    );
    const cardResults = await Promise.all(cardPromises);
    const cards = cardResults.filter(Boolean) as NFTCardData[];

    // 计算总价值和收益
    const totalValue = cards.reduce(
      (sum, card) => sum + parseFloat(card.price),
      0
    );
    const totalInvested = purchaseHistory.reduce(
      (sum, record) => sum + parseFloat(record.price),
      0
    );
    const totalProfit = totalValue - totalInvested;

    return {
      tokenIds: ownedTokenIds,
      cards,
      purchaseHistory,
      totalValue,
      totalProfit,
    };
  } catch (error) {
    console.error("获取用户收藏失败:", error);
    return {
      tokenIds: [],
      cards: [],
      purchaseHistory: [],
      totalValue: 0,
      totalProfit: 0,
    };
  }
};

// 用户上架信息接口
export interface UserListing {
  tokenId: number;
  seller: string;
  price: string;
  listedAt: number;
  isActive: boolean;
}

// 销售记录接口
export interface SaleRecord {
  tokenId: number;
  seller: string;
  buyer: string;
  price: string;
  timestamp: number;
  playerName: string;
  isInitialSale: boolean;
}

// 用户交易统计接口
export interface UserTradingStats {
  totalSales: number;
  totalRevenue: string;
  activeListings: number;
  averageSalePrice: string;
}

// 上架卡片（修改为接收signer参数）
export async function listCardForSale(
  tokenId: number,
  price: string,
  signer: ethers.Signer
): Promise<any> {
  try {
    const contract = getContract(signer); // 使用signer创建合约实例
    const priceInWei = ethers.parseEther(price);

    const tx = await contract.listCardForSale(tokenId, priceInWei);
    await tx.wait();

    return tx;
  } catch (error) {
    console.error("Error listing card for sale:", error);
    throw error;
  }
}

// 取消上架（同样需要修改）
export async function cancelListing(
  tokenId: number,
  signer: ethers.Signer
): Promise<any> {
  try {
    const contract = getContract(signer);

    const tx = await contract.cancelListing(tokenId);
    await tx.wait();

    return tx;
  } catch (error) {
    console.error("Error cancelling listing:", error);
    throw error;
  }
}

// 更新价格（同样需要修改）
export async function updateListingPrice(
  tokenId: number,
  newPrice: string,
  signer: ethers.Signer
): Promise<any> {
  try {
    const contract = getContract(signer);
    const priceInWei = ethers.parseEther(newPrice);

    const tx = await contract.updateListingPrice(tokenId, priceInWei);
    await tx.wait();

    return tx;
  } catch (error) {
    console.error("Error updating listing price:", error);
    throw error;
  }
}

// 购买用户卡片
export async function buyUserCard(
  tokenId: number,
  price: string,
  signer: ethers.Signer
): Promise<any> {
  try {
    const contract = getContract().connect(signer);
    const priceInWei = ethers.parseEther(price);

    const tx = await contract.buyUserCard(tokenId, {
      value: priceInWei,
      gasLimit: 300000, // 添加gas限制
    });
    await tx.wait();

    return tx;
  } catch (error) {
    console.error("Error buying user card:", error);
    throw error;
  }
}

// 删除重复的updateListingPrice函数定义（第422-435行）
// export async function updateListingPrice(tokenId: number, newPrice: string): Promise<any> {
//   try {
//     const contract = await getContract();
//     const priceInWei = ethers.parseEther(newPrice);
//
//     const tx = await contract.updateListingPrice(tokenId, priceInWei);
//     await tx.wait();
//
//     return tx;
//   } catch (error) {
//     console.error('Error updating listing price:', error);
//     throw error;
//   }
// }

// 获取用户活跃上架列表
export async function getUserActiveListings(
  userAddress: string
): Promise<UserListing[]> {
  try {
    const contract = await getContract();
    const listings = await contract.getUserActiveListings(userAddress);

    return listings.map((listing: any) => ({
      tokenId: Number(listing.tokenId),
      seller: listing.seller,
      price: ethers.formatEther(listing.price),
      listedAt: Number(listing.listedAt),
      isActive: listing.isActive,
    }));
  } catch (error) {
    console.error("Error getting user active listings:", error);
    throw error;
  }
}

// 获取所有用户上架列表
export async function getAllUserListings(): Promise<UserListing[]> {
  try {
    const contract = await getContract();
    const listings = await contract.getAllUserListings();

    return listings.map((listing: any) => ({
      tokenId: Number(listing.tokenId),
      seller: listing.seller,
      price: ethers.formatEther(listing.price),
      listedAt: Number(listing.listedAt),
      isActive: listing.isActive,
    }));
  } catch (error) {
    console.error("Error getting all user listings:", error);
    throw error;
  }
}

// 获取卡片上架信息
export async function getCardListing(
  tokenId: number
): Promise<UserListing | null> {
  try {
    const contract = await getContract();
    const listing = await contract.getCardListing(tokenId);

    if (!listing.isActive) {
      return null;
    }

    return {
      tokenId: Number(listing.tokenId),
      seller: listing.seller,
      price: ethers.formatEther(listing.price),
      listedAt: Number(listing.listedAt),
      isActive: listing.isActive,
    };
  } catch (error) {
    console.error("Error getting card listing:", error);
    throw error;
  }
}

// 获取用户销售历史
export async function getUserSaleHistory(
  userAddress: string
): Promise<SaleRecord[]> {
  try {
    const contract = await getContract();
    const saleHistory = await contract.getUserSaleHistory(userAddress);

    return saleHistory.map((record: any) => ({
      tokenId: Number(record.tokenId),
      seller: record.seller,
      buyer: record.buyer,
      price: ethers.formatEther(record.price),
      timestamp: Number(record.timestamp),
      playerName: record.playerName,
      isInitialSale: record.isInitialSale,
    }));
  } catch (error) {
    console.error("Error getting user sale history:", error);
    throw error;
  }
}

// 获取用户交易统计
export async function getUserTradingStats(
  userAddress: string
): Promise<UserTradingStats> {
  try {
    const [saleHistory, activeListings] = await Promise.all([
      getUserSaleHistory(userAddress),
      getUserActiveListings(userAddress),
    ]);

    const totalSales = saleHistory.length;
    const totalRevenue = saleHistory
      .reduce((sum, sale) => {
        return sum + parseFloat(sale.price);
      }, 0)
      .toString();

    const averageSalePrice =
      totalSales > 0 ? (parseFloat(totalRevenue) / totalSales).toString() : "0";

    return {
      totalSales,
      totalRevenue,
      activeListings: activeListings.length,
      averageSalePrice,
    };
  } catch (error) {
    console.error("Error getting user trading stats:", error);
    throw error;
  }
}
