import { useRef, useState, useMemo, useEffect } from "react";
import ReactPlayer from "react-player";
import {
    MeetingProvider,
    MeetingConsumer,
    useMeeting,
    useParticipant,
  } from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "../lib/API";
import { documents } from "../main";
import { setUsers, fetchUsers } from "../App";
import { useLocation } from "react-router-dom";
import { auth } from "../lib/Firebase";
import { getName } from "./Dialog";

export default function Chat(props) {
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState(null);
  const [joined, setJoined] = useState(false);
  const locate = useLocation();
  const [sessions, setSessions] = useState(null);
  const [meetingId, setMeetingId] = useState(null); 

  useEffect(() => {
    const users = documents;
        let roomId = null;
        users.docs.forEach((value) => {
            if(value.data().name == locate.pathname.toString().substring(1,locate.pathname.toString().length))
            {
              roomId = value.data().roomId;
            }

        });
        if(roomId == null)
            return;
        const id = roomId;
        const meetingId =
        id == null ? null : id;

        setMeetingId(meetingId);

  });

    useEffect(() => {
      const fetchSessions = async() => {
        if(meetingId == null || sessions != null)
        {
          return;
        }
        const options = {
          method: "GET",
          headers: {
              "Authorization": import.meta.env.VITE_VIDEO_TOKEN,
              "Content-Type": "application/json",
          },
      };
      const url= `https://api.videosdk.live/v2/sessions/?${meetingId}=xyz&page=1&perPage=200`;
      const response = await fetch(url, options);
      const data = await response.json();
      setSessions(data);
      }
      fetchSessions();

    },[meetingId,joined]);
    
    useEffect(() => {
      
      if(sessions == null)
      {
        return;
      }

      const setActiveSessionWithId = async () => {
        setLoading(true);
        const sessionId = getActiveSession(sessions.data);

        if(sessionId == undefined) {
        setLoading(false);
        return;
        }
        const options = {
          method: "GET",
          headers: {
            "Authorization": import.meta.env.VITE_VIDEO_TOKEN,
            "Content-Type": "application/json",
          },
        };
        const url= `https://api.videosdk.live/v2/sessions/${sessionId}/participants/active?page=1&perPage=200`;
        const response = await fetch(url, options);
        const data = await response.json();
        setLoading(false);
        setActiveSession(data.data);
      }
      setActiveSessionWithId();

      const fetchSessionsDuration = async () => {
        const allTime = calculateTime(sessions);
        await setUsers(props.user,meetingId,allTime,true,new Date());
      }
      fetchSessionsDuration();
    },[sessions]);


    const calculateTime = (data) => {
        let sum = 0;
        data.data.forEach((value) => {
            const diffTimeB = new Date(value.end) - new Date(value.start);
            const diffTime = Math.ceil(diffTimeB / (1000 * 60));
            sum += diffTime;

        });


        return sum;
    }

    const getMeetingAndToken = async () => {
        setLoading(true);
        const users = documents;
        let roomId = null;
        let user = null;
        users.docs.forEach((value) => {
            if(value.data().name == locate.pathname.toString().substring(1,locate.pathname.toString().length))
            {
              roomId = value.data().roomId;
              if(isAdmin())
                user = value;
            }

        });
        if(roomId == null && !isAdmin())
            return;
        const id = roomId;
        const meetingId =
        id == null && isAdmin() ? await createMeeting({token: authToken}) : id;

        if(isAdmin() && id == null)
        {
          await setUsers(user,meetingId,0,true,new Date());
        }

        setMeetingId(meetingId);
        setLoading(false);
    };

    const name = getName(auth.currentUser.email);
    function isAdmin() {
        return name == locate.pathname.toString().substring(1,locate.pathname.toString().length)
    }
    return (
    !loading ? (
    authToken && meetingId && sessions && (activeSession || isAdmin()) ? (
        <MeetingProvider
            config={{
                meetingId:meetingId,
                micEnabled: true,
                webcamEnabled: true,
                name: props.user.name,
            }}
            token={authToken}
            >
            <MeetingConsumer>
                {() => <Container 
                activeSession={activeSession} setActiveSession={setActiveSession} isAdmin={isAdmin()} name={props.user.name}
                sessions={sessions} joined={joined} setJoined={setJoined} setSessions={setSessions} meetingId={meetingId} />}
            </MeetingConsumer>
            </MeetingProvider>
        ) : props.user ?
        (<JoinScreen user={props.user} activeSession={activeSession} isAdmin={isAdmin()} getMeetingAndToken={getMeetingAndToken}/> )
        : (<div>Please log in before joining</div>)) : (<div>Loading..</div>)
)}


