import { ExternalLink, Mail, MapPinned, Star } from 'lucide-react'

function FacilitiesCell({ hotel }) {
  if (!hotel.facilitiesList.length) {
    return <span className="text-[#8fa0bd]">No facilities listed</span>
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {hotel.facilitiesPreview.map((facility) => (
        <span
          key={facility}
          className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-cyan-100"
        >
          {facility}
        </span>
      ))}
      {hotel.facilitiesCount > hotel.facilitiesPreview.length ? (
        <span className="inline-flex rounded-full border border-[#3a3337] bg-[#171314] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">
          +{hotel.facilitiesCount - hotel.facilitiesPreview.length}
        </span>
      ) : null}
    </div>
  )
}

export const hotelColumns = [
  {
    accessor: 'serial',
    id: 'serial',
    label: 'SL',
    width: '72px',
  },
  {
    id: 'hotel',
    label: 'Hotel',
    render: (hotel) => (
      <div>
        <div className="font-semibold text-white">{hotel.name}</div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#8fa0bd]">
          <span className="inline-flex items-center gap-1">
            <Star size={12} className="text-amber-300" />
            {hotel.starRatingLabel}
          </span>
          <span>{hotel.photoCountLabel}</span>
        </div>
      </div>
    ),
    width: '220px',
  },
  {
    id: 'contact',
    label: 'Contact',
    render: (hotel) => (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-white">
          <Mail size={13} className="text-[#7ea1ff]" />
          <span className="break-all">{hotel.email}</span>
        </div>
        {hotel.website ? (
          <a
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#9fd6ff] hover:text-white"
            href={hotel.website.startsWith('http') ? hotel.website : `https://${hotel.website}`}
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink size={12} />
            {hotel.websiteHostLabel}
          </a>
        ) : (
          <span className="text-xs text-[#8fa0bd]">No website listed</span>
        )}
      </div>
    ),
    width: '220px',
  },
  {
    id: 'location',
    label: 'Location',
    render: (hotel) => (
      <div>
        <div className="flex items-start gap-2 text-sm text-white">
          <MapPinned size={13} className="mt-0.5 shrink-0 text-[#7ea1ff]" />
          <span>{hotel.locationLabel}</span>
        </div>
      </div>
    ),
    width: '220px',
  },
  {
    id: 'rooms',
    label: 'Room Inventory',
    render: (hotel) => (
      <div>
        <div className="font-semibold text-white">{hotel.totalRoomsLabel}</div>
        <div className="mt-1 text-xs text-[#8fa0bd]">{hotel.roomTypesCountLabel}</div>
      </div>
    ),
    width: '150px',
  },
  {
    id: 'facilities',
    label: 'Facilities',
    render: (hotel) => <FacilitiesCell hotel={hotel} />,
    width: '260px',
  },
]
