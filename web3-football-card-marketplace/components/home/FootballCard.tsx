import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface FootballCardProps {
  player: {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    isForSale: boolean;
    owner: string;
  };
  variant?: "default" | "featured" | "compact";
  onPurchase?: (playerId: string) => void;
}

export function FootballCard({
  player,
  variant = "default",
  onPurchase,
}: FootballCardProps) {
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";

  const handlePurchase = () => {
    if (onPurchase) {
      onPurchase(player.id);
    }
  };

  return (
    <div>
      <div>
        <div>
          <Image src={player.imageUrl} alt={player.name} width={280} height={280} />
        </div>
      </div>
    </div>
  );
}
