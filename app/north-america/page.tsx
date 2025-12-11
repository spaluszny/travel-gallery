import DatabasePhotos from '@/components/databasePhotos';
import AlbumFetcher from '@/components/fetchPhotos'

export default function Home() {

    return (
        <div className="p-10">
            <h2 className="pb-10">NORTH AMERICA</h2>
            <DatabasePhotos continent="North America" />
        </div>
    );
}

//https://photos.app.goo.gl/YSPHAA7gxvjjZ5Wo7