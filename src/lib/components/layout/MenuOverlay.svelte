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
    { title: 'ABOUT', href: '/about' },
    { title: 'PROJECTS', href: '/projects' },
    { title: 'SKILLS', href: '/skills' },
    { title: 'CONTACT', href: '/contact' },
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
      <a href="/" class="logo" on:click={closeMenu}>NAVY GIBRAN</a>
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
      <div class="footer-content">
        <div class="footer-info">
          <span class="footer-title">Full-Stack Developer</span>
          <span class="footer-subtitle">Crafting digital experiences</span>
        </div>
        <a href="mailto:hello@navygibran.com" class="contact-link">GET IN TOUCH</a>
      </div>
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
    background: rgba(0, 0, 0, 0.8);
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
    background-color: rgba(15, 15, 15, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    color: #fff;
    opacity: 0;
  }

  .menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    opacity: 0;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .logo {
    font-size: 1.25rem;
    font-weight: 600;
    text-decoration: none;
    color: #fff;
    letter-spacing: -0.5px;
  }

  .menu-toggle {
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    padding: 8px;
    transition: opacity 0.3s ease;
  }

  .menu-toggle:hover {
    opacity: 0.7;
  }

  .menu-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2rem 0;
  }

  .menu-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .menu-links li {
    opacity: 0;
  }

  .menu-links a {
    font-size: 2.5rem;
    font-weight: 600;
    color: #fff;
    text-decoration: none;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 1rem;
    letter-spacing: -1px;
  }

  .menu-links a:hover {
    color: #64ffda;
    transform: translateX(8px);
  }

  .nav-number {
    font-size: 0.875rem;
    color: #64ffda;
    font-weight: 400;
    opacity: 0.7;
  }

  .menu-footer {
    width: 100%;
    opacity: 0;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .footer-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .footer-title {
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
  }

  .footer-subtitle {
    font-size: 0.875rem;
    color: #888;
    font-weight: 400;
  }

  .contact-link {
    font-size: 1rem;
    font-weight: 500;
    color: #64ffda;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border: 1px solid #64ffda;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .contact-link:hover {
    background-color: rgba(100, 255, 218, 0.1);
    transform: translateY(-2px);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .menu-card {
      padding: 1.5rem 1.5rem;
      max-width: 90vw;
      height: 85vh;
      max-height: 600px;
    }
    
    .menu-links a {
      font-size: 2rem;
    }
    
    .footer-content {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }
    
    .contact-link {
      align-self: flex-start;
    }
  }

  @media (max-width: 480px) {
    .menu-links a {
      font-size: 1.75rem;
    }
    
    .menu-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }
    
    .menu-toggle {
      align-self: flex-end;
      margin-top: -3rem;
    }
  }
</style>