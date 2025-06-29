import { useEffect, useState } from 'react';
import { closeCircleOutline, playCircleOutline } from 'ionicons/icons';
import React from 'react';
import { IonButton, IonFabButton, IonIcon } from '@ionic/react';
import './VoicePreviewComponent.css';

interface VoicePreviewComponentProps{
    voiceData: string,

}

const VoicePreviewComponent: React.FC<VoicePreviewComponentProps> = ({ voiceData }) => {

    return (
        <div className="voice-preview-component">
            <IonFabButton className='white-button play-button' slot='icon-only'>
                <IonIcon icon={playCircleOutline} className='play-button-icon'></IonIcon>
            </IonFabButton>
            <div className='voice-wave-container'>
                <img src="assets/BlueVoiceWave.svg" alt="voicewave_image" className='voice-wave'/>
                <IonFabButton className='white-button delete-button' style={{}} slot='icon-only'>
                    <IonIcon icon={closeCircleOutline}></IonIcon>
                </IonFabButton>
            </div>
        </div>
    );    
};

export default VoicePreviewComponent;