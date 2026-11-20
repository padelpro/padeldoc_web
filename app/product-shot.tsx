import styles from './product-shot.module.css'

// A product screenshot in a frame (Kevin 20 Nov 2026): a laptop or a phone drawn in plain CSS around a picture from
// public/images/product/ (padel-coach-src `npm run shots` takes them from the demo's made-up world, so no real person is
// ever in one; images/, not a new img/ folder, which would be a profile name to reserve). Not on any page yet: Kevin picks from the contact sheet first, then a page places
//   <ProductShot name="board" frame="laptop" alt="The Tactics Board with a lob drawn and its side view" />
// The picture is lazy-loaded with its width and height set, so the page holds its space before it arrives. alt is
// required and can't be empty: every one of these shows something a reader should be told about.
export const PRODUCT_SHOTS = {
  laptop: { suffix: 1440, width: 1440, height: 900 },   // a 1440 x 900 window
  phone: { suffix: 390, width: 780, height: 1688 },     // a 390 x 844 phone at 2x
} as const
export type ProductFrame = keyof typeof PRODUCT_SHOTS

export const productShotSrc = (name: string, frame: ProductFrame): string => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) throw new Error(`ProductShot: "${name}" isn't a shot's name (a-z, 0-9 and hyphens)`)
  return `/images/product/${name}-${PRODUCT_SHOTS[frame].suffix}.webp`
}

export default function ProductShot({ name, frame, alt, className = '' }: {
  name: string             // the shot's name, as npm run shots writes it: board, coach-home, box-league...
  frame: ProductFrame      // laptop: the 1440 px picture; phone: the 390 px one
  alt: string              // what the picture shows, in words
  className?: string       // the caller sets the width
}) {
  if (!alt || !alt.trim()) throw new Error(`ProductShot ${name}: alt text is required`)
  const size = PRODUCT_SHOTS[frame]
  const img = (
    <img className={styles.shot} src={productShotSrc(name, frame)} alt={alt} width={size.width} height={size.height} loading="lazy" decoding="async" />
  )
  return frame === 'phone' ? (
    <figure className={`${styles.frame} ${styles.phone} ${className}`}>{img}</figure>
  ) : (
    <figure className={`${styles.frame} ${styles.laptop} ${className}`}>
      <div className={styles.lid}>{img}</div>
      <div className={styles.base} aria-hidden="true" />
    </figure>
  )
}
