import { NextResponse } from 'next/server';

// Mock inventory API endpoint for frontend development
export async function GET() {
  // Return mock inventory data
  const mockInventory = [
    {
      name: 'Championship Trophy',
      description: 'Awarded for winning the league',
      image: '/images/trophy.png',
    },
    {
      name: 'MVP Badge',
      description: 'Most Valuable Player recognition',
      image: '/images/badge.png',
    },
    {
      name: 'Golden Boot',
      description: 'Top scorer award',
      image: '/images/boot.png',
    },
  ];

  return NextResponse.json({ items: mockInventory });
}

