//import AlbumFetcher from "@/components/fetchPhotos";
import DatabasePhotos from "@/components/databasePhotos";
export const dynamic = 'force-dynamic'
export const revalidate = 0
export default function Home() {

    return (
        <div className="p-10">
            <h2 className="pb-10">Asia</h2>
            <DatabasePhotos continent="Asia"/>
        </div>
    );
}