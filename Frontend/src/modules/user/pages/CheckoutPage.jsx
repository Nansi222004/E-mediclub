import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, Stepper, Step, StepLabel, TextField, Button, 
  Radio, RadioGroup, FormControlLabel, FormControl, FormLabel
} from '@mui/material';
import { FiMapPin, FiCreditCard, FiSmartphone, FiCheckCircle, FiShield, FiPlus, FiArrowLeft, FiAlertTriangle, FiTruck } from 'react-icons/fi';
import { clearCart } from '../store/cartSlice';
import { placeOrder, normalizeCity } from '../store/productSlice';
import { addAddress, addSavedCard } from '../../auth/store/authSlice';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Selectors
  const { items, total } = useSelector(state => state.cart);
  const { addresses, savedCards = [] } = useSelector(state => state.auth);
  const { location: locationState } = useSelector(state => state.products || {});

  const selectedCity = locationState?.city ? normalizeCity(locationState.city).toLowerCase() : '';
  const selectedPin = locationState?.pincode || '';

  const filteredAddresses = selectedCity
    ? addresses.filter(addr => addr.city && normalizeCity(addr.city).toLowerCase() === selectedCity)
    : addresses;

  const filterCardsByLocation = (card) => {
    if (!selectedCity) return true;
    const cardCity = card.city ? card.city.toLowerCase() : '';
    const cardPin = card.pincode || '';
    const matchesCity = cardCity === selectedCity;
    const matchesPin = selectedPin ? (cardPin === selectedPin) : true;
    return matchesCity && matchesPin;
  };

  const filteredCards = savedCards.filter(filterCardsByLocation);

  // States
  const requiresPrescription = items.some(item => item.rxRequired);
  const [rxUploaded, setRxUploaded] = useState(false);
  const [activeStep, setActiveStep] = useState(0); // 0: Address, 1: Payment, 2: Success (MUI is 0-indexed)
  const [selectedAddressId, setSelectedAddressId] = useState(filteredAddresses[0]?.id || 1);
  const [deliverySlot, setDeliverySlot] = useState('today');

  // Card sub-states
  const [selectedCardId, setSelectedCardId] = useState('');
  const [newCardBank, setNewCardBank] = useState('');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');
  const [saveNewCard, setSaveNewCard] = useState(true);

  // Set default selected card based on location changes
  React.useEffect(() => {
    const activeFiltered = savedCards.filter(filterCardsByLocation);
    if (activeFiltered.length > 0) {
      setSelectedCardId(activeFiltered[0].id);
    } else {
      setSelectedCardId('new');
    }
  }, [locationState?.city, locationState?.pincode, savedCards]);

  // Auto-populate address matching current location city if none exists
  React.useEffect(() => {
    if (!locationState?.city) return;
    const hasMatching = addresses.some(a => a.city?.toLowerCase() === locationState.city.toLowerCase());
    if (!hasMatching) {
      const activeCity = locationState.city;
      const activePin = locationState.pincode || '400001';
      const activeState = locationState.state || 'Maharashtra';
      
      const autoAddress = {
        name: `Current Location (${activeCity})`,
        phone: '9876543210',
        pincode: activePin,
        addressLine: `12, Main Street, Near City Center`,
        city: activeCity,
        state: activeState,
        isDefault: true
      };
      
      dispatch(addAddress(autoAddress));
    }
  }, [locationState?.city, addresses, dispatch]);

  // Auto-select address matching the active location city
  React.useEffect(() => {
    if (locationState?.city) {
      const matchingAddress = addresses.find(a => a.city?.toLowerCase() === locationState.city.toLowerCase());
      if (matchingAddress) {
        setSelectedAddressId(matchingAddress.id);
      }
    }
  }, [locationState?.city, addresses]);

  const [paymentMode, setPaymentMode] = useState('upi'); // 'upi' | 'card' | 'cod'
  const [generatedOrderId, setGeneratedOrderId] = useState('');

  // Add new address state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrPin, setNewAddrPin] = useState('');
  const [newAddrLine, setNewAddrLine] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('');
  const [newAddrType, setNewAddrType] = useState('Home');

  const steps = ['Verify Address', 'Secure Payment'];

  const handleAddNewAddress = (e) => {
    e.preventDefault();
    const newAddressObj = {
      name: newAddrName,
      phone: newAddrPhone,
      pincode: newAddrPin,
      addressLine: newAddrLine,
      city: newAddrCity,
      state: newAddrState,
      type: newAddrType,
      isDefault: addresses.length === 0
    };
    dispatch(addAddress(newAddressObj));
    setShowAddressForm(false);
    // Reset inputs
    setNewAddrName('');
    setNewAddrPhone('');
    setNewAddrPin('');
    setNewAddrLine('');
    setNewAddrCity('');
    setNewAddrState('');
    setNewAddrType('Home');
  };

  const handlePlaceOrder = () => {
    if (paymentMode === 'card') {
      if (selectedCardId === 'new') {
        if (!newCardBank || !newCardNumber || !newCardExpiry || !newCardCvv) {
          alert('Please fill out all new card details.');
          return;
        }
        if (saveNewCard) {
          dispatch(addSavedCard({
            id: `c-${Date.now()}`,
            bank: newCardBank,
            last4: newCardNumber.slice(-4),
            expiry: newCardExpiry,
            city: locationState?.city || 'Mumbai',
            pincode: locationState?.pincode || '400001'
          }));
        }
      }
    }

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    setGeneratedOrderId(orderId);

    const activeAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

    const orderObj = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      items: items.map(item => ({
        name: item.name,
        qty: item.qty,
        price: item.discountPrice || item.price,
        type: item.type
      })),
      total: total,
      status: 'Ordered',
      deliveryAddress: activeAddress 
        ? `${activeAddress.name} (${activeAddress.city})` 
        : `Home Delivery (${locationState?.city || 'Mumbai'})`,
      city: activeAddress ? activeAddress.city : (locationState?.city || ''),
      pincode: activeAddress ? activeAddress.pincode : (locationState?.pincode || '')
    };

    dispatch(placeOrder(orderObj));
    dispatch(clearCart());
    setActiveStep(2); // trigger Success page
  };

  return (
    <div className="max-w-3xl mx-auto pb-10 select-none">

      {/* Main stepper container content */}
      <AnimatePresence mode="wait">
        
        {/* Step 1: Address Selection */}
        {activeStep === 0 && (
          <motion.div
            key="address"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex flex-col gap-6"
          >
            {requiresPrescription && (
              <div className="bg-rose-50 border border-rose-200 p-5 rounded-3xl flex flex-col gap-4 mb-2">
                <h3 className="text-rose-700 font-extrabold text-sm flex items-center gap-2">
                  <FiAlertTriangle /> Prescription Required
                </h3>
                <p className="text-xs text-rose-600 font-semibold">
                  One or more items in your cart require a valid prescription. Please upload it to proceed.
                </p>
                {rxUploaded ? (
                  <div className="bg-white p-3 rounded-xl border border-rose-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5"><FiCheckCircle /> Prescription_Doc_1.pdf uploaded</span>
                    <button onClick={() => setRxUploaded(false)} className="text-[10px] text-slate-400 font-bold hover:text-rose-500 outline-none border-0 bg-transparent cursor-pointer">REMOVE</button>
                  </div>
                ) : (
                  <Button 
                    variant="contained" 
                    onClick={() => {
                      setTimeout(() => setRxUploaded(true), 600);
                    }}
                    className="bg-rose-600 hover:bg-rose-700 text-white shadow-none font-black text-xs py-2.5 rounded-xl w-fit"
                  >
                    UPLOAD PRESCRIPTION
                  </Button>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
                <FiMapPin className="text-teal" /> Verify Shipping Address
              </h2>
              <Button 
                onClick={() => setShowAddressForm(!showAddressForm)}
                variant="text"
                color="secondary"
                size="small"
                className="font-extrabold text-xs flex items-center gap-1"
                style={{ minHeight: '44px', borderRadius: '12px' }}
              >
                <FiPlus className="stroke-[3px]" /> ADD NEW ADDRESS
              </Button>
            </div>

            {/* Address Form block using MUI TextFields */}
            <AnimatePresence>
              {showAddressForm && (
                <motion.form 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleAddNewAddress}
                  className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-sm flex flex-col gap-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <TextField
                      label="Receiver Name"
                      variant="outlined"
                      size="small"
                      required
                      value={newAddrName}
                      onChange={(e) => setNewAddrName(e.target.value)}
                    />
                    <TextField
                      label="Receiver Phone"
                      variant="outlined"
                      size="small"
                      required
                      value={newAddrPhone}
                      onChange={(e) => setNewAddrPhone(e.target.value)}
                    />
                  </div>
                  <TextField
                    label="Pincode"
                    variant="outlined"
                    size="small"
                    required
                    value={newAddrPin}
                    onChange={(e) => setNewAddrPin(e.target.value)}
                  />
                  <TextField
                    label="Address Line (Flat, Street name)"
                    variant="outlined"
                    size="small"
                    required
                    value={newAddrLine}
                    onChange={(e) => setNewAddrLine(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <TextField
                      label="City"
                      variant="outlined"
                      size="small"
                      required
                      value={newAddrCity}
                      onChange={(e) => setNewAddrCity(e.target.value)}
                    />
                    <TextField
                      label="State"
                      variant="outlined"
                      size="small"
                      required
                      value={newAddrState}
                      onChange={(e) => setNewAddrState(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Address Type</label>
                    <div className="flex gap-4">
                      {['Home', 'Work', 'Other'].map(type => (
                        <label key={type} className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-700">
                          <input type="radio" name="addrType" checked={newAddrType === type} onChange={() => setNewAddrType(type)} className="accent-forest" />
                          {type}
                        </label>
                      ))}
                    </div>
                  </div>
                  <Button 
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="py-2.5 bg-forest hover:bg-forest-dark text-white rounded-xl shadow-sm text-xs font-black"
                    style={{ borderRadius: '12px', minHeight: '44px' }}
                  >
                    Save Address Details
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

             {/* Address listing cards */}
            <div className="flex flex-col gap-3">
              {filteredAddresses.length > 0 ? (
                filteredAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-[24px] border shadow-sm cursor-pointer transition-all flex items-start gap-3 bg-white ${
                      selectedAddressId === addr.id ? 'border-forest ring-2 ring-forest-light' : 'border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full border-2 mt-1 shrink-0 flex items-center justify-center ${
                      selectedAddressId === addr.id ? 'border-forest bg-forest text-white' : 'border-slate-300'
                    }`}>
                      {selectedAddressId === addr.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <div className="flex-1 text-xs">
                      <h4 className="font-extrabold text-slate-800 flex items-center gap-2">
                        {addr.name} 
                        {addr.type && <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider">{addr.type}</span>}
                      </h4>
                      <p className="text-slate-500 font-semibold mt-1">{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1.5">PHONE: +91 {addr.phone}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 px-4 text-slate-405 bg-slate-50 border border-dashed border-slate-200 rounded-2xl select-none font-bold text-xs uppercase tracking-wider">
                  No saved addresses found in {locationState?.city || 'this area'}. Please add a new address above.
                </div>
              )}
            </div>

            {/* Next CTA trigger using MUI Button */}
            <Button
              onClick={() => setActiveStep(1)}
              disabled={requiresPrescription && !rxUploaded}
              variant="contained"
              color="primary"
              fullWidth
              className="py-3.5 bg-forest hover:bg-forest-dark text-white rounded-2xl shadow-sm font-black text-xs"
              style={{ borderRadius: '16px', minHeight: '44px' }}
            >
              PROCEED TO SECURE PAYMENT
            </Button>
          </motion.div>
        )}

        {/* Step 2: Secure Payment */}
        {activeStep === 1 && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-3">
              <Button onClick={() => setActiveStep(0)} className="text-slate-400 hover:text-slate-650 min-w-0 p-1">
                <FiArrowLeft className="w-5 h-5 stroke-[2.5px]" />
              </Button>
              <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
                <FiCreditCard className="text-teal" /> Choose Payment Option
              </h2>
            </div>

            {/* Delivery Slot Selection */}
            <div className="flex flex-col gap-3 mb-2">
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                <FiTruck className="text-teal" /> Choose Delivery Slot
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'express', label: 'Express Delivery', desc: 'Within 2 Hours', fee: 50 },
                  { id: 'today', label: 'Standard Today', desc: 'By 9:00 PM', fee: 0 },
                  { id: 'tomorrow', label: 'Tomorrow', desc: 'Morning 8AM - 12PM', fee: 0 }
                ].map(slot => (
                  <div 
                    key={slot.id}
                    onClick={() => setDeliverySlot(slot.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      deliverySlot === slot.id ? 'border-forest ring-2 ring-forest-light bg-forest-light/10' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-black text-slate-800">{slot.label}</span>
                      <Radio checked={deliverySlot === slot.id} size="small" className="p-0" color="primary" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 block">{slot.desc}</span>
                    <span className="text-[10px] font-black text-emerald-600 block mt-1">{slot.fee === 0 ? 'FREE' : `+₹${slot.fee}`}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment options selection using MUI Radio controls */}
            <div className="flex flex-col gap-3">
              {/* UPI */}
              <div
                onClick={() => setPaymentMode('upi')}
                className={`p-4 bg-white rounded-[24px] border shadow-sm cursor-pointer transition-all flex items-center gap-3 ${
                  paymentMode === 'upi' ? 'border-forest ring-2 ring-forest-light' : 'border-slate-100'
                }`}
              >
                <Radio
                  checked={paymentMode === 'upi'}
                  onChange={() => setPaymentMode('upi')}
                  color="primary"
                  name="payment-options"
                />
                <FiSmartphone className="text-teal w-5 h-5 shrink-0" />
                <div className="flex-1 text-xs">
                  <h4 className="font-extrabold text-slate-800">Pay via Instant UPI Options</h4>
                  <p className="text-slate-400 font-semibold text-[10px]">Google Pay, PhonePe, Paytm, or custom UPI ID</p>
                </div>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-3">
                <div
                  onClick={() => setPaymentMode('card')}
                  className={`p-4 bg-white rounded-[24px] border shadow-sm cursor-pointer transition-all flex items-center gap-3 ${
                    paymentMode === 'card' ? 'border-forest ring-2 ring-forest-light' : 'border-slate-100'
                  }`}
                >
                  <Radio
                    checked={paymentMode === 'card'}
                    onChange={() => setPaymentMode('card')}
                    color="primary"
                    name="payment-options"
                  />
                  <FiCreditCard className="text-teal w-5 h-5 shrink-0" />
                  <div className="flex-1 text-xs">
                    <h4 className="font-extrabold text-slate-800">Credit or Debit Cards</h4>
                    <p className="text-slate-400 font-semibold text-[10px]">Visa, Mastercard, RuPay cards processed via secure gateway</p>
                  </div>
                </div>

                {paymentMode === 'card' && (
                  <div className="p-4 bg-slate-50 border border-slate-150 rounded-[24px] flex flex-col gap-4 animate-fade-in text-xs font-semibold">
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Saved Cards in {locationState?.city || 'this area'}</span>
                      {filteredCards.length > 0 ? (
                        filteredCards.map((card) => (
                          <div
                            key={card.id}
                            onClick={() => setSelectedCardId(card.id)}
                            className={`p-3.5 bg-white border rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${
                              selectedCardId === card.id ? 'border-forest ring-2 ring-forest-light' : 'border-slate-100 hover:border-slate-300'
                            }`}
                          >
                            <span className="text-base">💳</span>
                            <div className="flex-1">
                              <h4 className="font-extrabold text-slate-850">{card.bank}</h4>
                              <p className="text-[10px] text-slate-400 font-bold mt-0.5">•••• {card.last4} • Exp {card.expiry}</p>
                            </div>
                            <Radio
                              checked={selectedCardId === card.id}
                              onChange={() => setSelectedCardId(card.id)}
                              color="primary"
                              size="small"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="text-[10px] text-slate-450 font-bold bg-white p-3 border border-dashed border-slate-205 rounded-2xl text-center">
                          No saved cards found in {locationState?.city || 'this area'} ({locationState?.pincode || ''}).
                        </div>
                      )}

                      <div
                        onClick={() => setSelectedCardId('new')}
                        className={`p-3.5 bg-white border rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${
                          selectedCardId === 'new' ? 'border-forest ring-2 ring-forest-light' : 'border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-base font-extrabold flex items-center justify-center"><FiPlus /></span>
                        <div className="flex-1 font-extrabold text-slate-850">
                          Use a new credit/debit card
                        </div>
                        <Radio
                          checked={selectedCardId === 'new'}
                          onChange={() => setSelectedCardId('new')}
                          color="primary"
                          size="small"
                        />
                      </div>
                    </div>

                    {selectedCardId === 'new' && (
                      <div className="flex flex-col gap-3 pt-3 border-t border-slate-200/60 animate-fade-in">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Card Bank Name</label>
                          <input
                            type="text"
                            placeholder="e.g. HDFC Bank, ICICI Bank"
                            value={newCardBank}
                            onChange={(e) => setNewCardBank(e.target.value)}
                            className="px-3.5 py-2.5 border border-slate-200 bg-white rounded-xl text-xs font-bold outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Card Number</label>
                          <input
                            type="text"
                            maxLength="16"
                            placeholder="4111 2222 3333 4444"
                            value={newCardNumber}
                            onChange={(e) => setNewCardNumber(e.target.value.replace(/\D/g, ''))}
                            className="px-3.5 py-2.5 border border-slate-200 bg-white rounded-xl text-xs font-bold outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex flex-col gap-1 col-span-2">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Expiry Date</label>
                            <input
                              type="text"
                              maxLength="5"
                              placeholder="MM/YY"
                              value={newCardExpiry}
                              onChange={(e) => setNewCardExpiry(e.target.value)}
                              className="px-3.5 py-2.5 border border-slate-200 bg-white rounded-xl text-xs font-bold outline-none text-center"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">CVV</label>
                            <input
                              type="password"
                              maxLength="3"
                              placeholder="•••"
                              value={newCardCvv}
                              onChange={(e) => setNewCardCvv(e.target.value.replace(/\D/g, ''))}
                              className="px-3.5 py-2.5 border border-slate-200 bg-white rounded-xl text-xs font-bold outline-none text-center"
                            />
                          </div>
                        </div>
                        <label className="flex items-center gap-2 mt-1 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={saveNewCard}
                            onChange={(e) => setSaveNewCard(e.target.checked)}
                            className="w-4 h-4 rounded text-forest focus:ring-forest border-slate-200"
                          />
                          <span className="text-[10px] font-bold text-slate-500">Save card for future payments in {locationState?.city || 'this area'}</span>
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Wallets */}
              <div
                onClick={() => setPaymentMode('wallet')}
                className={`p-4 bg-white rounded-[24px] border shadow-sm cursor-pointer transition-all flex items-center gap-3 ${
                  paymentMode === 'wallet' ? 'border-forest ring-2 ring-forest-light' : 'border-slate-100'
                }`}
              >
                <Radio checked={paymentMode === 'wallet'} onChange={() => setPaymentMode('wallet')} color="primary" name="payment-options" />
                <span className="text-lg shrink-0">👛</span>
                <div className="flex-1 text-xs">
                  <h4 className="font-extrabold text-slate-800">Mobile Wallets</h4>
                  <p className="text-slate-400 font-semibold text-[10px]">Amazon Pay, Mobikwik, Freecharge</p>
                </div>
              </div>

              {/* Net Banking */}
              <div
                onClick={() => setPaymentMode('netbanking')}
                className={`p-4 bg-white rounded-[24px] border shadow-sm cursor-pointer transition-all flex items-center gap-3 ${
                  paymentMode === 'netbanking' ? 'border-forest ring-2 ring-forest-light' : 'border-slate-100'
                }`}
              >
                <Radio checked={paymentMode === 'netbanking'} onChange={() => setPaymentMode('netbanking')} color="primary" name="payment-options" />
                <span className="text-lg shrink-0">🏦</span>
                <div className="flex-1 text-xs">
                  <h4 className="font-extrabold text-slate-800">Net Banking</h4>
                  <p className="text-slate-400 font-semibold text-[10px]">All major Indian banks supported</p>
                </div>
              </div>

              {/* Cash on delivery */}
              <div
                onClick={() => setPaymentMode('cod')}
                className={`p-4 bg-white rounded-[24px] border shadow-sm cursor-pointer transition-all flex items-center gap-3 ${
                  paymentMode === 'cod' ? 'border-forest ring-2 ring-forest-light' : 'border-slate-100'
                }`}
              >
                <Radio
                  checked={paymentMode === 'cod'}
                  onChange={() => setPaymentMode('cod')}
                  color="primary"
                  name="payment-options"
                />
                <span className="text-lg shrink-0">💵</span>
                <div className="flex-1 text-xs">
                  <h4 className="font-extrabold text-slate-800">Cash on Delivery (COD)</h4>
                  <p className="text-slate-400 font-semibold text-[10px]">Pay cash or scan QR code at delivery time.</p>
                </div>
              </div>
            </div>

            {/* Total checkout details block */}
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-150 flex items-center justify-between text-xs text-slate-650 font-black">
              <span>Total Payable Amount</span>
              <span className="text-base text-forest">₹{total}</span>
            </div>

            {/* Final execution button */}
            <Button
              onClick={handlePlaceOrder}
              variant="contained"
              color="primary"
              fullWidth
              className="py-3.5 bg-forest hover:bg-forest-dark text-white rounded-2xl shadow-sm text-sm font-black"
              style={{ borderRadius: '16px', minHeight: '44px' }}
            >
              PAY AND PLACE ORDER (₹{total})
            </Button>
          </motion.div>
        )}

        {/* Step 3: Success Screen */}
        {activeStep === 2 && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-premium text-center flex flex-col items-center gap-4 relative overflow-hidden"
          >
            {/* Background Confetti illustration mimic */}
            <div className="absolute inset-0 opacity-10 pointer-events-none text-2xl grid grid-cols-6 items-center select-none">
              🎉 🎊 🌿 🧪 💊 🎉 🎊 🧪 💊 🌿
            </div>

            <FiCheckCircle className="w-16 h-16 text-emerald-500 animate-bounce" />
            <h2 className="text-xl md:text-2xl font-black text-slate-850">Your Order Has Been Placed!</h2>
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 w-full max-w-sm flex flex-col gap-2.5 text-xs text-slate-500 font-semibold mt-2">
              <div className="flex items-center justify-between">
                <span>Order Reference ID</span>
                <span className="font-black text-slate-800">{generatedOrderId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Expected Delivery</span>
                <span className="font-black text-emerald-600">Today evening, by 8:00 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Payment Mode</span>
                <span className="font-black text-slate-800 uppercase">{paymentMode}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mt-4 relative z-10">
              <Button
                onClick={() => navigate('/orders')}
                variant="contained"
                color="primary"
                className="flex-1 py-3 bg-forest hover:bg-forest-dark text-white rounded-xl shadow-sm font-black text-xs"
                style={{ borderRadius: '12px', minHeight: '44px' }}
              >
                TRACK SHIPMENTS
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outlined"
                color="secondary"
                className="flex-1 py-3 text-teal rounded-xl font-black text-xs"
                style={{ borderRadius: '12px', minHeight: '44px' }}
              >
                RETURN TO HOME
              </Button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
