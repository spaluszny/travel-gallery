"use client"

import { useState } from 'react'

interface PhotoPickerProps {
  accessToken: string
  apiKey: string
}

export default function PhotoPicker({ accessToken, apiKey }: PhotoPickerProps) {
  //const [selectedPhotos, setSelectedPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

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
        
        window.open(data.pickerUri  + '/autoclose', 'photoPicker', 'width=1000,height=800')

        console.log('Picker opened. Session ID:', data.id)
      }

    } catch (error) {
      console.error('Error opening picker:', error)
      alert('Failed to open photo picker')
    } finally {
      setLoading(false)
    }
  }

  const deleteSession = () =>{
    if(sessionId){
      //DELETE 
    }
  }

  return (
    <div>
      <button
        className="disabled:opacity-50 btn-primary"
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
      <button className="disabled:opacity-50 btn-primary"
        disabled={!sessionId}
        onClick={deleteSession}
      >
        Delete Session
      </button>

      {/* {selectedPhotos.length > 0 && (
        <div className="mt-4">
          <p>Selected {selectedPhotos.length} photos</p>
        </div>
      )} */}
    </div>
  )
}


// async function deletePhotoPickerSession(sessionId: string, accessToken: string): Promise<void> {
//   const url = `https://photospicker.googleapis.com/v1/sessions/${sessionId}`;

//   try {
//     const response = await fetch(url, {
//       method: 'DELETE',
//       headers: {
//         'Authorization': `Bearer ${accessToken}`,
//         'Content-Type': 'application/json', // Although the body is empty, it's good practice to include
//       },
//     });

//     if (response.ok) {
//       console.log(`Session ${sessionId} deleted successfully.`);
//       // The API returns an empty JSON object {} for successful deletion,
//       // but the documentation states an empty response indicates success.
//       // You might want to check if response.status === 200 and response.headers.get('Content-Length') === '0'
//     } else {
//       const errorData = await response.json();
//       console.error(`Failed to delete session ${sessionId}:`, errorData);
//       throw new Error(`Failed to delete session: ${response.status} ${response.statusText}`);
//     }
//   } catch (error) {
//     console.error('Error deleting session:', error);
//     throw error;
//   }
// }

// // Example usage:
// // Replace 'YOUR_SESSION_ID' with the actual session ID you want to delete
// // Replace 'YOUR_ACCESS_TOKEN' with the authenticated user's access token
// // deletePhotoPickerSession('YOUR_SESSION_ID', 'YOUR_ACCESS_TOKEN')
// //   .then(() => console.log('Deletion process completed.'))
// //   .catch((err) => console.error('Deletion process failed:', err));
