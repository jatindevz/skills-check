import React, { useMemo, useCallback } from 'react';

const FullPageLoader = React.memo(({
    loading = true,
    text = "Loading...",
    size = "medium",
    variant = "pulse",
    backgroundColor = "rgba(255, 255, 255, 0.7)",
    spinnerColor = "#3B82F6",
    textColor = "white",
    blurBackground = false
}) => {
    if (!loading) return null;

    const sizeClasses = {
        small: "w-8 h-8",
        medium: "w-12 h-12",
        large: "w-16 h-16"
    };

    const renderSpinner = useCallback(() => {
        switch (variant) {
            case "dots":
                return (
                    <div className="flex space-x-2">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className={`${sizeClasses[size]} rounded-full animate-bounce`}
                                style={{
                                    backgroundColor: spinnerColor,
                                    animationDelay: `${i * 0.1}s`
                                }}
                            />
                        ))}
                    </div>
                );

            case "pulse":
                return (
                    <div
                        className={`${sizeClasses[size]} rounded-full animate-pulse`}
                        style={{ backgroundColor: spinnerColor }}
                    />
                );

            default:
                return (
                    <div
                        className={`${sizeClasses[size]} rounded-full animate-spin border-4 border-solid border-current border-r-transparent`}
                        style={{ color: spinnerColor }}
                    />
                );
        }
    }, [variant, size, spinnerColor]);

    const spinnerElement = useMemo(() => renderSpinner(), [renderSpinner]);

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center ${blurBackground ? 'backdrop-blur-sm' : ''
                }`}
            style={{ backgroundColor }}
        >
            <div className="flex flex-col items-center space-y-4">
                {spinnerElement}

                {text && (
                    <p
                        className="text-lg font-medium"
                        style={{ color: textColor }}
                    >
                        {text}
                    </p>
                )}
            </div>
        </div>
    );
});

export default FullPageLoader;
