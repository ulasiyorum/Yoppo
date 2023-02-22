import { useRef } from "react";

export default function Chat(props) {

    const videoRef = useRef(null);
    const getVideo = () => {
        navigator.mediaDevices.getUserMedia({video: {width: 300}})
        .then(stream => {
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
        }).catch(err => 
            {
                console.log(err);
            });
    }

    getVideo();

    return (
        <>
        <div>{props.name}</div>
        
        <video ref={videoRef}/>
        </>
    );

}