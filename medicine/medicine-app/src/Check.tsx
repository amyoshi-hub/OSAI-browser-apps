// src/Check.tsx

import { useState, useEffect } from 'react';
import './App.css';
// Assuming medicineData.json is in the same directory as Check.tsx, or adjust path if it's in a 'data' subfolder
import medicineData from './medicineData.json'; 

// Define an interface or type for your medicine data structure
interface MedicineItem {
  id: number;
  name: string;
  time: string;
  // Add other properties if your JSON has them, e.g.:
  // type?: string;
  // stock?: number;
}

// **** RENAMED from function App() to function Check() ****
function Check() { 
  // Explicitly tell useState that medicineSchedule will be an array of MedicineItem
  const [medicineSchedule, setMedicineSchedule] = useState<MedicineItem[]>([]);

  useEffect(() => {
    // In a real application, you would fetch this data from an API:
    // fetch('/api/medicine-schedule')
    //   .then(response => response.json())
    //   .then(data => setMedicineSchedule(data))
    //   .catch(error => console.error('Error fetching medicine data:', error));

    // For now, if medicineData is imported directly:
    if (medicineData) {
      setMedicineSchedule(medicineData);
    }
  }, []);

  return (
    <div>
      <h1>薬のスケジュール</h1>

      {medicineSchedule.length > 0 ? (
        <ul>
          {medicineSchedule.map((medicine: MedicineItem) => ( // Use MedicineItem type here too
            <li key={medicine.id}> {/* It's better to use a unique ID if available, otherwise index */}
              {medicine.name} - {medicine.time}
            </li>
          ))}
        </ul>
      ) : (
        <p>薬のスケジュールがありません。</p>
      )}
    </div>
  );
}

// **** RENAMED from export default App; to export default Check; ****
export default Check;
