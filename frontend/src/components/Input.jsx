import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, ...props }, ref) => {
    return (
        <div className="space-y-1">
            {label && <label className="block text-sm font-medium text-gray-300">{label}</label>}
            <input
                ref={ref}
                className={`w-full bg-neutral-900/50 border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-fuchsia-500/50'} 
                rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500/50 transition-all backdrop-blur-sm`}
                {...props}
            />
            {error && <p className="text-red-400 text-xs mt-1">{error.message}</p>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
