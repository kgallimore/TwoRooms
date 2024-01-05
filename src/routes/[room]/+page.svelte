<script lang="ts">
	import type { PageData } from './$types';
	import Join from '$lib/Join.svelte';
	import { page } from '$app/stores';

	export let data: PageData;
</script>

<Join room={$page.params?.room} />

{#if data.room?.users}
	<table class="table table-xs text-center p-4 my-4">
		<thead>
			<tr>
				<th>Players</th>
			</tr>
		</thead>
		<tbody>
			{#each data.room.users as user}
				<tr>
					<td>{user.name} {user.primaryUser ? '👑' : ''}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
