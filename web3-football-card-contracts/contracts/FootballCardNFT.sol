// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FootballCardNFT is ERC721, ERC721URIStorage, Ownable {
    // 使用简单的 uint256 替代 Counters
    uint256 private _tokenIds;

    // 球星卡信息结构 - 根据你的元数据优化
    struct CardInfo {
        string playerName;
        uint256 overallRating;
        string position;
        string strongFoot;
        uint256 skillMoves;
        uint256 weakFoot;
        uint256 pace;
        uint256 shooting;
        uint256 passing;
        uint256 dribbling;
        uint256 defending;
        uint256 physical;
        string club;
        string nation;
        string league;
        string rarity;
        bool isInitialInventory;
        uint256 price;
        string metadataURI; // IPFS 元数据地址
    }

    // 购买记录结构
    struct PurchaseRecord {
        uint256 tokenId;
        address buyer;
        uint256 price;
        uint256 timestamp;
        string playerName;
    }

    // 用户上架信息结构
    struct UserListing {
        uint256 tokenId;
        address seller;
        uint256 price;
        uint256 listedAt;
        bool isActive;
    }

    mapping(uint256 => CardInfo) public cardInfo;
    mapping(uint256 => bool) public isForSale;

    // 购买记录相关映射
    mapping(address => uint256[]) public userPurchaseHistory; // 用户购买记录ID列表
    mapping(uint256 => PurchaseRecord) public purchaseRecords; // 购买记录详情
    uint256 private _purchaseRecordIds; // 购买记录计数器

    // 用户上架映射
    mapping(uint256 => UserListing) public userListings;
    mapping(address => uint256[]) public userActiveListings;

    address public marketplaceContract;

    event CardMinted(
        uint256 indexed tokenId,
        string playerName,
        uint256 price,
        string metadataURI
    );
    event CardListedForSale(uint256 indexed tokenId, uint256 price);

    // 新增购买事件
    event CardPurchased(
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price,
        uint256 timestamp,
        uint256 purchaseRecordId
    );

    // 用户交易事件
    event CardListedByUser(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );

    event CardSoldBetweenUsers(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price
    );

    event ListingCancelled(uint256 indexed tokenId, address indexed seller);

    constructor() ERC721("Football Card NFT", "FCNFT") Ownable(msg.sender) {}

    // 设置市场合约地址
    function setMarketplaceContract(address _marketplace) external onlyOwner {
        marketplaceContract = _marketplace;
    }

    // 铸造初始库存球星卡（使用完整的元数据）
    function mintInitialCard(
        string memory metadataURI, // IPFS 元数据地址
        string memory playerName,
        uint256 overallRating,
        string memory position,
        string memory strongFoot,
        uint256 skillMoves,
        uint256 weakFoot,
        uint256 pace,
        uint256 shooting,
        uint256 passing,
        uint256 dribbling,
        uint256 defending,
        uint256 physical,
        string memory club,
        string memory nation,
        string memory league,
        string memory rarity,
        uint256 price
    ) external onlyOwner returns (uint256) {
        _tokenIds++; // 简单递增
        uint256 newTokenId = _tokenIds;

        _mint(address(this), newTokenId);
        _setTokenURI(newTokenId, metadataURI);

        cardInfo[newTokenId] = CardInfo({
            playerName: playerName,
            overallRating: overallRating,
            position: position,
            strongFoot: strongFoot,
            skillMoves: skillMoves,
            weakFoot: weakFoot,
            pace: pace,
            shooting: shooting,
            passing: passing,
            dribbling: dribbling,
            defending: defending,
            physical: physical,
            club: club,
            nation: nation,
            league: league,
            rarity: rarity,
            isInitialInventory: true,
            price: price,
            metadataURI: metadataURI
        });

        isForSale[newTokenId] = true;

        emit CardMinted(newTokenId, playerName, price, metadataURI);
        return newTokenId;
    }

    // 简化的铸造函数（只需要元数据URI和价格）
    function mintCardFromMetadata(
        string memory metadataURI,
        uint256 price
    ) public onlyOwner returns (uint256) {
        _tokenIds++; // 简单递增
        uint256 newTokenId = _tokenIds;

        _mint(address(this), newTokenId);
        _setTokenURI(newTokenId, metadataURI);

        // 简化版本，只存储必要信息
        cardInfo[newTokenId] = CardInfo({
            playerName: "", // 从元数据中获取
            overallRating: 0,
            position: "",
            strongFoot: "",
            skillMoves: 0,
            weakFoot: 0,
            pace: 0,
            shooting: 0,
            passing: 0,
            dribbling: 0,
            defending: 0,
            physical: 0,
            club: "",
            nation: "",
            league: "",
            rarity: "",
            isInitialInventory: true,
            price: price,
            metadataURI: metadataURI
        });

        isForSale[newTokenId] = true;

        emit CardMinted(newTokenId, "", price, metadataURI);
        return newTokenId;
    }

    // 批量铸造（使用元数据URI）
    function batchMintFromMetadata(
        string[] memory metadataURIs,
        uint256[] memory prices
    ) external onlyOwner {
        require(metadataURIs.length == prices.length, "Arrays length mismatch");

        for (uint256 i = 0; i < metadataURIs.length; i++) {
            mintCardFromMetadata(metadataURIs[i], prices[i]);
        }
    }

    // 购买初始库存球星卡（修改后包含购买记录）
    function buyInitialCard(uint256 tokenId) external payable {
        require(
            ownerOf(tokenId) == address(this),
            "Card not owned by contract"
        );
        require(isForSale[tokenId], "Card not for sale");
        require(msg.value >= cardInfo[tokenId].price, "Insufficient payment");

        isForSale[tokenId] = false;
        cardInfo[tokenId].isInitialInventory = false;

        // 创建购买记录
        _purchaseRecordIds++;
        uint256 purchaseRecordId = _purchaseRecordIds;

        purchaseRecords[purchaseRecordId] = PurchaseRecord({
            tokenId: tokenId,
            buyer: msg.sender,
            price: cardInfo[tokenId].price,
            timestamp: block.timestamp,
            playerName: cardInfo[tokenId].playerName
        });

        // 添加到用户购买历史
        userPurchaseHistory[msg.sender].push(purchaseRecordId);

        _transfer(address(this), msg.sender, tokenId);

        // 发出购买事件
        emit CardPurchased(
            tokenId,
            msg.sender,
            cardInfo[tokenId].price,
            block.timestamp,
            purchaseRecordId
        );

        // 退还多余的ETH
        if (msg.value > cardInfo[tokenId].price) {
            payable(msg.sender).transfer(msg.value - cardInfo[tokenId].price);
        }
    }

    // 获取用户的购买记录
    function getUserPurchaseHistory(
        address user
    ) external view returns (PurchaseRecord[] memory) {
        uint256[] memory recordIds = userPurchaseHistory[user];
        PurchaseRecord[] memory records = new PurchaseRecord[](
            recordIds.length
        );

        for (uint256 i = 0; i < recordIds.length; i++) {
            records[i] = purchaseRecords[recordIds[i]];
        }

        return records;
    }

    // 获取用户拥有的所有卡片
    function getUserOwnedCards(
        address user
    ) external view returns (uint256[] memory) {
        uint256 currentSupply = _tokenIds;
        uint256 ownedCount = 0;

        // 先计算用户拥有的卡片数量
        for (uint256 i = 1; i <= currentSupply; i++) {
            if (_ownerOf(i) == user) {
                ownedCount++;
            }
        }

        // 创建数组并填充
        uint256[] memory ownedCards = new uint256[](ownedCount);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= currentSupply; i++) {
            if (_ownerOf(i) == user) {
                ownedCards[currentIndex] = i;
                currentIndex++;
            }
        }

        return ownedCards;
    }

    // 获取用户拥有的卡片详细信息
    function getUserOwnedCardsWithInfo(
        address user
    )
        external
        view
        returns (uint256[] memory tokenIds, CardInfo[] memory cards)
    {
        uint256[] memory ownedTokenIds = this.getUserOwnedCards(user);
        CardInfo[] memory ownedCards = new CardInfo[](ownedTokenIds.length);

        for (uint256 i = 0; i < ownedTokenIds.length; i++) {
            ownedCards[i] = cardInfo[ownedTokenIds[i]];
        }

        return (ownedTokenIds, ownedCards);
    }

    // 获取购买记录总数
    function getTotalPurchaseRecords() external view returns (uint256) {
        return _purchaseRecordIds;
    }

    // 获取卡片的元数据URI
    function getCardMetadataURI(
        uint256 tokenId
    ) external view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return cardInfo[tokenId].metadataURI;
    }

    // 获取所有待售的初始库存卡片
    function getAvailableCards() external view returns (uint256[] memory) {
        uint256 currentSupply = _tokenIds; // 重命名变量
        uint256 availableCount = 0;

        for (uint256 i = 1; i <= currentSupply; i++) {
            if (ownerOf(i) == address(this) && isForSale[i]) {
                availableCount++;
            }
        }

        uint256[] memory availableCards = new uint256[](availableCount);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= currentSupply; i++) {
            if (ownerOf(i) == address(this) && isForSale[i]) {
                availableCards[currentIndex] = i;
                currentIndex++;
            }
        }

        return availableCards;
    }

    // 根据稀有度筛选卡片
    function getCardsByRarity(
        string memory rarity
    ) external view returns (uint256[] memory) {
        uint256 currentSupply = _tokenIds; // 重命名变量
        uint256 matchCount = 0;

        for (uint256 i = 1; i <= currentSupply; i++) {
            if (
                keccak256(bytes(cardInfo[i].rarity)) == keccak256(bytes(rarity))
            ) {
                matchCount++;
            }
        }

        uint256[] memory matchingCards = new uint256[](matchCount);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= currentSupply; i++) {
            if (
                keccak256(bytes(cardInfo[i].rarity)) == keccak256(bytes(rarity))
            ) {
                matchingCards[currentIndex] = i;
                currentIndex++;
            }
        }

        return matchingCards;
    }

    // 获取当前总供应量
    function totalSupply() public view returns (uint256) {
        return _tokenIds;
    }

    // 提取合约余额
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }

    // Override functions
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // 用户上架卡片
    function listCardForSale(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than 0");
        require(!userListings[tokenId].isActive, "Card already listed");

        userListings[tokenId] = UserListing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            listedAt: block.timestamp,
            isActive: true
        });

        // 添加这行：设置isForSale状态
        isForSale[tokenId] = true;

        userActiveListings[msg.sender].push(tokenId);
        emit CardListedByUser(tokenId, msg.sender, price);
    }

    // 取消上架
    // 添加辅助函数：从数组中移除指定元素
    function _removeFromActiveListings(
        address seller,
        uint256 tokenId
    ) internal {
        uint256[] storage listings = userActiveListings[seller];
        for (uint256 i = 0; i < listings.length; i++) {
            if (listings[i] == tokenId) {
                // 将最后一个元素移到当前位置，然后删除最后一个元素
                listings[i] = listings[listings.length - 1];
                listings.pop();
                break;
            }
        }
    }

    // 修改 cancelListing 函数
    function cancelListing(uint256 tokenId) external {
        UserListing storage listing = userListings[tokenId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.isActive, "Listing not active");

        listing.isActive = false;

        // 添加这行：取消isForSale状态
        isForSale[tokenId] = false;

        _removeFromActiveListings(msg.sender, tokenId);
        emit ListingCancelled(tokenId, msg.sender);
    }

    // 修改 buyUserCard 函数中的取消上架部分
    function buyUserCard(uint256 tokenId) external payable {
        UserListing storage listing = userListings[tokenId];
        require(listing.isActive, "Card not for sale");
        require(msg.value >= listing.price, "Insufficient payment");
        require(msg.sender != listing.seller, "Cannot buy your own card");
    
        address seller = listing.seller;
        uint256 price = listing.price;
    
        // 取消上架
        listing.isActive = false;
    isForSale[tokenId] = false;
    _removeFromActiveListings(seller, tokenId);
    
        // 转移NFT
        _transfer(seller, msg.sender, tokenId);
    
        // 支付给卖家
        payable(seller).transfer(price);
    
        // 记录买家购买记录
        _purchaseRecordIds++;
        uint256 recordId = _purchaseRecordIds;
        purchaseRecords[recordId] = PurchaseRecord({
            tokenId: tokenId,
            buyer: msg.sender,
            price: price,
            timestamp: block.timestamp,
            playerName: cardInfo[tokenId].playerName
        });
        userPurchaseHistory[msg.sender].push(recordId);
    
        // 🔥 关键修复：记录卖家销售记录
        _saleRecordIds++;
        uint256 saleRecordId = _saleRecordIds;
        saleRecords[saleRecordId] = SaleRecord({
            tokenId: tokenId,
            seller: seller,
            buyer: msg.sender,
            price: price,
            timestamp: block.timestamp,
            playerName: cardInfo[tokenId].playerName,
            isInitialSale: false
        });
        userSaleHistory[seller].push(saleRecordId);
    
        // 发出事件
        emit CardSold(tokenId, seller, msg.sender, price, saleRecordId);
        emit CardSoldBetweenUsers(tokenId, seller, msg.sender, price);
    
        // 退还多余的ETH
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }

    // 获取用户的活跃上架列表
    function getUserActiveListings(
        address user
    ) external view returns (UserListing[] memory) {
        uint256[] memory tokenIds = userActiveListings[user];
        uint256 activeCount = 0;

        // 计算活跃上架数量
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (userListings[tokenIds[i]].isActive) {
                activeCount++;
            }
        }

        UserListing[] memory activeListings = new UserListing[](activeCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (userListings[tokenIds[i]].isActive) {
                activeListings[currentIndex] = userListings[tokenIds[i]];
                currentIndex++;
            }
        }

        return activeListings;
    }

    // 获取所有用户上架的卡片
    function getAllUserListings() external view returns (UserListing[] memory) {
        uint256 currentSupply = _tokenIds;
        uint256 activeCount = 0;

        for (uint256 i = 1; i <= currentSupply; i++) {
            if (userListings[i].isActive) {
                activeCount++;
            }
        }

        UserListing[] memory allListings = new UserListing[](activeCount);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= currentSupply; i++) {
            if (userListings[i].isActive) {
                allListings[currentIndex] = userListings[i];
                currentIndex++;
            }
        }

        return allListings;
    }

    // 获取卡片的上架信息
    function getCardListing(
        uint256 tokenId
    ) external view returns (UserListing memory) {
        return userListings[tokenId];
    }

    // 销售记录结构
    struct SaleRecord {
        uint256 tokenId;
        address seller;
        address buyer;
        uint256 price;
        uint256 timestamp;
        string playerName;
        bool isInitialSale; // 是否为初始库存销售
    }

    mapping(address => uint256[]) public userSaleHistory; // 用户销售记录ID列表
    mapping(uint256 => SaleRecord) public saleRecords; // 销售记录详情
    uint256 private _saleRecordIds; // 销售记录计数器

    event CardSold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price,
        uint256 saleRecordId
    );

    // 获取用户的销售记录
    function getUserSaleHistory(
        address user
    ) external view returns (SaleRecord[] memory) {
        uint256[] memory recordIds = userSaleHistory[user];
        SaleRecord[] memory records = new SaleRecord[](recordIds.length);

        for (uint256 i = 0; i < recordIds.length; i++) {
            records[i] = saleRecords[recordIds[i]];
        }

        return records;
    }

    // 更新上架价格
    function updateListingPrice(uint256 tokenId, uint256 newPrice) external {
        UserListing storage listing = userListings[tokenId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.isActive, "Listing not active");
        require(newPrice > 0, "Price must be greater than 0");

        uint256 oldPrice = listing.price;
        listing.price = newPrice;

        emit PriceUpdated(tokenId, msg.sender, oldPrice, newPrice);
    }

    event PriceUpdated(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 oldPrice,
        uint256 newPrice
    );
}
