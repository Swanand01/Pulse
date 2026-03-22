const ownTracker = `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/announce`;

export const TRACKERS = [
  ownTracker,
  "wss://tracker.openwebtorrent.com",
  "wss://tracker.webtorrent.dev",
];
