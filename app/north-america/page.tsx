import AlbumFetcher from '@/components/fetchPhotos'

export default function Home() {

    return (
        <div className="p-10">
            <h2 className="pb-10">NORTH AMERICA</h2>
            <AlbumFetcher linkURL="https://photos.app.goo.gl/YSPHAA7gxvjjZ5Wo7" />
        </div>
    );
}

//https://photos.app.goo.gl/YSPHAA7gxvjjZ5Wo7