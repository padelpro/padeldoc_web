// A phone drawn in CSS around a phone screenshot (preview-mobile-layout, Kevin 27 Oct 2026): rounded body, dark bezel,
// soft shadow, no image asset. The screenshots are 780 x 1520 (a 390 x 760 phone screen at 2x); the size reserves the
// space before they load. The caller sets the width through className.
export default function PhoneFrame({ src, alt, className = '', eager = false }: {
  src: string
  alt: string
  className?: string
  eager?: boolean
}) {
  return (
    <div className={`rounded-[2.4rem] bg-[#0d0e10] p-[9px] ring-1 ring-black/10 shadow-[0_30px_60px_-30px_color-mix(in_srgb,var(--color-shade)_55%,transparent)] ${className}`}>
      <img src={src} alt={alt} width={780} height={1520}
        loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined}
        className="block w-full h-auto rounded-[1.9rem]" />
    </div>
  )
}
