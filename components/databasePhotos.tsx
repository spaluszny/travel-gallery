/* eslint-disable @next/next/no-img-element */
import { createClient } from '@supabase/supabase-js'
//import Image from 'next/image'

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface DataBasePhotoProps {
    continent?: string
    limit?: number
    orderBy?: 'recent' | 'default'
}

export default async function DatabasePhotos({
    continent,
    limit,
    orderBy = 'recent'
}: DataBasePhotoProps) {

    let query = supabase
        .from('photos')
        .select('*')
        .eq('active', true)

    if (continent) {
        query = query.eq('continent', continent)
    }

    if (orderBy === 'recent') {
        query = query.order('photo_date', { ascending: false })
    }

    if (limit) {
        query = query.limit(limit)
    }

    if (limit) {
        query = query.limit(limit)
    }

    const { data: photos, error } = await query

    if (error) {
        console.error('Database error:', error)
        return <div>Error loading photos</div>
    }

    if (!photos || photos.length === 0) {
        return <div>No photos found</div>
    }

    return (
        <div className="columns-1 md:columns-2 2xl:columns-3 gap-4">
            {photos.map((photo) => (
                <div key={photo.photo_id} className="mb-4 break-inside-avoid">
                    <img
                        src={photo.photo_url}
                        alt={photo.description || photo.filename}
                        width={photo.width}
                        height={photo.height}
                        className="w-full h-auto"
                    />
                </div>
            ))}
        </div>
    )













}