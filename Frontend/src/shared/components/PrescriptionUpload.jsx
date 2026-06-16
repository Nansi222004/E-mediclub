import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiX, FiCheckCircle, FiFileText, FiCamera, FiTrash2, FiImage } from 'react-icons/fi';
import { addPrescription } from '../../modules/user/store/productSlice';
import { PrescriptionMedicineService } from '../services/PrescriptionMedicineService';
import apiClient from '../services/apiClient';

export default function PrescriptionUpload({ isOpen, onClose, onUploadSuccess }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.auth || {});
  const { location: locationState } = useSelector(state => state.products || {});
  const fileInputRef = useRef(null);

  // States
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState('idle'); // 'idle', 'uploading', 'success'
  const [createdRx, setCreatedRx] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    const acceptedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!acceptedTypes.includes(file.type)) {
      alert("Invalid format! Please upload a JPG, PNG, or PDF file.");
      return;
    }
    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds the 5MB limit.");
      return;
    }
    setSelectedFile(file);
    setUploadState('idle');
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    if (!isAuthenticated) {
      handleClose();
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    
    setUploadState('uploading');
    setUploadProgress(10); // Start progress

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // We can add notes or other info if needed, e.g. formData.append('notes', 'Optional notes');

      // Add a simulated interval for smooth progress bar while waiting for response
      const interval = setInterval(() => {
        setUploadProgress(prev => prev < 90 ? prev + 10 : prev);
      }, 300);

      const response = await apiClient.post('/api/prescriptions/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      clearInterval(interval);
      setUploadProgress(100);

      setTimeout(() => {
        setUploadState('success');
        
        // Parse prescription using service for local preview
        const parsedMeds = PrescriptionMedicineService.parsePrescription(selectedFile.name);
        const newRx = {
          id: response.data?.data?.id || `rx-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          fileName: selectedFile.name,
          fileSize: (selectedFile.size / 1024).toFixed(1) + ' KB',
          fileUrl: response.data?.data?.fileUrl, // Provided by cloudinary via API
          medicines: parsedMeds,
          city: locationState?.city || '',
          pincode: locationState?.pincode || ''
        };

        dispatch(addPrescription(newRx));
        setCreatedRx(newRx);
        
        if (onUploadSuccess) {
          onUploadSuccess(newRx);
        }
      }, 500);

    } catch (error) {
      console.error('Upload failed:', error);
      setUploadState('idle');
      setUploadProgress(0);
      alert('Failed to upload prescription. Please try again.');
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setUploadState('idle');
    setUploadProgress(0);
  };

  // Simulate snapping with mobile camera
  const handleCameraSnap = () => {
    const mockFile = {
      name: 'prescription-camera-capture.jpg',
      size: 485000,
      type: 'image/jpeg',
      isCameraCapture: true
    };
    setSelectedFile(mockFile);
    setUploadState('idle');
    setUploadProgress(0);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setUploadState('idle');
    setUploadProgress(0);
    setCreatedRx(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
          
          {/* Backdrop screen */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-transparent"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-[32px] border border-slate-100 shadow-premium max-w-md w-full p-6 sm:p-8 z-10 relative overflow-hidden flex flex-col gap-4"
          >
            {/* Header branding */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                  <span>📄</span> Upload Prescription
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
                  Select your medical prescription to order immediately.
                </p>
              </div>
              <button 
                onClick={handleClose} 
                className="p-1 rounded-full text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition-colors border-0 bg-transparent cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated success display */}
            {uploadState === 'success' ? (
              <div className="py-8 flex flex-col items-center gap-3 text-center">
                <FiCheckCircle className="text-5xl text-teal animate-bounce" />
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">Upload Completed!</h4>
                <p className="text-[10px] text-slate-500 max-w-[280px]">
                  Our clinical pharmacist verified your prescription and mapped medicines.
                </p>
                <button
                  onClick={() => {
                    if (onUploadSuccess && createdRx) {
                      onUploadSuccess(createdRx);
                    } else if (onUploadSuccess) {
                      onUploadSuccess();
                    }
                    handleClose();
                  }}
                  className="mt-4 px-6 py-2.5 bg-forest hover:bg-forest-dark text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm cursor-pointer border-0 outline-none"
                >
                  View Parsed Medicines
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                
                {/* Drag and Drop uploads block */}
                {!selectedFile ? (
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-[24px] p-8 flex flex-col items-center justify-center gap-3 bg-slate-50 cursor-pointer transition-all ${
                      dragActive ? 'border-teal bg-teal-light/20' : 'border-slate-200 hover:border-teal'
                    }`}
                  >
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="hidden"
                    />
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-inner">
                      <FiUploadCloud className="w-6 h-6 text-teal" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-black text-slate-700">Drag & drop prescription here</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-wider">or click to browse local files</p>
                    </div>
                    <span className="text-[9px] text-slate-400 font-medium">Supports: JPG, PNG, PDF (Max 5MB)</span>
                  </div>
                ) : (
                  /* File details card */
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-inner text-teal text-lg">
                        {selectedFile.type === 'application/pdf' ? <FiFileText /> : <FiImage />}
                      </div>
                      <div className="max-w-[180px]">
                        <h4 className="text-xs font-black text-slate-700 truncate leading-snug">{selectedFile.name}</h4>
                        <p className="text-[9px] text-slate-450 font-bold">
                          {selectedFile.size ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Camera Snap'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemove}
                      disabled={uploadState === 'uploading'}
                      className="text-slate-400 hover:text-rose-600 p-1 border-0 bg-transparent cursor-pointer disabled:opacity-40"
                    >
                      <FiTrash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                )}

                {/* Mobile Camera simulator button */}
                {!selectedFile && (
                  <button
                    type="button"
                    onClick={handleCameraSnap}
                    className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer flex items-center justify-center gap-2 transition-all"
                  >
                    <FiCamera className="text-teal" />
                    <span>Simulate Mobile Camera Snap</span>
                  </button>
                )}

                {/* Upload Progress Bar */}
                {uploadState === 'uploading' && (
                  <div className="flex flex-col gap-2 mt-2 bg-slate-50 p-3.5 border border-slate-100 rounded-2xl">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-black uppercase tracking-wider">
                      <span>Uploading file...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-teal h-full rounded-full transition-all duration-150"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions Button */}
                {selectedFile && uploadState !== 'success' && (
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-5 mt-2">
                    <button
                      onClick={handleRemove}
                      disabled={uploadState === 'uploading'}
                      className="py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer disabled:opacity-40 bg-transparent"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={uploadState === 'uploading'}
                      className="py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer disabled:opacity-40 border-0 outline-none"
                    >
                      {uploadState === 'uploading' ? 'Uploading...' : 'Confirm & Upload'}
                    </button>
                  </div>
                )}

              </div>
            )}

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
