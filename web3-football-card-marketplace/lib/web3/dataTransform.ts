import { NFTCardData } from "./contract";

// 将 NFT 数据转换为前端组件需要的格式
export const transformNFTToPlayerCard = (nft: any) => {
  
  if (!nft.metadata) return null;

  // 从attributes中提取属性的辅助函数
  const getAttributeValue = (traitType: string) => {
    if (!nft.metadata.attributes) return null;
    const attr = nft.metadata.attributes.find((a: any) => a.trait_type === traitType);
    return attr?.value || null;
  };

  // 提取所有相关属性
  const playerName = getAttributeValue("Player Name") || nft.metadata.name || "未知球员";
  const position = getAttributeValue("Position");
  const club = getAttributeValue("Club");
  const league = getAttributeValue("League");
  const nation = getAttributeValue("Nation");
  const rarity = getAttributeValue("Rarity");
  const overallRating = getAttributeValue("Overall Rating");
  
  // 提取技能属性
  const pace = getAttributeValue("PAC (Pace)");
  const shooting = getAttributeValue("SHO (Shooting)");
  const passing = getAttributeValue("PAS (Passing)");
  const dribbling = getAttributeValue("DRI (Dribbling)");
  const defending = getAttributeValue("DEF (Defending)");
  const physical = getAttributeValue("PHY (Physical)");
  const skillMoves = getAttributeValue("Skill Moves");
  const weakFoot = getAttributeValue("Weak Foot");
  const strongFoot = getAttributeValue("Strong Foot");

  return {
    id: nft.tokenId,
    name: playerName,
    imageUrl: nft.metadata.image,
    price: parseFloat(nft.price),
    isForSale: nft.isForSale,
    owner: nft.owner,
     isUserListing: nft.isUserListing,
    // 球员基本信息
    position: position,
    team: club,
    league: league,
    country: nation,
    rarity: rarity?.toLowerCase() || "common",
    rating: overallRating || 0,
    // 技能属性
    pace: pace || 0,
    shooting: shooting || 0,
    passing: passing || 0,
    dribbling: dribbling || 0,
    defending: defending || 0,
    physicality: physical || 0,
    skillMoves: skillMoves || 0,
    weakFoot: weakFoot || 0,
    strongFoot: strongFoot,
    // 元数据
    description: nft.metadata.description,
    attributes: nft.metadata.attributes
  };
};
