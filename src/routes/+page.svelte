<script lang="ts">
	import WikipediaImageFigure from '$lib/WikipediaImageFigure.svelte';
	import type { Channel, Meme } from '$lib/arena';
	import { getArenaChannel, parseArenaChannelSlug } from '$lib/arena';
	import { onMount } from 'svelte';

	async function addNewChannel(url: string) {
		try {
			const channelSlug = parseArenaChannelSlug(url);
			const channel = await getArenaChannel(channelSlug);
			console.log(channel);
			channels.push(channel);
		} catch {
			//TODO: error handling
		}
	}

	async function onSubmitChannelUrlButton(event: Event) {
		event.preventDefault();
		isLoadingAddNewChannel = true;
		const form = event.target as HTMLFormElement;
		const urlInput = form.querySelector<HTMLInputElement>('#channel-url');
		if (!urlInput || !urlInput.value.trim()) {
			//TODO: error handling
			console.error('URL input is empty');
			return;
		}
		const url = urlInput.value.trim();
		await addNewChannel(url);
		isLoadingAddNewChannel = false;
	}

	const NUMBER_OF_MEMES_TO_GENERATE = 30;
	function refreshMemes() {
		function getRandomValue<T>(arr: T[]): T {
			const randomIndex = Math.floor(Math.random() * arr.length);
			return arr[randomIndex];
		}
		const allImageBlocks = channels.flatMap((channel) => channel.imageBlocks);
		const allTextBlocks = channels.flatMap((channel) => channel.textBlocks);

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
		await addNewChannel('https://www.are.na/justin-liang/uncategorized-x90eek6ekqu');
		refreshMemes();
	});

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
		<h2>Channels</h2>
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
				<label for="channel-url">are.na Channel URL</label>
				<input type="text" id="channel-url" />
				<button>submit</button>
				<p style={isLoadingAddNewChannel ? '' : 'visibility: hidden;'}>
					loading... (big channels take longer to load!)
				</p>
			</form>
			<hr />
			<div style="text-align: center;">
				<button onclick={refreshMemes}>refresh memes</button>
			</div>
		</div>
	</section>
	<section class="content">
		{#each memes as meme}
			<WikipediaImageFigure caption={meme.textBlock.content} imageSrc={meme.imageBlock.src} />
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
