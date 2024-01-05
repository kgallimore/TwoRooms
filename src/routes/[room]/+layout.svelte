<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div class="p-3 max-w-5xl m-auto">
	<slot />
</div>
