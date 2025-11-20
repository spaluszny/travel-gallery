import AlbumFetcher from "@/components/fetchPhotos";

export default function Home() {

    return (
        <div className="p-10">
            <h2 className="pb-10">ASIA</h2>
            <AlbumFetcher linkURL="https://photos.app.goo.gl/zXwohYEdAk2kbxoA8" />
        </div>
    );
}