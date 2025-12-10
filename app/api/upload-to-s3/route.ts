import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for server-side
)

const s3client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function POST(req: Request) {
    try {
        const {
            baseUrl,
            filename,
            width,
            height,
            googlePhotoId,
            photoDate,
            continent,
            country,
            state,
            description,
            cameraMake,
            cameraModel,
            takenBy
        } = await req.json()

        // Get access token
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('google_access_token')?.value

        if (!accessToken) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        // Fetch the image directly from Google with auth
        const imageUrl = `${baseUrl}=w${width}-h${height}`
        const imageResponse = await fetch(imageUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        })

        if (!imageResponse.ok) {
            throw new Error('Failed to fetch image from Google')
        }

        const imageBuffer = await imageResponse.arrayBuffer()

        // Generate unique filename
        const key = `photos/${Date.now()}-${filename}`

        // Upload to S3
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: key,
            Body: Buffer.from(imageBuffer),
            ContentType: 'image/jpeg',
        })

        await s3client.send(command)

        // Construct the public URL
        const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

        const { error } = await supabase
            .from('photos')
            .insert({
                google_photo_id: googlePhotoId,
                photo_date: photoDate,
                photo_url: s3Url,
                s3_key: key,
                filename: filename,
                continent: continent,
                country: country,
                state: state,
                description: description,
                camera_make: cameraMake,
                camera_model: cameraModel,
                width: width,
                height: height,
                taken_by: takenBy,
            })

        if (error) {
            throw new Error(`Database error: ${error.message}`)
        }

        return NextResponse.json({
            success: true,
            url: s3Url,
            key: key
        })

    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Error uploading file' }, { status: 500 })
    }
}