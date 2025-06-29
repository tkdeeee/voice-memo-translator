import { useState, useEffect } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { micOutline, stopCircleOutline, micOffCircleOutline } from 'ionicons/icons';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import type { voiceDataType } from '../pages/Talk';
// import './VoiceRecorder.css';

interface VoiceRecorderButtonProps {
  setIsModalopen: (open: boolean) => void,
  isModalopen: boolean,
  setPermissionGranted: (open: boolean) => void,
  permissionGranted: boolean,
  voiceData: voiceDataType | null,
}

const VoiceRecorderButton: React.FC<VoiceRecorderButtonProps> = ({ setIsModalopen, isModalopen, setPermissionGranted, permissionGranted, voiceData }) => {
// const VoiceRecorderButton: React.FC<VoiceRecorderButtonProps> = ({ setIsModalopen, isModalopen, setPermissionGranted, permissionGranted}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerId, setTimerId] = useState<number | null>(null);

  useEffect(() => {
    checkPermission();
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, []);

  const checkPermission = async () => {
    try {
      const checkPermissions = (await VoiceRecorder.hasAudioRecordingPermission()).value;
        if (checkPermissions === true) {
            setPermissionGranted(true);
        } else {
            setPermissionGranted(false);
        }
    //   setPermissionGranted(checkPermissions.microphone === 'granted');
    } catch (error) {
      console.error('権限チェックエラー:', error);
    }
  };

  const requestPermission = async () => {
    try {
      const permissions = (await VoiceRecorder.requestAudioRecordingPermission()).value;
        if (permissions === true) {
            setPermissionGranted(true);
        } else {
            setPermissionGranted(false);
        }
    //   setPermissionGranted(permissions.microphone === 'granted');
    } catch (error) {
      console.error('権限リクエストエラー:', error);
    }
  };

  return (
    <div className="voice-recorder">
      {!permissionGranted ? (
        <IonButton onClick={requestPermission} className=''>
          <IonIcon icon={micOffCircleOutline}  slot="icon-only"></IonIcon>
        </IonButton>
      ) : (
        <IonButton onClick={() => setIsModalopen(true)} disabled={voiceData !== null}>
            <IonIcon icon={micOutline}  slot="icon-only"></IonIcon>
        </IonButton>
      )}
    </div>
  );
};

export default VoiceRecorderButton;