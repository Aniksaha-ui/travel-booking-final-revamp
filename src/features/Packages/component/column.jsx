import { PackageFeatureBadgeList } from './PackageFeatureBadgeList.jsx'

export const packageColumns = [
  {
    id: 'package',
    label: 'Package',
    render: (item) => (
      <div>
        <div className="font-semibold text-white">{item.name}</div>
        <div className="mt-1 text-xs text-[#8fa0bd]">Package #{item.id}</div>
      </div>
    ),
    width: '240px',
  },
  {
    accessor: 'tripName',
    id: 'trip',
    label: 'Trip',
    width: '220px',
  },
  {
    defaultHidden: true,
    id: 'description',
    label: 'Description',
    render: (item) => <span className="text-[#b4c5df]">{item.descriptionPreview}</span>,
    width: '320px',
  },
  {
    id: 'services',
    label: 'Included Services',
    render: (item) => <PackageFeatureBadgeList packageItem={item} />,
    sortable: false,
    width: '260px',
  },
  {
    accessor: 'pricingCountLabel',
    id: 'pricing',
    label: 'Pricing',
    width: '130px',
  },
]

