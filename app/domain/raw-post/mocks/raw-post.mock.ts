import type { RawPost } from '../models/raw-post.types';

export const mockRawPosts: RawPost[] = [
  {
    id: 'post-1',
    flow_id: 'flow-1',
    status: 'completed',
    blocks: [
      {
        id: 'block-1-1',
        stage_id: 'stage-1',
        status: 'completed',
      },
      // {
      //   id: 'block-1-2',
      //   stage_id: 'stage-2',
      //   status: 'completed',
      // },
    ],
    created_at: '2025-02-01T10:00:00Z',
    updated_at: '2025-02-01T10:05:00Z',
  },

  {
    id: 'post-2',
    flow_id: 'flow-1',
    status: 'processing',
    blocks: [
      {
        id: 'block-2-1',
        stage_id: 'stage-1',
        status: 'completed',
      },
      {
        id: 'block-2-2',
        stage_id: 'stage-2',
        status: 'processing',
      },
      {
        id: 'block-2-3',
        stage_id: 'stage-3',
        status: 'waiting',
      },
    ],
    created_at: '2025-02-02T09:30:00Z',
    updated_at: '2025-02-02T09:31:10Z',
  },

  {
    id: 'post-3',
    flow_id: 'flow-2',
    status: 'failed',
    blocks: [
      {
        id: 'block-3-1',
        stage_id: 'stage-1',
        status: 'completed',
      },
      {
        id: 'block-3-2',
        stage_id: 'stage-2',
        status: 'failed',
      },
    ],
    created_at: '2025-02-03T14:12:00Z',
    updated_at: '2025-02-03T14:13:45Z',
  },

  {
    id: 'post-4',
    flow_id: 'flow-3',
    status: 'processing',
    blocks: [
      {
        id: 'block-4-1',
        stage_id: 'stage-10',
        status: 'processing',
      },
    ],
    created_at: '2025-02-04T08:00:00Z',
    updated_at: '2025-02-04T08:00:30Z',
  },

  {
    id: 'post-5',
    flow_id: 'flow-3',
    status: 'completed',
    blocks: [
      {
        id: 'block-5-1',
        stage_id: 'stage-10',
        status: 'completed',
      },
      {
        id: 'block-5-2',
        stage_id: 'stage-11',
        status: 'completed',
      },
      {
        id: 'block-5-3',
        stage_id: 'stage-12',
        status: 'completed',
      },
    ],
    created_at: '2025-02-05T16:40:00Z',
    updated_at: '2025-02-05T16:45:00Z',
  },
];
