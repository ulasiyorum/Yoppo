import React, { useState } from "react";
import Auth from "./Auth";
import { auth } from "../lib/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { documents } from "../main";
import { useNavigate } from "react-router-dom";
import Chat from "./Chat";
import { router } from "../main";
export default function Body(props) {
    const navigator = useNavigate();
    const [open, setOpen] = useState(false);

    const login = (user) => {
        
        signInWithEmailAndPassword(auth,user.mail,user.pass).then((userCredential) => {
            if(user.name == undefined)
            {
                user.name = getName(user.mail);
            }                    
            const newRoute = {
                path:'/' + user.name,
                element: <Chat user={user}/>
            };
            router.push(newRoute);
            navigator(newRoute.path);
            setOpen(false);
        }).catch((err) => {
            console.log(err);
        });

    }

    const getStarted = (event) => {
        if(localStorage.getItem('remember') != null && localStorage.getItem('remember').toString() == 'true' && !open)
        {    
            const user = {
                mail:localStorage.getItem('mail'),
                pass:localStorage.getItem('pass')
            }
            login(user);
        }
        else {
            setOpen(true);
        }
    }

    return (

        <div className="h-100 flex flex-col">
            <h1 className="mx-auto my-14 font-black drop-shadow-md text-32 font-nunito-b">Welcome to Yoppo!</h1>
            <p className="mx-auto my-4 font-karla">Welcome to Yoppo. We're allowing you to video-chat online in this website!</p>
            <button className="bg-gradient-to-b overflow-hidden duration-300 relative from-orange-400 to-orange-500 w-60 my-12 rounded-full mx-auto h-16 
            text-2xl font-karla font-bold text-white before:bg-gradient-to-b before:from-orange-400 before:to-orange-500
            before:w-0 before:h-16 before:absolute transition before:rounded-full before:left-0 before:bottom-0
            hover:before:w-60 before:duration-300 before:brightness-85 before:-z-10 z-10
            after:absolute after:bottom-0 after:left-0 after:w-60 after:h-16 after:bg-gradient-to-b after:from-orange-400 after:to-orange-500
            after:-z-20 after:rounded-full
            tracking-wider drop-shadow-md active:scale-90
            " onClick={getStarted}
            >GET STARTED</button>
            <Auth open={open} setOpen={setOpen}/>
            <h1 className="m-auto font-nunito-b font-medium drop-shadow-sm text-32 my-2">LOOKING FOR A MEETING?</h1>
            <h3 className="m-auto font-karla text-2xl my-2">TYPE IN THE NAME!</h3>
            <div className="flex flex-row justify-center border-solid my-2">
                <div className="border-solid border-2 mx-2 rounded-md border-black">
                    <input className="w-64 rounded-md text-32 text-center h-16 "/>
                </div>
                <button className="w-16 h-16 mx-2 auto text-32 font-karla text-white before:h-0 before:w-0 before:absolute
                before:rounded-md before:bg-gradient-to-b before:from-orange-400 before:to-orange-500 before:brightness-90
                bg-gradient-to-b overflow-hidden duration-300 relative from-orange-400 to-orange-500 before:hover:h-16 before:left-0
                before:bottom-0 before:duration-300 before:-z-10 z-10 hover:before:w-16
                rounded-md
                ">GO</button>
            </div>
        </div>

    );
}


function getName(mail) {
    let name = '';
    documents.docs.forEach((val) => {
        if(val.data().mail == mail) {
            name = val.data().name;
        }
    })

    return name;
}