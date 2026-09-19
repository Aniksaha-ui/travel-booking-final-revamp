import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '../../../components/common/Toaster'
import { APP_ROUTES } from '../../../constants/routes'
import { VisaCountryFormModal } from '../component/VisaCountryFormModal'
import { fetchVisaCountryById, visaCountriesApi } from '../service/visaCountriesService'
import { buildVisaCountryPayload } from '../utils/visaCountriesUtils'

export default function VisaCountryFormPage({ action }) {
  const isEdit = action === 'update'
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [country, setCountry] = useState(null)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  useEffect(() => { if (!isEdit) return; let active = true; (async () => { try { const data = await fetchVisaCountryById(id); if (active) setCountry(data) } catch (error) { toast.error(error.message || 'Unable to load visa country details.'); navigate(APP_ROUTES.visaCountries) } finally { if (active) setLoading(false) } })(); return () => { active = false } }, [id, isEdit, navigate, toast])
  const submit = async (values) => { try { setSaving(true); if (isEdit) await visaCountriesApi.update(id, buildVisaCountryPayload(values, 'edit')); else await visaCountriesApi.create(buildVisaCountryPayload(values)); toast.success(`Visa country ${isEdit ? 'updated' : 'created'} successfully.`); navigate(APP_ROUTES.visaCountries) } catch (error) { toast.error(error.message || 'Unable to save visa country.') } finally { setSaving(false) } }
  return <VisaCountryFormModal country={country} isLoading={loading} isMutating={saving} mode={isEdit ? 'edit' : 'create'} onClose={() => navigate(APP_ROUTES.visaCountries)} onSubmit={submit} />
}
