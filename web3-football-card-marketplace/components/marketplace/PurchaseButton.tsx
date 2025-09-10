"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { buyNFT, buyUserCard, checkNFTAvailability } from "@/lib/web3/contract";
import { useWeb3 } from "@/lib/web3/Web3Context";
import { toast } from "sonner";

interface PurchaseButtonProps {
  player: {
    id: string;
    name: string;
    price: number;
    isForSale: boolean;
    owner: string;
    isUserListing?: boolean; // 添加这个字段来区分是否为用户上架
  };
  onPurchaseSuccess?: (playerId: string) => void;
  variant?: "default" | "compact";
  className?: string;
}

export function PurchaseButton({
  player,
  onPurchaseSuccess,
  variant = "default",
  className,
}: PurchaseButtonProps) {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isAvailable, setIsAvailable] = useState(player.isForSale);
  const { account, signer, isConnected } = useWeb3();

  const isOwner =
    account && account.toLowerCase() === player.owner.toLowerCase();
  const isCompact = variant === "compact";

  const handlePurchase = async () => {
    if (!isConnected || !signer) {
      toast.error("请先连接钱包");
      return;
    }

    if (isOwner) {
      toast.error("不能购买自己的NFT");
      return;
    }

    if (!isAvailable) {
      toast.error("该NFT已不在售");
      return;
    }

    setIsPurchasing(true);

    try {
      // 先检查NFT是否仍然可用
      const stillAvailable = await checkNFTAvailability(parseInt(player.id));
      if (!stillAvailable) {
        setIsAvailable(false);
        toast.error("该NFT已被其他用户购买");
        return;
      }

      // 根据NFT类型调用不同的购买函数
      let result;
      if (player.isUserListing) {
        // 购买用户上架的NFT
        result = await buyUserCard(
          parseInt(player.id),
          player.price.toString(),
          signer
        );
        // buyUserCard 返回的是交易对象，需要包装成统一格式
        result = { success: true, txHash: result.hash };
      } else {
        // 购买初始库存NFT
        result = await buyNFT(
          parseInt(player.id),
          player.price.toString(),
          signer
        );
      }

      if (result.success) {
        toast.success(`成功购买 ${player.name}!`, {
          description: `交易哈希: ${result.txHash?.slice(0, 10)}...`,
        });
        setIsAvailable(false);
        onPurchaseSuccess?.(player.id);
      } else {
        toast.error(result.error || "购买失败");
      }
    } catch (error) {
      console.error("购买过程中出错:", error);
      toast.error("购买过程中出现错误");
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isCompact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="font-bold text-sm ">{player.price} ETH</div>
        <Button
          size="sm"
          onClick={handlePurchase}
          disabled={!isAvailable || isPurchasing || isOwner || !isConnected}
        >
          {isPurchasing ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : isOwner ? (
            "已拥有"
          ) : !isAvailable ? (
            "已售出"
          ) : !isConnected ? (
            "连接钱包"
          ) : (
            "购买"
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* 价格显示 */}
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-primary">
          {player.price} ETH
        </div>
        {isOwner && (
          <Badge variant="outline" className="text-xs">
            已拥有
          </Badge>
        )}
      </div>

      {/* 购买按钮 */}
      <Button
        className={cn(
          "w-full transition-all duration-300",
          isAvailable && !isOwner && isConnected
            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            : ""
        )}
        onClick={handlePurchase}
        disabled={!isAvailable || isPurchasing || isOwner || !isConnected}
      >
        {isPurchasing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            购买中...
          </>
        ) : isOwner ? (
          <>
            <Star className="h-4 w-4 mr-2" />
            已拥有
          </>
        ) : !isAvailable ? (
          "已售出"
        ) : !isConnected ? (
          "请连接钱包"
        ) : (
          <>
            <ShoppingCart className="h-4 w-4 mr-2" />
            立即购买
          </>
        )}
      </Button>
    </div>
  );
}
