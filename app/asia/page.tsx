//import AlbumFetcher from "@/components/fetchPhotos";
import DatabasePhotos from "@/components/databasePhotos";

export default function Home() {

    return (
        <div className="p-10">
            <h2 className="pb-10">ASIA</h2>
            <DatabasePhotos continent="Asia"/>
        </div>
    );
}