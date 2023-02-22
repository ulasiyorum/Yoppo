import * as React from 'react';
import Dialogue from './Dialog';


export default function Auth(props) {
    return(

        <>
        <Dialogue open={props.open} setOpen={props.setOpen}/>
        </>

    );

}