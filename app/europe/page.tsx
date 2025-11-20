import AlbumFetcher from "@/components/fetchPhotos";
export default function Home() {

    return (
        <div className="p-10">
            <h2 className="pb-10">EUROPE</h2>
            <AlbumFetcher linkURL="https://photos.app.goo.gl/3ipE9MwjypfY35DS9" />
        </div>
    );
}