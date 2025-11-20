
import axios from "axios"
import Image from "next/image"

export default async function AlbumFetcher({ linkURL }: { linkURL: string }) {
  const response = await axios.get(linkURL)
  
  const regex = /\["(https:\/\/lh3\.googleusercontent\.com\/pw\/[a-zA-Z0-9\-_]+)"/g

  
  const responseText = typeof response.data === 'string' 
    ? response.data 
    : JSON.stringify(response.data)
  const matches = [...responseText.matchAll(regex)]
  const urls = matches.map(match => match[1])
  
  return (
  <div className="columns-1 md:columns-2 gap-4">
  {urls.map((url, index) => (
    <div key={index} className="mb-4 break-inside-avoid">
      <Image
        src={url}
        alt={`Image ${index + 1}`}
        width={500}
        height={0}
        className="w-full h-auto"
      />
    </div>
  ))}
</div>
)
}


//https://medium.com/@ValentinHervieu/how-i-used-google-photos-to-host-my-website-pictures-gallery-d49f037c8e3c
