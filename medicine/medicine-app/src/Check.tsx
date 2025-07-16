import { useState, useEffect } from 'react';
import './App.css'; // App.cssをインポート

// App.tsxで定義されたMedicineEntryインターフェースと一致させる
// これにより、localStorageから読み込むデータの型が正しくなります
interface MedicineEntry {
  id: string; // 各エントリの一意のID
  date: string; // この薬のエントリの特定の日付 (YYYY-MM-DD)
  medName: string; // 薬の名前
  medType: string; // 薬の種類
  medTimes: string[]; // 例: ["朝", "昼"]
  medTimeSpecific: string; // 例: "08:00"
  medStock: number; // 在庫数
}

function Check() {
  // medicineScheduleの状態をMedicineEntryの配列として初期化
  const [medicineSchedule, setMedicineSchedule] = useState<MedicineEntry[]>([]);
  const [message, setMessage] = useState(''); // ユーザーへのメッセージ表示用の状態

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('medicineSchedule');
      if (storedData) {
        // localStorageから読み込んだJSON文字列を解析
        const parsedData: MedicineEntry[] = JSON.parse(storedData);
        
        // 日付でソートして表示順を改善
        parsedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        setMedicineSchedule(parsedData); // 状態を更新
        
        // データが存在するかどうかに基づいてメッセージを設定
        if (parsedData.length === 0) {
          setMessage('登録された薬のスケジュールはありません。');
        } else {
          setMessage(''); // データがある場合はメッセージをクリア
        }
      } else {
        // localStorageにデータがない場合
        setMessage('登録された薬のスケジュールはありません。');
      }
    } catch (error) {
      // JSONの解析エラーなど、読み込み中に問題が発生した場合
      console.error("ローカルストレージから薬のスケジュールを読み込む際にエラーが発生しました:", error);
      setMessage('スケジュールの読み込み中にエラーが発生しました。');
    }
  }, []); // 空の依存配列により、コンポーネントのマウント時に一度だけ実行される

  return (
    <div className="container mx-auto p-4 max-w-2xl bg-white shadow-lg rounded-lg mt-10 font-inter">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">🗓️ 薬のスケジュール確認</h1>

      {/* メッセージ表示エリア */}
      {message && (
        <div className={`mb-4 p-3 rounded-md text-center ${message.includes('エラー') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
          {message}
        </div>
      )}

      {/* スケジュールリストの表示 */}
      {medicineSchedule.length > 0 ? (
        <div className="space-y-4">
          {medicineSchedule.map((medicine: MedicineEntry) => (
            <div key={medicine.id} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
              <p className="text-lg font-semibold text-gray-800 mb-1">
                <span className="text-blue-600">日付:</span> {medicine.date}
              </p>
              <p className="text-md text-gray-700 mb-1">
                <span className="font-medium">薬の名前:</span> {medicine.medName}
              </p>
              <p className="text-md text-gray-700 mb-1">
                <span className="font-medium">薬の種類:</span> {medicine.medType}
              </p>
              <p className="text-md text-gray-700 mb-1">
                <span className="font-medium">服用タイミング:</span> {medicine.medTimes.join(', ')}
              </p>
              <p className="text-md text-gray-700 mb-1">
                <span className="font-medium">時間:</span> {medicine.medTimeSpecific}
              </p>
              <p className="text-md text-gray-700">
                <span className="font-medium">在庫数:</span> {medicine.medStock} 錠
              </p>
            </div>
          ))}
        </div>
      ) : (
        // データがない場合、かつメッセージが表示されていないときのみ表示（メッセージが優先されるため）
        !message && <p className="text-center text-gray-600">薬のスケジュールがありません。</p>
      )}
    </div>
  );
}

export default Check;

