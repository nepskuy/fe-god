<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import "../app.css";
	import Lenis from "lenis";
	import "lenis/dist/lenis.css";
	import { onMount } from "svelte";
	import gsap from "gsap";
	import { ScrollTrigger } from "gsap/ScrollTrigger";
	import Header from "$lib/components/layout/Header.svelte";
	import MenuOverlay from "$lib/components/layout/MenuOverlay.svelte";
	import "$lib/styles/global.css"; // Import global styles

	let lenis: Lenis;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		lenis = new Lenis({
			duration: 1.8,
			easing: (t) => {
				return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
			},
			orientation: "vertical",
			gestureOrientation: "vertical",
			smoothWheel: true,
			wheelMultiplier: 0.8,
			smoothTouch: false,
			touchMultiplier: 1.5,
			infinite: false,
			autoRaf: false,
		});

		lenis.on("scroll", ScrollTrigger.update);
		gsap.ticker.add((time) => {
			lenis.raf(time * 1000);
		});
		gsap.ticker.lagSmoothing(0);

		return () => {
			gsap.ticker.remove(lenis.raf);
			lenis.destroy();
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	});

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>A-TAMS Wedding Organizer</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<Header />
<MenuOverlay />
<main>
	{@render children?.()}
</main>

<style>
	:global(html) {
		overflow-x: hidden;
	}

	:global(html.lenis, html.lenis body) {
		height: auto;
	}

	:global(.lenis.lenis-smooth) {
		scroll-behavior: auto !important;
	}

	:global(.lenis.lenis-smooth [data-lenis-prevent]) {
		overscroll-behavior: contain;
	}

	:global(.lenis.lenis-stopped) {
		overflow: hidden;
	}

	:global(.lenis.lenis-smooth iframe) {
		pointer-events: none;
	}

	main {
		position: relative;
		width: 100%;
		z-index: 1; /* <--- TAMBAHKAN INI */

	}
</style>
