<script lang="ts">
	import WikipediaImageFigure from '$lib/WikipediaImageFigure.svelte';
	import type { Channel, Meme } from '$lib/arena';
	import { getArenaChannel, parseArenaChannelSlug } from '$lib/arena';
	import { onMount } from 'svelte';

	async function addNewChannel(url: string) {
		isLoadingAddNewChannel = true;
		try {
			const channelSlug = parseArenaChannelSlug(url);
			const channel = await getArenaChannel(channelSlug);
			console.log(channel);
			channels.push(channel);
		} catch {
			//TODO: error handling
		}
		isLoadingAddNewChannel = false;
	}

	async function onSubmitChannelUrlButton(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const urlInput = form.querySelector<HTMLInputElement>('#channel-url');
		if (!urlInput || !urlInput.value.trim()) {
			//TODO: error handling
			console.error('URL input is empty');
			return;
		}
		const url = urlInput.value.trim();
		await addNewChannel(url);
	}

	const NUMBER_OF_MEMES_TO_GENERATE = 30;
	function refreshMemes() {
		function getRandomValue<T>(arr: T[]): T {
			const randomIndex = Math.floor(Math.random() * arr.length);
			return arr[randomIndex];
		}
		const allImageBlocks = channels
			.filter((channel) => !channel.hidden)
			.flatMap((channel) => channel.imageBlocks);
		const allTextBlocks = channels
			.filter((channel) => !channel.hidden)
			.flatMap((channel) => channel.textBlocks);

		const noMemes = allImageBlocks.length === 0 && allTextBlocks.length === 0;
		if (noMemes) {
			memes = [];
			return;
		}
		const newMemes: Meme[] = [];
		for (let i = 0; i < NUMBER_OF_MEMES_TO_GENERATE; i++) {
			newMemes.push({
				imageBlock: getRandomValue(allImageBlocks),
				textBlock: getRandomValue(allTextBlocks)
			});
		}
		memes = newMemes;
	}

	onMount(async () => {
		for (const channelUrl of INITIAL_CHANNELS_URLS) {
			await addNewChannel(channelUrl);
		}
		refreshMemes();
	});

	const INITIAL_CHANNELS_URLS: string[] = [
		'https://www.are.na/justin-liang/uncategorized-x90eek6ekqu',
		'https://www.are.na/connie-liu-kg4ypfp7ry0/universal-feelings-of-self-expression',
		'https://www.are.na/connie-liu-kg4ypfp7ry0/we-live-in-a-seltzer-world'
	];
	let channels: Channel[] = $state([]);
	let memes: Meme[] = $state([]);
	let isLoadingAddNewChannel = $state(false);
</script>

<main>
	<section class="sidebar">
		<h1>memeare.na</h1>
		<p>Randomly generated memes from <a href="https://www.are.na/">are.na</a> channels.</p>
		<p>
			First add are.na channel(s) that contain <b>image/text</b> blocks you want to use. Then click
			<b>refresh memes</b> to generate memes that randomly pair an image block with a text block.
			Currently the only meme format is a
			<a href="https://www.are.na/justin-liang/fake-wikipedia-memes">fake wikipedia meme </a> but more
			can be added later.
		</p>
		<hr />
		<h2>Channels</h2>
		<p>
			<b>All blocks</b> from channels below will be used in memes (unless you press the "hide" button)
		</p>
		<div style="text-align: left;">
			<ul class="channels-list">
				{#each channels as channel}
					<!-- content here -->
					<li style={channel.hidden ? 'text-decoration: line-through;' : ''}>
						<a href={`https://www.are.na/${channel.userSlug}/${channel.slug}`}>{channel.name}</a>:
						<b>{channel.imageBlocks.length}</b> image blocks and
						<b>{channel.textBlocks.length}</b> text blocks
						<button onclick={() => (channel.hidden = !channel.hidden)}>hide</button>
						<button
							onclick={() => {
								channels = channels.filter((c) => c != channel);
							}}>delete</button
						>
					</li>
				{/each}
			</ul>
			<form onsubmit={onSubmitChannelUrlButton}>
				<label for="channel-url">Add are.na channel:</label>
				<input type="text" id="channel-url" placeholder="are.na channel URL" />
				<button>submit</button>
				<p style={isLoadingAddNewChannel ? '' : 'visibility: hidden;'}>
					loading... (big channels take longer to load!)
				</p>
			</form>
			<hr />
			<div style="text-align: center;">
				<button onclick={refreshMemes}><b>Click to Refresh Memes</b></button>
			</div>

			<p style="text-align: center;">
				created by <a href="https://www.justinliang.me/">Justin</a> ~
				<a href="https://github.com/justinliang1020/memearena">source code</a>
			</p>
		</div>
	</section>
	<section class="content">
		{#each memes as meme}
			<div style="text-align: center;">
				<WikipediaImageFigure caption={meme.textBlock.content} imageSrc={meme.imageBlock.src} />
				<p>
					<a href="https://www.are.na/block/{meme.imageBlock.id}">image source</a>
					|
					<a href="https://www.are.na/block/{meme.textBlock.id}">text source</a>
				</p>
			</div>
		{/each}
	</section>
</main>

<style>
	:global(body) {
		background-color: rgb(32, 33, 34);
		color: rgb(248, 249, 250);
	}

	:global(a) {
		color: rgb(136, 163, 232);
	}

	::placeholder {
		color: rgb(178, 190, 181);
	}

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
		flex-basis: 30rem;
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
