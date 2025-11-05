// 'use client';
//
// import { memo } from 'react';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import CollectibleCard from './CollectibleCard';
// import LoadingSpinner from '../LoadingSpinner';
// import ErrorScreen from '../ErrorScreen';
// import useCollectibles, { Collectible } from '@/hooks/useCollectibles';
//
// interface CollectibleListProps {
//   walletAddress?: string;
// }
//
// function CollectibleList({ walletAddress }: CollectibleListProps) {
//   const { primaryWallet } = useDynamicContext();
//   const address = walletAddress || primaryWallet?.address;
//
//   const { collectibles, isLoading, isError } = useCollectibles(address);
//
//   if (isError) return <ErrorScreen />;
//   if (isLoading) return <LoadingSpinner />;
//   if (!collectibles || collectibles.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <p className="text-center text-sm sm:text-base text-muted-foreground">
//           No collectibles found in this wallet.
//         </p>
//       </div>
//     );
//   }
//
//   return (
//     <div className="space-y-3">
//       {collectibles.map((collectible: Collectible) => (
//         <CollectibleCard
//           key={collectible.id}
//           collectible={collectible}
//           inList={true}
//         />
//       ))}
//     </div>
//   );
// }
//
// // Memoize the component to prevent unnecessary re-renders
// export default memo(CollectibleList);
