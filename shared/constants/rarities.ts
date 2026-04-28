export const RARITIES = {
  kEpic: {
    icon: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/rarity-gem-icons/epic.png",
    price: {
      type: 'RP',
      value: '1350'
    },
    color: '#0cbdcb',
  },
  kLegendary: {
    icon: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/rarity-gem-icons/legendary.png",
    price: {
      type: 'RP',
      value: '1820'
    },
    color: '#d31a26',
  },
  kMythic: {
    icon: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/rarity-gem-icons/mythic.png",
    price: {
      type: 'ME',
      value: '125-150'
    },
    color: '#b412b2',
  },
  kUltimate: {
    icon: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/rarity-gem-icons/ultimate.png",
    price: {
      type: 'RP',
      value: '3250'
    },
    color: '#df7f17',
  },
  kTranscendent: {
    icon: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/rarity-gem-icons/transcendent.png",
    color: '#ded6e7'
  },
  kExalted: {
    icon: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/rarity-gem-icons/exalted.png",
    color: '#b0b95e'
  },
} as {
  [rarity: string]: {
    icon: string;
    price?: { type: 'RP' | 'ME', value: string; };
    color?: string;
  }
};
