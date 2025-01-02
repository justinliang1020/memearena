<script lang="ts">
	let { caption, imageSrc }: { caption: string; imageSrc: string } = $props();
	//TODO: make another prop for light or dark mode
</script>

<figure>
	<img src={imageSrc} alt="meow" />
	<figcaption>
		<svg xmlns="http://www.w3.org/2000/svg" width="15" height="11" viewBox="0 0 11 15">
			<g id="magnify-clip" fill="#fff" stroke="#000">
				<path id="bigbox" d="M1.509 1.865h10.99v7.919H1.509z" />
				<path id="smallbox" d="M-1.499 6.868h5.943v4.904h-5.943z" />
			</g>
		</svg>
		{@html caption}
	</figcaption>
</figure>

<style>
	figure {
		width: 229px;
		height: fit-content;
		background-color: rgb(32, 33, 34);
		border: 1px solid rgb(84, 89, 93);
		border-bottom: 0;
		font-family: sans-serif;
		font-size: 16px;
		display: table;
		color: rgb(248, 249, 250);
		position: relative;
	}

	figure img {
		width: calc(100% - (2 * 3px) - (2 * 1px));
		border: 1px solid #c8ccd1;
		margin: 3px;
		background-color: white;
	}

	figure figcaption {
		position: relative;
		display: table-caption;
		caption-side: bottom;
		line-height: 1.4em;
		padding: 0 6px 6px 6px;
		border: 1px solid rgb(84, 89, 93);
		border-top: 0;
		background-color: rgb(32, 33, 34);
		font-size: 88%;
		word-break: break-word;
	}

	figcaption svg {
		float: right;
	}
</style>
