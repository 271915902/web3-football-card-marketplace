const { ethers } = require("hardhat");

async function main() {
  //   你的合约地址;
  const contractAddress = "0x5eFa810a75e6048fDDaC3b40E7c161f715a8811a";

  // 获取合约实例
  const FootballCardNFT = await ethers.getContractFactory("FootballCardNFT");
  const contract = FootballCardNFT.attach(contractAddress);

  // 查看总供应量
  const totalSupply = await contract.totalSupply();
  console.log(`总NFT数量: ${totalSupply}`);

  // 查看每个NFT的信息
  for (let i = 1; i <= totalSupply; i++) {
    try {
      const owner = await contract.ownerOf(i);
      const tokenURI = await contract.tokenURI(i);
      const cardInfo = await contract.cardInfo(i);
      const isForSale = await contract.isForSale(i);

      console.log(`\n=== NFT #${i} ===`);
      console.log(cardInfo, "球星卡信息");
      console.log(`拥有者: ${owner}`);
      console.log(`元数据URI: ${tokenURI}`);
      console.log(`价格: ${ethers.formatEther(cardInfo.price)} ETH`);
      console.log(`是否在售: ${isForSale}`);

      if (cardInfo.playerName) {
        console.log(`球员姓名: ${cardInfo.playerName}`);
        console.log(`球队: ${cardInfo.team}`);
        console.log(`位置: ${cardInfo.position}`);
        console.log(`稀有度: ${cardInfo.rarity}`);
      }
    } catch (error) {
      console.log(`NFT #${i} 不存在或查询失败`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
