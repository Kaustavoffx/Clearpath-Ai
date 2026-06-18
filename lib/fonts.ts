import localFont from 'next/font/local'

export const cmGeom = localFont({
  src: [
    {
      path: '../assets/fonts/CMGeom-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/CMGeom-Regular.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/CMGeom-Regular.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/CMGeom-Regular.woff2',
      weight: '400',
      style: 'italic',
    }
  ],
  variable: '--font-cm-geom',
  display: 'swap',
})
