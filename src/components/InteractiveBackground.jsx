import { motion } from 'framer-motion';

const InteractiveBackground = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden bg-[#02040a]">


            {/* ===== ZERO-BLUR ATMOSPHERIC CLOUD LAYERS (PERFORMANCE OPTIMIZED) ===== */}
            {/* Cloud 1 - Deep Cyan, base layer */}
            <motion.div
                animate={{ x: [0, 40, -20, 0], y: [0, -30, 25, 0], scale: [1, 1.1, 0.9, 1] }}
                transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full pointer-events-none opacity-40 will-change-transform"
                style={{
                    background: 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, rgba(34, 211, 238, 0.05) 45%, transparent 75%)',
                }}
            />

            {/* Cloud 2 - Dark Indigo, heavy trailing layer */}
            <motion.div
                animate={{ x: [0, -35, 30, 0], y: [0, 25, -40, 0], scale: [1, 0.9, 1.15, 1] }}
                transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-15%] right-[-10%] w-[65vw] h-[65vw] rounded-full pointer-events-none opacity-30 will-change-transform"
                style={{
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0.04) 50%, transparent 80%)',
                }}
            />

            {/* Cloud 3 - Deep Blue, center-left atmospheric density */}
            <motion.div
                animate={{ y: [0, 50, -30, 0], opacity: [0.15, 0.25, 0.15] }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[20%] left-[5%] w-[55vw] h-[55vw] rounded-full pointer-events-none will-change-transform"
                style={{
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                }}
            />

            {/* Cloud 4 - Dark Maroon/Red accent (from previous theme) for depth */}
            <motion.div
                animate={{ x: [0, 20, -30, 0], scale: [1, 1.05, 0.95, 1] }}
                transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[40%] right-[-5%] w-[50vw] h-[50vw] rounded-full pointer-events-none opacity-20 will-change-transform"
                style={{
                    background: 'radial-gradient(circle, rgba(76, 8, 8, 0.08) 0%, transparent 65%)',
                }}
            />

            {/* Subtle Overlay - very light vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(2,4,10,0.4)_100%)] pointer-events-none" />


            {/* Very subtle noise texture */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            }} />


        </div>
    );
};

export default InteractiveBackground;
