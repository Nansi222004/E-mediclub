import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AdminLocationContext = createContext();

export const AdminLocationProvider = ({ children }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [locationFilter, setLocationFilter] = useState({
    search:  searchParams.get('locationQuery') || '',
    state:   searchParams.get('state')         || '',
    city:    searchParams.get('city')           || '',
    pincode: searchParams.get('pincode')        || '',
  });

  // Keep in sync with URL searchParams change
  useEffect(() => {
    setLocationFilter({
      search:  searchParams.get('locationQuery') || '',
      state:   searchParams.get('state')         || '',
      city:    searchParams.get('city')           || '',
      pincode: searchParams.get('pincode')        || '',
    });
  }, [searchParams]);

  const updateFilter = (updates) => {
    const updated = { ...locationFilter, ...updates };
    setLocationFilter(updated);

    const params = new URLSearchParams(searchParams);
    if (updated.search !== undefined) {
      if (updated.search) params.set('locationQuery', updated.search);
      else params.delete('locationQuery');
    }
    if (updated.state !== undefined) {
      if (updated.state) params.set('state', updated.state);
      else params.delete('state');
    }
    if (updated.city !== undefined) {
      if (updated.city) params.set('city', updated.city);
      else params.delete('city');
    }
    if (updated.pincode !== undefined) {
      if (updated.pincode) params.set('pincode', updated.pincode);
      else params.delete('pincode');
    }
    navigate({ search: params.toString() }, { replace: true });
  };

  const clearFilter = () => {
    setLocationFilter({ search: '', state: '', city: '', pincode: '' });
    
    const params = new URLSearchParams(searchParams);
    params.delete('locationQuery');
    params.delete('state');
    params.delete('city');
    params.delete('pincode');
    navigate({ search: params.toString() }, { replace: true });
  };

  // Check if any filter is active
  const isFiltered = !!(
    locationFilter.search ||
    locationFilter.state  ||
    locationFilter.city   ||
    locationFilter.pincode
  );

  // Build API query string from current filter
  const getQueryString = () => {
    const params = new URLSearchParams();
    if (locationFilter.search)  params.set('locationQuery', locationFilter.search);
    if (locationFilter.state)   params.set('state',         locationFilter.state);
    if (locationFilter.city)    params.set('city',           locationFilter.city);
    if (locationFilter.pincode) params.set('pincode',        locationFilter.pincode);
    return params.toString();
  };

  return (
    <AdminLocationContext.Provider value={{
      locationFilter,
      updateFilter,
      clearFilter,
      isFiltered,
      getQueryString,
    }}>
      {children}
    </AdminLocationContext.Provider>
  );
};

export const useAdminLocation = () => useContext(AdminLocationContext);
