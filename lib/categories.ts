export interface Category {
  id: string
  name: string
  icon: string
  priority: number // 1 = highest priority shown to free users
  tier: 'free' | 'paid' // first 5 categories are 'free'
  keywords: string[] // keywords to detect relevance from user input
  services: Service[]
}

export interface Service {
  id: string
  name: string
  actions: string[]
}

export const MASTER_CATEGORIES: Category[] = [
  // === FREE TIER (priority 1-5) ===
  {
    id: 'streaming',
    name: 'Streaming Services',
    icon: '📺',
    priority: 1,
    tier: 'free',
    keywords: [
      'netflix', 'hulu', 'disney', 'hbo', 'max', 'streaming', 'movies',
      'shows', 'tv', 'watch', 'prime', 'apple tv', 'paramount', 'peacock',
      'crunchyroll',
    ],
    services: [
      {
        id: 'netflix',
        name: 'Netflix',
        actions: [
          'Remove them from your profile',
          'Change your password',
          'Sign out all devices',
          'Review watch history',
          'Update payment method',
        ],
      },
      {
        id: 'hulu',
        name: 'Hulu',
        actions: [
          'Remove shared profile',
          'Change password',
          'Update billing info',
        ],
      },
      {
        id: 'disney_plus',
        name: 'Disney+',
        actions: [
          'Remove from family plan',
          'Change password',
          'Update payment',
        ],
      },
      {
        id: 'hbo_max',
        name: 'Max (HBO)',
        actions: [
          'Remove profile',
          'Change password',
          'Sign out all devices',
        ],
      },
      {
        id: 'apple_tv',
        name: 'Apple TV+',
        actions: [
          'Remove from family sharing',
          'Change Apple ID password',
        ],
      },
      {
        id: 'paramount',
        name: 'Paramount+',
        actions: ['Remove from plan', 'Change password'],
      },
      {
        id: 'peacock',
        name: 'Peacock',
        actions: ['Remove from plan', 'Change password'],
      },
      {
        id: 'prime_video',
        name: 'Amazon Prime Video',
        actions: [
          'Remove household member',
          'Change password if shared',
        ],
      },
    ],
  },
  {
    id: 'music',
    name: 'Music & Podcasts',
    icon: '🎵',
    priority: 2,
    tier: 'free',
    keywords: [
      'spotify', 'apple music', 'music', 'podcast', 'playlist', 'songs',
      'listen', 'tidal', 'pandora', 'soundcloud', 'amazon music',
    ],
    services: [
      {
        id: 'spotify',
        name: 'Spotify',
        actions: [
          'Remove from Family Plan',
          'Unfollow their profile',
          'Delete shared playlists',
          'Clear listening history',
          'Change password',
          'Remove from Spotify Duo',
        ],
      },
      {
        id: 'apple_music',
        name: 'Apple Music',
        actions: [
          'Remove from Family Sharing',
          'Remove shared playlists',
        ],
      },
      {
        id: 'tidal',
        name: 'Tidal',
        actions: ['Remove from family plan', 'Change password'],
      },
      {
        id: 'amazon_music',
        name: 'Amazon Music',
        actions: ['Remove household member'],
      },
    ],
  },
  {
    id: 'social_media',
    name: 'Social Media',
    icon: '📱',
    priority: 3,
    tier: 'free',
    keywords: [
      'instagram', 'twitter', 'x', 'facebook', 'snapchat', 'tiktok',
      'social', 'close friends', 'story', 'post', 'linkedin', 'threads',
      'reddit',
    ],
    services: [
      {
        id: 'instagram',
        name: 'Instagram',
        actions: [
          'Remove from Close Friends list',
          'Remove from Favorites',
          'Mute or unfollow',
          'Remove tags from old photos',
          'Archive shared memories',
          'Turn off activity status',
        ],
      },
      {
        id: 'snapchat',
        name: 'Snapchat',
        actions: [
          'Remove from Best Friends',
          'Delete saved Snaps',
          'Remove from Memories',
          'Block or unfollow',
        ],
      },
      {
        id: 'twitter_x',
        name: 'Twitter / X',
        actions: [
          'Remove from Lists',
          'Unfollow',
          'Mute keywords',
          'Remove from Circle',
        ],
      },
      {
        id: 'facebook',
        name: 'Facebook',
        actions: [
          'Update relationship status',
          'Untag from photos',
          'Leave shared groups',
          'Remove from friends if needed',
        ],
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        actions: [
          'Remove from favorites',
          'Clear watch history',
          'Unfollow',
        ],
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        actions: [
          'Remove connection if needed',
          'Update relationship field on profile',
          'Mute their activity',
        ],
      },
      {
        id: 'threads',
        name: 'Threads',
        actions: ['Unfollow', 'Restrict or block if needed'],
      },
      {
        id: 'reddit',
        name: 'Reddit',
        actions: [
          'Leave shared subreddits',
          'Remove from followers',
          'Unfollow their profile',
        ],
      },
    ],
  },
  {
    id: 'financial',
    name: 'Financial & Payments',
    icon: '💳',
    priority: 4,
    tier: 'free',
    keywords: [
      'venmo', 'paypal', 'splitwise', 'bank', 'money', 'payment',
      'cash app', 'zelle', 'joint', 'bills', 'rent', 'expense',
      'apple pay', 'google pay',
    ],
    services: [
      {
        id: 'venmo',
        name: 'Venmo',
        actions: [
          'Remove from trusted contacts',
          'Make transactions private',
          'Remove linked bank if shared',
          'Change password',
        ],
      },
      {
        id: 'paypal',
        name: 'PayPal',
        actions: [
          'Remove as saved contact',
          'Review linked accounts',
          'Change password',
        ],
      },
      {
        id: 'splitwise',
        name: 'Splitwise',
        actions: [
          'Settle all debts',
          'Leave shared groups',
          'Delete shared expenses',
        ],
      },
      {
        id: 'cash_app',
        name: 'Cash App',
        actions: [
          'Remove from contacts',
          'Change $cashtag if shared',
          'Review transactions',
        ],
      },
      {
        id: 'apple_pay',
        name: 'Apple Pay',
        actions: [
          'Remove shared payment methods',
          'Update Apple ID payment info',
        ],
      },
      {
        id: 'zelle',
        name: 'Zelle',
        actions: [
          'Remove from recent contacts',
          'Update linked bank account',
        ],
      },
      {
        id: 'google_pay',
        name: 'Google Pay',
        actions: [
          'Remove saved contacts',
          'Update payment methods',
        ],
      },
    ],
  },
  {
    id: 'cloud_storage',
    name: 'Cloud Storage & Files',
    icon: '☁️',
    priority: 5,
    tier: 'free',
    keywords: [
      'icloud', 'google drive', 'dropbox', 'photos', 'files', 'documents',
      'storage', 'backup', 'onedrive', 'box', 'shared folder',
    ],
    services: [
      {
        id: 'icloud',
        name: 'iCloud',
        actions: [
          'Remove from Family Sharing',
          'Revoke shared album access',
          'Remove from shared iCloud Drive',
          'Change Apple ID password',
          'Turn off location sharing in Find My',
        ],
      },
      {
        id: 'google_drive',
        name: 'Google Drive',
        actions: [
          'Revoke access to shared folders',
          'Remove from shared documents',
          'Transfer ownership of docs if needed',
        ],
      },
      {
        id: 'dropbox',
        name: 'Dropbox',
        actions: [
          'Remove from shared folders',
          'Revoke app permissions',
          'Change password',
        ],
      },
      {
        id: 'onedrive',
        name: 'OneDrive',
        actions: ['Remove from shared folders', 'Revoke access'],
      },
      {
        id: 'box',
        name: 'Box',
        actions: ['Remove from shared folders', 'Revoke collaborator access'],
      },
    ],
  },

  // === PAID TIER (priority 6+) ===
  {
    id: 'location_sharing',
    name: 'Location Sharing',
    icon: '📍',
    priority: 6,
    tier: 'paid',
    keywords: [
      'location', 'find my', 'google maps', 'life360', 'share', 'track',
      'gps', 'where', 'maps',
    ],
    services: [
      {
        id: 'find_my',
        name: 'Find My (Apple)',
        actions: [
          'Stop sharing your location',
          'Remove them from People tab',
          'Remove yourself from their sharing list',
          'Check who can see your location',
        ],
      },
      {
        id: 'google_maps',
        name: 'Google Maps',
        actions: [
          'Stop location sharing',
          'Remove from sharing list',
          'Clear shared trips',
        ],
      },
      {
        id: 'life360',
        name: 'Life360',
        actions: [
          'Leave the circle',
          'Delete shared location history',
        ],
      },
      {
        id: 'snapchat_map',
        name: 'Snapchat Map',
        actions: ['Enable Ghost Mode', 'Remove from friends if needed'],
      },
      {
        id: 'whatsapp_location',
        name: 'WhatsApp Live Location',
        actions: [
          'Stop sharing live location',
          'Review who you have shared location with',
        ],
      },
    ],
  },
  {
    id: 'smart_home',
    name: 'Smart Home & Devices',
    icon: '🏠',
    priority: 7,
    tier: 'paid',
    keywords: [
      'alexa', 'google home', 'smart home', 'wifi', 'nest', 'ring',
      'doorbell', 'thermostat', 'smart', 'echo', 'homekit',
      'security camera', 'siri',
    ],
    services: [
      {
        id: 'alexa',
        name: 'Amazon Alexa',
        actions: [
          'Remove their account from household',
          'Delete voice history',
          'Remove from smart home groups',
          'Change WiFi password if they knew it',
        ],
      },
      {
        id: 'google_home',
        name: 'Google Home',
        actions: [
          'Remove from home',
          'Revoke assistant access',
          'Change routines',
        ],
      },
      {
        id: 'apple_homekit',
        name: 'Apple HomeKit',
        actions: ['Remove from home', 'Change home hub access'],
      },
      {
        id: 'ring',
        name: 'Ring',
        actions: [
          'Remove shared user',
          'Review doorbell footage access',
          'Change account password',
        ],
      },
      {
        id: 'nest',
        name: 'Google Nest',
        actions: [
          'Remove member from home',
          'Review thermostat access',
        ],
      },
      {
        id: 'wifi',
        name: 'WiFi / Router',
        actions: [
          'Change WiFi password',
          'Remove devices from trusted list',
          'Review connected devices',
        ],
      },
      {
        id: 'arlo',
        name: 'Arlo Cameras',
        actions: [
          'Remove shared user access',
          'Review camera recordings',
          'Change account password',
        ],
      },
    ],
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: '🎮',
    priority: 8,
    tier: 'paid',
    keywords: [
      'playstation', 'xbox', 'steam', 'gaming', 'game', 'nintendo',
      'switch', 'psn', 'live', 'friends', 'discord', 'twitch',
      'epic games',
    ],
    services: [
      {
        id: 'playstation',
        name: 'PlayStation Network',
        actions: [
          'Remove from friends list',
          'Remove as primary PS5 if shared',
          'Change PSN password',
          'Revoke game sharing',
        ],
      },
      {
        id: 'xbox',
        name: 'Xbox / Game Pass',
        actions: [
          'Remove from friends',
          'End game sharing',
          'Change Microsoft account password',
        ],
      },
      {
        id: 'steam',
        name: 'Steam',
        actions: [
          'Remove from friends',
          'End Family Sharing',
          'Review shared library',
        ],
      },
      {
        id: 'nintendo',
        name: 'Nintendo Switch',
        actions: [
          'Remove from family group',
          'Change Nintendo Account password',
        ],
      },
      {
        id: 'discord',
        name: 'Discord',
        actions: [
          'Leave mutual servers',
          'Remove from friends',
          'Update profile',
        ],
      },
      {
        id: 'epic_games',
        name: 'Epic Games / Fortnite',
        actions: ['Remove from friends', 'Change password'],
      },
      {
        id: 'twitch',
        name: 'Twitch',
        actions: [
          'Unfollow their channel',
          'Remove from squad stream',
          'Update subscription if shared',
        ],
      },
    ],
  },
  {
    id: 'health_wellness',
    name: 'Health & Wellness',
    icon: '❤️‍🩹',
    priority: 9,
    tier: 'paid',
    keywords: [
      'health', 'fitness', 'apple health', 'period', 'cycle', 'flo',
      'clue', 'peloton', 'strava', 'whoop', 'fitbit', 'garmin', 'workout',
    ],
    services: [
      {
        id: 'apple_health',
        name: 'Apple Health',
        actions: [
          'Stop health data sharing',
          'Review who has access to your data',
          'Remove from Medical ID if listed',
        ],
      },
      {
        id: 'flo_health',
        name: 'Flo / Period Tracker',
        actions: [
          'Remove partner access',
          'Review shared data',
          'Change password',
        ],
      },
      {
        id: 'clue',
        name: 'Clue',
        actions: ['Remove partner', 'Review shared cycle data'],
      },
      {
        id: 'strava',
        name: 'Strava',
        actions: [
          'Remove from followers',
          'Set segments to private',
          'Review segment data',
        ],
      },
      {
        id: 'peloton',
        name: 'Peloton',
        actions: [
          'Remove from following',
          'Remove from household plan if shared',
        ],
      },
      {
        id: 'fitbit',
        name: 'Fitbit / Google Fit',
        actions: [
          'Remove from friends list',
          'Set data to private',
          'Leave shared challenges',
        ],
      },
      {
        id: 'whoop',
        name: 'WHOOP',
        actions: [
          'Remove from team',
          'Set health data to private',
        ],
      },
    ],
  },
  {
    id: 'sentimental_triggers',
    name: 'Sentimental Triggers',
    icon: '💔',
    priority: 10,
    tier: 'paid',
    keywords: [
      'photos', 'memories', 'google photos', 'wrapped', 'spotify wrapped',
      'amazon', 'order history', 'memories', 'album', 'timehop',
      'anniversary', 'shared album',
    ],
    services: [
      {
        id: 'google_photos',
        name: 'Google Photos',
        actions: [
          'Remove shared album access',
          'Archive photos together',
          'Turn off Memories highlights if triggering',
          'Remove partner face tag',
        ],
      },
      {
        id: 'spotify_wrapped',
        name: 'Spotify Wrapped & Memories',
        actions: [
          'Unfollow their account',
          'Delete or private shared playlists',
          'Clear listening data if needed',
        ],
      },
      {
        id: 'amazon_history',
        name: 'Amazon Order History',
        actions: [
          'Archive triggering orders',
          'Remove shared household',
          'Update delivery addresses',
        ],
      },
      {
        id: 'imessage',
        name: 'iMessage / Messages',
        actions: [
          'Archive or delete conversation',
          'Remove from Favorites',
          'Update contact if needed',
        ],
      },
      {
        id: 'timehop',
        name: 'Timehop / On This Day',
        actions: [
          'Turn off notifications during healing',
          'Review memory settings on Facebook/Google',
        ],
      },
      {
        id: 'apple_shared_albums',
        name: 'Apple Shared Albums',
        actions: [
          'Leave or delete shared albums',
          'Save photos you want to keep first',
        ],
      },
    ],
  },
  {
    id: 'subscriptions_misc',
    name: 'Shared Subscriptions',
    icon: '📋',
    priority: 11,
    tier: 'paid',
    keywords: [
      'subscription', 'shared', 'plan', 'account', 'newspaper', 'magazine',
      'audible', 'kindle', 'duolingo', 'nyt', 'times', 'medium', 'substack',
    ],
    services: [
      {
        id: 'audible',
        name: 'Audible',
        actions: [
          'Review shared library',
          'Change password',
          'Remove from household',
        ],
      },
      {
        id: 'kindle',
        name: 'Kindle / Amazon Household',
        actions: [
          'Leave Amazon Household',
          'Remove shared books access',
        ],
      },
      {
        id: 'duolingo',
        name: 'Duolingo',
        actions: [
          'Remove from friend list',
          'Consider new streak goals',
        ],
      },
      {
        id: 'nyt',
        name: 'New York Times',
        actions: ['Remove from shared plan', 'Update billing info'],
      },
      {
        id: 'youtube_premium',
        name: 'YouTube Premium',
        actions: [
          'Remove from family group',
          'Change Google account password',
        ],
      },
      {
        id: 'medium',
        name: 'Medium',
        actions: ['Review shared payment method', 'Update billing'],
      },
      {
        id: 'masterclass',
        name: 'MasterClass',
        actions: ['Remove from shared team plan', 'Update billing'],
      },
    ],
  },
  {
    id: 'communication',
    name: 'Communication & Email',
    icon: '✉️',
    priority: 12,
    tier: 'paid',
    keywords: [
      'email', 'gmail', 'outlook', 'phone', 'whatsapp', 'telegram',
      'signal', 'facetime', 'contact', 'number', 'google workspace', 'slack',
    ],
    services: [
      {
        id: 'gmail',
        name: 'Gmail / Google Account',
        actions: [
          'Revoke access if they knew your password',
          "Check \"Manage your Google Account\" for shared apps",
          'Remove from Google Family Group',
          'Update recovery email/phone',
        ],
      },
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        actions: [
          'Archive or delete conversation',
          'Block if needed',
          'Remove from groups',
          'Update your status privacy',
        ],
      },
      {
        id: 'signal',
        name: 'Signal',
        actions: [
          'Delete conversation',
          'Block contact',
          'Remove from groups',
        ],
      },
      {
        id: 'slack',
        name: 'Slack (shared workspace)',
        actions: ['Leave shared workspace', 'Update profile info'],
      },
      {
        id: 'telegram',
        name: 'Telegram',
        actions: [
          'Leave shared channels or groups',
          'Delete conversation',
          'Block contact if needed',
        ],
      },
      {
        id: 'facetime',
        name: 'FaceTime',
        actions: [
          'Remove from Favorites',
          'Update Caller ID settings',
        ],
      },
    ],
  },
  {
    id: 'travel_transport',
    name: 'Travel & Transport',
    icon: '✈️',
    priority: 13,
    tier: 'paid',
    keywords: [
      'uber', 'lyft', 'airbnb', 'travel', 'trip', 'booking', 'hotel',
      'flight', 'points', 'miles', 'rewards', 'waymo',
    ],
    services: [
      {
        id: 'uber',
        name: 'Uber',
        actions: [
          'Remove from trusted contacts',
          'Remove saved home/work if shared',
          'Update payment method',
        ],
      },
      {
        id: 'lyft',
        name: 'Lyft',
        actions: ['Remove saved places', 'Update payment'],
      },
      {
        id: 'airbnb',
        name: 'Airbnb',
        actions: [
          'Remove from travel together preferences',
          'Update payment method',
        ],
      },
      {
        id: 'tripit',
        name: 'TripIt',
        actions: [
          'Remove from shared trips',
          'Revoke calendar sharing',
        ],
      },
      {
        id: 'google_trips',
        name: 'Google Trips / Travel',
        actions: [
          'Remove shared itineraries',
          'Update saved destinations',
        ],
      },
    ],
  },
  {
    id: 'passwords_security',
    name: 'Passwords & Security',
    icon: '🔐',
    priority: 14,
    tier: 'paid',
    keywords: [
      'password', '1password', 'lastpass', 'bitwarden', 'security',
      'keychain', 'two factor', '2fa', 'authenticator', 'shared password',
      'vault',
    ],
    services: [
      {
        id: 'password_manager',
        name: 'Password Manager',
        actions: [
          'Remove from shared vault',
          'Change all passwords they knew',
          'Enable 2FA on important accounts',
          'Review emergency access contacts',
        ],
      },
      {
        id: 'apple_keychain',
        name: 'Apple Keychain / Passwords',
        actions: [
          'Review all saved passwords',
          'Remove shared password groups',
        ],
      },
      {
        id: 'google_passwords',
        name: 'Google Password Manager',
        actions: [
          'Review saved passwords',
          'Revoke access if account was shared',
        ],
      },
      {
        id: 'authenticator',
        name: 'Google/Microsoft Authenticator',
        actions: [
          'Review accounts connected to authenticator',
          'Update 2FA recovery contacts',
        ],
      },
    ],
  },
  {
    id: 'food_delivery',
    name: 'Food & Delivery',
    icon: '🍕',
    priority: 15,
    tier: 'paid',
    keywords: [
      'doordash', 'uber eats', 'grubhub', 'instacart', 'food', 'delivery',
      'order', 'restaurant',
    ],
    services: [
      {
        id: 'doordash',
        name: 'DoorDash',
        actions: [
          'Remove saved addresses',
          'Update payment method',
          'Remove from DashPass family plan',
        ],
      },
      {
        id: 'uber_eats',
        name: 'Uber Eats',
        actions: ['Remove saved addresses', 'Update payment'],
      },
      {
        id: 'instacart',
        name: 'Instacart',
        actions: ['Remove shared household', 'Update payment'],
      },
      {
        id: 'grubhub',
        name: 'Grubhub',
        actions: ['Remove saved addresses', 'Update payment method'],
      },
      {
        id: 'gopuff',
        name: 'GoPuff',
        actions: ['Remove saved addresses', 'Update payment'],
      },
    ],
  },
  {
    id: 'digital_identity',
    name: 'Digital Identity',
    icon: '🪪',
    priority: 16,
    tier: 'paid',
    keywords: [
      'google account', 'apple id', 'microsoft', 'facebook account',
      'recovery', 'backup', 'trusted contact', 'emergency',
    ],
    services: [
      {
        id: 'google_account',
        name: 'Google Account',
        actions: [
          'Review trusted devices',
          'Remove emergency contact if set',
          'Update recovery email/phone',
          'Revoke app permissions',
          'Check Google Family link',
        ],
      },
      {
        id: 'apple_id',
        name: 'Apple ID',
        actions: [
          'Change Apple ID password',
          'Remove from Family Sharing',
          'Review trusted phone numbers',
          'Check Find My settings',
        ],
      },
      {
        id: 'microsoft',
        name: 'Microsoft Account',
        actions: [
          'Remove trusted devices',
          'Update recovery info',
        ],
      },
      {
        id: 'facebook_account',
        name: 'Facebook Account',
        actions: [
          'Review trusted contacts',
          'Remove as Legacy Contact',
          'Update privacy settings',
        ],
      },
    ],
  },
  {
    id: 'shopping_retail',
    name: 'Shopping & Retail',
    icon: '🛍️',
    priority: 17,
    tier: 'paid',
    keywords: [
      'amazon', 'target', 'walmart', 'shopping', 'wish list', 'registry',
      'etsy', 'ebay', 'prime', 'household',
    ],
    services: [
      {
        id: 'amazon',
        name: 'Amazon',
        actions: [
          'Remove from Amazon Household',
          'Remove shared wish lists',
          'Update default shipping address',
          'Update payment methods',
        ],
      },
      {
        id: 'target',
        name: 'Target / Target Circle',
        actions: [
          'Remove from shared savings',
          'Update payment method',
        ],
      },
      {
        id: 'walmart',
        name: 'Walmart+',
        actions: ['Remove household member', 'Update billing'],
      },
      {
        id: 'etsy',
        name: 'Etsy',
        actions: [
          'Remove from shared favorites',
          'Update payment method',
        ],
      },
    ],
  },
  {
    id: 'productivity',
    name: 'Productivity & Work',
    icon: '💼',
    priority: 18,
    tier: 'paid',
    keywords: [
      'notion', 'google docs', 'trello', 'asana', 'calendar', 'shared',
      'workspace', 'project', 'todoist', 'monday', 'airtable',
    ],
    services: [
      {
        id: 'notion',
        name: 'Notion',
        actions: [
          'Remove from shared workspace',
          'Revoke access to shared pages',
          'Archive joint projects',
        ],
      },
      {
        id: 'google_calendar',
        name: 'Google Calendar',
        actions: [
          'Remove shared calendar',
          'Delete shared events',
          'Update event invites',
        ],
      },
      {
        id: 'trello',
        name: 'Trello',
        actions: [
          'Remove from shared boards',
          'Archive joint boards',
        ],
      },
      {
        id: 'apple_calendar',
        name: 'Apple Calendar',
        actions: [
          'Remove shared calendar',
          'Remove from family calendar',
        ],
      },
      {
        id: 'todoist',
        name: 'Todoist',
        actions: [
          'Remove from shared projects',
          'Update collaborators',
        ],
      },
    ],
  },
  {
    id: 'dating_social',
    name: 'Dating & Social Apps',
    icon: '💑',
    priority: 19,
    tier: 'paid',
    keywords: [
      'tinder', 'bumble', 'hinge', 'dating', 'match', 'okcupid',
      'coffee meets bagel', 'plenty of fish',
    ],
    services: [
      {
        id: 'tinder',
        name: 'Tinder',
        actions: [
          'Update profile photos',
          'Refresh bio',
          'Pause or delete account if needed',
        ],
      },
      {
        id: 'bumble',
        name: 'Bumble',
        actions: [
          'Update profile',
          'Remove from BFF section if applicable',
        ],
      },
      {
        id: 'hinge',
        name: 'Hinge',
        actions: ['Update profile and preferences', 'Delete old matches'],
      },
    ],
  },
  {
    id: 'news_content',
    name: 'News & Content',
    icon: '📰',
    priority: 20,
    tier: 'paid',
    keywords: [
      'news', 'apple news', 'pocket', 'feedly', 'substack', 'newsletter',
      'rss', 'flipboard', 'content',
    ],
    services: [
      {
        id: 'apple_news',
        name: 'Apple News+',
        actions: ['Remove from family sharing', 'Update billing'],
      },
      {
        id: 'pocket',
        name: 'Pocket',
        actions: [
          'Review shared reading lists',
          'Remove from shared account',
        ],
      },
      {
        id: 'substack',
        name: 'Substack',
        actions: ['Review shared subscriptions', 'Update billing'],
      },
    ],
  },
]

