import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiInfo, FiLayers, FiAlertTriangle, FiUploadCloud, FiCheckCircle, 
  FiArrowRight, FiArrowLeft, FiPlus, FiTrash2, FiCpu, FiFileText, FiCamera, FiEdit
} from 'react-icons/fi';

export default function VendorMedicineAddWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [autoSaveTime, setAutoSaveTime] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [dragOverSlot, setDragOverSlot] = useState(null);

  // 1. Wizard State
  const [medicineData, setMedicineData] = useState({
    // Step 1: Basic Info
    name: '',
    brand: '',
    saltComposition: [],
    currentSaltInput: '',
    category: 'Allopathy',
    medicineType: 'Tablet',
    therapeuticCategory: 'Pain Management',
    description: '',
    uses: '',
    sideEffects: '',
    dosageInstructions: '',
    warnings: '',
    prescriptionRequired: false,
    scheduleType: 'OTC',
    manufacturer: '',
    
    // Step 2: Variants
    variants: [
      { strength: '650mg', form: 'Tablet', packSize: 'Strip of 15', mrp: '35', sellingPrice: '30', discount: '14', stock: '100', batchNumber: 'BAT-2026-01', expiryDate: '2027-12-31', sku: 'MED-DOLO650-T15' }
    ],

    // Step 3: Inventory Settings
    lowStockThreshold: 10,
    autoOutOfStock: true,
    expiryAlert: true,
    batchTracking: true,

    // Step 4: Media
    images: [
      { id: 1, url: '', label: 'Primary Product Image', isMandatory: true, status: 'Approved', description: 'Mandatory main thumbnail image for product catalog search.' },
      { id: 2, url: '', label: 'Strip / Bottle View', isMandatory: false, status: 'Pending Review', description: 'Detailed view of the tablet strip, syrup bottle, or tube.' },
      { id: 3, url: '', label: 'Box / Back Label View', isMandatory: false, status: 'Pending Review', description: 'Packaging label showing drug warnings, manufacturing dates, and ingredients.' }
    ]
  });

  // Auto-save draft simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setAutoSaveTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

