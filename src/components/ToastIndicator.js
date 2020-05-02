import React from 'react';
import { Toast } from 'galio-framework';

const ToastIndicator = (props) => {
    return (
    <Toast isShow={props.isShowValue} positionIndicator={props.position} color={props.colorValue} fadeOutDuration={300} fadeInDuration={300} round={true} style={{marginTop:-50,margin:20}}>{props.value}</Toast>
    )
};

export default ToastIndicator;