export const FREE_CATEGORY_COUNT = 5

/**
 * Score and sort categories by relevance to the user's input.
 * Returns ALL categories sorted by relevance (most relevant first),
 * keeping free categories prioritized when scores are equal.
 */
export function getRelevantCategories(input: string): Category[] {
  const lower = input.toLowerCase()

  const scored = MASTER_CATEGORIES.map((cat) => {
    const keywordMatches = cat.keywords.filter((kw) => lower.includes(kw)).length
    const serviceMatches = cat.services.filter((s) =>
      lower.includes(s.name.toLowerCase())
    ).length
    return { cat, score: keywordMatches * 2 + serviceMatches * 3 }
  })

  // Sort: first by score (desc), then by priority (asc) for equal scores
  const sorted = scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return a.cat.priority - b.cat.priority
  })

  return sorted.map((s) => s.cat)
}

/**
 * Returns the relevant service names within a category given user input.
 * Falls back to all services if no specific matches found.
 */
export function getFilteredServices(category: Category, input: string): string[] {
  const lower = input.toLowerCase()
  const relevant = category.services.filter(
    (s) =>
      s.actions.length > 0 &&
      (category.keywords.some((kw) => lower.includes(kw)) ||
        lower.includes(s.name.toLowerCase()) ||
        true) // always include all services as fallback
  )
  return relevant.map((s) => s.name)
}

/**
 * Returns all free-tier categories sorted by priority.
 */
export function getFreeTierCategories(): Category[] {
  return MASTER_CATEGORIES.filter((c) => c.tier === 'free').sort(
    (a, b) => a.priority - b.priority
  )
}

/**
 * Returns all paid-tier categories sorted by priority.
 */
export function getPaidTierCategories(): Category[] {
  return MASTER_CATEGORIES.filter((c) => c.tier === 'paid').sort(
    (a, b) => a.priority - b.priority
  )
}
