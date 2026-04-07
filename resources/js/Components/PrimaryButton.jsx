export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex justify-center items-center rounded-md border border-transparent bg-primary-700 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary-50 transition duration-150 ease-in-out hover:bg-primary-800 py-3 focus:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:bg-primary-900 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