const hasParticipant = (uname,data) => {
  let has = false;
  if(data == null)
  return false;
  data.forEach((value) => {
    value.participants.forEach((val) => {
      if(val.name == uname)
        has = true;
    });

  });
  
  return has;

}


function JoinScreen({ getMeetingAndToken,isAdmin,user,activeSession }) {
    const onClick = async () => {
      await getMeetingAndToken();
    };
    useEffect(() => {
      if(!isAdmin && activeSession)
        onClick();
    })
    return (  (
      <div className="flex h-80">
        {
          isAdmin && !activeSession ? (
        <button onClick={onClick} className="m-auto relative bg-gradient-to-b from-slate-400 to-slate-500 w-60 h-16 rounded-xl text-center font-nunito-b
        drop-shadow-md overflow-hidden before:bg-gradient-to-b before:from-slate-400 before:to-slate-500 before:w-60 before:absolute before:h-0 before:left-0 before:bottom-0
        tracking-widest z-10 before:-z-10 before:brightness-85 hover:before:h-16 transition duration-300 hover:duration-300 before:duration-300 active:scale-90
        ">{"START MEETING"}</button>) : (<div>No Meeting Found</div>)
        }
      </div> )
    );
  }


  function Container(props) {

    const { join } = useMeeting();
    const { participants } = useMeeting();
    const joinMeeting = async () => {

      const has = hasParticipant(getName(auth.currentUser.email),props.activeSession);
      if(has) {
        alert('You are already in the meeting!');
      }
      else {
      props.setJoined(true);
      join();
      }
    };

    return (
      <div className="container flex h-max w-max m-auto">
        {props.joined ? (
          <div>
            {[...participants.keys()].map((participantId) => (
              <VideoComponent key={participantId} participantId={participantId} />
            ))}
          </div>
        ) : (
        <div className="flex flex-col h-100 border-black border-solid border-4 w-96">
          <div className="m-auto my-14 font-nunito-b">{"WELCOME " + props.name.toUpperCase()}</div>
            <div className="m-auto
            my-2 text-3xl font-medium font-nunito-b
            "
            >{props.isAdmin && !props.activeSession ? "MEETING IS READY" : "MEETING STARTED!"}</div>
            <button onClick={joinMeeting} className="m-auto relative bg-gradient-to-b from-slate-400 to-slate-500 w-60 h-16 rounded-xl text-center font-nunito-b
            drop-shadow-md my-14 overflow-hidden before:bg-gradient-to-b before:from-slate-400 before:to-slate-500 before:w-60 before:absolute before:h-0 before:left-0 before:bottom-0
            tracking-widest z-10 before:-z-10 before:brightness-85 hover:before:h-16 transition duration-300 hover:duration-300 before:duration-300 active:scale-90
            ">{props.isAdmin && !props.activeSession ? "START MEETING" : "JOIN"}</button>
            </div>
        )}
      </div>
    );
  }
  function VideoComponent(props) {
    const micRef = useRef(null);
    const { webcamStream, micStream, webcamOn, micOn, isLocal } = useParticipant(
      props.participantId
    );
    const videoStream = useMemo(() => {
      if (webcamStream && webcamOn) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(webcamStream.track);
        return mediaStream;
      }
    }, [webcamStream, webcamOn]);
  
    useEffect(() => {
      if (micRef.current) {
        if (micStream && micOn) {
          const mediaStream = new MediaStream();
          mediaStream.addTrack(micStream.track);
  
          micRef.current.srcObject = mediaStream;
          micRef.current
            .play()
            .catch((error) =>
              console.error("videoElem.current.play() failed", error)
            );
        } else {
          micRef.current.srcObject = null;
        }
      }
    }, [micStream, micOn]);
  
    return (
      <div key={props.participantId}>
        {micOn && micRef && <audio ref={micRef} autoPlay muted={isLocal} />}
        {webcamOn && (
          <ReactPlayer
            //
            playsinline // very very imp prop
            pip={false}
            light={false}
            controls={true}
            muted={true}
            playing={true}
            //
            url={videoStream}
            //
            className="drop-shadow-md"
            onError={(err) => {
              console.log(err, "participant video error");
            }}
          />
        )}
      </div>
    );
  }


  function getActiveSession(data) {
    let d = null;
    data.forEach((value) => {
      if(value.end == null)
        d = value;
    });
    if(d != null)
      return d.id;
  }