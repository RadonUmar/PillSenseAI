export const medicines = [
  {
    id: '1',
    name: 'Tylenol',
    activeIngredient: 'Acetaminophen',
    dosage: '500mg',
    frequency: 'Every 4-6 hours',
    warnings: 'Do not exceed 3000mg per day',
    ageRestriction: '12+',
    notes: 'Take with food if stomach upset occurs',
  },
  {
    id: '2',
    name: 'Ibuprofen',
    activeIngredient: 'Ibuprofen',
    dosage: '200mg',
    frequency: 'Every 4-6 hours',
    warnings: 'May cause stomach irritation',
    ageRestriction: '6+',
    notes: 'Take with milk or food',
  },
  {
    id: '3',
    name: 'Aspirin',
    activeIngredient: 'Acetylsalicylic acid',
    dosage: '325mg',
    frequency: 'Every 4-6 hours',
    warnings: 'Not for children under 16',
    ageRestriction: '16+',
    notes: 'Do not use with other pain relievers',
  },
  {
    id: '4',
    name: 'Allergy Relief',
    activeIngredient: 'Cetirizine',
    dosage: '10mg',
    frequency: 'Once daily',
    warnings: 'May cause drowsiness',
    ageRestriction: '12+',
    notes: 'Take in the morning or evening',
  },
]

export const doseHistory = [
  {
    id: '1',
    medicine: 'Tylenol',
    dosage: '500mg',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    time: '8:02 PM',
  },
  {
    id: '2',
    medicine: 'Ibuprofen',
    dosage: '200mg',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    time: '5:15 PM',
  },
  {
    id: '3',
    medicine: 'Tylenol',
    dosage: '500mg',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    time: '2:30 PM',
  },
  {
    id: '4',
    medicine: 'Allergy Relief',
    dosage: '10mg',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 8 * 60 * 60 * 1000), // 1 day + 8 hours ago
    time: '6:45 AM',
  },
]

export const pillBoxMedicines = [
  { ...medicines[0], quantity: 12 },
  { ...medicines[1], quantity: 8 },
  { ...medicines[2], quantity: 5 },
  { ...medicines[3], quantity: 30 },
]
