"use client"

import { useState } from 'react'

interface PhotoPickerProps {
  accessToken: string
  apiKey: string
}

export default function PhotoPicker({ accessToken, apiKey }: PhotoPickerProps) {
  const [selectedPhotos, setSelectedPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const openPicker = async () => {
    setLoading(true)
    
    try {
      // Create a picker session
      const response = await fetch('/api/create-session', {
  method: 'POST',
})

      if (!response.ok) {
        throw new Error('Failed to create picker session')
      }

      const data = await response.json()
      console.log('Session created:', data)
      
      // Open the picker URL in a new window
      if (data.pickerUri) {
        setSessionId(data.id)
        window.open(data.pickerUri, 'photoPicker', 'width=1000,height=800')
        
        // TODO: Start polling the session to check when user is done
        console.log('Picker opened. Session ID:', data.id)
      }
      
    } catch (error) {
      console.error('Error opening picker:', error)
      alert('Failed to open photo picker')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button 
        className="px-3 py-2 mt-5 bg-black text-white rounded-md cursor-pointer disabled:opacity-50"
        disabled={loading}
        onClick={openPicker}
      >
        {loading ? 'Opening Picker...' : 'Add Photos'}
      </button>

      {sessionId && (
        <p className="mt-2 text-sm text-gray-600">
          Session ID: {sessionId}
        </p>
      )}

      {selectedPhotos.length > 0 && (
        <div className="mt-4">
          <p>Selected {selectedPhotos.length} photos</p>
        </div>
      )}
    </div>
  )
}