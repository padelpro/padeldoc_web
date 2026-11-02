import { ImageResponse } from 'next/og'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { RoleCopy, RoleId } from './role-page'

// The Open Graph card for a role page (1200 x 630, made once at build): the logo and name, the role's heading in its
// colour and its one line, on the site's page colour with a band of the role's colour down the side.
export const ogSize = { width: 1200, height: 630 }

const COLOUR: Record<RoleId, string> = { players: '#8c5021', coaches: '#0865c2', clubs: '#11683f' }

export function roleOg(id: RoleId, c: RoleCopy) {
  const logo = `data:image/png;base64,${readFileSync(join(process.cwd(), 'public', 'icon-192.png')).toString('base64')}`
  const colour = COLOUR[id]
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#f6f4f0', color: '#1b1c1f' }}>
        <div style={{ width: 28, height: '100%', background: colour }} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 80px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <img src={logo} width={84} height={84} alt="" />
            <div style={{ fontSize: 40 }}>The Padel Doc</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 104, color: colour, letterSpacing: -2 }}>{c.heading}</div>
            <div style={{ marginTop: 24, fontSize: 44, lineHeight: 1.3, color: '#1b1c1f', maxWidth: 960 }}>{c.line}</div>
          </div>
          <div style={{ fontSize: 30, color: '#56656d' }}>thepadeldoc.com</div>
        </div>
      </div>
    ),
    ogSize,
  )
}
