import { useEffect, useState, type CSSProperties } from 'react';
import { Check, ExternalLink, Info, X } from 'lucide-react';

type BillingMode = 'monthly' | 'yearly';

const starterFeatures = [
    'Feature not included',
    '150 credits',
    'AI clipping with Virality Score',
    'AI animated captions in 20+ languages',
    'Auto post to YouTube Shorts, TikTok, IG Reels, or download',
    'Powerful editor',
    '1 brand template',
    'Filler & silence removal',
    'Remove Watermark'
];

const proBaseFeatures = [
    '100GB Storage for projects and assets',
    '3,600 credits per year, available instantly',
    'Team workspace with 2 seats. Upgrade to support up to 4 seats',
    '2 brand templates',
    '6 social media connections'
];

const proPlusFeatures = [
    'AI B-Roll',
    'Input from 10+ sources',
    'Export to Adobe Premiere Pro & DaVinci Resolve',
    'Multiple aspect ratios (9:16, 1:1, 16:9)',
    'Social media scheduler',
    'Intercom chat support',
    'Custom fonts',
    'Speech enhancement'
];

const businessFeatures = [
    'Customized storage size',
    'Priority project processing',
    'Customized credits and team seats',
    'Tailored business assets: brand templates, fonts, vocabulary, social media connections & more',
    'Dedicated storage',
    'API & custom integrations',
    'Master Service Agreement (MSA)',
    'Priority support with a dedicated Slack channel',
    'Enterprise-level security'
];

