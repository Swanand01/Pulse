import { isChrome } from "./utils";

const TRACKERS = [
  "wss://tracker.btorrent.xyz",
  "wss://tracker.openwebtorrent.com",
  "wss://tracker.webtorrent.dev",
];

const ICE_SERVERS = [
  isChrome()
    ? { url: "stun:68.183.83.122:3478" }
    : { urls: "stun:68.183.83.122:3478" },
  {
    urls: "turn:68.183.83.122:3478",
    username: "pulse",
    credential: "pulsepassword",
  },
];

export const WEBTORRENT_CONFIG = {
  tracker: {
    announce: TRACKERS,
    rtcConfig: {
      iceServers: ICE_SERVERS,
    },
  },
};
