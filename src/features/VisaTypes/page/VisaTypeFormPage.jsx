import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '../../../components/common/Toaster'
import { APP_ROUTES } from '../../../constants/routes'
import { VisaTypeFormModal } from '../component/VisaTypeFormModal'
import { fetchVisaCountryOptions, fetchVisaTypeById, visaTypesApi } from '../service/visaTypesService'
import { buildVisaTypePayload } from '../utils/visaTypesUtils'

export default function VisaTypeFormPage({ action }) {
  const isEdit = action === 'update'
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [countries, setCountries] = useState([])
  const [visaType, setVisaType] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  useEffect(() => { let active = true; (async () => { try { const [countryOptions, details] = await Promise.all([fetchVisaCountryOptions(), isEdit ? fetchVisaTypeById(id) : Promise.resolve(null)]); if (!active) return; setCountries(countryOptions); setVisaType(details) } catch (error) { toast.error(error.message || 'Unable to load visa type form.'); if (isEdit) navigate(APP_ROUTES.visaTypes) } finally { if (active) setLoading(false) } })(); return () => { active = false } }, [id, isEdit, navigate, toast])
  const submit = async (values) => { try { setSaving(true); if (isEdit) await visaTypesApi.update(id, buildVisaTypePayload(values)); else await visaTypesApi.create(buildVisaTypePayload(values)); toast.success(`Visa type ${isEdit ? 'updated' : 'created'} successfully.`); navigate(APP_ROUTES.visaTypes) } catch (error) { toast.error(error.message || 'Unable to save visa type.') } finally { setSaving(false) } }
  return <VisaTypeFormModal countries={countries} countriesLoading={loading} isLoading={loading && isEdit} isMutating={saving} mode={isEdit ? 'edit' : 'create'} onClose={() => navigate(APP_ROUTES.visaTypes)} onSubmit={submit} visaType={visaType} />
}
