import DatabasePhotos from "@/components/databasePhotos";
import AlbumFetcher from "@/components/fetchPhotos";
import Newsletter from "@/components/newsletter";
export default function Home() {

    return (
        <div className="p-10">
            <h2 className="pb-10">Europe</h2>
            <DatabasePhotos continent="Europe" />
            <Newsletter/>
        </div>
    );
}