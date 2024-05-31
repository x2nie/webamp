export type WebampOptions = {
  skin: string;
  skins: string[];
  tracks: string[];
  ownPlayback: boolean; // whether create new Audio or share.
};

export const webampDefaultOptions = {
  skin: "skins/SimpleTutorial.wal",
  skins: [],
  tracks: [],
  ownPlayback: false,
};
