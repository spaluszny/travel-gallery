import { createClient } from '@supabase/supabase-js'
import Map from "@/components/map"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function MapPage() {
  const { data: locations, error } = await supabase
    .from('unique_travel_locations')
    .select('state, country, continent, lat, lng')

  if (error) console.error(error)

  return <Map locations={locations ?? []} />
}