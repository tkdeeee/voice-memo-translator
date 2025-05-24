import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/react';
import { micOutline, saveOutline, documentTextOutline, handLeftOutline } from 'ionicons/icons';
import { useState } from 'react';
import './Home.css';
import VoiceRecorderComponent from '../components/VoiceRecorder';

const Home: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // ここに録音開始/停止のロジックを追加
  };

  const handleRecordingComplete = (recording: any) => {
    // 録音が完了したときの処理
    console.log('録音完了:', recording);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>音声メモアプリ</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <div className="container">
          <h2>新しいメモを作成</h2>
          <div className="record-button-container">
            {/* <IonButton 
              shape="round" 
              size="large" 
              color={isRecording ? "danger" : "primary"}
              onClick={toggleRecording}
            >
              <IonIcon slot="icon-only" icon={micOutline} />
            </IonButton> */}
            <VoiceRecorderComponent
              onRecordingComplete={handleRecordingComplete}
            />
            <p>{isRecording ? '録音中...' : '録音'}</p>
          </div>
          
          <div className="record-button-container">
            <IonButton 
              shape="round" 
              size="large" 
              color= "primary"//{isRecording ? "danger" : "primary"}
              onClick={() => {console.log("a")}}
            >
              <IonIcon slot="icon-only" icon={handLeftOutline} />
            </IonButton>
            <p>手入力</p>
          </div>
          
          <div className="actions">
            <IonButton disabled={!isRecording}>
              <IonIcon slot="start" icon={saveOutline} />
              保存
            </IonButton>
            <IonButton routerLink="/notes">
              <IonIcon slot="start" icon={documentTextOutline} />
              メモ一覧
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;