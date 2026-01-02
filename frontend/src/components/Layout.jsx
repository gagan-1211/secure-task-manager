import { useRef } from 'react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-neutral-950 text-white">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default Layout;
