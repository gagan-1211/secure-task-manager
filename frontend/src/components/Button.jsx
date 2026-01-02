const Button = ({ children, onClick, type = "button", variant = "primary", className = "", ...props }) => {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-gradient-to-r from-fuchsia-600 to-orange-500 text-white hover:opacity-90 shadow-lg shadow-fuchsia-500/20",
        secondary: "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/10",
        danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20",
        ghost: "text-gray-400 hover:text-white hover:bg-white/5"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
