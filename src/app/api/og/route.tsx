import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    const title = searchParams.get('title') || 'Radikal Creative Technologies';
    const subtitle = searchParams.get('subtitle') || 'AI Photography & Virtual Studio';
    const accent = searchParams.get('accent') || '#D4AF37';

    // Load the Inter font from Google Fonts (variable fonts aren't supported in og:image)
    const interBold = fetch(
        'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZFhiI2B.woff2'
    ).then((res) => res.arrayBuffer());

    const interRegular = fetch(
        'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZFhiI2B.woff2'
    ).then((res) => res.arrayBuffer());

    const [interBoldData, interRegularData] = await Promise.all([interBold, interRegular]);

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 40%, #111111 100%)',
                    padding: '80px',
                    fontFamily: 'Inter',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Background decorative elements */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-100px',
                        right: '-100px',
                        width: '500px',
                        height: '500px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${accent}15, transparent 70%)`,
                        display: 'flex',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-150px',
                        left: '-50px',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${accent}10, transparent 70%)`,
                        display: 'flex',
                    }}
                />

                {/* Top accent line */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '4px',
                        background: `linear-gradient(90deg, ${accent}, ${accent}80, transparent)`,
                        display: 'flex',
                    }}
                />

                {/* Brand mark */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '40px',
                    }}
                >
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: accent,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '16px',
                            fontSize: '24px',
                            fontWeight: 700,
                            color: '#000',
                        }}
                    >
                        R
                    </div>
                    <span
                        style={{
                            fontSize: '20px',
                            fontWeight: 400,
                            color: '#999',
                            letterSpacing: '3px',
                            textTransform: 'uppercase',
                        }}
                    >
                        Radikal Creative Technologies
                    </span>
                </div>

                {/* Title */}
                <div
                    style={{
                        fontSize: '64px',
                        fontWeight: 700,
                        color: '#ffffff',
                        lineHeight: 1.15,
                        marginBottom: '24px',
                        maxWidth: '900px',
                        display: 'flex',
                        flexWrap: 'wrap',
                    }}
                >
                    {title}
                </div>

                {/* Subtitle */}
                <div
                    style={{
                        fontSize: '28px',
                        fontWeight: 400,
                        color: '#999',
                        lineHeight: 1.5,
                        maxWidth: '800px',
                        display: 'flex',
                        flexWrap: 'wrap',
                    }}
                >
                    {subtitle}
                </div>

                {/* Bottom accent bar */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '60px',
                        left: '80px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}
                >
                    <div
                        style={{
                            width: '40px',
                            height: '3px',
                            background: accent,
                            display: 'flex',
                        }}
                    />
                    <span
                        style={{
                            fontSize: '16px',
                            color: '#666',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                        }}
                    >
                        radikalcreatech.com
                    </span>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: 'Inter',
                    data: interBoldData,
                    weight: 700,
                    style: 'normal',
                },
                {
                    name: 'Inter',
                    data: interRegularData,
                    weight: 400,
                    style: 'normal',
                },
            ],
        }
    );
}
