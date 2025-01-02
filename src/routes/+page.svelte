<script lang="ts">
	import WikipediaImageFigure from '$lib/WikipediaImageFigure.svelte';
	import type { Channel, Meme } from '$lib/arena';
	import { getArenaChannel, parseArenaChannelSlug } from '$lib/arena';

	async function submitNewChannel(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const urlInput = form.querySelector<HTMLInputElement>('#channel-url');
		if (!urlInput || !urlInput.value.trim()) {
			//TODO: error handling
			console.error('URL input is empty');
			return;
		}

		const url = urlInput.value.trim();
		try {
			const channelSlug = parseArenaChannelSlug(url);
			const channel = await getArenaChannel(channelSlug);
			console.log(channel);
			channels.push(channel);
		} catch {
			//TODO: error handling
		}
	}

	let dummyChannel1: Channel = {
		slug: 'dummyChannelslug1',
		name: 'dummyChannelName1',
		lastQueried: Date.now(),
		imageBlocks: [
			{
				id: 'blockslug',
				title: 'blockTitle1',
				src: 'favicon.png'
			}
		],
		textBlocks: [
			{
				id: 'blockId2',
				title: 'blockTitle2',
				content: 'blockContent2'
			},
			{
				id: 'blockId5',
				title: 'blockTitle5',
				content: 'blockContent5'
			}
		]
	};
	let dummyChannel2: Channel = {
		slug: 'dummyChannelSlug2',
		name: 'dummyChannelName2',
		lastQueried: Date.now(),
		imageBlocks: [
			{
				id: 'blockId3',
				title: 'blockTitle3',
				src: 'favicon.png'
			},
			{
				id: 'blockId6',
				title: 'blockTitle6',
				src: 'favicon.png'
			}
		],
		textBlocks: [
			{
				id: 'blockId4',
				title: 'blockTitle4',
				content: 'blockContent4'
			}
		]
	};
	let channels: Channel[] = $state([dummyChannel1, dummyChannel2]);
	let dummyMeme1: Meme = {
		imageBlock: dummyChannel1.imageBlocks[0],
		textBlock: dummyChannel1.textBlocks[0]
	};
	let dummyMeme2: Meme = {
		imageBlock: dummyChannel2.imageBlocks[0],
		textBlock: dummyChannel2.textBlocks[0]
	};
	let memes: Meme[] = [
		dummyMeme1,
		dummyMeme1,
		dummyMeme1,
		dummyMeme1,
		dummyMeme1,
		dummyMeme1,
		dummyMeme1,
		dummyMeme1,
		dummyMeme1,
		dummyMeme1,
		dummyMeme1,
		dummyMeme2,
		dummyMeme2,
		dummyMeme2,
		dummyMeme2,
		dummyMeme2,
		dummyMeme2,
		dummyMeme2,
		dummyMeme2,
		dummyMeme2,
		dummyMeme2,
		dummyMeme2
	];
</script>

<main>
	<section class="sidebar">
		<h1>memeare.na</h1>
		<p>Randomly generated memes curated from <a href="https://www.are.na/">are.na</a> channels</p>
		<h2>Channels</h2>
		<div style="text-align: left;">
			<form onsubmit={submitNewChannel}>
				<label for="channel-url">are.na Channel URL</label>
				<input type="text" id="channel-url" />
				<button>submit</button>
			</form>
			<ul class="channels-list">
				{#each channels as channel}
					<!-- content here -->
					<li>
						<a href="https://www.example.com/">{channel.name}</a>:
						<b>{channel.imageBlocks.length}</b>
						image blocks & <b>{channel.textBlocks.length}</b> text blocks
					</li>
				{/each}
			</ul>
		</div>
	</section>
	<section class="content">
		{#each memes as meme}
			<WikipediaImageFigure caption={meme.textBlock.content} imageSrc={meme.imageBlock.src} />
		{/each}
	</section>
</main>

<style>
	main {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		height: 100vh;
	}

	.channels-list {
		list-style-type: none;
		padding: 0;
	}

	.sidebar {
		flex-basis: 25rem;
		flex-grow: 1;
		text-align: center;
		border-right: black dashed 5px;
	}

	.content {
		flex-basis: 0;
		flex-grow: 999;
		min-inline-size: 50%;
		display: flex;
		flex-wrap: wrap;
	}
</style>
