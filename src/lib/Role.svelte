<script lang="ts">
	import type { Role } from '@prisma/client';
	export let role: Role;
	let cardElement: HTMLElement;
	let textElement: HTMLElement;
	function colorShare() {
		cardElement.classList.remove('hidden');
	}
	function cardShare() {
		cardElement.classList.remove('hidden');
		textElement.classList.remove('hidden');
		document.body.addEventListener('touchend', shareDone, { once: true });
	}
	function shareDone() {
		textElement.classList.add('hidden');
		cardElement.classList.add('hidden');
	}
</script>

<div class="h-full w-full left-0 top-0 z-10">
	<div class="h-1/2 w-full p-4">
		<button
			class="btn w-full h-full"
			on:mousedown={colorShare}
			on:mouseup={shareDone}
			on:touchstart={colorShare}
			on:touchend={colorShare}>Color Share</button
		>
	</div>
	<div class="h-1/2 w-full p-4">
		<button
			class="btn w-full h-full"
			on:mousedown={cardShare}
			on:mouseup={shareDone}
			on:touchstart={cardShare}
			on:touchend={cardShare}>Card Share</button
		>
	</div>
</div>

<div
	bind:this={cardElement}
	class="w-screen h-screen bg-{role.team.toLowerCase()}-700 fixed top-0 left-0 hidden z-20 pointer-events-none"
>
	<div bind:this={textElement} class="hidden m-auto w-full text-center">
		<div class="text-8xl">{role.name}</div>
		<div>{role.description}</div>
		<div>{role?.rules ?? ''}</div>
	</div>
</div>
