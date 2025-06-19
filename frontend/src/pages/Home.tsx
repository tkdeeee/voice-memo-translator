import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonModal, IonTextarea, IonButtons, IonItem, IonInput } from '@ionic/react';
import { micOutline, saveOutline, documentTextOutline, handLeftOutline, sendOutline, settingsOutline } from 'ionicons/icons';
import { useEffect, useState, useRef } from 'react';
import { getAuth } from 'firebase/auth';
import './Home.css';
import VoiceRecorderComponent from '../components/VoiceRecorder';

const Home: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonTextareaElement>(null);
  
  useEffect(() => {
        const fromLogin = sessionStorage.getItem("fromLogin");
        if (fromLogin === "true") {
            sessionStorage.removeItem("fromLogin");
            
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
    }, []);


  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // ここに録音開始/停止のロジックを追加
  };

  const handleRecordingComplete = (recording: any) => {
    // 録音が完了したときの処理
    console.log('録音完了:', recording);
    const base64Sound = recording.recordDataBase64 // from plugin
    const mimeType = recording.mimeType  // from plugin
    // const audioRef = new Audio(`data:${mimeType};base64,${base64Sound}`)
    // audioRef.oncanplaythrough = () => audioRef.play()
    // audioRef.load()
    // const base64Data = base64Sound.replace(/^data:.+;base64,/, '');
    // const byteCharacters = atob(base64Data);
    // const byteNumbers = new Array(byteCharacters.length);
    
    // for (let i = 0; i < byteCharacters.length; i++){
    //   byteNumbers[i] = byteCharacters.charCodeAt(i);
    // }

    // const byteArray = new Uint8Array(byteNumbers);
    // const blob = new Blob([byteArray], {type: "audio/wav"});
    // setUrl(URL.createObjectURL(blob));
    // setIsRecording(true);

    //ここでfastAPIに音声ファイルを送信&文字お越し後の文字列をget

    setTranscription("こんにちは");
    setIsOpen(true);

  };

  const SendMemoContent = () => {
    modal.current?.dismiss();
    setIsOpen(false);
    if (input.current && input.current.value ){
      setTranscription(input.current.value);
    }
  };

  useEffect(() => {
    if (transcription.trim() !== ""){
      console.log(transcription);
    }
  }, [transcription]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle class="ion-text-center">音声メモアプリ</IonTitle>
          <IonButton slot='end' routerLink='/setting' className="white-button">
            <IonIcon icon={settingsOutline}></IonIcon>
          </IonButton>
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
            <IonButton routerLink="/list" >
              <IonIcon slot="start" icon={documentTextOutline} />
              メモ一覧
            </IonButton>
          </div>

          <IonModal isOpen={isOpen} ref={modal}>
            <IonHeader>
              <IonToolbar>
                  <IonButtons slot="start">
                    <IonButton onClick={() => {
                      modal.current?.dismiss();
                      setIsOpen(false);
                    }}>Cancel</IonButton>
                  </IonButtons> 
                  <IonTitle class="ion-text-center">Confirm</IonTitle>

                  <IonButtons slot="end">
                    <IonButton onClick={() => SendMemoContent()}>Send</IonButton>
                  </IonButtons> 
              </IonToolbar>
            </IonHeader>
            <IonContent >
              <IonItem>
                <IonTextarea
                  // labelPlacement="stacked"
                  ref={input}
                  value={transcription}
                  // rows={10}
                  autoGrow={true}
                />
              </IonItem>
            </IonContent>
          </IonModal>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;