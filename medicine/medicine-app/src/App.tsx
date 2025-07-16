import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // App.cssをインポート

// データベースに保存される薬のエントリのインターフェースを定義
interface MedicineEntry {
  id: string; // 各エントリの一意のID
  date: string; // この薬のエントリの特定の日付 (YYYY-MM-DD)
  medName: string; // 薬の名前
  medType: string; // 薬の種類
  medTimes: string[]; // 例: ["朝", "昼"]
  medTimeSpecific: string; // 例: "08:00"
  medStock: number; // 在庫数
}

function App() {
  const [startDate, setStartDate] = useState('');
  const [finalDate, setFinalDate] = useState(''); // 終了日の状態
  const [medName, setMedName] = useState('');
  const [medType, setMedType] = useState('錠剤');
  const [medTimes, setMedTimes] = useState<string[]>([]);
  const [medTimeSpecific, setMedTimeSpecific] = useState('');
  const [medStock, setMedStock] = useState<number>(1);

  const [message, setMessage] = useState(''); // ユーザーへのメッセージ表示用の状態

  const navigate = useNavigate();

  // 「服用タイミング」のチェックボックスの変更を処理
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setMedTimes(prev => [...prev, value]);
    } else {
      setMedTimes(prev => prev.filter(time => time !== value));
    }
  };

  // 日付に日数を追加するヘルパー関数
  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // 薬の登録ロジックを処理
  const addMedicine = () => {
    setMessage(''); // 以前のメッセージをクリア

    // 必須項目の入力チェック
    if (!startDate || !finalDate || !medName || medTimes.length === 0 || !medTimeSpecific || medStock < 1) {
      setMessage('全ての必須項目を入力してください。');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(finalDate);

    // 開始日と終了日の順序チェック
    if (start > end) {
      setMessage('開始日は終了日よりも前に設定してください。');
      return;
    }

    const newMedicineEntries: MedicineEntry[] = [];
    let currentDate = new Date(start);

    // 開始日から終了日までの各日付に対して薬のエントリを作成
    while (currentDate <= end) {
      // 日付をYYYY-MM-DD形式にフォーマット
      const formattedDate = currentDate.toISOString().split('T')[0];

      const entry: MedicineEntry = {
        id: `${formattedDate}-${medName}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // 一意のIDを生成
        date: formattedDate,
        medName,
        medType,
        medTimes,
        medTimeSpecific,
        medStock,
      };
      newMedicineEntries.push(entry);
      currentDate = addDays(currentDate, 1); // 次の日に進む
    }

    // 既存のデータを読み込み、新しいエントリを追加してローカルストレージに保存
    const existingData: MedicineEntry[] = JSON.parse(localStorage.getItem('medicineSchedule') || '[]');
    localStorage.setItem('medicineSchedule', JSON.stringify([...existingData, ...newMedicineEntries]));

    setMessage('薬を登録しました！');
    // 登録成功後、フォームフィールドをクリア
    setStartDate('');
    setFinalDate('');
    setMedName('');
    setMedType('錠剤');
    setMedTimes([]);
    setMedTimeSpecific('');
    setMedStock(1);
  };

  // 全ての薬のデータを削除する処理
  const deleteMedicine = () => {
    // 確認メッセージを表示（window.confirmの代わりにシンプルなメッセージを使用）
    if (window.confirm('全ての登録薬を削除しますか？')) {
      localStorage.removeItem('medicineSchedule'); // ローカルストレージからデータを削除
      setMessage('全ての薬を削除しました。');
    }
  };

  // 薬のデータをJSONファイルとしてダウンロードする処理
  const downloadJson = () => {
    const data = localStorage.getItem('medicineSchedule');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'medicine_schedule.json'; // ダウンロードファイル名
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage('薬のスケジュールをJSONファイルとしてダウンロードしました。');
    } else {
      setMessage('ダウンロードするデータがありません。');
    }
  };

  // 確認ページへ移動
  const goToCheckPage = () => {
    navigate('/check');
  };

  return (
    <div className="container mx-auto p-4 max-w-md bg-white shadow-lg rounded-lg mt-10 font-inter">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">💊 薬の登録・在庫管理</h1>

      {/* メッセージ表示エリア */}
      {message && (
        <div className={`mb-4 p-3 rounded-md text-center ${message.includes('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* 開始日入力 */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          📅 開始日:{' '}
          <input
            type="date"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </label>
      </div>

      {/* 終了日入力 */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          📅 終了日:{' '}
          <input
            type="date"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={finalDate}
            onChange={e => setFinalDate(e.target.value)}
          />
        </label>
      </div>

      {/* 薬の名前入力 */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          薬の名前:{' '}
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={medName}
            onChange={e => setMedName(e.target.value)}
          />
        </label>
      </div>

      {/* 薬の種類選択 */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          薬の種類:
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={medType}
            onChange={e => setMedType(e.target.value)}
          >
            <option value="錠剤">錠剤</option>
            <option value="カプセル錠">カプセル錠</option>
            <option value="粉薬">粉薬</option>
            <option value="シロップ">シロップ</option>
          </select>
        </label>
      </div>

      {/* 服用タイミング選択 */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">服用タイミング:</label>
        <div className="flex flex-wrap gap-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600 rounded"
              value="朝"
              checked={medTimes.includes('朝')}
              onChange={handleCheckboxChange}
            />
            <span className="ml-2 text-gray-700">朝</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600 rounded"
              value="昼"
              checked={medTimes.includes('昼')}
              onChange={handleCheckboxChange}
            />
            <span className="ml-2 text-gray-700">昼</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600 rounded"
              value="夜"
              checked={medTimes.includes('夜')}
              onChange={handleCheckboxChange}
            />
            <span className="ml-2 text-gray-700">夜</span>
          </label>
        </div>
      </div>

      {/* 時間入力 */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          時間（HH:MM）:{' '}
          <input
            type="time"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={medTimeSpecific}
            onChange={e => setMedTimeSpecific(e.target.value)}
          />
        </label>
      </div>

      {/* 在庫数入力 */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          在庫数（錠数）:{' '}
          <input
            type="number"
            min="1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={medStock}
            onChange={e => setMedStock(Number(e.target.value))}
          />
        </label>
      </div>

      {/* ボタン群 */}
      <div className="flex flex-col space-y-4">
        <button
          onClick={addMedicine}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
        >
          登録
        </button>
        <button
          onClick={deleteMedicine}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
        >
          全削除
        </button>
        <button
          onClick={downloadJson}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
        >
          JSONダウンロード
        </button>
        <p className="text-center mt-4">
          <a
            href="#"
            onClick={goToCheckPage}
            className="text-blue-500 hover:text-blue-800 font-bold transition duration-300 ease-in-out"
          >
            ✅ 確認ページを開く
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;

