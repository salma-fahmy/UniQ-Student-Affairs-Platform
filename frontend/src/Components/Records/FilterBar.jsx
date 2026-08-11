import React from 'react';
import SearchInput from '../Shared/SearchInput';
import SelectField from '../Shared/SelectField';
import { FiChevronDown } from 'react-icons/fi';

const FilterBar = ({ 
  searchQuery, 
  onSearchChange,
  searchPlaceholder = 'Search complaints...',
  categoryFilter,
  categories = [],
  onCategoryChange,
  typeFilter,
  types = [],
  onTypeChange,
  sortBy,
  onSortChange,
}) => {
  const allTabs = ['All', ...categories];
  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'status', label: 'Status' },
  ];

  const currentSortLabel = sortOptions.find(o => o.value === sortBy)?.label || 'Latest';

  return (
    <section className="mb-6 flex flex-col gap-6 relative z-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            ariaLabel={searchPlaceholder}
            className="w-full md:max-w-[400px]"
          />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0 z-50">
             {types.length > 0 && onTypeChange && (
               <SelectField 
                 value={typeFilter}
                 onChange={onTypeChange}
                 options={types}
                 allLabel="All Types"
                 label="Filter by type"
                 className="min-w-[180px]"
               />
             )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {allTabs.map(tab => {
            const value = typeof tab === 'object' ? tab.value : tab;
            const label = typeof tab === 'object' ? tab.label : tab;
            const isSelected = categoryFilter === value;

            return (
              <button
                key={value}
                onClick={() => onCategoryChange(value)}
                className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-[13.5px] font-bold transition-all duration-300 ${
                  isSelected 
                    ? 'bg-indigo-800 text-white shadow-sm' 
                    : 'bg-[#F4F1FD] text-indigo-950 hover:bg-indigo-100 hover:shadow-sm'
                }`}
              >
                {label === 'All' ? 'All Statuses' : label}
              </button>
            );
          })}
        </div>
    </section>
  );
};

export default FilterBar;
