import { useEffect } from 'react';
import Lenis from 'lenis';

const SmoothScroll = () => {
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return undefined;

        const lenis = new Lenis({
            duration: 0.8,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            smoothTouch: true,
            touchMultiplier: 1,
            infinite: false,
        });

        let frameId;
        function raf(time) {
            lenis.raf(time);
            frameId = requestAnimationFrame(raf);
        }

        frameId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(frameId);
            lenis.destroy();
        };
    }, []);

    return null;
};

export default SmoothScroll;
