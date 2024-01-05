<script lang="ts">
	import '../app.css';
	import EndOfRound from '$lib/EndOfRound.svelte';
</script>

<div class="navbar">
	<div class="flex-1">
		<div class="btn btn-ghost text-xl">2 Rooms</div>
	</div>
	<div class="flex-none">
		<button onclick="rulesModal.showModal()" class="btn btn-square btn-ghost">Rules</button>
	</div>
</div>
<dialog class="modal" id="rulesModal">
	<div class="modal-box">
		<p class="font-bold text-lg">Overall Goal</p>
		"Two Rooms" involves two randomly assigned teams, Red and Blue, and two separate rooms. Each team
		has a key player - the
		<span class="text-blue-500 font-semibold">Blue President</span> and the
		<span class="text-red-500 font-semibold">Red Bomber</span>, as well as other randomly assigned
		roles. The winning team is determined by the location of the
		<span class="text-red-500 font-semibold">Red Bomber</span>
		and the
		<span class="text-blue-500 font-semibold">Blue President</span>. If they end up in the same
		room, the Red team wins. If they're in different rooms, the Blue team wins.
		<p class="font-bold text-lg">Gameplay</p>
		The game is played by players communicating to choose a leader for their room. The first leader is
		chosen by another player who points at them and says, "I appoint you as leader!" Players can't appoint
		themselves. The leader can be changed at any time by either a majority vote, or abdication (you may
		not receive leadership again until a new round).
		<br />
		The leader's job is to select hostages. These are players who will be moved to the other room at
		the end of each round. The game is made up of several rounds, each one shorter than the last.
		<br />
		At the end of each round, the chosen hostages are swapped into the other room. The game concludes
		after the final hostage exchange. At this point, everyone shows their card.
		<br />
		<EndOfRound />
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>Close</button>
	</form>
</dialog>
<slot />
