/**
 * PrescriptionMedicineService
 * Service layer responsible for simulating OCR/AI prescription parsing.
 * Maps uploaded files to realistic prescribed medicines with compositions, dosages, pricing, and stock status.
 * Keep this modular so that future OCR/API integrations can replace the mock data.
 */

// Simulated database of prescription medicines
const mockPrescribedMedicines = [
  {
    id: 'rx-med-1',
    name: 'Paracetamol 650mg',
    brand: 'Crocin Pain Relief',
    composition: 'Paracetamol 650mg',
    price: 34,
    discountPrice: 28,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    dosage: '1 tablet twice daily after meals (Pain & Fever)',
    category: 'Pain Relief',
    inStock: true,
    rxRequired: true,
    packSize: 'Strip of 15 tablets'
  },
  {
    id: 'rx-med-2',
    name: 'Azithromycin 500mg',
    brand: 'Azithral 500',
    composition: 'Azithromycin 500mg',
    price: 125,
    discountPrice: 106,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80',
    dosage: '1 tablet once daily for 3 days (Antibiotic)',
    category: 'Antibiotics',
    inStock: true,
    rxRequired: true,
    packSize: 'Strip of 5 tablets'
  },
  {
    id: 'rx-med-3',
    name: 'Vitamin D3 Capsules',
    brand: 'Calcirol 60K',
    composition: 'Cholecalciferol 60000 IU',
    price: 180,
    discountPrice: 153,
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=400&q=80',
    dosage: '1 capsule weekly with warm milk (Vitamins & Supplements)',
    category: 'Vitamins & Supplements',
    inStock: true,
    rxRequired: false,
    packSize: 'Strip of 4 capsules'
  },
  {
    id: 'rx-med-4',
    name: 'Pantoprazole 40mg',
    brand: 'Pan 40',
    composition: 'Pantoprazole 40mg',
    price: 110,
    discountPrice: 93,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80',
    dosage: '1 tablet daily 30 mins before breakfast (Digestive Health)',
    category: 'Digestive Health',
    inStock: true,
    rxRequired: true,
    packSize: 'Strip of 15 tablets'
  },
  {
    id: 'rx-med-5',
    name: 'Zincovit Tablets',
    brand: 'Zincovit Multivitamins',
    composition: 'Multivitamins, Multiminerals & Grape Seed Extract',
    price: 105,
    discountPrice: 89,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    dosage: '1 tablet daily after lunch (Vitamins & Supplements)',
    category: 'Vitamins & Supplements',
    inStock: false,
    alternative: {
      name: 'A to Z Multivitamin Tablets',
      price: 115,
      discountPrice: 98,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80',
      packSize: 'Strip of 15 tablets'
    },
    rxRequired: false,
    packSize: 'Strip of 15 tablets'
  },
  {
    id: 'rx-med-6',
    name: 'Cetirizine 10mg',
    brand: 'Alerid 10',
    composition: 'Cetirizine Hydrochloride 10mg',
    price: 40,
    discountPrice: 34,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80',
    dosage: '1 tablet at bedtime if needed (Cold & Allergy)',
    category: 'Cold & Fever',
    inStock: true,
    rxRequired: false,
    packSize: 'Strip of 10 tablets'
  },
  {
    id: 'rx-med-7',
    name: 'Metformin 500mg',
    brand: 'Glycomet 500 SR',
    composition: 'Metformin Hydrochloride 500mg',
    price: 65,
    discountPrice: 55,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80',
    dosage: '1 tablet twice daily with meals (Diabetes Care)',
    category: 'Diabetes Care',
    inStock: true,
    rxRequired: true,
    packSize: 'Strip of 15 tablets'
  },
  {
    id: 'rx-med-8',
    name: 'Telmisartan 40mg',
    brand: 'Telma 40',
    composition: 'Telmisartan 40mg',
    price: 88,
    discountPrice: 74,
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=400&q=80',
    dosage: '1 tablet daily in the morning (Blood Pressure)',
    category: 'Blood Pressure',
    inStock: true,
    rxRequired: true,
    packSize: 'Strip of 15 tablets'
  }
];

export const PrescriptionMedicineService = {
  /**
   * Simulates parsing an uploaded prescription file and extracting medicines.
   * Returns a list of 4 to 8 realistic prescribed medicines.
   */
  parsePrescription: (fileName) => {
    // Generate a deterministic subset based on file name or random length
    const fileHash = fileName ? fileName.length : 5;
    const count = 4 + (fileHash % 5); // Returns between 4 and 8
    
    // Select a slice of mock medicines
    const selected = mockPrescribedMedicines.slice(0, count);
    
    // Return cloned array to avoid reference issues
    return JSON.parse(JSON.stringify(selected));
  }
};
