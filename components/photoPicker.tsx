/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect } from 'react'

interface PhotoMetadata {
    continent?: string
    country?: string
    state?: string
    description?: string
    takenBy?: string
}

export default function PhotoPicker() {
    const [drawerOpen, setDrawerOpen] = useState(false)

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
    const [selectedPhotos, setSelectedPhotos] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [polling, setPolling] = useState(false)
    const [photoMetadata, setPhotoMetadata] = useState<Record<string, PhotoMetadata>>({})

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

    return (
        <>
            {/* ── Trigger button — same style as before ── */}
            <button
                className="disabled:opacity-50 btn-primary"
                onClick={() => setDrawerOpen(true)}
            >
                + Add Photos
            </button>

            {/* ── Backdrop ── */}
            {drawerOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                    onClick={() => !loading && setDrawerOpen(false)}
                />
            )}

            {/* ── Drawer ── */}
            {drawerOpen && (
            <div className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-lg flex-col bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
                    <h2 className="text-base font-semibold text-stone-800">Add Photos</h2>
                    <button
                        onClick={() => !loading && setDrawerOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
                    >
                        ✕
                    </button>
                </div>

                {/* Scrollable body — original picker UI lives here unchanged */}
                <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 overscroll-contain">

                    {/* Original buttons */}
                    <div className='flex gap-5'>
                        <button
                            className="disabled:opacity-50 btn-primary"
                            disabled={loading || sessionId != null}
                            onClick={openPicker}
                        >
                            {loading ? 'Opening Picker...' : 'Open Google Photos'}
                        </button>
                        <button
                            className="disabled:hidden btn-primary"
                            disabled={!sessionId}
                            onClick={deleteSession}
                        >
                            Delete Selection
                        </button>
                    </div>

                    {/* Polling indicator */}
                    {polling && selectedPhotos.length === 0 && (
                        <div className="flex items-center gap-3 py-8 text-sm text-stone-500">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-stone-200 border-t-stone-700" />
                            Waiting for you to select photos…
                        </div>
                    )}

                    {/* Original photo cards — completely unchanged */}
                    {selectedPhotos.map((photo) => {
                        const { width, height } = photo.mediaFile.mediaFileMetadata
                        const imageUrl = `${photo.mediaFile.baseUrl}=w${width}-h${height}`

                        return (
                            <div key={photo.id} className="mb-4 break-inside-avoid pt-5 w-100">
                                <img
                                    src={`/api/proxy-image?url=${encodeURIComponent(imageUrl)}`}
                                    alt={photo.mediaFile.filename}
                                    className="w-full h-auto"
                                />
                                <div className='flex flex-col pt-5 gap-5'>
                                    <select
                                        id="options"
                                        value={photoMetadata[photo.id]?.continent || ''}
                                        onChange={(e) => updateMetadata(photo.id, 'continent', e.target.value)}
                                    >
                                        <option value="">--Continent--</option>
                                        <option value="Asia">Asia</option>
                                        <option value="Africa">Africa</option>
                                        <option value="Europe">Europe</option>
                                        <option value="North America">North America</option>
                                        <option value="South America">South America</option>
                                        <option value="Oceania">Oceania</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Country"
                                        value={photoMetadata[photo.id]?.country || ''}
                                        onChange={(e) => updateMetadata(photo.id, 'country', e.target.value)}
                                        className="border p-2 mb-2 w-full"
                                    />
                                    <input
                                        type="text"
                                        placeholder="City/State"
                                        value={photoMetadata[photo.id]?.state || ''}
                                        onChange={(e) => updateMetadata(photo.id, 'state', e.target.value)}
                                        className="border p-2 mb-2 w-full"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        value={photoMetadata[photo.id]?.description || ''}
                                        onChange={(e) => updateMetadata(photo.id, 'description', e.target.value)}
                                        className="border p-2 mb-2 w-full"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Taken By"
                                        value={photoMetadata[photo.id]?.takenBy || ''}
                                        onChange={(e) => updateMetadata(photo.id, 'takenBy', e.target.value)}
                                        className="border p-2 mb-2 w-full"
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Footer — upload button, pinned to bottom, only shown when photos are ready */}
                {selectedPhotos.length > 0 && (
                    <div className="border-t border-stone-100 px-6 py-4">
                        <button
                            className="w-full rounded-lg bg-stone-800 py-2.5 text-sm font-medium text-white transition hover:bg-stone-700 disabled:opacity-50"
                            disabled={!sessionId || loading}
                            onClick={uploadPhotos}
                        >
                            {loading ? 'Uploading…' : `Upload ${selectedPhotos.length} photo${selectedPhotos.length !== 1 ? 's' : ''}`}
                        </button>
                    </div>
                )}
            </div>
            )}
        </>
    )
}