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
  country?: string
  state?: string
  camera_make?: string
  camera_model?: string
  taken_by?: string
}

export default function PhotoModal({ photos }: { photos: Photo[] }) {
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: '#gallery',
      children: 'a',
      pswpModule: () => import('photoswipe'),
    })
    
    // Add caption
    lightbox.on('uiRegister', function () {
      lightbox.pswp?.ui?.registerElement({
        name: 'custom-caption',
        order: 9,
        isButton: false,
        appendTo: 'root',
        html: '',
        onInit: (el, pswp) => {
          lightbox.pswp?.on('change', () => {
            const currSlideElement = lightbox.pswp?.currSlide?.data.element
            let captionHTML = ''
            
            if (currSlideElement) {
              const description = currSlideElement.dataset.pswpDescription
              const location = currSlideElement.dataset.pswpLocation
              const camera = currSlideElement.dataset.pswpCamera
              const takenBy = currSlideElement.dataset.pswpTakenBy
              
              if (description) {
                captionHTML += `<div class="pswp__custom-caption__description">${description}</div>`
              }
              if (location) {
                captionHTML += `<div class="pswp__custom-caption__location">📍 ${location}</div>`
              }
              if (camera) {
                captionHTML += `<div class="pswp__custom-caption__camera">📷 ${camera}</div>`
              }
              if (takenBy) {
                captionHTML += `<div class="pswp__custom-caption__taken-by">By ${takenBy}</div>`
              }
            }
            
            el.innerHTML = captionHTML
          })
        }
      })
    })
    
    lightbox.init()
    
    return () => {
      lightbox.destroy()
    }
  }, [])
  
  return (
    <>
      <style jsx global>{`
        .pswp__custom-caption {
          background: rgba(0, 0, 0, 0.75);
          color: white;
          padding: 16px;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          backdrop-filter: blur(10px);
        }
        .pswp__custom-caption__description {
          font-size: 16px;
          margin-bottom: 8px;
        }
        .pswp__custom-caption__location,
        .pswp__custom-caption__camera,
        .pswp__custom-caption__taken-by {
          font-size: 14px;
          opacity: 0.9;
          margin-top: 4px;
        }
      `}</style>
      
      <div id="gallery" className="columns-1 md:columns-2 2xl:columns-3 gap-4">
        {photos.map((photo) => {
          const location = [photo.state, photo.country].filter(Boolean).join(', ')
          const camera = [photo.camera_make, photo.camera_model].filter(Boolean).join(' ')
          
          return (
            <a
              key={photo.photo_id}
              href={photo.photo_url}
              data-pswp-width={photo.width}
              data-pswp-height={photo.height}
              data-pswp-description={photo.description}
              data-pswp-location={location}
              data-pswp-camera={camera}
              data-pswp-taken-by={photo.taken_by}
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
          )
        })}
      </div>
    </>
  )
}