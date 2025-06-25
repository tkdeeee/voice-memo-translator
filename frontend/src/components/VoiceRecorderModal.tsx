import React, { useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import { IonButton, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from '@ionic/react';
import { micOutline, stopCircleOutline, micOffCircleOutline } from 'ionicons/icons';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import './VoiceRecorderModal.css';

interface VoiceRecorderModalProps {
  onRecordingComplete: (recording: any) => void,
  setPermissionGranted: (permission: boolean) => void,
  permissionGranted: boolean,
  setIsVoiceRecorderModalopen: (open: boolean) => void,
  isVoiceRecorderModalopen: boolean
}

const VoiceRecorderModal = forwardRef((props: VoiceRecorderModalProps, ref) => {
  const { onRecordingComplete, setPermissionGranted, permissionGranted, setIsVoiceRecorderModalopen, isVoiceRecorderModalopen } = props;
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

  const startRecording = async () => {
    try {
      if (!permissionGranted) {
        await requestPermission();
        if (!permissionGranted) return;
      }
      
      await VoiceRecorder.startRecording();
      setIsRecording(true);
      
      // 録音時間のタイマー開始
      const timer = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setTimerId(timer);
      
    } catch (error) {
      console.error('録音開始エラー:', error);
    }
  };

  const stopRecording = async () => {
    try {
      if (timerId) {
        clearInterval(timerId);
        setTimerId(null);
      }
      
      const result = await VoiceRecorder.stopRecording();
      setIsRecording(false);
      setRecordingTime(0);
      
      if (result.value && onRecordingComplete) {
        onRecordingComplete(result.value);
      }
      
    } catch (error) {
      console.error('録音停止エラー:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useImperativeHandle(ref, () => ({
    stopRecording,
  }));

  if (!isVoiceRecorderModalopen) return null;
  return (
    <div className="voice-recorder">
        <>
            <IonHeader>
                <IonToolbar class="ion-text-center">
                    <IonTitle>タップして録音開始</IonTitle>
                </IonToolbar>
            </IonHeader>
            <div className='record-button-wrapper'>
                {isRecording ? (
                    <div className="recording-container">
                        <div className="recording-indicator">録音中...</div>
                        <div className="recording-time">{formatTime(recordingTime)}</div>
                        <IonButton 
                            color="danger" 
                            onClick={stopRecording}
                            className="stop-button"
                        >
                            <IonIcon icon={stopCircleOutline} slot="start" />
                            停止
                        </IonButton>
                    </div>
                ) : (
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <IonButton 
                        onClick={startRecording}
                        size="large"
                        shape="round"
                        className="record-button"
                        >
                        <IonIcon icon={micOutline} slot="icon-only" />
                        </IonButton>
                        <p style={{}}>開始</p>
                    </div>
                )}
            </div>
        </>
    </div>
  );
});

export default VoiceRecorderModal;