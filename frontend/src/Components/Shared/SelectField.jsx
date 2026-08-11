import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiCheck, FiChevronDown } from 'react-icons/fi';

const normalizeOptions = (options = []) =>
	options
		.map((option) => {
			if (typeof option === 'string') {
				return { value: option, label: option };
			}

			return {
				value: option.value ?? option.label ?? '',
				label: option.label ?? option.value ?? '',
			};
		})
		.filter((option) => option.value !== '' && option.label !== '');

const SelectField = ({
	label = 'Filter by status',
	value = 'All',
	onChange = () => {},
	options = [],
	allLabel = 'All statuses',
	className = '',
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const wrapperRef = useRef(null);
	const normalizedOptions = useMemo(() => normalizeOptions(options), [options]);
	const dropdownOptions = useMemo(
		() => [{ value: 'All', label: allLabel }, ...normalizedOptions],
		[allLabel, normalizedOptions],
	);

	useEffect(() => {
		const handlePointerDown = (event) => {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		const handleKeyDown = (event) => {
			if (event.key === 'Escape') {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handlePointerDown);
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('mousedown', handlePointerDown);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	const activeLabel = value === 'All'
		? allLabel
		: normalizedOptions.find((option) => option.value === value)?.label || value;

	const handleSelect = (nextValue) => {
		onChange(nextValue);
		setIsOpen(false);
	};

	return (
		<div ref={wrapperRef} className={`relative w-full ${className}`.trim()}>
			<button
				type="button"
				onClick={() => setIsOpen((currentState) => !currentState)}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				aria-label={`${label}: ${activeLabel}`}
className="flex h-[52px] w-full items-center justify-between gap-4 rounded-full border border-indigo-100 bg-white px-5 text-left shadow-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-md focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100/50 focus:shadow-md"			>
				<span className="min-w-0 truncate text-[15px] font-medium text-indigo-900/80">
					{activeLabel}
				</span>

				<span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-indigo-400 transition-colors">
					<FiChevronDown
						size={18}
						className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`}
					/>
				</span>
			</button>

			{isOpen ? (
				<div className="absolute right-0 z-50 mt-2 w-full origin-top overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-[0_12px_40px_-12px_rgba(49,46,129,0.15)] animate-in fade-in zoom-in-95 duration-200">
					<div className="max-h-72 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">
						{dropdownOptions.map((option) => {
							const isSelected = option.value === value;

							return (
								<button
									key={option.value}
									type="button"
									onClick={() => handleSelect(option.value)}
									className={`flex w-full items-center justify-between rounded-[1rem] px-4 py-3 text-sm font-medium transition-colors ${isSelected ? 'bg-indigo-50 text-indigo-900' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
								>
									<span className="truncate pr-3">{option.label}</span>
									{isSelected ? <FiCheck size={16} className="shrink-0 text-indigo-700" /> : null}
								</button>
							);
						})}
					</div>
				</div>
			) : null}
		</div>
	);
};

export default SelectField;