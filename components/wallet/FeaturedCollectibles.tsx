// 'use client';
//
// import { useEffect, useState, memo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import useCollectibles from '@/hooks/useCollectibles';
// import CollectibleCard from './CollectibleCard';
// import { LoadingSpinner } from '../loading-spinner';
// import { Collectible } from '@/hooks/useCollectibles';
//
// interface FeaturedCollectiblesProps {
//   walletAddress?: string;
// }
//
// function FeaturedCollectibles({ walletAddress }: FeaturedCollectiblesProps) {
//   const [currentPage, setCurrentPage] = useState(0);
//   const address = walletAddress || primaryWallet?.address;
//
//   const { featuredCollectibles, isLoading } = useCollectibles(address);
//
//   const itemsPerPage = 3;
//   const totalPages = Math.ceil(
//     (featuredCollectibles?.length || 0) / itemsPerPage,
//   );
//
//   useEffect(() => {
//     if (totalPages <= 1) return;
//
//     const timer = setInterval(() => {
//       setCurrentPage((prev) => (prev + 1) % totalPages);
//     }, 5000);
//
//     return () => clearInterval(timer);
//   }, [totalPages]);
//
//   if (isLoading) return <LoadingSpinner />;
//   if (!featuredCollectibles || featuredCollectibles.length === 0) return null;
//
//   const currentCollectibles = featuredCollectibles
//     .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
//     .sort((a, b) => {
//       if (a.id === featuredCollectibles[currentPage * itemsPerPage + 1]?.id)
//         return -1;
//       if (b.id === featuredCollectibles[currentPage * itemsPerPage + 1]?.id)
//         return 1;
//       return 0;
//     });
//
//   return (
//     <div className="space-y-4 w-full max-w-[500px] mx-auto">
//       <div className="flex justify-center gap-4">
//         <AnimatePresence mode="wait">
//           {currentCollectibles.map((collectible: Collectible, index) => (
//             <motion.div
//               key={collectible.id}
//               custom={index}
//               initial="enter"
//               animate="center"
//               exit="exit"
//               variants={{
//                 enter: (i) => ({
//                   x: 300,
//                   opacity: 0,
//                   transition: { delay: i * 0.1 },
//                 }),
//                 center: { x: 0, opacity: 1 },
//                 exit: (i) => ({
//                   x: -300,
//                   opacity: 0,
//                   transition: { delay: i * 0.1 },
//                 }),
//               }}
//               transition={{ duration: 0.3 }}
//               className="w-[calc(33.333%-0.5rem)] h-[250px]"
//               style={{
//                 order: index === 1 ? 0 : index === 0 ? -1 : 1,
//               }}
//             >
//               <CollectibleCard collectible={collectible} />
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>
//
//       {/* Page Indicators */}
//       {totalPages > 1 && (
//         <div className="flex justify-center space-x-2">
//           {Array.from({ length: totalPages }).map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentPage(index)}
//               className={`w-2 h-2 rounded-full transition-all duration-300 ${
//                 currentPage === index
//                   ? 'bg-amber-500 w-4'
//                   : 'bg-gray-300 hover:bg-amber-300'
//               }`}
//               aria-label={`Go to page ${index + 1}`}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
//
// // Memoize the component to prevent unnecessary re-renders
// export default memo(FeaturedCollectibles);
