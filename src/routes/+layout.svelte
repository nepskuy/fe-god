<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import Lenis from "lenis";
	import { onMount } from "svelte";
	import { gsap } from "gsap";
	import { ScrollTrigger } from "gsap/ScrollTrigger";
	import Header from "$lib/components/layout/Header.svelte";
	import MenuOverlay from "$lib/components/layout/MenuOverlay.svelte";
	import "$lib/styles/global.css";
	
	let lenis: Lenis;
	
	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);
		
		lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true,
			smoothTouch: false
		});
		
		function raf(time: number) {
			lenis.raf(time);
			ScrollTrigger.update();
			requestAnimationFrame(raf);
		}
		
		requestAnimationFrame(raf);
		
		// Cleanup ketika component unmount
		return () => {
			lenis.destroy();
		};
	});
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Navy Gibran</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<Header />
<MenuOverlay />

<main>
	{@render children?.()}
</main>