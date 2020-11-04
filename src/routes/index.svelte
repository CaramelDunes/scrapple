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
	}

	.card {
		flex-grow: 1;
		border: 3px solid lightgrey;
		border-radius: 10px;
		padding: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
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
	<title>Letters & Words</title>
</svelte:head>

<h1>Letters & Words</h1>

<div class="wrapper">
	<div class="card">
		<h2>New Game</h2>
		<form action="/game.json" method="post">
			<div>
				Language:
				<input
					type="radio"
					id="french"
					name="language"
					value="french"
					checked />
				<label for="french">🇫🇷</label>
				<input
					type="radio"
					id="english"
					name="language"
					value="english" />
				<label for="english">🇬🇧</label>
			</div>
			<input type="submit" value="Play!" />
		</form>
	</div>
	<div class="card">
		<h2>Join Game</h2>
		<input type="text" size="6" maxlength="6" />
		<button>Join!</button>
	</div>
</div>
