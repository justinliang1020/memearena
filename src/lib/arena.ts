export interface Channel {
  slug: string;
  name: string;
  lastQueried: number; // ms from Date.now()
  imageBlocks: ImageBlock[];
  textBlocks: TextBlock[];
}
interface BlockBase {
  id: string;
  title: string;
}
export interface ImageBlock extends BlockBase {
  src: string;
}
export interface TextBlock extends BlockBase {
  content: string;
}
export interface Meme {
  imageBlock: ImageBlock;
  textBlock: TextBlock;
}
// function to query arena api for channel metadata and blocks
// account for pagination

export function parseArenaChannelSlug(url: string): string {
  //parses are.na channel slug from an are.na URL.
  //i.e. `https://www.are.na/justin-liang/fake-wikipedia-memes` => `fake-wikipedia-memes`
  //i.e. `https://www.are.na/justin-liang/uncategorized-x90eek6ekqu` => `uncategorized-x90eek6ekqu`
  const regex = /https:\/\/www\.are\.na\/[^/]+\/([^/]+)/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  }

  throw new Error("Invalid Are.na URL. Couldn't parse channel.");
}

export async function getArenaChannel(channelSlug: string): Promise<Channel> {
  const baseUrl = `http://api.are.na/v2/channels/${channelSlug}`;
  const imageBlocks: ImageBlock[] = [];
  const textBlocks: TextBlock[] = [];

  let currentPage = 1;
  let channelMetadata: any = null;
  let hasMoreData = true;

  while (hasMoreData) {
    console.log(`Fetching page ${currentPage}`); // Debug log for pagination

    const response = await fetch(`${baseUrl}?page=${currentPage}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch channel data: ${response.statusText}`);
    }

    const data = await response.json();

    // Capture metadata only once
    if (!channelMetadata) {
      channelMetadata = {
        slug: data.slug,
        name: data.title,
        lastQueried: Date.now(),
      };
    }

    // Process blocks from contents
    if (data.contents && data.contents.length > 0) {
      for (const block of data.contents) {
        if (block.class === "Image" && block.image?.original) {
          imageBlocks.push({
            id: block.id,
            title: block.title || "Untitled",
            src: block.image.original.url,
          });
        } else if (block.class === "Text" && block.content) {
          textBlocks.push({
            id: block.id,
            title: block.title || "Untitled",
            content: block.content,
          });
        }
      }
    } else {
      hasMoreData = false; // Stop looping if no more contents
    }

    currentPage++; // Move to the next page
  }

  return {
    slug: channelMetadata.slug,
    name: channelMetadata.name,
    lastQueried: channelMetadata.lastQueried,
    imageBlocks,
    textBlocks,
  };
}

