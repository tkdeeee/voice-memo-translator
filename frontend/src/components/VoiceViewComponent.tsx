import { useEffect, useState } from 'react';
import { closeCircleOutline, playCircleOutline } from 'ionicons/icons';
import React from 'react';
import { IonButton, IonFabButton, IonIcon } from '@ionic/react';
import './VoicePreviewComponent.css';
import { voiceDataType } from '../pages/Talk';

interface VoiceViewComponentProps{
    voiceData: voiceDataType,
    own: boolean,
}

const VoiceViewComponent: React.FC<VoiceViewComponentProps> = ({ voiceData, own }) => {
    const audioRef = new Audio(`data:${voiceData.mimeType};base64,${voiceData.recordDataBase64}`);

    const playAudio = () => {
        audioRef.oncanplaythrough = () => audioRef.play();
        audioRef.load();
    };

    return (
        <div className="voice-preview-component">
            <IonFabButton className='white-button play-button' onClick={playAudio}>
                <IonIcon icon={playCircleOutline} className='play-button-icon'></IonIcon>
            </IonFabButton>
            <div className='voice-wave-container'>
                {own ? (
                    <img src="assets/BlueVoiceWave.svg" alt="voicewave_image" className='voice-wave'/>
                ) : (
                    <img src="assets/BlackVoiceWave.svg" alt="voicewave_image" className='voice-wave'/>
                )}
                <p>{voiceData.msDuration / 1000}s</p>
            </div>
            {/* <IonFabButton className='white-button delete-button' slot='icon-only'>
                <IonIcon icon={closeCircleOutline}></IonIcon>
            </IonFabButton> */}
        </div>
    );    
};

export default VoiceViewComponent;