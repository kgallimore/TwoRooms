<script lang="ts">
	import type { PageData } from './$types';
	import type { WebsocketMessages } from '$lib/server/webSocketUtils';
	import Role from '$lib/Role.svelte';
	import { onMount } from 'svelte';
	import RoundCounter from '$lib/RoundCounter.svelte';
	export let data: PageData;
	const roles = data.roles;
	const room = data.room;
	let enabledRoles = JSON.parse(room!.enabledRoles) as number[];
	let checkedRoles: number[] = enabledRoles;
	$: currentUser = room!.users.find((user) => user.name === data.user);
	$: userRole = roles.find((role) => role.id == currentUser?.roleId);
	let ws: WebSocket;
	let timer: NodeJS.Timeout;
	let secondsLeftInRound = getSecondsLeftInRound();
	let assignmentModal: HTMLDialogElement;
	if (secondsLeftInRound >= 0) {
		setTimer();
	}

	function getSecondsLeftInRound() {
		return room.roundStartTime
			? Math.floor(
					room.currentRound * 60 -
						(new Date().getTime() - new Date(room.roundStartTime).getTime()) / 1000
				)
			: 0;
	}
	onMount(() => {
		connectWebsockets();
	});

	function connectWebsockets() {
		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		if (ws) ws.close();
		if (!currentUser) {
			alert('You are not in this room');
			return;
		}
		ws = new WebSocket(
			`${protocol}//${window.location.host}/websocket?room=${room.id}&user=${currentUser?.id}`
		);

		ws.onmessage = (event) => {
			const message = JSON.parse(event.data) as WebsocketMessages;
			if (message.gameStateChanged) {
				room.gameState = message.gameStateChanged;
			}
			if (message.userJoined) {
				room.users = [...room.users, message.userJoined];
			}
			if (message.userLeft) {
				const user = room.users.findIndex((user) => user.id === message.userLeft);
				if (user != -1) {
					room.users[user].disconnectedAt = new Date();
				}
			}
			if (message.userKicked) {
				room.users = room.users.filter((user) => user.id !== message.userLeft);
			}
			if (message.rolesChanged) {
				enabledRoles = message.rolesChanged;
				checkedRoles = message.rolesChanged;
			}
			if (message.userRejoined) {
				const user = room.users.findIndex((user) => user.id === message.userRejoined);
				if (user != -1) {
					room.users[user].disconnectedAt = null;
				}
			}
			if (message.gameStarted) {
				assignmentModal.showModal();
				room.users = message.gameStarted.users;
				room.gameState = message.gameStarted.gameState;
				room.currentRound = message.gameStarted.currentRound;
				room.roundStartTime = new Date(message.gameStarted.roundStartTime);
				secondsLeftInRound = getSecondsLeftInRound();
				setTimer();
			}
			if (message.nextRound) {
				room.currentRound = message.nextRound.currentRound;
				room.roundStartTime = new Date(message.nextRound.roundStartTime);
				secondsLeftInRound = getSecondsLeftInRound();
				setTimer();
			}
		};
		ws.onclose = () => {
			// Reconnect
			setTimeout(() => {
				connectWebsockets();
			}, 1000);
		};
		ws.onerror = (err) => {
			// Reconnect
			console.warn('Websocket error, attempting to reconnect');
			console.error(err);
			setTimeout(() => {
				connectWebsockets();
			}, 1000);
		};
	}

	function setTimer() {
		if (timer) clearInterval(timer);
		timer = setInterval(() => {
			if (secondsLeftInRound <= 1) clearInterval(timer);
			secondsLeftInRound--;
		}, 1000);
	}

	function sendWsMessage(message: WebsocketMessages) {
		if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(message));
	}
	function changeCheck(
		id: number,
		event: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		const targetRole = roles.find((role) => role.id == id);
		if (!targetRole) return;
		const reqRoles: number[] = [id];
		if (targetRole.requiredRoles || targetRole.requiringRoles) {
			reqRoles.push(
				...(targetRole.requiredRoles.map((role) => role.id) ?? []),
				...(targetRole.requiringRoles.map((role) => role.id) ?? [])
			);
		}
		if (event.currentTarget.checked) {
			reqRoles.forEach((role) => {
				if (!checkedRoles.includes(role)) {
					checkedRoles.push(role);
				}
			});
		} else {
			reqRoles.forEach((role) => {
				if (checkedRoles.includes(role)) {
					checkedRoles.splice(
						checkedRoles.findIndex((r) => r === role),
						1
					);
				}
			});
		}
		sendWsMessage({ rolesChanged: checkedRoles });
	}
	function startGame() {
		if (checkedRoles.length > room!.users.length) {
			alert('Too many cards for the number of players');
			return;
		}
		fetch(`${window.location.pathname}/start`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(checkedRoles)
		}).then(async (res) => {
			if (res.ok) {
				let data = await res.json();
				if (data.error) {
					alert(data.error);
					return;
				}
			} else {
				alert('Failed to start game');
			}
		});
	}

	function nextRound() {
		if (confirm('Are you sure you want to advance the round?')) {
			fetch(`${window.location.pathname}/next`, {
				method: 'GET'
			}).then(async (res) => {
				if (res.ok) {
					let data = await res.json();
					if (data.error) {
						alert(data.error);
						return;
					}
				} else {
					alert('Failed to start next round');
				}
			});
		}
	}

	function endGame() {
		if (confirm('Are you sure you want to end the game?')) {
			fetch(`${window.location.pathname}/end`, {
				method: 'GET'
			}).then(async (res) => {
				if (res.ok) {
					let data = await res.json();
					if (data.error) {
						alert(data.error);
						return;
					}
				} else {
					alert('Failed to end game');
				}
			});
		}
	}
	function kickUser(id: number) {
		if (
			confirm(`Are you sure you want to kick ${room?.users.find((user) => user.id == id)?.name}?`)
		) {
			fetch(`${window.location.pathname}/kick`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ user: id })
			}).then(async (res) => {
				if (res.ok) {
					let data = await res.json();
					if (data.error) {
						alert(data.error);
						return;
					}
				} else {
					alert('Failed to kick user');
				}
			});
		}
	}
