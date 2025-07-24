// src/data/mockData.ts

export type TRTData = {
  month: string;
  year: number;
  trtPort: number;
  trtNonPort: number;
  trtTotal: number;
  trtNor: number;
  trtBoarding: number;
  trtDeboarding: number;
};

export const mockData: TRTData[] = [
  {
    month: 'January',
    year: 2024,
    trtPort: 12,
    trtNonPort: 8,
    trtTotal: 20,
    trtNor: 6,
    trtBoarding: 4,
    trtDeboarding: 5,
  },
  {
    month: 'February',
    year: 2024,
    trtPort: 15,
    trtNonPort: 10,
    trtTotal: 25,
    trtNor: 8,
    trtBoarding: 6,
    trtDeboarding: 7,
  },
  {
    month: 'March',
    year: 2025,
    trtPort: 18,
    trtNonPort: 12,
    trtTotal: 30,
    trtNor: 10,
    trtBoarding: 7,
    trtDeboarding: 8,
  },
  // Add more months as needed
];
