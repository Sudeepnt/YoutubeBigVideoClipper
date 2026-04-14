type CurrentTrendsViewProps = {
  platform: 'google' | 'instagram' | 'tiktok';
};

const PLATFORM_COPY: Record<CurrentTrendsViewProps['platform'], { title: string; subtitle: string; chips: string[] }> = {
  google: {
    title: 'Google Trends',
    subtitle: 'Track breakout search themes and rising topics worth turning into clips.',
    chips: ['Rising searches', 'Regional momentum', 'Keyword spikes'],
  },
  instagram: {
    title: 'Instagram Current Trends',
    subtitle: 'Watch what formats, hooks, and aesthetics are heating up across Reels right now.',
    chips: ['Reels hooks', 'Creator formats', 'Visual styles'],
  },
  tiktok: {
    title: 'TikTok Current Trends',
    subtitle: 'Spot fast-moving sounds, storytelling angles, and viral patterns for short-form content.',
    chips: ['Trending formats', 'Hook patterns', 'Sound-led ideas'],
  },
};

export default function CurrentTrendsView({ platform }: CurrentTrendsViewProps) {
  const copy = PLATFORM_COPY[platform];

  return (
    <section className="glass-panel" style={{ padding: 28, minHeight: 'calc(100vh - 64px)', margin: 16 }}>
      <div style={{ maxWidth: 980, display: 'grid', gap: 20 }}>
        <div style={{ display: 'grid', gap: 10 }}>
          <div className="panel-label">Current Trends</div>
          <h1 style={{ margin: 0, fontSize: 40, lineHeight: 1.02, letterSpacing: '-0.04em' }}>{copy.title}</h1>
          <p style={{ margin: 0, maxWidth: 760, color: 'rgba(226, 232, 240, 0.76)', fontSize: 17, lineHeight: 1.6 }}>
            {copy.subtitle}
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {copy.chips.map((chip) => (
            <span
              key={chip}
              style={{
                borderRadius: 999,
                border: '1px solid rgba(179, 206, 255, 0.12)',
                background: 'rgba(10, 14, 24, 0.72)',
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 700,
                color: '#edf3ff',
              }}
            >
              {chip}
            </span>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {[
            {
              title: 'Trend Radar',
              body: 'A focused feed for fast-rising topics you can convert into shorts, reels, and hooks.',
            },
            {
              title: 'Hook Angles',
              body: 'Surface the strongest phrasing patterns and title styles people are clicking into.',
            },
            {
              title: 'Content Gaps',
              body: 'Find topics that are rising in demand but still have room for fresh creators to win.',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="glass-panel"
              style={{
                padding: 18,
                borderRadius: 18,
                display: 'grid',
                gap: 10,
                background: 'rgba(9, 13, 22, 0.74)',
              }}
            >
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.16em', color: '#87a9ff' }}>
                Trend Module
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>{card.title}</div>
              <p style={{ margin: 0, color: 'rgba(226, 232, 240, 0.72)', lineHeight: 1.6 }}>{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
