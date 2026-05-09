'use client'
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

type Location = {
  state: string
  country: string
  continent: string
  lat: number
  lng: number
}

export default function Map({ locations }: { locations: Location[] }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-20">
      <ComposableMap style={{ width: "100%", height: "auto" }}>
        <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo} fill="#D6D6DA" stroke="#fff" strokeWidth={0.5} />
            ))
          }
        </Geographies>
        {locations.map(({ state, lat, lng }) => (
          <Marker key={state} coordinates={[lng, lat]}>
            <text fontSize={15} textAnchor="middle" y={0}>📍</text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  )
}