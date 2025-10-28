declare module 'lenis' {
	export interface LenisOptions {
		autoRaf?: boolean;
		lerp?: number;
		duration?: number;
		easing?: (t: number) => number;
		smoothWheel?: boolean;
		wheelMultiplier?: number;
		smoothTouch?: boolean;
		touchMultiplier?: number;
		orientation?: 'vertical' | 'horizontal';
		gestureOrientation?: 'vertical' | 'horizontal' | 'both';
		infinite?: boolean;
		wrapper?: Window | HTMLElement;
		content?: HTMLElement;
		prevent?: (node: Element) => boolean;
		virtualScroll?: boolean;
		overscroll?: boolean;
	}

	export default class Lenis {
		constructor(options?: LenisOptions);
		on(event: string, callback: (e: any) => void): void;
		raf(time: number): void;
		scrollTo(
			target: number | string | HTMLElement,
			options?: {
				offset?: number;
				lerp?: number;
				duration?: number;
				easing?: (t: number) => number;
				immediate?: boolean;
				lock?: boolean;
				force?: boolean;
				onComplete?: () => void;
			}
		): void;
		stop(): void;
		start(): void;
		destroy(): void;
		scroll: number;
		limit: number;
		velocity: number;
		direction: number;
		progress: number;
		isScrolling: boolean;
		isStopped: boolean;
		isSmooth: boolean;
		isLocked: boolean;
	}
}