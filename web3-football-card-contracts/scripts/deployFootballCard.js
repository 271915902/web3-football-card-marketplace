const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function main() {
  // 获取合约工厂
  const FootballCardNFT = await ethers.getContractFactory("FootballCardNFT");

  // 部署合约
  console.log("正在部署 FootballCardNFT 合约...");
  const footballCard = await FootballCardNFT.deploy();

  // 等待部署完成
  await footballCard.waitForDeployment();

  const contractAddress = footballCard.target;
  console.log("FootballCardNFT 合约已部署到地址:", contractAddress);

  // 更新 contracts/.env 文件
  const contractsEnvPath = path.join(__dirname, '../.env');
  try {
    let contractsEnvContent = fs.readFileSync(contractsEnvPath, 'utf8');
    
    // 更新 FOOTBALL_CARD_CONTRACT_ADDRESS
    if (contractsEnvContent.includes('FOOTBALL_CARD_CONTRACT_ADDRESS=')) {
      contractsEnvContent = contractsEnvContent.replace(
        /FOOTBALL_CARD_CONTRACT_ADDRESS=.*/,
        `FOOTBALL_CARD_CONTRACT_ADDRESS="${contractAddress}"`
      );
    } else {
      contractsEnvContent += `\nFOOTBALL_CARD_CONTRACT_ADDRESS="${contractAddress}"`;
    }
    
    fs.writeFileSync(contractsEnvPath, contractsEnvContent);
    console.log("已更新 contracts/.env 文件中的 FOOTBALL_CARD_CONTRACT_ADDRESS");
  } catch (error) {
    console.error("更新 contracts/.env 文件失败:", error.message);
  }

  // 更新 frontend/.env.local 文件
  const frontendEnvPath = path.join(__dirname, '../../web3-football-card-marketplace/.env.local');
  try {
    let frontendEnvContent = fs.readFileSync(frontendEnvPath, 'utf8');
    
    // 更新 NEXT_PUBLIC_CONTRACT_ADDRESS
    if (frontendEnvContent.includes('NEXT_PUBLIC_CONTRACT_ADDRESS=')) {
      frontendEnvContent = frontendEnvContent.replace(
        /NEXT_PUBLIC_CONTRACT_ADDRESS=.*/,
        `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      frontendEnvContent += `\nNEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`;
    }
    
    fs.writeFileSync(frontendEnvPath, frontendEnvContent);
    console.log("已更新 frontend/.env.local 文件中的 NEXT_PUBLIC_CONTRACT_ADDRESS");
  } catch (error) {
    console.error("更新 frontend/.env.local 文件失败:", error.message);
  }

  // 功能1：复制 ABI 文件到前端目录
  console.log("\n=== 复制 ABI 文件 ===");
  try {
    const sourceAbiPath = path.join(__dirname, '../artifacts/contracts/FootballCardNFT.sol/FootballCardNFT.json');
    const targetAbiPath = path.join(__dirname, '../../web3-football-card-marketplace/lib/web3/FootballCardNFT.json');
    
    // 读取源 ABI 文件
    const abiContent = fs.readFileSync(sourceAbiPath, 'utf8');
    const abiData = JSON.parse(abiContent);
    
    // 只提取 ABI 部分
    const abiOnly = abiData.abi;
    
    // 写入目标文件
    fs.writeFileSync(targetAbiPath, JSON.stringify(abiOnly, null, 2));
    console.log("✅ ABI 文件已成功复制到前端目录");
  } catch (error) {
    console.error("❌ 复制 ABI 文件失败:", error.message);
  }

 console.log("\n=== 部署完成 ===");
  console.log(`合约地址: ${contractAddress}`);
  console.log("环境文件已自动更新");
  console.log("ABI 文件已复制到前端");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
