<script lang="ts">
	import { onMount } from 'svelte';
	import { generateScramble } from '$lib/scramble';
	import { Copy, Lock, RefreshCcw } from 'lucide-svelte';

	let timeString = $state('0.00');
	let startTime = $state(0);
	let isStopped = $state(true);

	let scramble = $state(generateScramble());

	let isScrambleLocked = $state(false);

	let record = $state(0);

	function setTimeString(millis: number) {
		timeString = (millis / 1000).toFixed(2);
	}

	function timerLoop() {
		if (isStopped) {
			return;
		}
		setTimeString(Date.now() - startTime);
		requestAnimationFrame(timerLoop);
	}

	function startTimer() {
		timeString = '0.00';
		startTime = Date.now();
		isStopped = false;
		timerLoop();
	}

	function stopTimer() {
		record = Date.now() - startTime;
		setTimeString(record);
		isStopped = true;
	}

	// FIXME: Very messy code
	let preStart = $state(false);
	let isSpacePressed = $state(false);
	let ignoreNextPress = $state(false);

	onMount(() => {
		onkeydown = (event) => {
			if (ignoreNextPress) {
				return;
			}
			if (event.key === ' ') {
				isSpacePressed = true;
				if (isStopped) {
					preStart = true;
				} else {
					stopTimer();
					ignoreNextPress = true;
				}
			}
		};
		onkeyup = (event) => {
			if (ignoreNextPress) {
				ignoreNextPress = false;
				return;
			}
			isSpacePressed = false;
			if (event.key === ' ') {
				if (preStart) {
					startTimer();
				}
				preStart = false;
			}
		};
	});
</script>

<div class="flex flex-col justify-center items-center w-full h-full container timer">
	<p class="text-lg">{scramble}</p>
	<div class="container flex flex-row justify-center items-center m-3 gap-5">
		<button
			class="rounded p-1"
			title="copy scramble to clipboard"
			onclick={() => {
				navigator.clipboard.writeText(scramble);
			}}><Copy size={18} /></button
		>
		<button
			class="rounded p-1"
			title="get new scramble"
			onclick={() => {
				if (!isScrambleLocked && isStopped) {
					scramble = generateScramble();
				}
				console.log(scramble);
			}}><RefreshCcw size={18} /></button
		>
		<button
			class="rounded p-1 {isScrambleLocked ? 'bg-blue-500' : ''}"
			title="lock scramble (prevents regeneration)"
			onclick={() => {
				isScrambleLocked = !isScrambleLocked;
			}}><Lock size={18} /></button
		>
	</div>
	<h3 class="text-8xl {preStart ? 'text-red-500' : 'green'}">{timeString}</h3>
</div>
