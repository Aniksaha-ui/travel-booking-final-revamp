export const tripPerformanceColumns = [
  {
    id: 'trip',
    label: 'Trip',
    render: (item) => (
      <div>
        <div className="font-semibold text-white">{item.tripName}</div>
        <div className="mt-1 text-xs text-[#8fa0bd]">{item.periodLabel}</div>
      </div>
    ),
    width: '220px',
  },
  {
    id: 'seats',
    label: 'Seat Summary',
    render: (item) => (
      <div className="flex flex-wrap gap-2 text-[11px] font-bold">
        <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-blue-200">
          Total {item.totalBookedSeatsLabel}
        </span>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-200">
          Trip {item.bookedTripSeatsLabel}
        </span>
        <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-cyan-200">
          Package {item.bookedPackageSeatsLabel}
        </span>
        <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-amber-200">
          Open {item.availableSeatsLabel}
        </span>
      </div>
    ),
    sortable: false,
    width: '250px',
  },
  {
    accessor: 'tripIncomeLabel',
    id: 'tripIncome',
    label: 'Trip Income',
    width: '130px',
  },
  {
    accessor: 'packageIncomeLabel',
    id: 'packageIncome',
    label: 'Package Income',
    width: '140px',
  },
  {
    accessor: 'totalCostLabel',
    id: 'totalCost',
    label: 'Total Cost',
    width: '130px',
  },
  {
    id: 'profits',
    label: 'Profit Split',
    render: (item) => (
      <div className="space-y-1">
        <div className={item.tripProfit >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
          Trip {item.tripProfitLabel}
        </div>
        <div className={item.packageProfit >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
          Package {item.packageProfitLabel}
        </div>
      </div>
    ),
    width: '170px',
  },
]
