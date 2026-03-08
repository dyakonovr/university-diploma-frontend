import type { SocialPost } from '../models/social-post.types';

// function generateHourlyStats(startISO: string, days: number) {
//   const data = [];

//   const start = new Date(startISO);
//   const totalHours = days * 24;

//   let likes = 0;
//   let reposts = 0;
//   let comments = 0;
//   let views = 0;
//   let subscribers = 10000;

//   for (let i = 0; i < totalHours; i++) {
//     const current = new Date(start.getTime() + i * 60 * 60 * 1000);

//     // имитация роста
//     views += Math.floor(80 + Math.random() * 40);
//     likes += Math.floor(10 + Math.random() * 8);
//     reposts += Math.floor(2 + Math.random() * 3);
//     comments += Math.floor(1 + Math.random() * 4);
//     subscribers += Math.random() > 0.95 ? 1 : 0;

//     const ctr = Number(((likes / views) * 100).toFixed(2));

//     data.push({
//       parsed_at: current.toISOString(),
//       likes,
//       reposts,
//       comments,
//       views,
//       subscribers,
//       ctr,
//     });
//   }

//   return data;
// }

const postedAt = '2026-01-01T00:00:00.000Z';
// const statsData = generateHourlyStats(postedAt, 30);
// const last = statsData[statsData.length - 1]!;

export const MOCK_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'sp_1',
    post_id: 'raw_101',
    post_at: postedAt,
    posted_at: postedAt,
    preview: {
      social_network: 'instagram',
      post: {
        audio: [],
        hashtags: [],
        images: [],
        videos: [],
        metadata: {
          campaign: 'january_launch_2026',
          utm_source: 'instagram',
          utm_medium: 'organic',
        },
        text: '🚀 Январский запуск продукта. Следим за динамикой каждый час!',
        title: 'Запуск в начале года',
      },
    },
    created_at: postedAt,
    updated_at: postedAt,
  },
];
