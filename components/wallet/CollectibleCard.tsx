"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Collectible } from '@/hooks/useCollectibles';

interface CollectibleCardProps {
  collectible: Collectible;
  inList?: boolean;
}

export default function CollectibleCard({
  collectible,
  inList = false,
}: CollectibleCardProps) {
  const baseCardClass = inList
    ? 'flex items-center space-x-2 sm:space-x-4 p-2 sm:p-4 bg-white rounded-lg shadow-xs hover:shadow-md transition-shadow cursor-pointer w-full'
    : 'bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer w-full h-full';

  return (
    <div className={baseCardClass}>
      {inList ? (
        <>
          {/* List View */}
          <div className="relative w-12 h-12 xs:w-16 xs:h-16 md:w-20 md:h-20 shrink-0">
            <Image
              src={collectible.image || '/dslogo.png'}
              alt={collectible.name}
              fill
              className="object-cover rounded-md"
              sizes="(max-width: 480px) 48px, (max-width: 768px) 64px, 80px"
            />
          </div>
          <div className="grow min-w-0">
            <h3 className="font-semibold text-xs xs:text-sm md:text-base truncate">
              {collectible.name}
            </h3>
            <p className="text-[10px] xs:text-xs md:text-sm text-gray-500 truncate">
              {collectible.description}
            </p>
            <p className="text-[10px] xs:text-xs md:text-sm text-gray-400">
              Token ID: {collectible.tokenId}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] xs:text-xs md:text-sm text-gray-400 whitespace-nowrap">
              {collectible.contractAddress.slice(0, 6)}...{collectible.contractAddress.slice(-4)}
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Grid View */}
          <div className="relative aspect-square w-full">
            <Image
              src={collectible.image || '/placeholder.svg?height=400&width=400'}
              alt={collectible.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
            />
          </div>
          <div className="p-2 flex flex-col gap-1">
            <h3 className="font-semibold text-xs xs:text-sm text-[#05053b] truncate">
              {collectible.name}
            </h3>
            <p className="text-[10px] xs:text-xs text-gray-500 truncate">
              {collectible.description}
            </p>
            <div className="flex flex-col gap-0.5 mt-1">
              <span className="text-[10px] text-gray-400">
                Token ID: {collectible.tokenId}
              </span>
              <span className="text-[10px] text-gray-400">
                Contract: {collectible.contractAddress.slice(0, 6)}...{collectible.contractAddress.slice(-4)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
