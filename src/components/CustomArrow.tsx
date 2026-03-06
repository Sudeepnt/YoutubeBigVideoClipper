type ArrowTone = 'dark' | 'light';

interface CustomArrowProps {
    size?: number;
    tone?: ArrowTone;
    className?: string;
}

export default function CustomArrow({ size = 56, tone = 'dark', className = '' }: CustomArrowProps) {
    const isLight = tone === 'light';

    return (
        <div
            className={`custom-arrow-chip ${isLight ? 'light' : 'dark'} ${className}`.trim()}
            style={{ width: size, height: Math.round(size * 0.74) }}
        >
            <svg viewBox="0 0 120 60" width="100%" height="100%" aria-hidden="true">
                <defs>
                    <linearGradient id="arrowStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={isLight ? '#9ca3af' : '#4b5563'} />
                        <stop offset="100%" stopColor={isLight ? '#f3f4f6' : '#9ca3af'} />
                    </linearGradient>
                </defs>
                <path
                    d="M10 30 H84"
                    stroke="url(#arrowStroke)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                />
                <path
                    d="M72 16 L96 30 L72 44"
                    stroke="url(#arrowStroke)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            </svg>
        </div>
    );
}