</script>

<dialog bind:this={assignmentModal} class="modal" id="assignmentModal">
	<div class="modal-box">
		You have been assigned to room: {currentUser?.assignedRoom ? 'A' : 'B'}
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>Close</button>
	</form>
</dialog>
{#if room?.gameState == 'Lobby'}
	<div class="sticky top-0 w-full z-10 bg-neutral">
		Current {enabledRoles.length} Roles:
		{#each enabledRoles as role}
			<a
				href="#{roles.find((findRole) => findRole.id == role)?.name}{roles.find(
					(findRole) => findRole.id == role
				)?.team}"
				class="font-bold text-{roles
					.find((findRole) => findRole.id == role)
					?.team.toLowerCase()}-500"
				>{roles.find((findRole) => findRole.id == role)?.name}
			</a>
		{/each}
	</div>
	<table class="table">
		<thead>
			<tr>
				<th>Role</th>
				<th>Included</th>
			</tr>
		</thead>
		<tbody>
			{#each roles.filter((r) => r.name != 'Civilian') as role}
				<tr id="{role.name}{role.team}">
					<td
						><div class:tooltip={role.rules} data-tip={role.rules} class="w-full text-left">
							<span class="font-bold text-{role.team.toLowerCase()}-500">{role.name}</span
							>{#if role.requiredRoles}{#each role.requiredRoles as reqRole}/<a
										href="#{reqRole.name}{reqRole.team}"
										class="font-bold text-{reqRole.team.toLowerCase()}-500">{reqRole.name}</a
									>{/each}{/if}
							{#if role.requiringRoles}{#each role.requiringRoles as reqRole}/<a
										href="#{reqRole.name}{reqRole.team}"
										class="font-bold text-{reqRole.team.toLowerCase()}-500">{reqRole.name}</a
									>{/each}{/if}:

							{role.description}
						</div></td
					>
					<td>
						<input
							class="checkbox"
							disabled={currentUser?.primaryUser !== true}
							type="checkbox"
							checked={enabledRoles.includes(role.id)}
							on:change={(event) => changeCheck(role.id, event)}
						/>
					</td>
				</tr>
			{/each}
			{#if currentUser?.primaryUser}
				<tr>
					<td colspan="2"
						><button class="btn btn-primary w-full" on:click={startGame}>Start</button></td
					>
				</tr>
			{/if}
		</tbody>
	</table>
{:else if room?.gameState == 'In Progress'}
	<div class="sticky top-0 w-full z-10 bg-neutral">
		<div class="m-auto">
			<div class="text-center font-bold">Hostages Sent</div>
			<div class="flex justify-center">
				<RoundCounter numPlayers={room.users.length} currentRound={room.currentRound} />
			</div>
			<div class="flex justify-center">
				{#if secondsLeftInRound > 0}
					<progress
						class="progress w-56"
						value={100 - (secondsLeftInRound / (room.currentRound * 60)) * 100}
						max="100"
					></progress>{:else}
					<progress class="progress w-56 progress-error"></progress>
				{/if}
			</div>
		</div>
	</div>
	{#if userRole}<div class="h-[80vh]"><Role role={userRole} /></div>
	{/if}
	{#each enabledRoles as role}
		<div
			class:tooltip={roles.find((findRole) => findRole.id == role)?.rules}
			data-tip={roles.find((findRole) => findRole.id == role)?.rules}
			class="w-full text-left"
		>
			<span
				class="font-bold text-{roles
					.find((findRole) => findRole.id == role)
					?.team.toLowerCase()}-500">{roles.find((findRole) => findRole.id == role)?.name}:</span
			>
			{roles.find((findRole) => findRole.id == role)?.description}
		</div>
	{/each}
	{#if currentUser?.primaryUser}
		<div class="flex justify-center">
			<button
				class="btn"
				on:click={endGame}
				class:btn-success={secondsLeftInRound <= 0 && room.currentRound === 1}>End game</button
			>
			<button
				class="btn"
				on:click={nextRound}
				disabled={secondsLeftInRound > 0 || room.currentRound === 1}>Next Round</button
			>
		</div>
	{/if}
{/if}

{#if room?.users}
	<table class="table table-xs text-center p-4 my-4">
		<thead>
			<tr>
				<th>Players</th>
				{#if room.gameState == 'Lobby'}
					<th>Role</th>
				{/if}
				{#if currentUser?.primaryUser}
					<th>Kick</th>
				{/if}
			</tr>
		</thead>
		<tbody>
			{#each room.users as user}
				<tr>
					<td class={user.disconnectedAt ? 'line-through' : ''}
						>{user.name}
						{user.primaryUser ? '👑' : ''}
					</td>
					{#if room.gameState == 'Lobby'}
						<td>{roles.find((role) => role.id == user.roleId)?.name ?? ''}</td>
					{/if}
					{#if currentUser?.primaryUser}
						<td>
							<button
								class="btn btn-xs"
								disabled={user.primaryUser}
								on:click={() => kickUser(user.id)}>❌</button
							>
						</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
