/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface PhotoMetadata {
    continent?: string
    country?: string
    state?: string
    description?: string
    takenBy?: string
}

export default function PhotoPicker() {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [closing, setClosing] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [selectedPhotos, setSelectedPhotos] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [polling, setPolling] = useState(false)
    const [photoMetadata, setPhotoMetadata] = useState<Record<string, PhotoMetadata>>({})

    // Required for createPortal to work with SSR in Next.js
    useEffect(() => {
        setMounted(true)
    }, [])

    // Close with exit animation
    const closeDrawer = () => {
        if (loading) return
        setClosing(true)
        setTimeout(() => {
            setClosing(false)
            setDrawerOpen(false)
        }, 280) // slightly less than animation duration
    }

    // Lock page scroll when drawer is open
    useEffect(() => {
        if (drawerOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [drawerOpen])

    const updateMetadata = (photoId: string, field: string, value: string) => {
        setPhotoMetadata((prev) => ({
            ...prev,
            [photoId]: { ...prev[photoId], [field]: value }
        }))
    }

    const uploadPhotos = async () => {
        setLoading(true)

        try {
            for (const photo of selectedPhotos) {
                const metadata = photoMetadata[photo.id] || {}

                const response = await fetch('/api/upload-to-s3', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        baseUrl: photo.mediaFile.baseUrl,
                        filename: photo.mediaFile.filename,
                        width: photo.mediaFile.mediaFileMetadata.width,
                        height: photo.mediaFile.mediaFileMetadata.height,
                        googlePhotoId: photo.id,
                        photoDate: photo.createTime,
                        cameraMake: photo.mediaFile.mediaFileMetadata.cameraMake,
                        cameraModel: photo.mediaFile.mediaFileMetadata.cameraModel,
                        continent: metadata.continent || null,
                        country: metadata.country || null,
                        state: metadata.state || null,
                        description: metadata.description || null,
                        takenBy: metadata.takenBy || null,
                    })
                })

                if (!response.ok) {
                    const error = await response.json()
                    throw new Error(`Failed to upload ${photo.mediaFile.filename}: ${error.error}`)
                }

                const data = await response.json()
                console.log('Uploaded:', data)
            }

            alert('All photos uploaded successfully!')

            setSelectedPhotos([])
            setPhotoMetadata({})
            if (sessionId) {
                await deleteSession()
            }
            setDrawerOpen(false)

        } catch (error) {
            console.error('Upload error:', error)
            alert('Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
        } finally {
            setLoading(false)
        }
    }

    const fetchSelectedPhotos = async (sessionId: string) => {
        try {
            const response = await fetch(`/api/get-photos?sessionId=${sessionId}`)
            if (!response.ok) {
                throw new Error('Failed to fetch photos')
            }
            const data = await response.json()
            console.log('Selected photos:', data)
            setSelectedPhotos(data.mediaItems || [])
        } catch (error) {
            console.error('Error fetching photos:', error)
        }
    }

    const startPolling = (sessionId: string) => {
        console.log('Starting to poll with sessionId:', sessionId)
        setPolling(true)

        const intervalId = setInterval(async () => {
            const response = await fetch(`api/check-session?sessionId=${sessionId}`)
            try {
                if (!response.ok) {
                    console.error('Failed to check session')
                    return
                }
                const data = await response.json()
                console.log('Poll result:', data)
                if (data.mediaItemsSet) {
                    clearInterval(intervalId)
                    setPolling(false)
                    console.log('Photos selected! mediaItemsSet is true')
                    fetchSelectedPhotos(sessionId)
                }
            } catch (error) {
                console.error('Polling failed', error)
            }
        }, 5000)
    }

    const openPicker = async () => {
        setLoading(true)

        try {
            const response = await fetch('/api/create-session', {
                method: 'POST',
            })
            const data = await response.json()
            console.log('Session created:', data)

            if (data.pickerUri) {
                setSessionId(data.id)
                window.open(data.pickerUri + '/autoclose', 'photoPicker', 'width=1000,height=800')
                console.log('Picker opened. Session ID:', data.id)
                startPolling(data.id)
            }
        } catch (error) {
            console.error('Error opening picker:', error)
            alert('Failed to open photo picker')
        } finally {
            setLoading(false)
        }
    }

    const deleteSession = async () => {
        if (!sessionId) {
            alert('No session to delete')
            return
        }

        try {
            const response = await fetch(`/api/create-session?sessionId=${sessionId}`, {
                method: 'DELETE',
            })
            if (response.ok) {
                console.log('session deleted', { sessionId })
                setSessionId(null)
                setSelectedPhotos([])
            }
        } catch (error) {
            console.error('Error deleting SessionId:', error)
            alert('Failed delete SessionId')
        }
    }

    const fieldStyle: React.CSSProperties = {
        width: '100%',
        padding: '8px 10px',
        border: '1px solid #e7e5e4',
        borderRadius: '5px',
        fontSize: '13px',
        color: '#1c1917',
        backgroundColor: '#fafaf9',
        outline: 'none',
        boxSizing: 'border-box',
    }

    const drawer = (
        <>
            <style>{`
                @keyframes slideInFromRight {
                    from { transform: translateX(100%); }
                    to   { transform: translateX(0); }
                }
                @keyframes slideOutToRight {
                    from { transform: translateX(0); }
                    to   { transform: translateX(100%); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to   { opacity: 0; }
                }
            `}</style>

            {/* Backdrop */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 40,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(4px)',
                    animation: closing ? 'fadeOut 0.3s ease-in forwards' : 'fadeIn 0.2s ease-out',
                }}
                onClick={closeDrawer}
            />

            {/* Drawer */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '100%',
                    maxWidth: '480px',
                    height: '100vh',
                    zIndex: 50,
                    backgroundColor: 'white',
                    boxShadow: '-2px 0 16px rgba(0,0,0,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    animation: closing ? 'slideOutToRight 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards' : 'slideInFromRight 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
                    borderLeft: '1px solid #e7e5e4',
                }}
            >
                {/* Header */}
                <div style={{
                    flexShrink: 0,
                    borderBottom: '1px solid #e7e5e4',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#000', margin: 0, letterSpacing: '-0.01em' }}>
                        Add Photos
                    </h2>
                    <button
                        onClick={closeDrawer}
                        style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            border: '1px solid #e7e5e4',
                            background: 'white',
                            cursor: 'pointer',
                            fontSize: '13px',
                            color: '#78716c',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            lineHeight: 1,
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Scrollable body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

                    {/* Open picker button */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                        <button
                            onClick={openPicker}
                            disabled={loading || sessionId != null}
                            style={{
                                padding: '8px 14px',
                                backgroundColor: loading || sessionId ? '#d4d4d4' : '#000',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                fontSize: '13px',
                                fontWeight: 500,
                                cursor: loading || sessionId ? 'not-allowed' : 'pointer',
                                opacity: loading || sessionId ? 0.6 : 1,
                            }}
                        >
                            {loading ? 'Opening…' : 'Open Google Photos'}
                        </button>
                        {sessionId && (
                            <button
                                onClick={deleteSession}
                                style={{
                                    padding: '8px 14px',
                                    backgroundColor: 'white',
                                    color: '#000',
                                    border: '1px solid #e7e5e4',
                                    borderRadius: '5px',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                }}
                            >
                                Clear Selection
                            </button>
                        )}
                    </div>

                    {/* Polling indicator */}
                    {polling && selectedPhotos.length === 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '24px 0', color: '#78716c', fontSize: '13px' }}>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-stone-200 border-t-stone-700" />
                            Waiting for you to select photos…
                        </div>
                    )}

                    {/* Photo cards */}
                    {selectedPhotos.map((photo, index) => {
                        const { width, height } = photo.mediaFile.mediaFileMetadata
                        const imageUrl = `${photo.mediaFile.baseUrl}=w${width}-h${height}`

                        return (
                            <div key={photo.id} style={{
                                marginTop: '20px',
                                paddingTop: '20px',
                                borderTop: index === 0 ? '1px solid #e7e5e4' : '1px solid #e7e5e4',
                            }}>
                                {/* Thumbnail */}
                                <img
                                    src={`/api/proxy-image?url=${encodeURIComponent(imageUrl)}`}
                                    alt={photo.mediaFile.filename}
                                    style={{ width: '100%', height: 'auto', borderRadius: '6px', display: 'block' }}
                                />
                                <p style={{ fontSize: '11px', color: '#a8a29e', margin: '6px 0 14px', fontFamily: 'monospace' }}>
                                    {photo.mediaFile.filename}
                                </p>

                                {/* Fields */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <select
                                        value={photoMetadata[photo.id]?.continent || ''}
                                        onChange={(e) => updateMetadata(photo.id, 'continent', e.target.value)}
                                        style={fieldStyle}
                                    >
                                        <option value="">— Continent —</option>
                                        <option value="Asia">Asia</option>
                                        <option value="Africa">Africa</option>
                                        <option value="Europe">Europe</option>
                                        <option value="North America">North America</option>
                                        <option value="South America">South America</option>
                                        <option value="Oceania">Oceania</option>
                                    </select>
                                    <input type="text" placeholder="Country" value={photoMetadata[photo.id]?.country || ''} onChange={(e) => updateMetadata(photo.id, 'country', e.target.value)} style={fieldStyle} />
                                    <input type="text" placeholder="City / State" value={photoMetadata[photo.id]?.state || ''} onChange={(e) => updateMetadata(photo.id, 'state', e.target.value)} style={fieldStyle} />
                                    <input type="text" placeholder="Description" value={photoMetadata[photo.id]?.description || ''} onChange={(e) => updateMetadata(photo.id, 'description', e.target.value)} style={fieldStyle} />
                                    <input type="text" placeholder="Taken By" value={photoMetadata[photo.id]?.takenBy || ''} onChange={(e) => updateMetadata(photo.id, 'takenBy', e.target.value)} style={fieldStyle} />
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Footer */}
                {selectedPhotos.length > 0 && (
                    <div style={{
                        flexShrink: 0,
                        borderTop: '1px solid #e7e5e4',
                        padding: '16px 24px',
                        backgroundColor: 'white',
                    }}>
                        <button
                            disabled={!sessionId || loading}
                            onClick={uploadPhotos}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: !sessionId || loading ? '#d4d4d4' : '#000',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                fontSize: '13px',
                                fontWeight: 500,
                                cursor: !sessionId || loading ? 'not-allowed' : 'pointer',
                                opacity: !sessionId || loading ? 0.6 : 1,
                            }}
                        >
                            {loading ? 'Uploading…' : `Upload ${selectedPhotos.length} photo${selectedPhotos.length !== 1 ? 's' : ''}`}
                        </button>
                    </div>
                )}
            </div>
        </>
    )

    return (
        <>
            <button
                className="disabled:opacity-50 btn-primary"
                onClick={() => setDrawerOpen(true)}
            >
                + Add Photos
            </button>

            {/* Portal renders drawer into document.body — outside all layout constraints */}
            {mounted && drawerOpen && createPortal(drawer, document.body)}
        </>
    )
}