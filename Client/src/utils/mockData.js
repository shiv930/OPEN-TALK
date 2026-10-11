/**
 * Default mock fixtures for seamless preview and development fallback
 * when backend database is empty or server is offline.
 */

export const MOCK_SERVERS = [
  {
    _id: 'srv-1',
    name: 'Cosmic Nexus',
    description: 'Central hub for interstellar explorers and architects',
    category: 'Community',
    icon: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
    owner: 'user-0',
  },
  {
    _id: 'srv-2',
    name: 'Quantum Labs',
    description: 'Advanced computing, deep neural graphs & zero-g research',
    category: 'Technology',
    icon: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    owner: 'user-1',
  },
  {
    _id: 'srv-3',
    name: 'Solaris Beats',
    description: 'Ambient cosmic synth, lo-fi floating audio streams',
    category: 'Music',
    icon: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&auto=format&fit=crop&q=80',
    banner: null,
    owner: 'user-2',
  },
];

export const MOCK_CHANNELS = {
  'srv-1': [
    { _id: 'chn-101', name: 'general', type: 'text', topic: 'Main frequency for open cosmic communication' },
    { _id: 'chn-102', name: 'announcements', type: 'text', topic: 'Official platform broadcasts & release nodes' },
    { _id: 'chn-103', name: 'orbital-design', type: 'text', topic: 'Anti-gravity UI/UX explorations & prototypes' },
    { _id: 'chn-104', name: 'deep-space', type: 'text', topic: 'Unstructured cosmic chatter' },
    { _id: 'chn-105', name: 'Lounge 01', type: 'voice', topic: 'Spatial audio hangout' },
    { _id: 'chn-106', name: 'Quantum Core', type: 'voice', topic: 'Ultra-low latency audio room' },
  ],
  'srv-2': [
    { _id: 'chn-201', name: 'research-logs', type: 'text', topic: 'Experimental observations' },
    { _id: 'chn-202', name: 'neural-mesh', type: 'text', topic: 'Graph embeddings and cognitive synthesis' },
    { _id: 'chn-203', name: 'Lab Audio', type: 'voice', topic: 'Lab discussions' },
  ],
  'srv-3': [
    { _id: 'chn-301', name: 'playlist-stream', type: 'text', topic: 'Share tracks and stems' },
    { _id: 'chn-302', name: 'Live Stage', type: 'voice', topic: 'Live audio jamming' },
  ],
};

export const MOCK_MESSAGES = {
  'chn-101': [
    {
      _id: 'msg-1',
      content: 'Welcome to OpenTalk. The interface has entered anti-gravity orbit.',
      author_id: 'u-1',
      author_details: { username: 'CosmoDev' },
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      attachments: [],
    },
    {
      _id: 'msg-2',
      content: 'Notice how every element floats with breathing room rather than rigid edge-to-edge docking.',
      author_id: 'u-2',
      author_details: { username: 'AuraNova' },
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      attachments: [],
    },
    {
      _id: 'msg-3',
      content: 'Subtle atmospheric cyan and violet gradients maintain focus on clean communication.',
      author_id: 'u-3',
      author_details: { username: 'Zephyr' },
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      attachments: [],
    },
  ],
};

export const MOCK_MEMBERS = [
  {
    _id: 'm-1',
    user: {
      _id: 'u-1',
      username: 'CosmoDev',
      fullname: 'Lead Architect',
      profile_pic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    },
    role: 'Commander',
    status: 'online',
    activity: 'Designing orbital docks',
  },
  {
    _id: 'm-2',
    user: {
      _id: 'u-2',
      username: 'AuraNova',
      fullname: 'Aura Nova',
      profile_pic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    },
    role: 'Architect',
    status: 'online',
    activity: 'Synthesizing shaders',
  },
  {
    _id: 'm-3',
    user: {
      _id: 'u-3',
      username: 'Zephyr',
      fullname: 'Zephyr Wave',
      profile_pic: null,
    },
    role: 'Member',
    status: 'idle',
    activity: 'Away in hyperspace',
  },
  {
    _id: 'm-4',
    user: {
      _id: 'u-4',
      username: 'Starlight',
      fullname: 'Stella Ray',
      profile_pic: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    },
    role: 'Member',
    status: 'offline',
  },
];
