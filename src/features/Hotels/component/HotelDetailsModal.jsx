import {
  BedDouble,
  ExternalLink,
  Hotel,
  Image,
  Mail,
  MapPinned,
  Star,
  UsersRound,
  X,
} from 'lucide-react'
import { HOTELS_EMPTY_STATE } from '../constants/hotels.constants'

function DetailField({ label, value }) {
  return (
    <div className="rounded-lg border border-[#332d30] bg-[#171314] p-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">{label}</p>
      <p className="mt-2 break-words text-sm font-semibold text-white">{value}</p>
    </div>
  )
}

export function HotelDetailsModal({ error, fallbackHotel, hotel, isLoading, onClose }) {
  if (!fallbackHotel && !isLoading && !error) {
    return null
  }

  const activeHotel = hotel?.id ? hotel : fallbackHotel

  return (
    <div className="crud-modal" role="dialog" aria-modal="true">
      <button type="button" className="crud-modal__backdrop" aria-label="Close hotel details" onClick={onClose} />

      <section className="crud-modal__panel" style={{ width: 'min(1160px, 100%)' }}>
        <header className="crud-modal__header">
          <div className="min-w-0">
            <p className="crud-modal__eyebrow">Hotel Details</p>
            <h2>{activeHotel?.name || 'Hotel'}</h2>
            <p className="mt-2 text-sm text-[#8fa0bd]">
              Review supplier profile, location coverage, room types, and seasonal pricing
              snapshots.
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:w-auto sm:justify-end">
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-amber-100">
              <Star size={12} />
              {activeHotel?.starRatingLabel || '-'}
            </span>
            <button type="button" aria-label="Close hotel details" onClick={onClose}>
              <X size={14} />
            </button>
          </div>
        </header>

        <div className="max-h-[72vh] overflow-y-auto p-4 sm:p-5">
          {isLoading ? (
            <div className="flex min-h-[280px] items-center justify-center rounded-lg border border-[#332d30] bg-[#171314] text-sm font-semibold text-[#8fa0bd]">
              Loading hotel details...
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-900/60 bg-red-950/20 px-4 py-5 text-sm font-medium text-red-200">
              {error}
            </div>
          ) : (
            <>
              <section className="mb-5 grid gap-3 md:grid-cols-4">
                <article className="rounded-lg border border-[#332d30] bg-[#171314] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">Rooms</p>
                  <p className="mt-2 text-lg font-bold text-white">{activeHotel.totalRoomsLabel}</p>
                </article>
                <article className="rounded-lg border border-[#332d30] bg-[#171314] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">Room Types</p>
                  <p className="mt-2 text-lg font-bold text-cyan-200">{activeHotel.roomTypesCountLabel}</p>
                </article>
                <article className="rounded-lg border border-[#332d30] bg-[#171314] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">Facilities</p>
                  <p className="mt-2 text-lg font-bold text-emerald-200">{activeHotel.facilitiesCount}</p>
                </article>
                <article className="rounded-lg border border-[#332d30] bg-[#171314] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">Photos</p>
                  <p className="mt-2 text-lg font-bold text-amber-200">{activeHotel.photosLabel}</p>
                </article>
              </section>

              <section className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1.2fr)]">
                <div className="space-y-5">
                  <div className="rounded-lg border border-[#332d30] bg-[#231f21]">
                    <header className="flex min-h-[50px] items-center gap-2 border-b border-[#2d282b] px-4 sm:px-5">
                      <Hotel size={16} className="text-blue-400" />
                      <h3 className="text-sm font-bold text-white">Profile</h3>
                    </header>
                    <div className="grid gap-3 p-4 md:grid-cols-2">
                      <DetailField label="Hotel Name" value={activeHotel.name} />
                      <DetailField label="Email" value={activeHotel.email} />
                      <DetailField label="Location" value={activeHotel.locationLabel} />
                      <DetailField label="Website" value={activeHotel.websiteHostLabel} />
                    </div>
                    <div className="px-4 pb-4">
                      <div className="rounded-lg border border-[#332d30] bg-[#171314] p-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">Description</p>
                        <p className="mt-2 text-sm leading-7 text-white">{activeHotel.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-[#332d30] bg-[#231f21]">
                    <header className="flex min-h-[50px] items-center gap-2 border-b border-[#2d282b] px-4 sm:px-5">
                      <MapPinned size={16} className="text-cyan-400" />
                      <h3 className="text-sm font-bold text-white">Facilities</h3>
                    </header>
                    <div className="flex flex-wrap gap-2 p-4">
                      {activeHotel.facilitiesList.length ? (
                        activeHotel.facilitiesList.map((facility) => (
                          <span
                            key={facility}
                            className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-cyan-100"
                          >
                            {facility}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-[#8fa0bd]">{HOTELS_EMPTY_STATE.noFacilities}</p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border border-[#332d30] bg-[#231f21]">
                    <header className="flex min-h-[50px] items-center gap-2 border-b border-[#2d282b] px-4 sm:px-5">
                      <Image size={16} className="text-amber-400" />
                      <h3 className="text-sm font-bold text-white">Photos & Links</h3>
                    </header>
                    <div className="space-y-3 p-4">
                      <div className="grid gap-3 md:grid-cols-2">
                        <a
                          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                            activeHotel.email !== HOTELS_EMPTY_STATE.noEmail
                              ? 'border-[#332d30] bg-[#171314] text-[#c5d9f7] hover:bg-white/5 hover:text-white'
                              : 'cursor-default border-[#332d30] bg-[#171314] text-[#8fa0bd]'
                          }`}
                          href={activeHotel.email !== HOTELS_EMPTY_STATE.noEmail ? `mailto:${activeHotel.email}` : undefined}
                        >
                          <Mail size={14} />
                          Email Hotel
                        </a>
                        <a
                          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                            activeHotel.website
                              ? 'border-[#332d30] bg-[#171314] text-[#c5d9f7] hover:bg-white/5 hover:text-white'
                              : 'cursor-default border-[#332d30] bg-[#171314] text-[#8fa0bd]'
                          }`}
                          href={
                            activeHotel.website
                              ? activeHotel.website.startsWith('http')
                                ? activeHotel.website
                                : `https://${activeHotel.website}`
                              : undefined
                          }
                          rel="noreferrer"
                          target="_blank"
                        >
                          <ExternalLink size={14} />
                          Visit Website
                        </a>
                      </div>

                      {activeHotel.photos.length ? (
                        <div className="grid gap-2">
                          {activeHotel.photos.map((photo) => (
                            <a
                              key={photo.id}
                              className="inline-flex items-center justify-between gap-3 rounded-lg border border-[#332d30] bg-[#171314] px-3 py-2 text-sm font-semibold text-[#c5d9f7] transition hover:bg-white/5 hover:text-white"
                              href={photo.url}
                              rel="noreferrer"
                              target="_blank"
                            >
                              <span>{photo.label}</span>
                              <ExternalLink size={14} />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-[#8fa0bd]">{HOTELS_EMPTY_STATE.noPhotos}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-[#332d30] bg-[#231f21]">
                  <header className="flex min-h-[50px] items-center gap-2 border-b border-[#2d282b] px-4 sm:px-5">
                    <BedDouble size={16} className="text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Room Inventory</h3>
                  </header>

                  <div className="space-y-4 p-4">
                    {activeHotel.rooms.length ? (
                      activeHotel.rooms.map((room) => (
                        <article key={room.id} className="rounded-lg border border-[#332d30] bg-[#171314] p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold text-white">{room.typeName}</p>
                              <p className="mt-1 text-xs text-[#8fa0bd]">{room.priceCountLabel}</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <span className="inline-flex items-center gap-1 rounded-full border border-[#3a3337] bg-[#211d20] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#c5d9f7]">
                                <UsersRound size={12} />
                                {room.maxOccupancyLabel}
                              </span>
                              <span className="inline-flex rounded-full border border-[#3a3337] bg-[#211d20] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">
                                {room.totalRoomsLabel}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <DetailField label="Room Size" value={room.roomSizeLabel} />
                            <DetailField
                              label="Amenities"
                              value={room.amenitiesList.length ? room.amenitiesList.join(', ') : HOTELS_EMPTY_STATE.noFacilities}
                            />
                          </div>

                          <div className="mt-4 overflow-x-auto">
                            <table className="w-full min-w-[420px] border-collapse overflow-hidden rounded-lg border border-[#332d30] bg-[#120f10]">
                              <thead>
                                <tr className="bg-[#171314] text-left text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa0bd]">
                                  <th className="px-4 py-3">Season</th>
                                  <th className="px-4 py-3">Rate / Night</th>
                                </tr>
                              </thead>
                              <tbody>
                                {room.prices.length ? (
                                  room.prices.map((price) => (
                                    <tr key={price.id} className="border-t border-[#2d282b] text-sm text-slate-200">
                                      <td className="px-4 py-3">{price.seasonLabel}</td>
                                      <td className="px-4 py-3 font-semibold text-white">{price.pricePerNightLabel}</td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={2} className="px-4 py-4 text-center text-sm text-[#8fa0bd]">
                                      No seasonal pricing available.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-dashed border-[#332d30] bg-[#171314] px-5 py-8 text-center text-sm font-medium text-[#8fa0bd]">
                        {HOTELS_EMPTY_STATE.noRooms}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
