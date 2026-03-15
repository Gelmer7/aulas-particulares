import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Aulas Particulares de Química e Física'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #EEF2FF, #F0F9FF)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          textAlign: 'center',
          padding: '80px',
        }}
      >
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#4F46E5',
            color: 'white',
            borderRadius: '100px',
            padding: '20px 40px',
            fontSize: 48,
            fontWeight: 800,
            marginBottom: '40px',
          }}
        >
          Professora de Exatas
        </div>
        <div style={{ fontSize: 64, fontWeight: 900, color: '#0F172A', marginBottom: '20px', lineHeight: 1.1 }}>
          Aprenda Química e Física de Verdade
        </div>
        <div style={{ fontSize: 36, color: '#475569', fontWeight: 500 }}>
          Mentoria para ENEM e Vestibulares de Alta Concorrência
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
