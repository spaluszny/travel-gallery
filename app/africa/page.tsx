import AlbumFetcher from "@/components/fetchPhotos";
export default function Home() {

    return (
        <div className="p-10">
            <h2 className="pb-10">AFRICA</h2>
            <AlbumFetcher linkURL="https://photos.app.goo.gl/M4RKEFcn4Dbwef8C7" />
        </div>

    );
}

