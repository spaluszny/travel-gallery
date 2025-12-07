import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('google_access_token')?.value

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const response = await fetch('https://photospicker.googleapis.com/v1/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    })

    console.log('Response status:', response.status)

    if (!response.ok) {
      const error = await response.text()
      console.error('Session creation failed:', error)
      return NextResponse.json({ error: 'Failed to create session', details: error }, { status: response.status })
    }
  

    const data = await response.json()
    console.log('Session created successfully:', data)
    //const pickerUri = data.pickerUri + '/autoclose';
    //return pickerUri;
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

//From google api website


// Assuming you have an authenticated client or a way to make authenticated API calls.
// The exact client setup will depend on your authentication method (e.g., OAuth 2.0).

// interface SessionResponse {
//   id: string;
//   pickerUri: string;
//   pollingConfig: {
//     pollInterval: string; // e.g., "5s"
//     timeoutIn: string;    // e.g., "300s"
//   };
//   mediaItemsSet: boolean;
// }

// async function createPhotoPickerSession(): Promise<string | null> {
//   // Ensure the necessary authorization scope is included.
//   // The 'photospicker.mediaitems.readonly' scope is required for working with sessions.
//   const requiredScope = 'https://www.googleapis.com/auth/photospicker.mediaitems.readonly';

//   // In a real application, you would use your authenticated API client
//   // to make a POST request to the sessions.create endpoint.
//   // This example uses a placeholder for the API call.
//   try {
//     const response = await fetch('https://photospicker.googleapis.com/v1/sessions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         // Replace 'YOUR_ACCESS_TOKEN' with the actual access token obtained after user authentication.
//         'Authorization': `Bearer YOUR_ACCESS_TOKEN`,
//       },
//       // The request body might contain optional parameters, such as a requestId.
//       body: JSON.stringify({
//         // You can optionally include a requestId for streamlined picking experience.
//         // requestId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
//       }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error('Failed to create session:', errorData);
//       throw new Error(`API error: ${response.status} ${response.statusText}`);
//     }

//     const session: SessionResponse = await response.json();
//     console.log('Session created successfully:', session);

//     // The pickerUri is what you present to the user.
//     // For web-based applications, you can append /autoclose to automatically close the window.
//     const pickerUri = session.pickerUri + '/autoclose';
//     return pickerUri;

//   } catch (error) {
//     console.error('Error creating photo picker session:', error);
//     return null;
//   }
// }

// // Example usage:
// // createPhotoPickerSession().then(uri => {
// //   if (uri) {
// //     console.log('Please direct the user to this URI:', uri);
// //     // You would typically open this URI in a new window or tab for the user.
// //     // window.open(uri, '_blank');
// //   } else {
// //     console.log('Could not create a session.');
// //   }
// // });
