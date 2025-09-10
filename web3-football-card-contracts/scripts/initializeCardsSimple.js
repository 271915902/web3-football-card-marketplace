const { ethers } = require("hardhat");

// 简化的球星卡数据
const simpleCardData = [
  {
    metadataURI:
      "https://creepy-fuchsia-horse.myfilebase.com/ipfs/QmeL7J4MQQJ7fT4byGpy4MySuTuL5m8nW7SCyee7BZEEhJ",
    price: ethers.parseEther("0.06"),
  },
  {
    metadataURI:
      "https://creepy-fuchsia-horse.myfilebase.com/ipfs/QmW3B3go5qNiSiCruaiAHCT77eNFs7qABqodbuKSKo7bC8",
    price: ethers.parseEther("0.04"),
  },
  {
    metadataURI:
      "https://creepy-fuchsia-horse.myfilebase.com/ipfs/QmaUdrwLcwztoMBJtUt8YqanaRCPNcV6p7TzwU9eV8Ft5M",
    price: ethers.parseEther("0.01"),
  },
  {
    metadataURI:
      "https://creepy-fuchsia-horse.myfilebase.com/ipfs/QmT9sEw5eD8yeFqKFimnTXdN7AMHJABwH5L9qZGDkeJib5",
    price: ethers.parseEther("0.2"),
  },
  {
    metadataURI:
      "https://creepy-fuchsia-horse.myfilebase.com/ipfs/QmUtRMVHraxCkhtXJrUD7RhfBHcRc5B7gFpAuoefpmb9cS",
    price: ethers.parseEther("0.03"),
  },
  {
    metadataURI:
      "https://creepy-fuchsia-horse.myfilebase.com/ipfs/QmQ6N5XLwDEHUG4c6UbiyTwWUhjt89eNXHu8WC2w4pEByE",
    price: ethers.parseEther("0.05"),
  },
];

async function main() {
  const contractAddress = process.env.FOOTBALL_CARD_CONTRACT_ADDRESS;

  const FootballCardNFT = await ethers.getContractFactory("FootballCardNFT");
  const footballCard = FootballCardNFT.attach(contractAddress);

  console.log("开始批量铸造球星卡...");

  // 准备批量数据
  const metadataURIs = simpleCardData.map((card) => card.metadataURI);
  const prices = simpleCardData.map((card) => card.price);

  try {
    const tx = await footballCard.batchMintFromMetadata(metadataURIs, prices);
    console.log(`批量铸造交易哈希: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log(`✅ 批量铸造成功！Gas 使用: ${receipt.gasUsed}`);
  } catch (error) {
    console.error("❌ 批量铸造失败:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