export default function PricingModal({ onClose }: { onClose: () => void }) {
    const [billingMode, setBillingMode] = useState<BillingMode>('yearly');

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    const starterPrice = billingMode === 'yearly' ? '$9' : '$15';
    const starterBilling = billingMode === 'yearly' ? '$9 billed monthly' : '$15 billed monthly';
    const proPrice = billingMode === 'yearly' ? '$9.5' : '$29';
    const proBilling = billingMode === 'yearly' ? '$113.97 billed annually' : '$29 billed monthly';

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.9)',
                zIndex: 2200,
                padding: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="pricing-shell"
                style={{
                    width: '100%',
                    maxWidth: 1120,
                    maxHeight: 'calc(100vh - 40px)',
                    overflowY: 'auto',
                    position: 'relative'
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        border: '1px solid #ffffff24',
                        background: '#12141a',
                        color: '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                    aria-label="Close pricing"
                >
                    <X size={18} />
                </button>

                <h1 style={{ fontSize: 40, fontWeight: 700, textAlign: 'center', margin: '18px 0 16px' }}>Upgrade your plan</h1>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                    <div style={{ background: '#2a2d33', borderRadius: 999, padding: 4, display: 'inline-flex', gap: 4, border: '1px solid #ffffff20' }}>
                        <button
                            onClick={() => setBillingMode('monthly')}
                            style={billingMode === 'monthly' ? activePillStyle : pillStyle}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingMode('yearly')}
                            style={billingMode === 'yearly' ? activePillStyle : pillStyle}
                        >
                            Yearly <span style={{ color: '#34d399' }}>(up to 50% off)</span>
                        </button>
                    </div>
                </div>

                <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
                    <div style={cardStyle}>
                        <PlanHeader title="Starter" oldPrice="$15 USD" price={starterPrice} billedText={starterBilling} />
                        <PlanButton label="Get Starter" primary={false} />
                        <Separator />
                        <div style={featureStackStyle}>
                            {starterFeatures.map((feature, idx) => (
                                <FeatureRow key={feature} text={feature} emphasized={idx === 1} muted={idx === 0} />
                            ))}
                        </div>
                    </div>

                    <div style={{ ...cardStyle, borderColor: '#f3f4f6', borderWidth: 2 }}>
                        <div style={{ position: 'absolute', top: 12, right: 14, background: '#f3f4f6', color: '#111317', borderRadius: 8, fontWeight: 700, fontSize: 12, padding: '4px 8px' }}>
                            Most popular
                        </div>
                        <PlanHeader title="Pro" oldPrice="$29 USD" price={proPrice} billedText={proBilling} />
                        <PlanButton label="Get Pro" primary />
                        <Separator />
                        <div style={featureStackStyle}>
                            {proBaseFeatures.map((feature, idx) => (
                                <FeatureRow key={feature} text={feature} emphasized={idx === 0} />
                            ))}
                            <div style={{ color: '#9ca3af', fontSize: 14, marginTop: 2 }}>Everything in Starter plan, plus:</div>
                            {proPlusFeatures.map((feature) => (
                                <FeatureRow key={feature} text={feature} />
                            ))}
                        </div>
                    </div>

                    <div style={cardStyle}>
                        <div style={{ marginBottom: 12 }}>
                            <h2 style={{ fontSize: 38, fontWeight: 700, marginBottom: 6 }}>Business</h2>
                            <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.05, marginBottom: 6 }}>Let's talk</div>
                            <div style={{ color: '#9ca3af', fontSize: 16 }}>Fit for business, dressed in a tux</div>
                        </div>
                        <PlanButton label="Contact us" primary={false} />
                        <Separator />
                        <div style={featureStackStyle}>
                            {businessFeatures.map((feature, idx) => (
                                <FeatureRow key={feature} text={feature} emphasized={idx === 0} />
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
                    <button
                        style={{
                            background: '#22252b',
                            border: '1px solid #ffffff1f',
                            color: '#e5e7eb',
                            padding: '10px 16px',
                            borderRadius: 8,
                            fontSize: 14,
                            fontWeight: 500,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            cursor: 'pointer'
                        }}
                    >
                        Compare all features and plans <ExternalLink size={16} />
                    </button>
                </div>
            </div>

            <style>{`
                .pricing-shell::-webkit-scrollbar { width: 8px; }
                .pricing-shell::-webkit-scrollbar-thumb { background: #2e3440; border-radius: 999px; }
                @media (max-width: 1100px) {
                    .pricing-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}

function PlanHeader({ title, oldPrice, price, billedText }: { title: string; oldPrice: string; price: string; billedText: string }) {
    return (
        <div style={{ marginBottom: 14 }}>
            <h2 style={{ fontSize: 40, fontWeight: 700, marginBottom: 2 }}>{title}</h2>
            <div style={{ fontSize: 31, color: '#8b8e94', textDecoration: 'line-through', fontWeight: 600 }}>{oldPrice}</div>
            <div style={{ fontSize: 52, fontWeight: 800, color: '#34d399', lineHeight: 1.05 }}>
                {price}<span style={{ color: '#9ca3af', fontSize: 30, fontWeight: 600 }}>/mo</span>
            </div>
            <div style={{ fontSize: 14, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 6 }}>
                {billedText} <Info size={14} />
            </div>
        </div>
    );
}

function PlanButton({ label, primary }: { label: string; primary: boolean }) {
    return (
        <button
            style={{
                width: '100%',
                background: primary ? '#f3f4f6' : '#23262d',
                color: primary ? '#0f1115' : '#f3f4f6',
                border: 'none',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 28,
                padding: '12px 10px',
                cursor: 'pointer'
            }}
        >
            {label}
        </button>
    );
}

function FeatureRow({ text, emphasized = false, muted = false }: { text: string; emphasized?: boolean; muted?: boolean }) {
    return (
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Check size={18} color={muted ? '#6b7280' : '#ffffff'} style={{ marginTop: 2, flexShrink: 0 }} />
            <div style={{ color: muted ? '#9ca3af' : '#e5e7eb', fontSize: 15, lineHeight: 1.35, fontWeight: emphasized ? 700 : 500 }}>
                {text}
            </div>
        </div>
    );
}

function Separator() {
    return <div style={{ height: 1, background: '#ffffff14', margin: '14px 0' }} />;
}

const pillStyle: CSSProperties = {
    background: 'transparent',
    border: 'none',
    color: '#9ca3af',
    padding: '8px 14px',
    fontSize: 14,
    borderRadius: 999,
    fontWeight: 600,
    cursor: 'pointer'
};

const activePillStyle: CSSProperties = {
    ...pillStyle,
    background: '#1e2229',
    color: '#f3f4f6'
};

const cardStyle: CSSProperties = {
    background: '#08090d',
    border: '1px solid #ffffff26',
    borderRadius: 14,
    padding: 18,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 640,
    position: 'relative'
};

const featureStackStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    flex: 1
};
