import { ArrowLeft, BedDouble, Hotel, Plus, Save, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '../../../components/common/Toaster'
import { APP_ROUTES } from '../../../constants/routes'
import {
  createEmptyHotelPrice,
  createEmptyHotelRoom,
} from '../constants/hotels.constants'
import {
  createHotel,
  getHotelDetails,
  updateHotel,
} from '../service/hotelsService'
import {
  buildHotelFormData,
  buildHotelFormState,
} from '../utils/hotelsUtils'

function SectionCard({ children, description, title }) {
  return (
    <section className="rounded-[24px] border border-[#2d282b] bg-[#171314] shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
      <header className="border-b border-[#2d282b] px-5 py-4">
        <h2 className="text-sm font-bold text-white">{title}</h2>
        <p className="mt-2 text-sm text-[#8fa0bd]">{description}</p>
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}

export default function HotelFormPage({ action = 'add' }) {
  const navigate = useNavigate()
  const toast = useToast()
  const { id } = useParams()
  const isEditing = action === 'update'
  const [formData, setFormData] = useState(buildHotelFormState())
  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isEditing || !id) {
      return undefined
    }

    let mounted = true

    const loadHotel = async () => {
      setIsLoading(true)

      try {
        const hotel = await getHotelDetails(id)

        if (!mounted) {
          return
        }

        setFormData(buildHotelFormState(hotel))
      } catch (error) {
        if (!mounted) {
          return
        }

        toast.error(error.message || 'Unable to load hotel details.')
        navigate(APP_ROUTES.hotels)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    void loadHotel()

    return () => {
      mounted = false
    }
  }, [id, isEditing, navigate, toast])

  const updateField = (name, value) => {
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  const updateRoomField = (roomIndex, field, value) => {
    setFormData((currentData) => ({
      ...currentData,
      rooms: currentData.rooms.map((room, index) =>
        index === roomIndex
          ? {
              ...room,
              [field]: value,
            }
          : room,
      ),
    }))
  }

  const updateRoomPriceField = (roomIndex, priceIndex, field, value) => {
    setFormData((currentData) => ({
      ...currentData,
      rooms: currentData.rooms.map((room, index) =>
        index === roomIndex
          ? {
              ...room,
              prices: room.prices.map((price, nestedIndex) =>
                nestedIndex === priceIndex
                  ? {
                      ...price,
                      [field]: value,
                    }
                  : price,
              ),
            }
          : room,
      ),
    }))
  }

  const addRoom = () => {
    setFormData((currentData) => ({
      ...currentData,
      rooms: [...currentData.rooms, createEmptyHotelRoom()],
    }))
  }

  const removeRoom = (roomIndex) => {
    setFormData((currentData) => ({
      ...currentData,
      rooms:
        currentData.rooms.length === 1
          ? [createEmptyHotelRoom()]
          : currentData.rooms.filter((_, index) => index !== roomIndex),
    }))
  }

  const addPrice = (roomIndex) => {
    setFormData((currentData) => ({
      ...currentData,
      rooms: currentData.rooms.map((room, index) =>
        index === roomIndex
          ? {
              ...room,
              prices: [...room.prices, createEmptyHotelPrice()],
            }
          : room,
      ),
    }))
  }

  const removePrice = (roomIndex, priceIndex) => {
    setFormData((currentData) => ({
      ...currentData,
      rooms: currentData.rooms.map((room, index) =>
        index === roomIndex
          ? {
              ...room,
              prices:
                room.prices.length === 1
                  ? [createEmptyHotelPrice()]
                  : room.prices.filter((_, nestedIndex) => nestedIndex !== priceIndex),
            }
          : room,
      ),
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Hotel name is required.')
      return
    }

    try {
      setIsSubmitting(true)
      const payload = buildHotelFormData(formData)

      if (isEditing && id) {
        await updateHotel(id, payload)
        toast.success('Hotel updated successfully.')
      } else {
        await createHotel(payload)
        toast.success('Hotel created successfully.')
      }

      navigate(APP_ROUTES.hotels)
    } catch (error) {
      toast.error(error.message || `Unable to ${isEditing ? 'update' : 'create'} hotel.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <main className="routes-page">
        <div className="routes-page__inner">
          <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-[#2d282b] bg-[#171314] text-sm font-semibold text-[#8fa0bd]">
            Loading hotel form...
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="routes-page">
      <div className="routes-page__inner space-y-5">
        <header className="rounded-[28px] border border-[#2d282b] bg-[#171314] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#332d30] bg-[#211d20] text-[#c5d9f7]"
                onClick={() => navigate(APP_ROUTES.hotels)}
              >
                <ArrowLeft size={16} />
              </button>

              <div>
                <div className="routes-page__title">
                  <Hotel size={20} color="#4f83ff" />
                  <h1>{isEditing ? 'Edit Hotel' : 'Add Hotel'}</h1>
                </div>
                <p className="routes-page__subtitle">
                  Capture supplier profile details, facilities, media links, and room pricing in
                  one place.
                </p>
              </div>
            </div>

            <div className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]">
              <BedDouble size={16} />
              <span>{formData.rooms.length} room type entries</span>
            </div>
          </div>
        </header>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <SectionCard
            title="Hotel Profile"
            description="Set the core supplier identity, destination coverage, and contact channels."
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <label className="crud-field xl:col-span-2">
                <span>Hotel Name</span>
                <input
                  name="name"
                  placeholder="Enter hotel name"
                  value={formData.name}
                  onChange={(event) => updateField('name', event.target.value)}
                />
              </label>

              <label className="crud-field">
                <span>Star Rating</span>
                <input
                  min="0"
                  name="star_rating"
                  placeholder="4.5"
                  step="0.1"
                  type="number"
                  value={formData.star_rating}
                  onChange={(event) => updateField('star_rating', event.target.value)}
                />
              </label>

              <label className="crud-field">
                <span>Email</span>
                <input
                  name="email"
                  placeholder="hotel@example.com"
                  type="email"
                  value={formData.email}
                  onChange={(event) => updateField('email', event.target.value)}
                />
              </label>

              <label className="crud-field">
                <span>Website</span>
                <input
                  name="website"
                  placeholder="www.hotel-site.com"
                  value={formData.website}
                  onChange={(event) => updateField('website', event.target.value)}
                />
              </label>

              <label className="crud-field">
                <span>Location</span>
                <input
                  name="location"
                  placeholder="Beachfront / Airport Road / Downtown"
                  value={formData.location}
                  onChange={(event) => updateField('location', event.target.value)}
                />
              </label>

              <label className="crud-field">
                <span>City</span>
                <input
                  name="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={(event) => updateField('city', event.target.value)}
                />
              </label>

              <label className="crud-field">
                <span>Country</span>
                <input
                  name="country"
                  placeholder="Enter country"
                  value={formData.country}
                  onChange={(event) => updateField('country', event.target.value)}
                />
              </label>
            </div>
          </SectionCard>

          <SectionCard
            title="Content & Media"
            description="Describe the property, list major facilities, and provide photo links for internal reference."
          >
            <div className="grid gap-4 xl:grid-cols-2">
              <label className="crud-field">
                <span>Description</span>
                <textarea
                  name="description"
                  placeholder="Describe the hotel experience, strengths, and traveler fit."
                  rows={6}
                  value={formData.description}
                  onChange={(event) => updateField('description', event.target.value)}
                />
              </label>

              <div className="space-y-4">
                <label className="crud-field">
                  <span>Facilities</span>
                  <textarea
                    name="facilities"
                    placeholder="Pool, Spa, Wifi, Breakfast, Airport shuttle..."
                    rows={4}
                    value={formData.facilities}
                    onChange={(event) => updateField('facilities', event.target.value)}
                  />
                  <small>Use commas or new lines to separate facilities.</small>
                </label>

                <label className="crud-field">
                  <span>Photo Links</span>
                  <textarea
                    name="photos"
                    placeholder="https://.../cover.jpg, https://.../lobby.jpg"
                    rows={5}
                    value={formData.photos}
                    onChange={(event) => updateField('photos', event.target.value)}
                  />
                  <small>Use commas or new lines to separate photo URLs.</small>
                </label>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Room Inventory"
            description="Define room types, occupancy, available room count, and seasonal nightly pricing."
          >
            <div className="space-y-4">
              {formData.rooms.map((room, roomIndex) => (
                <article
                  key={`hotel-room-${roomIndex}`}
                  className="rounded-[22px] border border-[#332d30] bg-[#211d20] p-4 shadow-[0_12px_28px_rgba(0,0,0,0.16)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-white">Room Type {roomIndex + 1}</h3>
                      <p className="mt-1 text-sm text-[#8fa0bd]">
                        Configure type, occupancy, amenities, and nightly rates.
                      </p>
                    </div>

                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
                      onClick={() => removeRoom(roomIndex)}
                    >
                      <Trash2 size={14} />
                      Remove Room
                    </button>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <label className="crud-field">
                      <span>Room Type</span>
                      <input
                        placeholder="Deluxe Suite"
                        value={room.type_name}
                        onChange={(event) => updateRoomField(roomIndex, 'type_name', event.target.value)}
                      />
                    </label>

                    <label className="crud-field">
                      <span>Room Size</span>
                      <input
                        placeholder="420 sq ft"
                        value={room.room_size}
                        onChange={(event) => updateRoomField(roomIndex, 'room_size', event.target.value)}
                      />
                    </label>

                    <label className="crud-field">
                      <span>Max Occupancy</span>
                      <input
                        min="1"
                        type="number"
                        value={room.max_occupancy}
                        onChange={(event) =>
                          updateRoomField(roomIndex, 'max_occupancy', event.target.value)
                        }
                      />
                    </label>

                    <label className="crud-field">
                      <span>Total Rooms</span>
                      <input
                        min="1"
                        type="number"
                        value={room.total_rooms}
                        onChange={(event) => updateRoomField(roomIndex, 'total_rooms', event.target.value)}
                      />
                    </label>

                    <label className="crud-field md:col-span-2 xl:col-span-4">
                      <span>Amenities</span>
                      <textarea
                        placeholder="King bed, balcony, minibar, work desk..."
                        rows={3}
                        value={room.amenities}
                        onChange={(event) => updateRoomField(roomIndex, 'amenities', event.target.value)}
                      />
                    </label>
                  </div>

                  <div className="mt-5 rounded-[18px] border border-[#332d30] bg-[#171314] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-white">Seasonal Prices</h4>
                        <p className="mt-1 text-xs text-[#8fa0bd]">
                          Add one or more rate windows for this room type.
                        </p>
                      </div>

                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-lg border border-[#332d30] bg-[#211d20] px-3 py-2 text-sm font-semibold text-[#c5d9f7] transition hover:bg-white/5 hover:text-white"
                        onClick={() => addPrice(roomIndex)}
                      >
                        <Plus size={14} />
                        Add Price
                      </button>
                    </div>

                    <div className="mt-4 space-y-3">
                      {room.prices.map((price, priceIndex) => (
                        <div
                          key={`hotel-room-${roomIndex}-price-${priceIndex}`}
                          className="grid gap-3 rounded-xl border border-[#332d30] bg-[#211d20] p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
                        >
                          <label className="crud-field">
                            <span>Season Start</span>
                            <input
                              type="date"
                              value={price.season_start}
                              onChange={(event) =>
                                updateRoomPriceField(roomIndex, priceIndex, 'season_start', event.target.value)
                              }
                            />
                          </label>

                          <label className="crud-field">
                            <span>Season End</span>
                            <input
                              type="date"
                              value={price.season_end}
                              onChange={(event) =>
                                updateRoomPriceField(roomIndex, priceIndex, 'season_end', event.target.value)
                              }
                            />
                          </label>

                          <label className="crud-field">
                            <span>Price Per Night</span>
                            <input
                              min="0"
                              placeholder="150"
                              type="number"
                              value={price.price_per_night}
                              onChange={(event) =>
                                updateRoomPriceField(roomIndex, priceIndex, 'price_per_night', event.target.value)
                              }
                            />
                          </label>

                          <button
                            type="button"
                            className="inline-flex h-11 items-center justify-center self-end rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
                            onClick={() => removePrice(roomIndex, priceIndex)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ))}

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-[#332d30] bg-[#171314] px-4 py-3 text-sm font-semibold text-[#c5d9f7] transition hover:bg-white/5 hover:text-white"
                onClick={addRoom}
              >
                <Plus size={15} />
                Add Room Type
              </button>
            </div>
          </SectionCard>

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#332d30] bg-[#171314] px-4 text-sm font-semibold text-[#c5d9f7]"
              onClick={() => navigate(APP_ROUTES.hotels)}
            >
              <ArrowLeft size={15} />
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-5 text-sm font-semibold text-blue-100 transition hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
            >
              <Save size={15} />
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Hotel' : 'Create Hotel'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
