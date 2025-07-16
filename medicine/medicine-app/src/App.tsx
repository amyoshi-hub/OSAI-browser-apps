// src/App.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  const [startDate, setStartDate] = useState('');
  const [medName, setMedName] = useState('');
  const [medType, setMedType] = useState('錠剤');
  const [medTimes, setMedTimes] = useState<string[]>([]);
  const [medTimeSpecific, setMedTimeSpecific] = useState('');
  const [medStock, setMedStock] = useState<number>(1);
  const [repeatOption, setRepeatOption] = useState('1');

  const navigate = useNavigate();

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setMedTimes(prev => [...prev, value]);
    } else {
      setMedTimes(prev => prev.filter(time => time !== value));
    }
  };

  const addMedicine = () => {
    const medicineData = {
      startDate,
      medName,
      medType,
      medTimes,
      medTimeSpecific,
      medStock,
      repeatOption,
    };
    console.log('登録する薬:', medicineData);

    const existingData = JSON.parse(localStorage.getItem('medicineSchedule') || '[]');
    localStorage.setItem('medicineSchedule', JSON.stringify([...existingData, medicineData]));

    alert('薬を登録しました！');
    setStartDate('');
    setMedName('');
    setMedType('錠剤');
    setMedTimes([]);
    setMedTimeSpecific('');
    setMedStock(1);
    setRepeatOption('1');
  };

  const deleteMedicine = () => {
    if (window.confirm('全ての登録薬を削除しますか？')) {
      localStorage.removeItem('medicineSchedule');
      alert('全ての薬を削除しました。');
    }
  };

  const goToCheckPage = () => {
    navigate('/check');
  };

  return (
    <div>
      <h1>💊 薬の登録・在庫管理</h1>

      <label>
        📅 開始日:{' '}
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
      </label>
      <br />
      <br />

      <label>
        薬の名前:{' '}
        <input
          type="text"
          value={medName}
          onChange={e => setMedName(e.target.value)}
        />
      </label>
      <br />
      <br />

      <label>
        薬の種類:
        <select value={medType} onChange={e => setMedType(e.target.value)}>
          <option value="錠剤">錠剤</option>
          <option value="カプセル錠">カプセル錠</option>
          <option value="粉薬">粉薬</option>
          <option value="シロップ">シロップ</option>
        </select>
      </label>
      <br />
      <br />

      <label>服用タイミング:</label>
      <label>
        <input
          type="checkbox"
          value="朝"
          checked={medTimes.includes('朝')}
          onChange={handleCheckboxChange}
        />{' '}
        朝
      </label>
      <label>
        <input
          type="checkbox"
          value="昼"
          checked={medTimes.includes('昼')}
          onChange={handleCheckboxChange}
        />{' '}
        昼
      </label>
      <label>
        <input
          type="checkbox"
          value="夜"
          checked={medTimes.includes('夜')}
          onChange={handleCheckboxChange}
        />{' '}
        夜
      </label>
      <br />
      <br />

      <label>
        時間（HH:MM）:{' '}
        <input
          type="time"
          value={medTimeSpecific}
          onChange={e => setMedTimeSpecific(e.target.value)}
        />
      </label>
      <br />
      <br />

      <label>
        在庫数（錠数）:{' '}
        <input
          type="number"
          min="1"
          value={medStock}
          onChange={e => setMedStock(Number(e.target.value))}
        />
      </label>
      <br />
      <br />

      <label>登録範囲:</label>
      <br />
      <label>
        <input
          type="radio"
          name="repeat"
          value="1"
          checked={repeatOption === '1'}
          onChange={e => setRepeatOption(e.target.value)}
        />{' '}
        今日のみ
      </label>
      <br />
      <label>
        <input
          type="radio"
          name="repeat"
          value="7"
          checked={repeatOption === '7'}
          onChange={e => setRepeatOption(e.target.value)}
        />{' '}
        1週間分（7日）
      </label>
      <br />
      <label>
        <input
          type="radio"
          name="repeat"
          value="30"
          checked={repeatOption === '30'}
          onChange={e => setRepeatOption(e.target.value)}
        />{' '}
        30日分
      </label>
      <br />
      <br />

      <button onClick={addMedicine}>登録</button>
      <button onClick={deleteMedicine}>全削除</button>

      <p>
        <a href="#" onClick={goToCheckPage}>
          ✅ 確認ページを開く
        </a>
      </p>
    </div>
  );
}

export default App;
