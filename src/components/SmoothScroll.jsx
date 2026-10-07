import { useEffect } from 'react';
import Lenis from 'lenis';

const SmoothScroll = () => {
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return undefined;

        const lenis = new Lenis({
            duration: 1.5, // Increased duration for more "delay" and smoothness
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.3, // Slightly reduced multiplier for more control
            smoothTouch: true,
            touchMultiplier: 0.2,
            infinite: false,
            lerp: 0.002, // Lower lerp value makes the scroll more "delayed" and smooth
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
