export interface Channel {
  id: string;
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
