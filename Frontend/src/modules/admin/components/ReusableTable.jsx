import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiChevronLeft, FiChevronRight, FiDownload, FiFilter } from 'react-icons/fi';

export default function ReusableTable({ 
  columns, 
  data, 
  loading = false,
  emptyStateComponent = null,
  hideSearch = false,
  searchPlaceholder = "Search records...", 
  searchKey = "name",
  filterOptions = null, // e.g. { key: 'status', label: 'Status', options: ['approved', 'pending', 'rejected'] }
  actions = null, // JSX Actions callback: (row) => JSX
  fileName = "e-mediclub-export"
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtered and Searched Data
  const processedData = useMemo(() => {
    return data.filter(row => {
      // 1. Search Query Match
      const searchTarget = row[searchKey] ? String(row[searchKey]).toLowerCase() : "";
      const matchesSearch = searchTarget.includes(searchQuery.toLowerCase());

      // 2. Filter Category Match
      let matchesFilter = true;
      if (filterOptions && filterValue !== "all") {
        matchesFilter = String(row[filterOptions.key]).toLowerCase() === filterValue.toLowerCase();
      }

      return matchesSearch && matchesFilter;
    });
  }, [data, searchQuery, filterValue, searchKey, filterOptions]);

  // Pagination bounds
  const totalPages = Math.ceil(processedData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedData.slice(startIndex, startIndex + itemsPerPage);
  }, [processedData, currentPage]);

  // Handle page resets on filter triggers
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
    setCurrentPage(1);
  };

  // Convert and Export data to a clean CSV file
  const handleExportCSV = () => {
    if (processedData.length === 0) return;
    
    // Header keys
    const headers = columns.map(col => col.header);
    const keys = columns.map(col => col.key);

    const csvContent = [
      headers.join(','), // headers row
      ...processedData.map(row => 
        keys.map(key => {
          const val = row[key];
          // Handle string quotes
          return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col gap-3.5">
      {/* Search and Filters Top Deck */}
      {(!hideSearch || filterOptions) && (
        <div className="flex flex-row items-center justify-between gap-2 bg-white p-3 rounded-2xl border border-slate-100 shadow-premium">
          
          {/* Dynamic Search Box */}
          {!hideSearch ? (
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl flex-1 min-w-0">
              <FiSearch className="text-slate-400 text-sm shrink-0" />
              <input 
                type="text" 
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-transparent border-none outline-none text-[11px] font-semibold text-slate-700 w-full placeholder:text-slate-400 animate-fade-in"
              />
            </div>
          ) : <div className="flex-1" />}

          {/* Category Selectors & Download Deck */}
          <div className="flex items-center gap-2 shrink-0">
            {filterOptions && (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-2 rounded-xl shrink-0">
                <FiFilter className="text-slate-400 text-[10px] shrink-0" />
                <select 
                  value={filterValue} 
                  onChange={handleFilterChange}
                  className="bg-transparent border-none outline-none text-[10px] font-black text-slate-650 uppercase tracking-wide cursor-pointer"
                >
                  <option value="all">{filterOptions.label === 'Status' ? 'All Status' : `All ${filterOptions.label}s`}</option>
                  {filterOptions.options.map(opt => (
                    <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Export to CSV Button */}
            <button 
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-1 px-3 py-2.5 bg-[#1A7A4A] text-white text-[10px] font-black tracking-wider uppercase rounded-xl hover:bg-[#135A5A] shadow-sm transition-all duration-200 tap-scale shrink-0 cursor-pointer min-w-[34px] min-h-[34px] border-0"
              title="Export CSV"
            >
              <FiDownload className="text-xs shrink-0" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      )}

      {/* Advanced Responsive Table Grid */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-premium overflow-hidden">
        <div className="overflow-x-auto no-scrollbar max-h-[60vh] overflow-y-auto">
          <table className="w-full text-left border-collapse relative">
            <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm">
              <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                {columns.map((col) => (
                  <th key={col.key} className="py-4.5 px-6 font-black whitespace-nowrap">
                    {col.header}
                  </th>
                ))}
                {actions && <th className="py-4.5 px-6 text-right font-black sticky right-0 bg-slate-50/95 backdrop-blur-sm">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-600">
              {loading ? (
                // Loading Skeletons
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {columns.map((col) => (
                      <td key={col.key} className="py-4.5 px-6">
                        <div className="h-4 bg-slate-100 rounded-md animate-pulse w-3/4"></div>
                      </td>
                    ))}
                    {actions && (
                      <td className="py-4.5 px-6">
                        <div className="h-6 w-16 bg-slate-100 rounded-md animate-pulse ml-auto"></div>
                      </td>
                    )}
                  </tr>
                ))
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row, idx) => (
                  <tr 
                    key={row.id || row._id || idx} 
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="py-4.5 px-6">
                        {col.render ? col.render(row) : (row[col.key] || '-')}
                      </td>
                    ))}
                    {actions && (
                      <td className="py-3 px-6 text-right sticky right-0 bg-white group-hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center justify-end gap-2.5">
                          {actions(row)}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + (actions ? 1 : 0)} className="py-12 text-center">
                    {emptyStateComponent || (
                      <div className="text-slate-400 font-bold">No matching records found.</div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-50 p-4 bg-slate-50/20 text-xs">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
              Page {currentPage} of {totalPages} ({processedData.length} records)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded-xl border border-slate-100 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors tap-scale"
              >
                <FiChevronLeft className="text-lg" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-xl border border-slate-100 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors tap-scale"
              >
                <FiChevronRight className="text-lg" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
