/**
 * Helper to build clean API URLs with only non-empty query parameters
 * @param {string} baseUrl
 * @param {object} locationFilter
 * @param {string} timeframe
 * @returns {string}
 */
export const buildApiUrl = (baseUrl, locationFilter, timeframe) => {
  const params = new URLSearchParams();

  if (locationFilter?.search?.trim()) {
    params.set('locationQuery', locationFilter.search.trim());
  }
  if (locationFilter?.state?.trim()) {
    params.set('state', locationFilter.state.trim());
  }
  if (locationFilter?.city?.trim()) {
    params.set('city', locationFilter.city.trim());
  }
  if (locationFilter?.pincode?.trim()) {
    params.set('pincode', locationFilter.pincode.trim());
  }
  if (timeframe) {
    params.set('timeframe', timeframe);
  }

  const qs = params.toString();
  return qs ? `${baseUrl}?${qs}` : baseUrl;
};
