<style>
	h1 {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}

	.wrapper {
		display: flex;
		flex-wrap: wrap;
		max-width: 50em;
		margin: 0 auto;
	}

	.card {
		flex: 1 1 0px;
		border: 3px solid lightgrey;
		border-radius: 10px;
		padding: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		margin: 8px;
		box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
	}

	input[type="text"] {
		border-radius: 5px;
		padding: 5px;
		font-size: x-large;
		text-align: center;
	}

	form {
		text-align: center;
	}
</style>

<svelte:head>
	<title>Scrapple</title>
</svelte:head>

<h1>Scrapple</h1>

<div class="wrapper">
	<form class="card" action="/game.json" method="post">
		<h2>New Game</h2>
		<div>
			Language:
			<input
				type="radio"
				id="french"
				name="language"
				value="french"
				checked />
			<label for="french">🇫🇷</label>
			<input type="radio" id="english" name="language" value="english" />
			<label for="english">🇬🇧</label>
		</div>
		<input type="submit" value="Play!" />
	</form>
	<form class="card" action="/join" method="get">
		<h2>Join Game</h2>
		<input type="text" size="6" maxlength="6" name="id" />
		<input type="submit" value="Play!" />
	</form>
</div>
