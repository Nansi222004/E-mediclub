import { useState, useEffect } from 'react';
import apiClient from '../../../shared/services/apiClient';
import { useAdminLocation } from '../context/AdminLocationContext';

export default function LocationFilter() {
  const { locationFilter, updateFilter, clearFilter, isFiltered } = useAdminLocation();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [search, setSearch] = useState(locationFilter.search || '');

  // Load states on mount
  useEffect(() => {
    apiClient.get('/api/admin/locations/states')
      .then(res => setStates(res.data))
      .catch(err => console.error('Error fetching states:', err));
  }, []);

  // Load cities when state changes
  useEffect(() => {
    if (locationFilter.state) {
      apiClient.get(`/api/admin/locations/cities?state=${encodeURIComponent(locationFilter.state)}`)
        .then(res => setCities(res.data))
        .catch(err => console.error('Error fetching cities:', err));
    } else {
      setCities([]);
      setPincodes([]);
    }
  }, [locationFilter.state]);

  // Load pincodes when city changes
  useEffect(() => {
    if (locationFilter.city) {
      apiClient.get(`/api/admin/locations/pincodes?city=${encodeURIComponent(locationFilter.city)}&state=${encodeURIComponent(locationFilter.state)}`)
        .then(res => setPincodes(res.data))
        .catch(err => console.error('Error fetching pincodes:', err));
    } else {
      setPincodes([]);
    }
  }, [locationFilter.city, locationFilter.state]);

  // Debounce search input 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== locationFilter.search) {
        updateFilter({
          search,
          state: '',  // clear dropdowns when typing search
          city: '',
          pincode: '',
        });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Synchronize search input if cleared externally
  useEffect(() => {
    setSearch(locationFilter.search);
  }, [locationFilter.search]);

  const activeCount = [
    locationFilter.search,
    locationFilter.state,
    locationFilter.city,
    locationFilter.pincode
  ].filter(Boolean).length;

  return (
    <div className="admin-filter-bar">
      <input
        type="text"
        placeholder="Search city, state, pincode..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`admin-filter-search-input ${search ? 'active' : ''}`}
      />

      <div className="admin-filter-divider" />

      <select
        value={locationFilter.state}
        onChange={(e) => updateFilter({ state: e.target.value, city: '', pincode: '' })}
        className={`admin-filter-select ${locationFilter.state ? 'active' : ''}`}
      >
        <option value="">Select State</option>
        {states.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select
        value={locationFilter.city}
        onChange={(e) => updateFilter({ city: e.target.value, pincode: '' })}
        disabled={!locationFilter.state}
        className={`admin-filter-select ${locationFilter.city ? 'active' : ''}`}
      >
        <option value="">Select City</option>
        {cities.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        value={locationFilter.pincode}
        onChange={(e) => updateFilter({ pincode: e.target.value })}
        disabled={!locationFilter.city}
        className={`admin-filter-select ${locationFilter.pincode ? 'active' : ''}`}
      >
        <option value="">Select Pincode</option>
        {pincodes.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {isFiltered && (
        <>
          <div className="admin-filter-divider" />
          <button
            type="button"
            onClick={() => { clearFilter(); setSearch(''); }}
            className="admin-filter-clear-btn"
          >
            Clear Filters
            <span className="admin-filter-count-badge">{activeCount}</span>
          </button>
        </>
      )}
    </div>
  );
}
export const CITY_MAPPINGS = {};
