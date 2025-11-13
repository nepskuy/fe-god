<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	// Constants
	const totalFrames = 121;
	const pathForLeftHand = 'hand/left-mb/';
	const pathForRightHand = 'hand/right-mb/';
	const scrollDuration = '+=1500px';
	const scrubValue = 1.5;

	// Elements
	let leftImgEl: HTMLImageElement;
	let rightImgEl: HTMLImageElement;
	let containerEl: HTMLDivElement;
	
	// State
	let loading = true;
	let loadProgress = 0;
	let imagesLoaded = 0;
	const totalImages = totalFrames * 2;

	const imagesForLeftHand: HTMLImageElement[] = [];
	const imagesForRightHand: HTMLImageElement[] = [];

	const frame = { current: 0 };

	// Format frame number dengan leading zeros
	function formatFrame(frameNumber: number): string {
		return frameNumber.toString().padStart(3, '0');
	}

	// Improved preload function dengan timeout dan retry
	function preloadImage(src: string, retries = 3): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			let retryCount = 0;

			const attemptLoad = () => {
				img.src = src;

				const timeoutId = setTimeout(() => {
					if (retryCount < retries) {
						retryCount++;
						console.warn(`Retrying image load: ${src} (attempt ${retryCount})`);
						attemptLoad();
					} else {
						reject(new Error(`Timeout loading image: ${src}`));
					}
				}, 5000);

				img.onload = () => {
					clearTimeout(timeoutId);
					imagesLoaded++;
					loadProgress = Math.round((imagesLoaded / totalImages) * 100);
					resolve(img);
				};

				img.onerror = () => {
					clearTimeout(timeoutId);
					if (retryCount < retries) {
						retryCount++;
						console.warn(`Retrying image load: ${src} (attempt ${retryCount})`);
						attemptLoad();
					} else {
						reject(new Error(`Failed to load image: ${src}`));
					}
				};
			};

			attemptLoad();
		});
	}

	// Preload semua gambar
	async function preloadAllImages(): Promise<void> {
		const imagePromises: Promise<HTMLImageElement>[] = [];
		
		// Reset state
		imagesLoaded = 0;
		loadProgress = 0;
		imagesForLeftHand.length = 0;
		imagesForRightHand.length = 0;

		for (let i = 1; i <= totalFrames; i++) {
			const leftSrc = `${pathForLeftHand}${formatFrame(i)}.webp`;
			const rightSrc = `${pathForRightHand}${formatFrame(i)}.webp`;

			imagePromises.push(
				preloadImage(leftSrc)
					.then((img) => {
						imagesForLeftHand.push(img);
						return img;
					})
					.catch((error) => {
						console.error(`Failed to load left hand frame ${i}:`, error);
						// Buat placeholder image untuk frame yang gagal
						const placeholder = new Image();
						placeholder.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMyIvPjwvc3ZnPg==';
						imagesForLeftHand.push(placeholder);
						return placeholder;
					})
			);

			imagePromises.push(
				preloadImage(rightSrc)
					.then((img) => {
						imagesForRightHand.push(img);
						return img;
					})
					.catch((error) => {
						console.error(`Failed to load right hand frame ${i}:`, error);
						const placeholder = new Image();
						placeholder.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMyIvPjwvc3ZnPg==';
						imagesForRightHand.push(placeholder);
						return placeholder;
					})
			);
		}

		await Promise.allSettled(imagePromises);
	}

	// Setup animations setelah semua gambar loaded
	function setupAnimations(): void {
		// Pastikan ada gambar yang berhasil di-load
		if (imagesForLeftHand.length === 0 || imagesForRightHand.length === 0) {
			console.error('No images loaded successfully');
			loading = false;
			return;
		}

		// Set initial images
		if (leftImgEl && rightImgEl) {
			leftImgEl.src = imagesForLeftHand[0].src;
			rightImgEl.src = imagesForRightHand[0].src;
		}

		// Animasi 1: Frame Sequence dengan optimasi
		gsap.to(frame, {
			current: totalFrames - 1,
			ease: 'none',
			scrollTrigger: {
				trigger: containerEl,
				start: 'top top',
				end: scrollDuration,
				pin: true,
				scrub: scrubValue,
				anticipatePin: 1,
				onRefresh: () => ScrollTrigger.update()
			},
			onUpdate: () => {
				const frameIndex = Math.round(frame.current);
				if (frameIndex >= 0 && frameIndex < totalFrames) {
					if (imagesForLeftHand[frameIndex] && leftImgEl) {
						leftImgEl.src = imagesForLeftHand[frameIndex].src;
					}
					if (imagesForRightHand[frameIndex] && rightImgEl) {
						rightImgEl.src = imagesForRightHand[frameIndex].src;
					}
				}
			}
		});

		// Animasi 2: Posisi, Skala, Rotasi + Teks
		setupScrollAnimations();
	}

	function setupScrollAnimations(): void {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: containerEl,
				start: 'top top',
				end: scrollDuration,
				scrub: scrubValue,
				onRefresh: () => ScrollTrigger.update()
			}
		});

		// Tangan KIRI
		tl.to(
			'#left-hand',
			{
				top: '52%',
				left: '6%',
				rotation: -65,
				scale: 2.2,
				autoAlpha: 1
			},
			'<'
		);

		// Tangan KANAN
		tl.to(
			'#right-hand',
			{
				top: '12%',
				left: '55%',
				rotation: -25,
				scale: 2.2,
				autoAlpha: 1
			},
			'<'
		);

		// Animasi Teks dengan timing yang lebih smooth
		tl.to('.text-1', { 
			autoAlpha: 1,
			duration: 0.1 
		}, '0.1')
		.to('.text-1', { 
			autoAlpha: 0,
			duration: 0.1 
		}, '0.3')
		.to('.text-2', { 
			autoAlpha: 1,
			duration: 0.1 
		}, '0.4')
		.to('.text-2', { 
			autoAlpha: 0,
			duration: 0.1 
		}, '0.6')
		.to('.text-3', { 
			autoAlpha: 1,
			duration: 0.1 
		}, '0.7')
		.to('.text-3', { 
			autoAlpha: 0,
			duration: 0.1 
		}, '0.9');
	}

	// Cleanup function
	function cleanup(): void {
		if (ScrollTrigger) {
			ScrollTrigger.getAll().forEach(trigger => trigger.kill());
		}
		if (gsap) {
			gsap.killTweensOf(frame);
		}
	}

	onMount(async () => {
		gsap.registerPlugin(ScrollTrigger);

		try {
			await preloadAllImages();
			
			// Beri sedikit delay untuk memastikan DOM sudah siap
			requestAnimationFrame(() => {
				loading = false;
				setupAnimations();
			});
		} catch (error) {
			console.error('Error during initialization:', error);
			loading = false;
			
			// Fallback: tetap setup animations meski ada error
			setTimeout(() => {
				setupAnimations();
			}, 100);
		}

		return () => {
			cleanup();
		};
	});
