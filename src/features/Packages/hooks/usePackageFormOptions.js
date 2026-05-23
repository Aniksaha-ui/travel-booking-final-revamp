import { useEffect, useState } from 'react'
import { useToast } from '../../../components/common/Toaster'
import {
  fetchPackageGuideDropdown,
  fetchPackageTripDropdown,
} from '../service/packagesService'

export default function usePackageFormOptions() {
  const toast = useToast()
  const [guides, setGuides] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [trips, setTrips] = useState([])

  useEffect(() => {
    let mounted = true

    const loadOptions = async () => {
      setIsLoading(true)

      try {
        const [guideRows, tripRows] = await Promise.all([
          fetchPackageGuideDropdown(),
          fetchPackageTripDropdown(),
        ])

        if (!mounted) {
          return
        }

        setGuides(guideRows)
        setTrips(tripRows)
      } catch (error) {
        if (!mounted) {
          return
        }

        toast.error(error.message || 'Unable to load package form options.')
        setGuides([])
        setTrips([])
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadOptions()

    return () => {
      mounted = false
    }
  }, [toast])

  return {
    guides,
    isLoading,
    trips,
  }
}

