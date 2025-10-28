<script lang="ts">
    import { onMount } from "svelte";
    import { gsap } from "gsap";

    let heroEl: HTMLElement;
    let mediaItems: HTMLElement[] = [];
    let xQuickTos: Array<(value: number) => void> = [];
    let yQuickTos: Array<(value: number) => void> = [];

    onMount(() => {
        mediaItems = Array.from(heroEl.querySelectorAll(".hero-media-item"));

        mediaItems.forEach((item) => {
            xQuickTos.push(
                gsap.quickTo(item, "x", { duration: 0.7, ease: "power3.out" }),
            );
            yQuickTos.push(
                gsap.quickTo(item, "y", { duration: 0.7, ease: "power3.out" }),
            );
        });

        heroEl.addEventListener("mousemove", handleMouseMove);

        mediaItems.forEach((item) => {
            item.addEventListener("mouseenter", handleHoverStart);
            item.addEventListener("mouseleave", handleHoverEnd);
        });

        return () => {
            heroEl.removeEventListener("mousemove", handleMouseMove);
            mediaItems.forEach((item) => {
                item.removeEventListener("mouseenter", handleHoverStart);
                item.removeEventListener("mouseleave", handleHoverEnd);
            });
        };
    });

    function handleMouseMove(event: MouseEvent) {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;

        xQuickTos.forEach((qTo, i) => {
            const depth = parseFloat(mediaItems[i].dataset.depth || "0.1");
            qTo(-x * depth * 400);
        });

        yQuickTos.forEach((qTo, i) => {
            const depth = parseFloat(mediaItems[i].dataset.depth || "0.1");
            qTo(-y * depth * 400);
        });
    }

    function handleHoverStart(event: Event) {
        const currentItem = event.currentTarget as HTMLElement;
        mediaItems.forEach((item) => {
            if (item !== currentItem) {
                item.classList.add("is-blurred");
            }
        });
    }

    function handleHoverEnd() {
        mediaItems.forEach((item) => {
            item.classList.remove("is-blurred");
        });
    }
</script>

<section class="hero-container" bind:this={heroEl}>
    <div class="hero-content">
        <h1 class="hero-title">
            Turn your vision into<br />
            a remarkable <span class="text-accent">brand,</span><br />
            <span class="text-accent">website or ai product</span>
        </h1>
        <p class="hero-subtitle">
            A decade of proven results for startups scaling from Series A to
            unicorn
        </p>
        <button class="start-button">START HERE</button>
    </div>

    <div
        class="hero-media-item"
        style="top: 5%; left: 10%; width: 12rem;"
        data-depth="0.1"
    >
        <img src="https://picsum.photos/id/101/300/400" alt="Abstract Blue" />
    </div>

    <div
        class="hero-media-item"
        style="top: 15%; right: 8%; width: 15rem;"
        data-depth="0.15"
    >
        <img src="https://picsum.photos/id/10/400/300" alt="Asteroid" />
    </div>

    <div
        class="hero-media-item"
        style="bottom: 10%; left: 5%; width: 18rem;"
        data-depth="0.08"
    >
        <img src="https://picsum.photos/id/111/400/300" alt="Seen Card" />
    </div>

    <div
        class="hero-media-item"
        style="bottom: 12%; right: 10%; width: 14rem;"
        data-depth="0.12"
    >
        <img src="https://picsum.photos/id/21/300/300" alt="Laptop" />
    </div>

    <div
        class="hero-media-item"
        style="bottom: 20%; left: 30%; width: 10rem;"
        data-depth="0.2"
    >
        <img src="https://picsum.photos/id/31/300/300" alt="Tennis" />
    </div>

    <div
        class="hero-media-item"
        style="top: 60%; right: 30%; width: 10rem;"
        data-depth="0.1"
    >
        <img src="https://picsum.photos/id/321/300/300" alt="Donut" />
    </div>
</section>

<style>
    .hero-container {
        position: relative;
        min-height: 100vh;
        width: 100%;
        background-color: #000;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    .hero-content {
        position: relative;
        z-index: 10;
        text-align: center;
        display: grid;
        gap: 1.5rem;
        padding: 2rem;
    }

    .hero-title {
        font-size: clamp(2.5rem, 5vw, 4rem);
        font-weight: 600;
        line-height: 1.2;
        color: #fff;
    }

    .text-accent {
        color: #f0f; /* Pink/Magenta */
    }

    .hero-subtitle {
        font-size: 1rem;
        max-width: 400px;
        margin: 0 auto;
        color: #aaa;
    }

    .start-button {
        background-color: #fff;
        color: #000;
        border: none;
        padding: 0.75rem 1.5rem;
        font-size: 0.9rem;
        font-weight: 600;
        border-radius: 99px;
        cursor: pointer;
        justify-self: center;
        transition: transform 0.3s ease;
    }

    .start-button:hover {
        transform: scale(1.05);
    }

    .hero-media-item {
        position: absolute;
        border-radius: 12px;
        overflow: hidden;
        will-change: transform, filter, opacity;
        /* Transisi untuk semua properti */
        transition:
            filter 0.5s cubic-bezier(0.23, 1, 0.32, 1),
            opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1),
            transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    }

    .hero-media-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    :global(.hero-media-item.is-blurred) {
        filter: blur(4px);
        opacity: 0.5;
        transform: scale(0.95);
    }

    .hero-media-item:hover {
        transform: scale(1.05);
        z-index: 20;
    }
</style>
