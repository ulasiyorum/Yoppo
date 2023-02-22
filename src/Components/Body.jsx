import React, { useState } from "react";
import Auth from "./Auth";

export default function Body(props) {

    const [open, setOpen] = useState(false);

    return (

        <div className="h-100 flex flex-col">
            <h1 className="mx-auto my-20 font-black drop-shadow-md text-32 font-nunito-b">Welcome to Yoppo!</h1>
            <p className="mx-auto font-karla">Welcome to Yoppo. We're allowing you to video-chat online in this website!</p>
            <button className="bg-gradient-to-b overflow-hidden duration-300 relative from-orange-400 to-orange-500 w-60 my-16 rounded-full mx-auto h-16 
            text-2xl font-karla font-bold text-white before:bg-gradient-to-b before:from-orange-400 before:to-orange-500
            before:w-0 before:h-16 before:absolute transition before:rounded-full before:left-0 before:bottom-0
            hover:before:w-60 before:duration-300 before:brightness-85 before:-z-10 z-10
            after:absolute after:bottom-0 after:left-0 after:w-60 after:h-16 after:bg-gradient-to-b after:from-orange-400 after:to-orange-500
            after:-z-20 after:rounded-full
            tracking-wider drop-shadow-md active:scale-90
            " onClick={() => setOpen(true)}
            >GET STARTED</button>
            <Auth open={open} setOpen={setOpen}/>
        </div>

    );

}