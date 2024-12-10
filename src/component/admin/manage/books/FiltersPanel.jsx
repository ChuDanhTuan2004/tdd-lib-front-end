import React from 'react';

const FiltersPanel = ({ showFilters, subcategoryId, publicationYear, years, categories, setPublicationYear }) => (
    showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
            <h3 className="font-semibold mb-4">Bộ lọc nâng cao</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Năm xuất bản</label>
                    <select
                        value={publicationYear}
                        onChange={(e) => setPublicationYear(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#1e439b]/20 focus:border-[#1e439b]"
                    >
                        <option value="">Tất cả các năm</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
);

export default FiltersPanel;