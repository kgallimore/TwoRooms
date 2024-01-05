<script lang="ts">
	import { hostageCounts } from './roles';
	export let currentRound = 5;
	export let numRounds: 3 | 5 = 5;
	export let numPlayers: number;
	if (numPlayers <= 10) {
		numRounds = 3;
	}
	let hostageCount = hostageCounts(numPlayers);
	if (numRounds === 3) {
		hostageCount = hostageCount.slice(0, 3);
	}
	console.log(hostageCount);
</script>

<ul class="steps">
	{#each hostageCount as amount, i}
		<li class="step" class:step-info={numRounds - i >= currentRound} data-content={amount}>
			Round {i + 1}
		</li>
	{/each}
</ul>