// AI Medicine Knowledge Base for authentic clinical data generation
const MEDICINE_KNOWLEDGE_BASE = {
  paracetamol: {
    description: "Paracetamol (also known as Acetaminophen) is a widely used analgesic (pain reliever) and antipyretic (fever reducer). It is commonly administered for the treatment of mild to moderate pain, such as headaches, muscle aches, arthritis, backaches, toothaches, and colds.",
    uses: "Relieving mild to moderate pain (headache, muscle pain, dental pain, backache) and reducing fever.",
    sideEffects: "Very rare when taken at recommended doses. High doses can lead to liver damage, allergic skin reactions (rash, swelling), or gastrointestinal discomfort.",
    dosageInstructions: "Take 1 tablet every 4 to 6 hours as needed. Do not exceed 4000mg (6 tablets of 650mg) in a 24-hour period. Best taken after meals.",
    warnings: "Do not exceed the recommended dose as it can cause severe liver damage. Avoid alcohol consumption while taking this medication. Inform your doctor if you have hepatic or renal impairment.",
    therapeuticCategory: "Pain Relief",
    medicineType: "Tablet",
    saltComposition: ["Paracetamol 650mg"]
  },
  dolo: {
    description: "Dolo 650 is a prescription tablet containing Paracetamol 650mg. It is highly effective for reducing high fever and relieving body aches, headaches, and joint pain associated with viral infections, flu, or common colds.",
    uses: "Indicated for fever reduction (antipyretic) and relief of mild to moderate pain (headache, body ache, joint pain).",
    sideEffects: "Nausea, vomiting, indigestion, or mild skin rashes. Severe side effects like liver toxicity occur only on overdose.",
    dosageInstructions: "Take 1 tablet 3 to 4 times daily after food or as directed by the physician. Maintain a minimum gap of 4 hours between doses.",
    warnings: "Do not consume with other paracetamol-containing products. Avoid alcohol. Safe for pregnant women only under medical supervision.",
    therapeuticCategory: "Pain Relief",
    medicineType: "Tablet",
    saltComposition: ["Paracetamol 650mg"]
  },
  crocin: {
    description: "Crocin is a well-known analgesic and antipyretic medication containing Paracetamol. It works by blocking chemical messengers in the brain that signal pain and regulate body temperature.",
    uses: "Relief of headache, toothache, cold symptoms, sore throat, and reducing fever.",
    sideEffects: "Generally well-tolerated. Rare side effects include skin allergies, nausea, or blood disorders in case of chronic abuse.",
    dosageInstructions: "Take 1 to 2 tablets every 4 to 6 hours. Do not exceed 4g per day. Take with a glass of water, preferably after food.",
    warnings: "Liver warning: Consuming more than 4000mg daily can cause severe liver injury. Avoid alcohol.",
    therapeuticCategory: "Pain Relief",
    medicineType: "Tablet",
    saltComposition: ["Paracetamol 500mg"]
  },
  augmentin: {
    description: "Augmentin 625 Duo is a penicillin-type combination antibiotic containing Amoxicillin (500mg) and Clavulanic Acid (125mg). Amoxicillin kills bacteria, while Clavulanic Acid prevents bacteria from destroying Amoxicillin, enhancing its spectrum of activity.",
    uses: "Treatment of bacterial infections of the lungs (pneumonia), ear, nasal sinuses, urinary tract, skin, and soft tissues.",
    sideEffects: "Diarrhea, nausea, vomiting, skin rashes, oral thrush, or vaginal yeast infections due to alteration of bacterial flora.",
    dosageInstructions: "Take 1 tablet twice daily, ideally at the start of a meal to reduce gastrointestinal intolerance. Complete the full prescribed course.",
    warnings: "Contraindicated in individuals allergic to penicillin or cephalosporin antibiotics. Use with caution in patients with hepatic dysfunction.",
    therapeuticCategory: "Antibiotic",
    medicineType: "Tablet",
    saltComposition: ["Amoxicillin 500mg", "Clavulanic Acid 125mg"]
  },
  amoxicillin: {
    description: "Amoxicillin is a moderate-spectrum, bactericidal beta-lactam antibiotic used to treat bacterial infections caused by susceptible microorganisms. It inhibits the synthesis of bacterial cell walls.",
    uses: "Bacterial infections of the ear, nose, throat, skin, urinary tract, and lower respiratory tract.",
    sideEffects: "Nausea, vomiting, diarrhea, abdominal pain, or allergic reactions (hives, breathing difficulty).",
    dosageInstructions: "Take 1 capsule every 8 to 12 hours as prescribed. Complete the entire course even if symptoms disappear.",
    warnings: "Avoid if you have a history of penicillin allergy. Alert your physician if you have kidney disease or mononucleosis.",
    therapeuticCategory: "Antibiotic",
    medicineType: "Capsule",
    saltComposition: ["Amoxicillin 500mg"]
  },
  pan: {
    description: "Pan 40 is a gastro-resistant tablet containing Pantoprazole 40mg. It is a proton pump inhibitor (PPI) that reduces the amount of acid produced in the stomach, helping to heal acid reflux, ulcers, and GERD.",
    uses: "Treatment of Gastroesophageal Reflux Disease (GERD), peptic ulcers, acid acidity, and stomach erosion.",
    sideEffects: "Headache, diarrhea, stomach pain, flatulence, dizziness, or joint pain. Long-term use may cause vitamin B12 deficiency.",
    dosageInstructions: "Take 1 tablet daily in the morning, 1 hour before breakfast/first meal, with a glass of water. Swallow whole; do not crush or chew.",
    warnings: "Long-term usage can lead to weak bones (osteoporosis) or low magnesium levels. Consult your doctor if symptoms persist beyond 2 weeks.",
    therapeuticCategory: "Gastrointestinal",
    medicineType: "Tablet",
    saltComposition: ["Pantoprazole 40mg"]
  },
  pantoprazole: {
    description: "Pantoprazole is a proton pump inhibitor that suppresses gastric acid secretion by inhibiting the H+/K+-ATPase enzyme system in the gastric parietal cells.",
    uses: "Acid reflux relief, healing erosive esophagitis, and managing gastric acid hypersecretion.",
    sideEffects: "Headache, nausea, diarrhea, flatulence, dry mouth, or sleep disturbance.",
    dosageInstructions: "Take 1 tablet once daily in the morning, 30-60 minutes before breakfast. Swallow whole.",
    warnings: "Use caution in patients with severe hepatic impairment. Monitoring magnesium levels is advised for long-term therapy.",
    therapeuticCategory: "Gastrointestinal",
    medicineType: "Tablet",
    saltComposition: ["Pantoprazole 40mg"]
  },
  shelcal: {
    description: "Shelcal 500 is a calcium and vitamin D3 supplement. It contains Calcium Carbonate (500mg elemental calcium) and Cholecalciferol (Vitamin D3 250 IU), which help in maintaining healthy bones, joints, teeth, and calcium absorption.",
    uses: "Prevention and treatment of calcium deficiency, osteoporosis, bone weakness, and supporting joint health.",
    sideEffects: "Constipation, stomach upset, nausea, hypercalcemia (excess calcium levels in blood, rare at normal dose).",
    dosageInstructions: "Take 1 tablet daily after meals (preferably dinner) or as recommended by the healthcare professional.",
    warnings: "Avoid taking with high-fiber meals. Contraindicated in patients with kidney stones or high calcium levels.",
    therapeuticCategory: "Vitamin",
    medicineType: "Tablet",
    saltComposition: ["Calcium Carbonate 1250mg", "Vitamin D3 250 IU"]
  },
  metformin: {
    description: "Metformin is an oral antidiabetic drug belonging to the biguanide class. It is the first-line medication for the treatment of type 2 diabetes, helping to improve insulin sensitivity and lower blood glucose levels.",
    uses: "Management of type 2 diabetes mellitus, improving insulin sensitivity, and blood sugar control.",
    sideEffects: "Nausea, vomiting, abdominal bloating, diarrhea, metallic taste, or lactic acidosis (very rare but serious).",
    dosageInstructions: "Take 1 tablet with or after meals (usually dinner) to minimize stomach side effects, as prescribed by the diabetologist.",
    warnings: "Avoid excessive alcohol intake as it increases the risk of lactic acidosis. Contraindicated in severe renal or hepatic failure.",
    therapeuticCategory: "Diabetes",
    medicineType: "Tablet",
    saltComposition: ["Metformin Hydrochloride 500mg"]
  },
  limcee: {
    description: "Limcee is a chewable tablet containing Vitamin C (Ascorbic Acid 500mg). It is a powerful antioxidant that boosts immunity, promotes skin health, aids in iron absorption, and helps prevent scurvy.",
    uses: "Treatment of Vitamin C deficiency, boosting immunity against infections/colds, and promoting wound healing.",
    sideEffects: "Generally safe. High doses may cause diarrhea, stomach cramps, or kidney stones.",
    dosageInstructions: "Chew 1 tablet daily or as recommended by the physician. Do not swallow whole.",
    warnings: "Diabetic patients should use with caution as high doses of Vitamin C can interfere with blood glucose tests.",
    therapeuticCategory: "Vitamin",
    medicineType: "Tablet",
    saltComposition: ["Ascorbic Acid (Vitamin C) 500mg"]
  },
  allegra: {
    description: "Allegra contains Fexofenadine Hydrochloride, a second-generation non-sedating antihistamine. It works by blocking histamine receptors, thereby relieving allergy symptoms without causing drowsiness.",
    uses: "Relief of seasonal allergic rhinitis (sneezing, runny nose, itchy/watery eyes) and hives.",
    sideEffects: "Headache, drowsiness (rare), dry mouth, dizziness, or nausea.",
    dosageInstructions: "Take 1 tablet daily with water. Do not take with fruit juices as they reduce absorption.",
    warnings: "Consult a doctor if you have kidney disease. Avoid taking antacids containing aluminum or magnesium close to dosage time.",
    therapeuticCategory: "Respiratory",
    medicineType: "Tablet",
    saltComposition: ["Fexofenadine Hydrochloride 120mg"]
  },
  zyrtec: {
    description: "Zyrtec contains Cetirizine Hydrochloride, an antihistamine that treats symptoms of allergies and hives by blocking histamine substances.",
    uses: "Treatment of cold or allergy symptoms such as sneezing, itching, watery eyes, or runny nose.",
    sideEffects: "Drowsiness, dry mouth, sore throat, tiredness, or headache.",
    dosageInstructions: "Take 1 tablet daily with or without food. Best taken in the evening if it causes drowsiness.",
    warnings: "Avoid driving or operating heavy machinery until you know how Cetirizine affects you. Avoid alcohol.",
    therapeuticCategory: "Respiratory",
    medicineType: "Tablet",
    saltComposition: ["Cetirizine Hydrochloride 10mg"]
  }
};

  // AI Description Generator Simulation
  const handleGenerateAiDescription = () => {
    if (!medicineData.name) {
      alert("Please enter the Medicine Name first to generate a description.");
      return;
    }
    
    setIsAiGenerating(true);
    setTimeout(() => {
      const cleanName = medicineData.name.toLowerCase().trim();
      let matchedData = null;

      // Try exact or partial knowledge base lookup
      for (const key in MEDICINE_KNOWLEDGE_BASE) {
        if (cleanName.includes(key)) {
          matchedData = MEDICINE_KNOWLEDGE_BASE[key];
          break;
        }
      }

      if (matchedData) {
        setMedicineData(prev => ({
          ...prev,
          description: matchedData.description,
          uses: matchedData.uses,
          sideEffects: matchedData.sideEffects,
          dosageInstructions: matchedData.dosageInstructions,
          warnings: matchedData.warnings,
          saltComposition: [...new Set([...prev.saltComposition, ...matchedData.saltComposition])],
          therapeuticCategory: matchedData.therapeuticCategory,
          medicineType: matchedData.medicineType
        }));
      } else {
        // Fallback dynamic generation based on name and category
        const activeIngredient = medicineData.name.split(' ')[0] || medicineData.name;
        const cat = medicineData.therapeuticCategory;
        const type = medicineData.medicineType;
        
        let desc = `${medicineData.name} is a specialized pharmaceutical formulation indicated for clinical therapeutic management. It acts effectively to restore metabolic and physiological balance.`;
        let uses = `Relief of symptoms and management of clinical conditions corresponding to ${cat.toLowerCase()}.`;
        let side = "Mild headaches, nausea, dry mouth, drowsiness, or temporary digestive changes. Consult a medical practitioner if persistent.";
        let dosage = `Take 1 ${type.toLowerCase()} daily after meals or as directed by a healthcare professional.`;
        let warnings = "Do not exceed recommended dose. Keep away from alcohol. Use caution in renal or hepatic dysfunction.";
        let salts = [`${activeIngredient} compound`];

        if (cat.toLowerCase().includes('antibiotic')) {
          desc = `${medicineData.name} is a potent bacterial agent formulated to eliminate susceptible bacterial pathogens by disrupting cell wall synthesis.`;
          uses = "Management of lower respiratory tract infections, skin infections, and bacterial ENT conditions.";
          side = "Mild diarrhea, soft stools, nausea, abdominal cramps, or hypersensitivity rashes.";
          dosage = `Take 1 ${type.toLowerCase()} twice daily after meals. Complete the entire course as prescribed.`;
        } else if (cat.toLowerCase().includes('pain')) {
          desc = `${medicineData.name} is an analgesic and antipyretic compound that alleviates mild-to-moderate pain and reduces fever by blocking prostaglandins in the nervous system.`;
          uses = "Relief of headache, toothache, acute muscular strain, osteoarthritic discomfort, and high body temperature.";
          side = "Indigestion, abdominal discomfort, drowsiness, or cutaneous rashes.";
        }

        setMedicineData(prev => ({
          ...prev,
          description: desc,
          uses: uses,
          sideEffects: side,
          dosageInstructions: dosage,
          warnings: warnings,
          saltComposition: [...new Set([...prev.saltComposition, ...salts])]
        }));
      }
      setIsAiGenerating(false);
    }, 1200);
  };

  // Salt Composition Chips Management
  const handleAddSaltChip = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (!medicineData.currentSaltInput.trim()) return;
      setMedicineData(prev => ({
        ...prev,
        saltComposition: [...prev.saltComposition, prev.currentSaltInput.trim()],
        currentSaltInput: ''
      }));
    }
  };

  const handleRemoveSaltChip = (index) => {
    setMedicineData(prev => ({
      ...prev,
      saltComposition: prev.saltComposition.filter((_, i) => i !== index)
    }));
  };

  // Variants management
  const handleAddVariantRow = () => {
    setMedicineData(prev => ({
      ...prev,
      variants: [...prev.variants, { strength: '', form: medicineData.medicineType, packSize: '', mrp: '', sellingPrice: '', discount: '0', stock: '', batchNumber: '', expiryDate: '', sku: '' }]
    }));
  };

  const handleRemoveVariantRow = (index) => {
    if (medicineData.variants.length === 1) return;
    setMedicineData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setMedicineData(prev => {
      const updatedVariants = prev.variants.map((v, i) => {
        if (i === index) {
          const updated = { ...v, [field]: value };
          // Auto calculate discount percent if MRP and Selling Price are modified
          if (field === 'mrp' || field === 'sellingPrice') {
            const mrpVal = Number(updated.mrp || 0);
            const sellVal = Number(updated.sellingPrice || 0);
            if (mrpVal > 0) {
              updated.discount = Math.round(((mrpVal - sellVal) / mrpVal) * 100).toString();
            }
          }
          return updated;
        }
        return v;
      });
      return { ...prev, variants: updatedVariants };
    });
  };

  // Media upload simulation and management per slot
  const handleSlotImageUpload = (slotIndex, file) => {
    if (!file) return;

    // Upload validation: JPG PNG WEBP, Max 5MB each
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Only PNG, JPG, JPEG, and WEBP are supported.");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size exceeds 5MB limit. Please upload an image smaller than 5MB.");
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    setMedicineData(prev => {
      const updatedImages = [...prev.images];
      updatedImages[slotIndex] = {
        ...updatedImages[slotIndex],
        url: fileUrl,
        status: 'Pending Review' // Default status when uploaded
      };
      return { ...prev, images: updatedImages };
    });
  };

  const handleRemoveSlotImage = (slotIndex) => {
    setMedicineData(prev => {
      const updatedImages = [...prev.images];
      updatedImages[slotIndex] = {
        ...updatedImages[slotIndex],
        url: '',
        status: 'Pending Review'
      };
      return { ...prev, images: updatedImages };
    });
  };

  const handleSwapSlots = (indexA, indexB) => {
    if (indexA < 0 || indexA >= 3 || indexB < 0 || indexB >= 3) return;
    setMedicineData(prev => {
      const updatedImages = [...prev.images];
      const tempUrl = updatedImages[indexA].url;
      const tempStatus = updatedImages[indexA].status;
      
      updatedImages[indexA].url = updatedImages[indexB].url;
      updatedImages[indexA].status = updatedImages[indexB].status;
      
      updatedImages[indexB].url = tempUrl;
      updatedImages[indexB].status = tempStatus;
      
      return { ...prev, images: updatedImages };
    });
  };

  const handleSetImageStatus = (slotIndex, status) => {
    setMedicineData(prev => {
      const updatedImages = [...prev.images];
      updatedImages[slotIndex] = {
        ...updatedImages[slotIndex],
        status: status
      };
      return { ...prev, images: updatedImages };
    });
  };

  const handlePublish = () => {
    // Validate first image is mandatory
    if (!medicineData.images[0].url) {
      alert("Primary Product Image (Image 1) is mandatory. Please upload an image in the first slot.");
      setStep(4);
      return;
    }
    alert("Medicine published successfully to E Mediclub marketplace!");
    navigate('/vendor/pharmacy/medicines');
  };

  return (
    <div className="font-sans bg-[#F8FAF9] min-h-[calc(100vh-120px)] p-2 sm:p-4 lg:p-6 flex flex-col gap-6 max-w-5xl mx-auto">
      
      {/* 1. Header with Auto-save indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-150 pb-4 gap-3 shrink-0">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-slate-805 leading-none">Add New Medicine</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">Configure catalogs, dynamic variants, thresholds, and media vaults.</p>
        </div>
        <div className="text-right text-[10px] text-slate-450 font-black uppercase tracking-wider bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          {autoSaveTime ? `Draft Auto-Saved at ${autoSaveTime}` : 'Draft Auto-Saving active...'}
        </div>
      </div>

      {/* 2. Stepper UI */}
      <div className="bg-white border border-slate-100 p-4.5 rounded-3xl shadow-sm shrink-0 flex items-center justify-between">
        {[
          { stepNum: 1, label: 'Basic Info' },
          { stepNum: 2, label: 'Variants System' },
          { stepNum: 3, label: 'Inventory Settings' },
          { stepNum: 4, label: 'Media Upload' },
          { stepNum: 5, label: 'Review & Publish' }
        ].map((item) => (
          <div key={item.stepNum} className="flex items-center gap-2 flex-1 last:flex-initial">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= item.stepNum 
                ? 'bg-[#135A5A] text-white' 
                : 'bg-slate-100 text-slate-400 border border-slate-200/50'
            }`}>
              {item.stepNum}
            </div>
            <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider hidden md:inline ${
              step >= item.stepNum ? 'text-slate-800' : 'text-slate-400'
            }`}>
              {item.label}
            </span>
            {item.stepNum < 5 && <div className={`flex-1 h-0.5 mx-2 hidden md:block ${step > item.stepNum ? 'bg-[#135A5A]' : 'bg-slate-100'}`} />}
          </div>
        ))}
      </div>

      {/* 3. Step Content Panes */}
      <div className="flex-1 bg-white border border-slate-100 rounded-[32px] p-5 sm:p-6 shadow-sm min-h-[400px]">
        
        {/* STEP 1: BASIC INFO */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <h3 className="text-xs font-black text-slate-805 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <FiInfo className="text-[#135A5A]" /> Basic Medicine Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Medicine Name *</label>
                <input 
                  type="text" 
                  value={medicineData.name} 
                  onChange={(e) => setMedicineData({...medicineData, name: e.target.value})}
                  placeholder="e.g. Augmentin 625 Duo Tablet" 
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Brand Name *</label>
                <input 
                  type="text" 
                  value={medicineData.brand} 
                  onChange={(e) => setMedicineData({...medicineData, brand: e.target.value})}
                  placeholder="e.g. GlaxoSmithKline" 
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A]"
                />
              </div>
            </div>

            {/* Salt composition chips */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Salt Composition</label>
              <div className="flex flex-wrap gap-1.5 bg-slate-50 border border-slate-100 p-2.5 rounded-xl min-h-[44px]">
                {medicineData.saltComposition.map((salt, index) => (
                  <span key={index} className="bg-teal-50 text-[#135A5A] border border-teal-100 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5">
                    <span>{salt}</span>
                    <button type="button" onClick={() => handleRemoveSaltChip(index)} className="text-xs hover:text-rose-500 border-0 bg-transparent cursor-pointer">✕</button>
                  </span>
                ))}
                <input 
                  type="text" 
                  value={medicineData.currentSaltInput} 
                  onChange={(e) => setMedicineData({...medicineData, currentSaltInput: e.target.value})}
                  onKeyDown={handleAddSaltChip}
                  placeholder="Type salt composition and press Enter..." 
                  className="bg-transparent border-none outline-none text-xs font-semibold placeholder:text-slate-400 flex-1 min-w-[200px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Medicine Type *</label>
                <select 
                  value={medicineData.medicineType}
                  onChange={(e) => setMedicineData({...medicineData, medicineType: e.target.value})}
                  className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A]"
                >
                  <option>Tablet</option>
                  <option>Capsule</option>
                  <option>Syrup</option>
                  <option>Cream</option>
                  <option>Drops</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Therapeutic Category *</label>
                <select 
                  value={medicineData.therapeuticCategory}
                  onChange={(e) => setMedicineData({...medicineData, therapeuticCategory: e.target.value})}
                  className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A]"
                >
                  <option>Antibiotic</option>
                  <option>Pain Relief</option>
                  <option>Diabetes</option>
                  <option>Cardiac</option>
                  <option>Skin Care</option>
                  <option>Vitamin</option>
                  <option>Respiratory</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Manufacturer Company *</label>
                <input 
                  type="text" 
                  value={medicineData.manufacturer} 
                  onChange={(e) => setMedicineData({...medicineData, manufacturer: e.target.value})}
                  placeholder="e.g. Sun Pharma Labs" 
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A]"
                />
              </div>
            </div>

            {/* AI Generator description */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Medicine Description *</label>
                <button 
                  type="button" 
                  onClick={handleGenerateAiDescription}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-150 hover:bg-teal-100 text-[#135A5A] text-[9.5px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  <FiCpu className={isAiGenerating ? 'animate-spin' : ''} />
                  <span>{isAiGenerating ? 'Generating...' : 'Generate Medicine Information with AI'}</span>
                </button>
              </div>
              <textarea 
                rows="3" 
                value={medicineData.description}
                onChange={(e) => setMedicineData({...medicineData, description: e.target.value})}
                placeholder="Detailed clinical instructions, pharmacological descriptions, etc."
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Uses & Indications</label>
                <textarea 
                  rows="2" 
                  value={medicineData.uses}
                  onChange={(e) => setMedicineData({...medicineData, uses: e.target.value})}
                  placeholder="e.g. Pain relief, fever reduction" 
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A] resize-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Dosage Instructions</label>
                <textarea 
                  rows="2" 
                  value={medicineData.dosageInstructions}
                  onChange={(e) => setMedicineData({...medicineData, dosageInstructions: e.target.value})}
                  placeholder="e.g. 1 Tablet twice daily after meals" 
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A] resize-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Warnings & Contraindications</label>
                <textarea 
                  rows="2" 
                  value={medicineData.warnings}
                  onChange={(e) => setMedicineData({...medicineData, warnings: e.target.value})}
                  placeholder="e.g. Avoid alcohol, not safe during pregnancy" 
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A] resize-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Side Effects</label>
              <input 
                type="text" 
                value={medicineData.sideEffects}
                onChange={(e) => setMedicineData({...medicineData, sideEffects: e.target.value})}
                placeholder="e.g. Dizziness, dry mouth, nausea" 
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1 border-t border-slate-50 pt-3">
              <div className="flex items-center justify-between bg-slate-50 p-3.5 border border-slate-100 rounded-2xl">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-extrabold text-slate-805">Prescription Required *</span>
                  <span className="text-[9.5px] text-slate-400 font-bold uppercase">Must check prescription uploads before dispatch</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={medicineData.prescriptionRequired} 
                  onChange={(e) => setMedicineData({...medicineData, prescriptionRequired: e.target.checked})}
                  className="w-4 h-4 text-[#135A5A] focus:ring-[#135A5A]/20 cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Drug Schedule selector</label>
                <select 
                  value={medicineData.scheduleType}
                  onChange={(e) => setMedicineData({...medicineData, scheduleType: e.target.value})}
                  className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A]"
                >
                  <option>OTC</option>
                  <option>H</option>
                  <option>H1</option>
                  <option>X</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: VARIANTS SYSTEM */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
              <h3 className="text-xs font-black text-slate-805 uppercase tracking-widest flex items-center gap-1.5">
                <FiLayers className="text-[#135A5A]" /> Medicine Variants configuration
              </h3>
              <button 
                type="button" 
                onClick={handleAddVariantRow}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#135A5A] hover:bg-[#0F4A4A] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <FiPlus /> Add Variant Row
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase tracking-wider text-slate-450">
                    <th className="p-3">Strength</th>
                    <th className="p-3">Form</th>
                    <th className="p-3">Pack Size</th>
                    <th className="p-3">MRP (₹)</th>
                    <th className="p-3">Selling (₹)</th>
                    <th className="p-3">Disc (%)</th>
                    <th className="p-3">Stock Qty</th>
                    <th className="p-3">Batch No.</th>
                    <th className="p-3">Expiry Date</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {medicineData.variants.map((variant, index) => (
                    <tr key={index} className="hover:bg-slate-50/20">
                      <td className="p-2">
                        <select value={variant.strength} onChange={(e) => handleVariantChange(index, 'strength', e.target.value)} className="w-24 px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-[#135A5A] font-semibold">
                          <option>650mg</option>
                          <option>500mg</option>
                          <option>250mg</option>
                          <option>100mg</option>
                          <option>50mg</option>
                          <option>40mg</option>
                          <option>20mg</option>
                          <option>10mg</option>
                          <option>5mg</option>
                          <option>15ml</option>
                          <option>60ml</option>
                          <option>100ml</option>
                          <option>200ml</option>
                          <option>15g</option>
                          <option>20g</option>
                          <option>30g</option>
                          <option>50g</option>
                          <option>100g</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <select value={variant.form} onChange={(e) => handleVariantChange(index, 'form', e.target.value)} className="w-24 px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-[#135A5A] font-semibold">
                          <option>Tablet</option>
                          <option>Capsule</option>
                          <option>Syrup</option>
                          <option>Cream</option>
                          <option>Drops</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <select value={variant.packSize} onChange={(e) => handleVariantChange(index, 'packSize', e.target.value)} className="w-28 px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-[#135A5A] font-semibold">
                          <option>Strip of 10</option>
                          <option>Strip of 15</option>
                          <option>Strip of 30</option>
                          <option>Bottle of 30</option>
                          <option>Bottle of 60</option>
                          <option>Bottle of 100</option>
                          <option>Bottle of 60ml</option>
                          <option>Bottle of 100ml</option>
                          <option>Bottle of 200ml</option>
                          <option>Tube of 10g</option>
                          <option>Tube of 15g</option>
                          <option>Tube of 20g</option>
                          <option>Tube of 30g</option>
                          <option>Tube of 50g</option>
                          <option>Box of 1</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input type="number" placeholder="35" value={variant.mrp} onChange={(e) => handleVariantChange(index, 'mrp', e.target.value)} className="w-16 px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-[#135A5A] font-bold text-slate-805" />
                      </td>
                      <td className="p-2">
                        <input type="number" placeholder="30" value={variant.sellingPrice} onChange={(e) => handleVariantChange(index, 'sellingPrice', e.target.value)} className="w-16 px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-[#135A5A] font-bold text-[#135A5A]" />
                      </td>
                      <td className="p-2">
                        <span className="w-12 px-2 py-1.5 bg-slate-100 rounded-lg font-black text-center text-[10px] block">{variant.discount}%</span>
                      </td>
                      <td className="p-2">
                        <input type="number" placeholder="100" value={variant.stock} onChange={(e) => handleVariantChange(index, 'stock', e.target.value)} className="w-16 px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-[#135A5A] font-bold text-slate-805" />
                      </td>
                      <td className="p-2">
                        <input type="text" placeholder="BAT-2026" value={variant.batchNumber} onChange={(e) => handleVariantChange(index, 'batchNumber', e.target.value)} className="w-24 px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-[#135A5A] font-semibold font-mono" />
                      </td>
                      <td className="p-2">
                        <input type="date" value={variant.expiryDate} onChange={(e) => handleVariantChange(index, 'expiryDate', e.target.value)} className="w-28 px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-[#135A5A] font-semibold" />
                      </td>
                      <td className="p-2">
                        <input type="text" placeholder="SKU-DOLO" value={variant.sku} onChange={(e) => handleVariantChange(index, 'sku', e.target.value)} className="w-32 px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-[#135A5A] font-semibold font-mono" />
                      </td>
                      <td className="p-2 text-center">
                        <button 
                          type="button" 
                          onClick={() => handleRemoveVariantRow(index)}
                          className="text-slate-400 hover:text-rose-500 border-0 bg-transparent cursor-pointer p-1"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STEP 3: INVENTORY SETTINGS */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <h3 className="text-xs font-black text-slate-805 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <FiAlertTriangle className="text-[#135A5A]" /> Advanced Inventory Parameters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Low Stock Threshold Limit *</label>
                <input 
                  type="number" 
                  value={medicineData.lowStockThreshold}
                  onChange={(e) => setMedicineData({...medicineData, lowStockThreshold: Number(e.target.value)})}
                  placeholder="e.g. 10" 
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-[#135A5A]"
                />
                <span className="text-[8.5px] text-slate-405 font-bold uppercase mt-0.5">Triggers warning status once catalog falls below value.</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center justify-between bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                <div>
                  <span className="text-xs font-extrabold text-slate-805 block">Auto Out-of-Stock Status</span>
                  <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Hide or disable pharmacy orders automatically when stock is 0.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={medicineData.autoOutOfStock} 
                  onChange={(e) => setMedicineData({...medicineData, autoOutOfStock: e.target.checked})}
                  className="w-4 h-4 text-[#135A5A] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                <div>
                  <span className="text-xs font-extrabold text-slate-805 block">Expiry Date Alerts</span>
                  <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Alert inventory admin 90 days before batch expirations.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={medicineData.expiryAlert} 
                  onChange={(e) => setMedicineData({...medicineData, expiryAlert: e.target.checked})}
                  className="w-4 h-4 text-[#135A5A] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                <div>
                  <span className="text-xs font-extrabold text-slate-850 block">Batch Tracking Logs</span>
                  <span className="text-[9px] text-slate-400 font-semibold mt-0.5">Log manufacturing audits, timestamps, and shelf positions.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={medicineData.batchTracking} 
                  onChange={(e) => setMedicineData({...medicineData, batchTracking: e.target.checked})}
                  className="w-4 h-4 text-[#135A5A] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: MEDIA UPLOAD */}
        {step === 4 && (
          <div className="flex flex-col gap-6">
            <div className="border-b border-slate-50 pb-3">
              <h3 className="text-xs font-black text-slate-850 uppercase tracking-widest flex items-center gap-1.5">
                <FiUploadCloud className="text-[#135A5A]" /> Medicine Images Vault
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                Upload up to 3 images. Max size 5MB each. Supported: PNG, JPG, WEBP.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {medicineData.images.map((slot, index) => {
                const hasImage = !!slot.url;
                const isDragOver = dragOverSlot === index;
                
                // Status badge styling helper
                let statusBg = "bg-amber-50 text-amber-700 border-amber-200";
                if (slot.status === 'Approved') statusBg = "bg-emerald-50 text-emerald-700 border-emerald-200";
                if (slot.status === 'Rejected') statusBg = "bg-rose-50 text-rose-700 border-rose-200";

                return (
                  <div 
                    key={slot.id} 
                    className={`bg-white border-2 rounded-[24px] p-4 flex flex-col justify-between transition-all duration-300 relative ${
                      isDragOver 
                        ? 'border-[#135A5A] bg-[#135A5A]/5 scale-[1.02]' 
                        : hasImage 
                          ? 'border-slate-100 shadow-sm hover:shadow-md' 
                          : 'border-dashed border-slate-200 hover:border-[#135A5A]/40'
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverSlot(index);
                    }}
                    onDragLeave={() => setDragOverSlot(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOverSlot(null);
                      const file = e.dataTransfer.files[0];
                      if (file) handleSlotImageUpload(index, file);
                    }}
                  >
                    <div>
                      {/* Slot Header Label */}
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-805">
                          [ Image {slot.id} ]
                        </span>
                        {slot.isMandatory && (
                          <span className="text-[8.5px] bg-[#135A5A]/10 text-[#135A5A] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                            Mandatory
                          </span>
                        )}
                      </div>
                      
                      <h4 className="text-[11px] font-extrabold text-slate-850">{slot.label}</h4>
                      <p className="text-[9.5px] text-slate-400 font-semibold leading-tight mt-0.5 mb-4">{slot.description}</p>
                    </div>

                    {/* Preview Area or Upload Dropzone */}
                    <div className="flex-1 min-h-[160px] flex flex-col justify-center">
                      {hasImage ? (
                        <div className="flex flex-col gap-3">
                          {/* Image Box */}
                          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center relative group">
                            <img src={slot.url} alt={slot.label} className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <label className="p-2 bg-white/95 text-[#135A5A] rounded-xl hover:bg-white transition-all cursor-pointer shadow-md text-xs font-bold flex items-center gap-1">
                                <input 
                                  type="file" 
                                  accept=".png,.jpg,.jpeg,.webp"
                                  className="hidden" 
                                  onChange={(e) => handleSlotImageUpload(index, e.target.files[0])}
                                />
                                <FiCamera className="w-3.5 h-3.5" /> Replace
                              </label>
                              <button 
                                type="button" 
                                onClick={() => handleRemoveSlotImage(index)}
                                className="p-2 bg-white/95 text-rose-600 rounded-xl hover:bg-white transition-all cursor-pointer shadow-md text-xs font-bold border-0 flex items-center gap-1"
                              >
                                <FiTrash2 className="w-3.5 h-3.5" /> Remove
                              </button>
                            </div>
                          </div>

                          {/* Status and Action Row */}
                          <div className="flex items-center justify-between border-t border-slate-50 pt-2.5">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[8.5px] text-slate-405 font-black uppercase">Approval Status</span>
                              <span className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 border rounded-lg ${statusBg}`}>
                                {slot.status}
                              </span>
                            </div>
                            
                            {/* Simulate Status Select for Vendor Review */}
                            <div className="flex flex-col gap-0.5 items-end">
                              <span className="text-[8.5px] text-slate-405 font-black uppercase">Simulate Action</span>
                              <select 
                                value={slot.status} 
                                onChange={(e) => handleSetImageStatus(index, e.target.value)}
                                className="text-[9.5px] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg py-0.5 px-1 font-bold outline-none cursor-pointer"
                              >
                                <option value="Pending Review">Pending</option>
                                <option value="Approved">Approve</option>
                                <option value="Rejected">Reject</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-slate-205 hover:border-[#135A5A]/50 transition-colors rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50/50 hover:bg-slate-50/80">
                          <input 
                            type="file" 
                            accept=".png,.jpg,.jpeg,.webp"
                            className="hidden" 
                            onChange={(e) => handleSlotImageUpload(index, e.target.files[0])}
                          />
                          <FiCamera className="text-3xl text-slate-350" />
                          <span className="text-[10px] font-black text-slate-805 uppercase tracking-wider">+ Drag or Upload</span>
                        </label>
                      )}
                    </div>

                    {/* Bottom Swap/Order Controllers */}
                    {hasImage && (
                      <div className="flex items-center justify-between mt-4 border-t border-slate-50 pt-2.5">
                        <button 
                          type="button" 
                          disabled={index === 0} 
                          onClick={() => handleSwapSlots(index, index - 1)}
                          className="text-[9.5px] text-[#135A5A] font-black uppercase tracking-wider hover:underline disabled:opacity-30 disabled:no-underline border-0 bg-transparent cursor-pointer"
                        >
                          ← Move Left
                        </button>
                        <span className="text-[9px] text-slate-400 font-bold uppercase">Order: {index + 1}</span>
                        <button 
                          type="button" 
                          disabled={index === 2} 
                          onClick={() => handleSwapSlots(index, index + 1)}
                          className="text-[9.5px] text-[#135A5A] font-black uppercase tracking-wider hover:underline disabled:opacity-30 disabled:no-underline border-0 bg-transparent cursor-pointer"
                        >
                          Move Right →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & PUBLISH */}
        {step === 5 && (
          <div className="flex flex-col gap-6">
            <h3 className="text-xs font-black text-slate-805 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <FiCheckCircle className="text-emerald-600" /> Review catalog listing details
            </h3>

            <div className="flex flex-col gap-4">
              
              {/* Review Section 1: Basic Info */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-3 relative">
                <button type="button" onClick={() => setStep(1)} className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#135A5A] hover:underline cursor-pointer border-0 bg-transparent">
                  <FiEdit /> Edit
                </button>
                <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider block border-b border-slate-200/50 pb-1.5">Medicine Info</span>
                <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-650">
                  <div><span className="text-slate-400">Name</span>: <span className="text-slate-850 font-extrabold">{medicineData.name || 'N/A'}</span></div>
                  <div><span className="text-slate-400">Brand</span>: <span className="text-slate-850 font-extrabold">{medicineData.brand || 'N/A'}</span></div>
                  <div><span className="text-slate-400">Type</span>: <span className="text-slate-850 font-extrabold">{medicineData.medicineType}</span></div>
                  <div><span className="text-slate-400">Therapeutic</span>: <span className="text-slate-850 font-extrabold">{medicineData.therapeuticCategory}</span></div>
                  <div><span className="text-slate-400">Category</span>: <span className="text-slate-850 font-extrabold">{medicineData.category}</span></div>
                  <div><span className="text-slate-400">Schedule</span>: <span className="text-slate-850 font-extrabold">{medicineData.scheduleType}</span></div>
                </div>
              </div>

              {/* Review Section 2: Variants */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-3 relative">
                <button type="button" onClick={() => setStep(2)} className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#135A5A] hover:underline cursor-pointer border-0 bg-transparent">
                  <FiEdit /> Edit
                </button>
                <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider block border-b border-slate-200/50 pb-1.5">Variants System</span>
                <div className="flex flex-col gap-2">
                  {medicineData.variants.map((v, i) => (
                    <div key={i} className="flex justify-between items-center text-xs font-semibold text-slate-650 bg-white p-2.5 rounded-xl border border-slate-100">
                      <span>{v.strength} {v.form} ({v.packSize})</span>
                      <span className="font-extrabold text-[#135A5A]">₹{v.sellingPrice} <span className="text-slate-400 line-through text-[10px] ml-1">₹{v.mrp}</span></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Section 3: Media Upload */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-3 relative">
                <button type="button" onClick={() => setStep(4)} className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#135A5A] hover:underline cursor-pointer border-0 bg-transparent">
                  <FiEdit /> Edit
                </button>
                <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider block border-b border-slate-200/50 pb-1.5">Uploaded Media</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {medicineData.images.map((img, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0">
                        {img.url ? (
                          <img src={img.url} className="w-full h-full object-contain" />
                        ) : (
                          <FiCamera className="text-slate-300 w-5 h-5" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-black text-slate-805 uppercase truncate">{img.label}</span>
                        {img.url ? (
                          <span className={`text-[8.5px] font-black uppercase tracking-wider mt-1 px-1.5 py-0.5 rounded border inline-block w-fit ${
                            img.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            img.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                            'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {img.status}
                          </span>
                        ) : (
                          <span className="text-[8.5px] font-semibold text-slate-400 uppercase">Not Uploaded</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Substitutes placeholder */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-3">
                <span className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider block border-b border-slate-200/50 pb-1.5">Suggested Alternatives Substitutes</span>
                <p className="text-2xs text-slate-450 font-semibold">Smart suggestions will auto-derive based on the salt compositions configured in Step 1 once published.</p>
              </div>

            </div>

            <div className="flex gap-3 mt-4 border-t border-slate-50 pt-5">
              <button 
                type="button" 
                onClick={handlePublish}
                className="flex-1 py-3 bg-[#135A5A] hover:bg-[#0F4A4A] text-white text-xs font-black uppercase tracking-wider rounded-2xl cursor-pointer border-0 shadow-premium"
              >
                Publish Medicine
              </button>
              <button 
                type="button" 
                onClick={() => { alert("Draft saved successfully!"); navigate('/vendor/pharmacy/medicines'); }}
                className="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-2xl cursor-pointer border border-slate-200"
              >
                Save as Draft
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 4. Sticky Stepper Actions Footer */}
      <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm shrink-0 flex justify-between items-center">
        <button
          type="button"
          disabled={step === 1}
          onClick={() => setStep(prev => prev - 1)}
          className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all border border-slate-200 cursor-pointer
            ${step === 1 ? 'opacity-40 cursor-not-allowed bg-transparent text-slate-300' : 'bg-white text-slate-650 hover:bg-slate-50'}`}
        >
          <FiArrowLeft /> Back
        </button>

        {step < 5 ? (
          <button
            type="button"
            onClick={() => setStep(prev => prev + 1)}
            className="px-5 py-3 bg-[#135A5A] hover:bg-[#0F4A4A] text-white text-xs font-black uppercase tracking-wider rounded-2xl cursor-pointer border-0 shadow-premium flex items-center gap-1.5"
          >
            Next <FiArrowRight />
          </button>
        ) : (
          <span className="text-[10px] font-black uppercase text-teal-700">All Steps Configured</span>
        )}
      </div>

    </div>
  );
}
