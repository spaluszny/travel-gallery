import DatabasePhotos from "@/components/databasePhotos";
import AlbumFetcher from "@/components/fetchPhotos";
export default function Home() {

    return (
        <div className="p-10">
            <h2 className="pb-10">Africa</h2>
            <DatabasePhotos continent="Africa" />
        </div>
    );
}

