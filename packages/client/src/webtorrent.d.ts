declare module "webtorrent" {
  interface TorrentFile {
    name: string;
    blob(): Promise<Blob>;
  }

  interface Torrent {
    magnetURI: string;
    uploaded: number;
    length: number;
    uploadSpeed: number;
    downloadSpeed: number;
    progress: number;
    files: TorrentFile[];
    on(event: "upload" | "download" | "done", listener: () => void): this;
    on(event: "error", listener: (err: Error) => void): this;
    destroy(): void;
  }

  interface Instance {
    seed(file: File, callback: (torrent: Torrent) => void): void;
    add(link: string, callback: (torrent: Torrent) => void): void;
    get(link: string): Promise<Torrent | null>;
    remove(torrent: Torrent): void;
    on(event: "error", listener: (err: Error) => void): this;
  }

  interface WebTorrentConstructor {
    new (opts?: object): Instance;
  }

  const WebTorrent: WebTorrentConstructor;
  export default WebTorrent;
  export type { Instance, Torrent, TorrentFile };
}