</script>

<!-- HAPUS svelte:head yang bermasalah -->
{#if loading}
	<div class="loading-screen">
		<div class="loading-content">
			<p>Loading assets...</p>
			<div class="progress-bar">
				<div class="progress-fill" style="width: {loadProgress}%"></div>
			</div>
			<p>{loadProgress}%</p>
		</div>
	</div>
{/if}

<div class="animation-container" bind:this={containerEl}>
	<div class="text-overlay">
		<h1 class="text-1">TRANSCEND THE FRICTION OF MANAGEMENT</h1>
		<h1 class="text-2">UNLEASH YOUR COMMUNITY'S MOMENTUM</h1>
		<h1 class="text-3">ARRIVE AT THE SINGULARITY</h1>
	</div>

	<img
		class="hand-image"
		id="left-hand"
		src=""
		alt="Left Hand Animation"
		bind:this={leftImgEl}
		loading="eager"
	/>

	<img
		class="hand-image"
		id="right-hand"
		src=""
		alt="Right Hand Animation"
		bind:this={rightImgEl}
		loading="eager"
	/>
</div>

<style>
	:global(body) {
		background-color: #000;
		color: #fff;
		font-family: serif;
		overflow-x: hidden;
		margin: 0;
		padding: 0;
	}

	:global(html) {
		scroll-behavior: smooth;
	}

	.loading-screen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #000;
		z-index: 1000;
	}

	.loading-content {
		text-align: center;
		width: 300px;
	}

	.progress-bar {
		width: 100%;
		height: 4px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 2px;
		margin: 20px 0;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: #fff;
		transition: width 0.3s ease;
		border-radius: 2px;
	}

	.animation-container {
		height: 100vh;
		width: 100%;
		position: sticky;
		top: 0;
		overflow: hidden;
		/* Optimasi GPU */
		transform: translateZ(0);
		backface-visibility: hidden;
		perspective: 1000;
	}

	.hand-image {
		position: absolute;
		width: 45vw;
		max-width: 450px;
		height: auto;
		/* Optimasi performa */
		will-change: transform, opacity;
		backface-visibility: hidden;
		transform: translateZ(0);
		image-rendering: -webkit-optimize-contrast;
		image-rendering: crisp-edges;
	}

	#left-hand {
		top: 10%;
		left: -10%;
		transform: scale(0.7) rotate(-60deg);
		opacity: 0;
	}

	#right-hand {
		top: 85%;
		left: 75%;
		transform: scale(0.7) rotate(60deg);
		opacity: 0;
	}

	.text-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 10;
		text-align: center;
		width: 80%;
		pointer-events: none;
	}

	.text-overlay h1 {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		margin: 0;
		font-size: clamp(2rem, 4vw, 3rem);
		opacity: 0;
		visibility: hidden;
		will-change: opacity;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
	}

	/* Media queries untuk responsive */
	@media (max-width: 768px) {
		.hand-image {
			width: 60vw;
			max-width: none;
		}

		.text-overlay h1 {
			font-size: clamp(1.5rem, 5vw, 2.5rem);
		}

		#left-hand {
			left: -15%;
		}

		#right-hand {
			left: 70%;
		}
	}

	@media (max-width: 480px) {
		.hand-image {
			width: 70vw;
		}

		.text-overlay h1 {
			font-size: clamp(1.2rem, 6vw, 2rem);
		}
	}
</style>