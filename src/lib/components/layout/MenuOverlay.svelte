<script lang="ts">
  import { onMount } from 'svelte';
  import { isMenuOpen } from '$lib/stores/menuStore';
  import { gsap } from 'gsap';
  
  import TwoDotIcon from '$lib/components/icons/TwoDotIcon.svelte';

  interface MenuItem {
    title: string;
    href: string;
  }
  const menuItems: MenuItem[] = [
    { title: 'HOME', href: '/' },
    { title: 'SERVICES', href: '/services' },
    { title: 'CASE STUDIES', href: '/case-studies' },
    { title: 'FINTECH EXPERTISE', href: '/fintech' },
    { title: "LET'S CONNECT", href: '/connect' },
  ];

  let overlayEl: HTMLElement;
  let menuCardEl: HTMLElement;
  let menuHeaderEl: HTMLElement;
  let menuLinks: HTMLElement[] = [];
  let menuFooterEl: HTMLElement;
  let timeline: gsap.core.Timeline;

  function closeMenu(): void {
    isMenuOpen.set(false);
  }

  function handleFocusOut(event: FocusEvent): void {
    if (event.relatedTarget && overlayEl.contains(event.relatedTarget as Node)) {
      return;
    }
    closeMenu();
  }

  onMount(() => {
    timeline = gsap.timeline({
      paused: true,
      onStart: () => {
        if (overlayEl) overlayEl.style.display = 'flex';
      },
      onReverseComplete: () => {
        if (overlayEl) overlayEl.style.display = 'none';
      },
    });

    timeline.fromTo(
      overlayEl,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.5, ease: 'power2.inOut' }
    );

    timeline.fromTo(
      menuCardEl,
      { yPercent: -50, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' },
      '-=0.3'
    );

    timeline.fromTo(
      menuHeaderEl,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.4'
    );

    timeline.fromTo(
      menuLinks,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.07,
      },
      '-=0.3'
    );

    timeline.fromTo(
      menuFooterEl,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.2'
    );
  });

  $: if (timeline) {
    if ($isMenuOpen) {
      timeline.timeScale(1).play();
    } else {
      timeline.timeScale(0.8).reverse();
    }
  }
</script>

<nav
  class="menu-overlay"
  bind:this={overlayEl}
  style="display: none;"
  on:mouseleave={closeMenu}
  on:focusout={handleFocusOut}
>
  <div class="menu-card" bind:this={menuCardEl}>
    
    <div class="menu-header" bind:this={menuHeaderEl}>
      <a href="/" class="logo" on:click={closeMenu}>ATAM STUDIO</a>
      <button on:click={closeMenu} class="menu-toggle" aria-label="Close menu">
        <TwoDotIcon />
      </button>
    </div>

    <div class="menu-content">
      <ul class="menu-links">
        {#each menuItems as item, i}
          <li bind:this={menuLinks[i]}>
            <a href={item.href} on:click={closeMenu}>
              {item.title}
              <span class="nav-number">0{i + 1}</span>
            </a>
          </li>
        {/each}
      </ul>
    </div>

    <footer class="menu-footer" bind:this={menuFooterEl}>
      <a href="/book-intro" on:click={closeMenu}>BOOK AN INTRO</a>
    </footer>
  </div>
</nav>

<style>
  .menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    height: 100svh;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--padding-global, 2rem);
    box-sizing: border-box;
  }

  .menu-card {
    width: 100%;
    max-width: 640px; 
    height: 90vh;
    max-height: 800px; 
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1.5rem 3rem; 
    box-sizing: border-box;
    background-color: rgba(20, 20, 20, 0.7);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    color: #fff;
    opacity: 0;
  }

  .menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    opacity: 0;
  }

  .logo {
    font-size: 1.25rem;
    font-weight: 600;
    text-decoration: none;
    color: #fff;
  }

  .menu-toggle {
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    padding: 8px;
  }

  .menu-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1rem 0;
  }

  .menu-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
  }

  .menu-links li {
    opacity: 0;
  }

  .menu-links a {
    font-size: 2.25rem;
    font-weight: 500;
    color: #fff;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .menu-links a:hover {
    color: #aaa;
  }

  .nav-number {
    font-size: 0.75rem;
    color: #888;
    margin-left: 0.5rem;
    font-weight: 300;
  }

  .menu-footer {
    width: 100%;
    text-align: left;
    opacity: 0;
    padding-top: 2rem; 
  }

  .menu-footer a {
    font-size: 1.5rem;
    font-weight: 500;
    color: #fff;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .menu-footer a:hover {
    color: #aaa;
  }

  /* 7. Query Responsif */
  @media (max-width: 768px) {
    .menu-card {
      padding: 1.5rem 1.5rem;
      max-width: 90vw;
      height: 85vh;
    }
    .menu-links a {
      font-size: 1.75rem;
    }
    .menu-footer a {
      font-size: 1.25rem;
    }
  }
</style>