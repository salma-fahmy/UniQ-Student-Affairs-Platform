import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchInput = ({
	value = '',
	onChange = () => {},
	placeholder = 'Search...',
	ariaLabel = 'Search records',
	className = '',
}) => {
	return (
		<label
			className={`group relative flex h-11 w-full items-center rounded-full border border-slate-200 bg-white px-4 shadow-sm transition-all duration-200 focus-within:border-indigo-800 focus-within:ring-1 focus-within:ring-indigo-800 ${className}`.trim()}
		>
			<span className="pointer-events-none text-slate-400 transition-colors group-focus-within:text-indigo-800 mr-2">
				<FiSearch size={18} />
			</span>
			<input
				type="search"
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder={placeholder}
				aria-label={ariaLabel}
				autoComplete="off"
				spellCheck="false"
				className="h-full w-full py-2 border-0 bg-transparent text-[14px] font-medium text-slate-800 outline-none placeholder:text-slate-400"
			/>
		</label>
	);
};

export default SearchInput;