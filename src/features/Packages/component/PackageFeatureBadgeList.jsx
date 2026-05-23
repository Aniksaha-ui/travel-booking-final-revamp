export function PackageFeatureBadgeList({ packageItem }) {
  const badges = [
    {
      active: packageItem.includesMeal,
      label: 'Meal',
    },
    {
      active: packageItem.includesHotel,
      label: 'Hotel',
    },
    {
      active: packageItem.includesBus,
      label: 'Vehicle',
    },
  ]

  return (
    <div className="package-feature-badges">
      {badges.map((badge) => (
        <span
          key={badge.label}
          className={`package-feature-badge ${badge.active ? 'is-active' : 'is-inactive'}`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  )
}

