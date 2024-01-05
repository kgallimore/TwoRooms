<script lang="ts">
	import { goto } from '$app/navigation';
	export let username: string = '';
	export let room: string = '';

	function submitForm() {
		if (username && room) goto(`/${room}/${username}`);
	}
</script>

<div class="flex justify-center">
	<div class="card w-96 bg-neutral text-neutral-content">
		<div class="card-body items-center text-center">
			<h2 class="card-title">Join/Create Game</h2>
			<form class="form-control">
				<label for="usernameInput" class="label-text">Username</label>
				<input
					id="usernameInput"
					class="input"
					type="text"
					placeholder="Username"
					bind:value={username}
				/>
				<label for="roomNameInput" class="label-text">Room Name</label>
				<input
					id="roomNameInput"
					class="input"
					type="text"
					placeholder="Room Name"
					bind:value={room}
				/>
			</form>

			<div class="card-actions justify-end">
				<button class="btn btn-primary" type="submit" on:click={submitForm}>Join</button>
			</div>
		</div>
	</div>
</div>
