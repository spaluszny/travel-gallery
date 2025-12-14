import DatabasePhotos from "@/components/databasePhotos";
import Newsletter from "@/components/newsletter";
export const dynamic = 'force-dynamic'
export const revalidate = 0
export default function Home() {

    return (
        <div className="p-10">
            <h2 className="pb-10">Europe</h2>
            <DatabasePhotos continent="Europe" />
            <Newsletter/>
        </div>
    );
}