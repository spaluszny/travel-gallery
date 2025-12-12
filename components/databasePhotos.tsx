/* eslint-disable @next/next/no-img-element */
// "use client";
import { createClient } from '@supabase/supabase-js'
import PhotoModal from './photoModal'
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
        <div className="">
        
            <PhotoModal photos={photos}/>
        </div>
    )

}