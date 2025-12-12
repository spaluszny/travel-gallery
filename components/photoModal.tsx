'use client'

import Image from 'next/image'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import { useEffect } from 'react'

interface Photo {
  photo_id: number
  photo_url: string
  width: number
  height: number
  description?: string
  filename: string
}

export default function PhotoModal({ photos }: { photos: Photo[] }) {
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: '#gallery',
      children: 'a',
      pswpModule: () => import('photoswipe'),
    })
    
    lightbox.init()
    
    return () => {
      lightbox.destroy()
    }
  }, [])
  
  return (
    <div id="gallery" className="columns-1 md:columns-2 2xl:columns-3 gap-4">
      {photos.map((photo) => (
        <a
          key={photo.photo_id}
          href={photo.photo_url}
          data-pswp-width={photo.width}
          data-pswp-height={photo.height}
          target="_blank"
          rel="noreferrer"
          className="mb-4 break-inside-avoid block"
        >
          <Image
            src={photo.photo_url}
            alt={photo.description || photo.filename}
            width={photo.width}
            height={photo.height}
            className="w-full h-auto"
          />
        </a>
      ))}
    </div>
  )
}