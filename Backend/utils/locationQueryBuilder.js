const buildLocationQuery = (params) => {
  const locationQuery = params.locationQuery?.trim() || '';
  const state   = params.state?.trim()   || '';
  const city    = params.city?.trim()    || '';
  const pincode = params.pincode?.trim() || '';

  const query = {};
  const conditions = [];

  if (locationQuery.length >= 2) {
    const regex = { $regex: locationQuery, $options: 'i' };
    conditions.push({
      $or: [
        { city:                    regex },
        { state:                   regex },
        { pincode:                 regex },
        { area:                    regex },
        { address:                 regex },
        { 'address.city':          regex },
        { 'address.state':         regex },
        { 'address.pincode':       regex },
        { 'address.area':          regex },
        { location:                regex },
        { 'location.city':         regex },
        { 'location.state':        regex },
        { 'location.pincode':      regex },
        { serviceableCity:         regex },
        { serviceableCities:       regex },
        { serviceableAreas:        regex },
        { serviceablePincodes:     regex },
        { deliveryCity:            regex },
        { 'shipping.city':         regex },
        { 'delivery.city':         regex },
        { clinicCity:              regex },
        { clinicAddress:           regex },
        { vendorCity:              regex },
        { vendorState:             regex },
        { vendorPincode:           regex },
        { storeCity:               regex },
        { storeState:              regex },
        { storePincode:            regex },
        { patientCity:             regex },
        { patientState:            regex },
        { 'profile.city':          regex },
        { 'profile.state':         regex },
        { 'profile.pincode':       regex },
      ]
    });
  }

  if (state.length > 0) {
    const val = { $regex: `^${state}$`, $options: 'i' };
    conditions.push({
      $or: [
        { state: val },
        { vendorState: val },
        { 'profile.state': val }
      ]
    });
  }
  if (city.length > 0) {
    const val = { $regex: `^${city}$`, $options: 'i' };
    conditions.push({
      $or: [
        { city: val },
        { vendorCity: val },
        { 'profile.city': val }
      ]
    });
  }
  if (pincode.length > 0) {
    conditions.push({
      $or: [
        { pincode: pincode },
        { vendorPincode: pincode },
        { 'profile.pincode': pincode }
      ]
    });
  }

  if (conditions.length > 0) {
    query.$and = conditions;
  }

  return query;
};

module.exports = { buildLocationQuery };
