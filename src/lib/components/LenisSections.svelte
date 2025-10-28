<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	let horizontalSection: HTMLDivElement;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		setTimeout(() => {
			const items = gsap.utils.toArray<HTMLElement>(".horizontal__item");

			gsap.to(items, {
				xPercent: -100 * (items.length - 1),
				ease: "none",
				scrollTrigger: {
					trigger: horizontalSection,
					pin: true,
					scrub: 1,
					start: "top top",
					snap: {
						snapTo: 1 / (items.length - 1),
						duration: 0.3,
						ease: "power1.inOut"
					},
					end: () => "+=" + horizontalSection.offsetWidth * 0.8
				}
			});

			ScrollTrigger.refresh();
		}, 100);

		return () => {
			ScrollTrigger.getAll().forEach(t => t.kill());
		};
	});
</script>

<!-- VERTICAL SECTION -->
<section class="vertical-section">
	<div class="container">
		<div class="vertical-wrapper">
			<!-- Sticky Left Column -->
			<div class="vertical-left">
				<h2 class="vertical-title">
					<span>About</span>
					<span>Smooth</span>
					<span>Scroll</span>
				</h2>
			</div>

			<!-- Scrollable Right Column -->
			<div class="vertical-right">
				<article class="vertical-item">
					<h3>Smooth Scroll Lenis</h3>
					<p>Lenis is an open-source library built to standardize scroll experiences and sauce up websites with butter-smooth navigation, all while using the platform and keeping it accessible.</p>
				</article>
				<article class="vertical-item">
					<h3>Seamless Integration</h3>
					<p>Works perfectly with GSAP ScrollTrigger to create stunning scroll-based animations. The combination provides precise control over animation timing and smooth interpolation.</p>
				</article>
				<article class="vertical-item">
					<h3>Performance First</h3>
					<p>Built with performance in mind, Lenis uses requestAnimationFrame for optimal rendering and provides a native-like scrolling experience across all devices and browsers.</p>
				</article>
				<article class="vertical-item">
					<h3>Developer Friendly</h3>
					<p>Simple API, extensive documentation, and active community support. Easy to integrate into any project, whether vanilla JS, React, Vue, or Svelte.</p>
				</article>
			</div>
		</div>
	</div>
</section>

<!-- HORIZONTAL SECTION - Sama kayak darkroom.engineering -->
<section class="horizontal-section" bind:this={horizontalSection}>
	<div class="horizontal-wrapper">
		<div class="horizontal__item">
			<div class="horizontal__num">1</div>
		</div>
		<div class="horizontal__item">
			<div class="horizontal__num">2</div>
		</div>
		<div class="horizontal__item">
			<div class="horizontal__num">3</div>
		</div>
		<div class="horizontal__item">
			<div class="horizontal__num">4</div>
		</div>
		<div class="horizontal__item">
			<div class="horizontal__num">5</div>
		</div>
	</div>
</section>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');

	/* ===== GLOBAL STYLES ===== */
	:global(body) {
		font-family: 'Inter', sans-serif;
		font-size: 16px;
		line-height: 1.6;
		background: #000;
		color: #fff;
		margin: 0;
		padding: 0;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	/* ===== TYPOGRAPHY ===== */
	h2, h3 {
		margin: 0;
		text-transform: uppercase;
		letter-spacing: -0.02em;
	}

	h2 {
		font-size: clamp(48px, 7vw, 80px);
		font-weight: 900;
		line-height: 0.9;
	}

	h3 {
		font-size: clamp(18px, 2.5vw, 24px);
		font-weight: 700;
		color: #ff98a2;
		margin-bottom: 1rem;
	}

	p {
		font-size: clamp(14px, 1.8vw, 16px);
		line-height: 1.7;
		color: rgba(255, 255, 255, 0.8);
		margin: 0;
	}

	/* ===== CONTAINER ===== */
	.container {
		width: min(90%, 1400px);
		margin: 0 auto;
		padding: 0 20px;
	}

	/* ===== VERTICAL SECTION ===== */
	.vertical-section {
		min-height: 200vh;
		padding: 100px 0;
	}

	.vertical-wrapper {
		display: flex;
		gap: clamp(40px, 8vw, 120px);
		align-items: flex-start;
	}

	.vertical-left {
		position: sticky;
		top: 100px;
		width: 45%;
		min-width: 300px;
	}

	.vertical-title {
		border-left: 4px solid #ff98a2;
		padding-left: 30px;
	}

	.vertical-title span {
		display: block;
		opacity: 0;
		animation: fadeInUp 0.6s ease forwards;
	}

	.vertical-title span:nth-child(1) { animation-delay: 0.1s; }
	.vertical-title span:nth-child(2) { animation-delay: 0.2s; }
	.vertical-title span:nth-child(3) { animation-delay: 0.3s; }

	.vertical-right {
		flex: 1;
		padding-bottom: 200px;
	}

	.vertical-item {
		margin-bottom: clamp(150px, 25vh, 300px);
		opacity: 0;
		animation: fadeInUp 0.8s ease forwards;
	}

	.vertical-item:nth-child(1) { animation-delay: 0.4s; }
	.vertical-item:nth-child(2) { animation-delay: 0.5s; }
	.vertical-item:nth-child(3) { animation-delay: 0.6s; }
	.vertical-item:nth-child(4) { animation-delay: 0.7s; }

	.vertical-item:last-child {
		margin-bottom: 0;
	}

	/* ===== HORIZONTAL SECTION - PERSIS KAYAK DARKROOM.ENGINEERING ===== */
	.horizontal-section {
		height: 100vh;
		overflow: hidden;
		position: relative;
	}

	.horizontal-wrapper {
		display: flex;
		height: 100%;
		will-change: transform;
	}

	.horizontal__item {
		min-width: 100vw;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		border-right: 1px solid rgba(255, 255, 255, 0.1);
		flex-shrink: 0;
		position: relative;
	}

	/* Nomor besar aja - persis kayak website asli */
	.horizontal__num {
		font-size: clamp(120px, 20vw, 300px);
		font-weight: 900;
		line-height: 1;
		color: #ff98a2;
		opacity: 0.9;
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.05em;
	}

	/* ===== ANIMATIONS ===== */
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* ===== RESPONSIVE ===== */
	@media (max-width: 1024px) {
		.vertical-wrapper {
			flex-direction: column;
		}

		.vertical-left {
			position: relative;
			top: 0;
			width: 100%;
			margin-bottom: 60px;
		}

		.vertical-right {
			padding-bottom: 100px;
		}
	}

	@media (max-width: 768px) {
		.vertical-section {
			padding: 60px 0;
		}

		.vertical-title {
			border-left-width: 3px;
			padding-left: 20px;
		}

		.vertical-item {
			margin-bottom: 120px;
		}
	}
</style>