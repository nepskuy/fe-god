<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	const totalFrames = 121;
	const pathForLeftHand = 'hand/left-mb/';
	const pathForRightHand = 'hand/right-mb/';
	const scrollDuration = '+=1500px';
	const scrubValue = 1.5; 

	let leftImgEl: HTMLImageElement;
	let rightImgEl: HTMLImageElement;
	let containerEl: HTMLDivElement;
	let loading = true;

	const imagesForLeftHand: HTMLImageElement[] = [];
	const imagesForRightHand: HTMLImageElement[] = [];

	const frame = { current: 0 };

	function formatFrame(frameNumber: number): string {
		return frameNumber.toString().padStart(3, '0');
	}

	function preloadImage(src: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.src = src;
			img.onload = () => resolve(img);
			img.onerror = reject;
		});
	}

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const imagePromises: Promise<HTMLImageElement>[] = [];
		for (let i = 1; i <= totalFrames; i++) {
			const leftSrc = `${pathForLeftHand}${formatFrame(i)}.webp`;
			const rightSrc = `${pathForRightHand}${formatFrame(i)}.webp`;

			imagePromises.push(
				preloadImage(leftSrc).then((img) => {
					imagesForLeftHand.push(img);
					return img;
				})
			);
			imagePromises.push(
				preloadImage(rightSrc).then((img) => {
					imagesForRightHand.push(img);
					return img;
				})
			);
		}

		Promise.all(imagePromises).then(() => {
			loading = false;

			if (leftImgEl && rightImgEl && imagesForLeftHand[0] && imagesForRightHand[0]) {
				leftImgEl.src = imagesForLeftHand[0].src;
				rightImgEl.src = imagesForRightHand[0].src;
			}

			// Animasi 1: Frame Sequence
			gsap.to(frame, {
				current: totalFrames - 1,
				ease: 'none', // Ease tidak perlu di sini
				scrollTrigger: {
					trigger: containerEl,
					start: 'top top',
					end: scrollDuration, // Gunakan variabel
					pin: true,
					scrub: scrubValue, // Gunakan variabel
					anticipatePin: 1
				},
				onUpdate: () => {
					// --- PERBAIKAN: Kembali ke Math.round() ---
					const frameIndex = Math.round(frame.current);
					if (imagesForLeftHand[frameIndex] && imagesForRightHand[frameIndex] && leftImgEl && rightImgEl) {
						leftImgEl.src = imagesForLeftHand[frameIndex].src;
						rightImgEl.src = imagesForRightHand[frameIndex].src;
					}
				}
			});

			// Animasi 2: Posisi, Skala, Rotasi + Teks
			setupScrollAnimations();
		});
	});

	function setupScrollAnimations() {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: containerEl,
				start: 'top top',
				end: scrollDuration, // Gunakan variabel
				scrub: scrubValue    // Gunakan variabel
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
				// Hapus ease, biarkan scrub yang mengatur
				// Hapus duration agar sinkron dengan scrub
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
				// Hapus ease
				// Hapus duration
			},
			'<'
		);

		// Animasi Teks (Bisa tambahkan ease jika mau, tapi tidak wajib)
		tl.to('.text-1', { autoAlpha: 1 }, '0.1')
			.to('.text-1', { autoAlpha: 0 }, '0.3')
			.to('.text-2', { autoAlpha: 1 }, '0.4')
			.to('.text-2', { autoAlpha: 0 }, '0.6')
			.to('.text-3', { autoAlpha: 1 }, '0.7')
			.to('.text-3', { autoAlpha: 0 }, '0.9');
	}
</script>

{#if loading}
	<div class="loading-screen">
		<p>Loading assets...</p>
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
	/>

	<img
		class="hand-image"
		id="right-hand"
		src=""
		alt="Right Hand Animation"
		bind:this={rightImgEl}
	/>
</div>

<style>
	:global(body) {
		background-color: #000;
		color: #fff;
		font-family: serif;
		/* Mencegah scroll horizontal jika gambar sedikit keluar */
		overflow-x: hidden;
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
		z-index: 100;
	}

	.animation-container {
		height: 100vh;
		width: 100%;
		position: sticky;
		top: 0;
		overflow: hidden;
	}

	.hand-image {
		position: absolute;
		width: 45vw;
		max-width: 450px;
		height: auto;
		/* --- TAMBAHAN: Optimasi Performa --- */
		will-change: transform, opacity;
		/* Mencegah blur pada beberapa browser saat transform */
		backface-visibility: hidden;
		transform-style: preserve-3d;
		/* --- AKHIR TAMBAHAN --- */
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
	}

	.text-overlay h1 {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		margin: 0;
		font-size: 3rem;
		opacity: 0;
		visibility: hidden;
		will-change: opacity;
	}
</style>