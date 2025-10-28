<script lang="ts">
  import { isMenuOpen } from '$lib/stores/menuStore';
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import GridIcon from '$lib/components/icons/GridIcon.svelte';

  let headerEl: HTMLElement;

  function openMenu(): void {
    isMenuOpen.set(true);
  }

  $: if (headerEl) {
    gsap.to(headerEl, { 
      autoAlpha: $isMenuOpen ? 0 : 1, 
      duration: 0.3, 
      ease: 'power2.out' 
    });
  }
</script>

<header
  class="site-header"
  bind:this={headerEl}
  on:mouseenter={openMenu}
  on:focus={openMenu}
  role="button"
  tabindex="0"
>
  <a href="/" class="logo">ATAM STUDIO</a>
  <button class="menu-toggle" aria-label="Open menu">
    <GridIcon />
  </button>
</header>

<style>
  .site-header {
    position: fixed;
    top: var(--padding-global, 2rem);
    left: 50%;
    transform: translateX(-50%);
    width: 35.5%; 
    background-color: #1a1a1a;
    border-radius: 9999px;
    padding: 0.5rem 1.25rem;
    z-index: 110; 
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    color: #fff;
    gap: 1rem;
    opacity: 1;
    visibility: inherit;
  }
  
  .logo {
    font-size: 1.25rem;
    font-weight: 600;
    color: inherit;
  }
  
  .menu-toggle {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 8px; 
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>