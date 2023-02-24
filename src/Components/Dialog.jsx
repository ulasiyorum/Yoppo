import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Checkbox  } from '@mui/material'
import React, { forwardRef, useRef, useState } from 'react';
import Slide from '@mui/material/Slide';
import { router } from '../main';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import Chat from './Chat';
import { documents } from '../main';
import { auth } from '../lib/Firebase';
import { setUsers } from '../App';

let rememberMe = false;

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
  });

export default function Dialogue(props) {
    const navigator = useNavigate();
    const userRef = {
        name:useRef(null),
        mail:useRef(null),
        pass:useRef(null)
    }
    const [message,setMessage] = useState('');
    const [showPass, setShowPass] = useState(false);

    const validateMail = (event) => {

        const val = event.target.value;
        let validation = /^[^@]+@\w+(\.\w+)+\w$/;
        if(validation.test(val))
            setMessage('');
        else
            setMessage('Invalid Email');

    }

    const validatePass = (event) => {
        const val = event.target.value;
        if(val.length < 6)
            setMessage('Weak Password');
        else
            setMessage('');
    }

    const validateName = (event) => {
        const val = event.target.value;
        if(val.length < 4)
            setMessage('Short Username');
        else if(val > 16)
            setMessage('Username too long');
        else
            setMessage('');

    }

    const send = async (event) => {
        const login = (user) => {
            signInWithEmailAndPassword(auth,user.mail,user.pass).then((userCredential) => {
                if(user.name == undefined)
                {
                    user.name = getName(user.mail);
                }                    
                const newRoute = {
                    path:'/' + userRef.name.current.value,
                    element: <Chat user={user}/>
                };
                router.routes.push(newRoute);
                navigator(newRoute.path);
                props.setOpen(false);
            }).catch((err) => {
                setMessage('An error occurred: ' + err);
            })


        }

        if(message != '')
            setMessage('Please enter valid credentials')
        if(router.length > 3)
        {
            setMessage('No servers available at the moment')
        } else {
            const mess = await handleAuthentication();
            if(mess != '')
            {
                setMessage(mess);
            } else {
                const user = {
                    name:userRef.name.current.value,
                    mail:userRef.mail.current.value,
                    pass: userRef.pass.current.value
                };
                localStorage.setItem('remember',rememberMe);
                if(rememberMe) {
                    localStorage.setItem('name',user.name);
                    localStorage.setItem('mail',user.mail);
                    localStorage.setItem('pass',user.pass);
                }
                login(user);
            }
        }
    }

    const handleAuthentication = async () => {
        const user = {
            name:userRef.name.current.value,
            mail:userRef.mail.current.value,
            pass: userRef.pass.current.value
        };
        let error = '';
        let accountExists = false;
        documents.docs.forEach((doc) => {
            if(user.mail == doc.data().mail) {
                accountExists = true;
                if(user.name != doc.data().name) {
                    error = 'E-mail did not match the username';
                }
            }
            else if(user.mail != doc.data().mail && user.name == doc.data().name) {
                error = 'Username Already Exists';
            }
        });

        if(accountExists && error == '') {
            signInWithEmailAndPassword(auth,user.mail,user.pass).then((userCredential) => {
                error = '';
            }).catch((err) => {
                error = err;
            })

        } else if(!accountExists && error == '') {
            createUserWithEmailAndPassword(auth,user.mail,user.pass).then((userCredential) => {
                error = '';
            }).catch((err) => {
                error = err;
            });

            if(error == '') {
                await setUsers(user,null,0,false);
            }

        } else {
            error = 'Invalid Credentials';
        }

        
        return error;

    }





    return (

        <>
        <Dialog aria-labelledby='dialog-title' aria-describedby='dialog-description' 
        open={props.open} onClose={() => props.setOpen(false)}
        TransitionComponent={Transition}
        transitionDuration={500}
        >
            <DialogTitle id="dialog-title" className='w-80' style={{fontFamily:'Nunito'}}>Register / Log In</DialogTitle>
            <DialogContent className='flex flex-col'>
                <DialogContentText id='dialog-description' className='my-2' style={{color:'red',margin:'auto'}}>{message}</DialogContentText>
                <input placeholder='User Name' 
                onChange={validateName}
                ref={userRef.name}
                className='bg-slate-200 rounded-sm my-2 h-8 outline-none px-3 font-nunito'></input>
                <input placeholder='Email' 
                onChange={validateMail}
                ref={userRef.mail}
                className='bg-slate-200 rounded-sm my-2 h-8 outline-none px-3 font-nunito'></input>
                <input placeholder='Password'
                onChange={validatePass} type={showPass ? 'text' : 'password'} 
                ref={userRef.pass}
                className='bg-slate-200 rounded-sm my-2 h-8 outline-none px-3 font-nunito'></input>
                <div className='flex flex-row justify-between'>
                    <div className='flex flex-row scale-90'>
                        <Checkbox className='w-0 h-6' onChange={() => setShowPass(!showPass)}/>
                        <h1 className='mx-1'>Show password</h1>
                    </div>
                    <div className='flex flex-row scale-90'>
                        <Checkbox className='w-0 h-6' onChange={() => {rememberMe = !rememberMe}}/>
                        <h1 className='mx-1'>Remember Me</h1>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={send}>Start</Button>
                <Button onClick={() => props.setOpen(false)}>Cancel</Button>
            </DialogActions>
        </Dialog>
        </>

    );


}


export function getName(mail) {
    let name = '0';
    documents.docs.forEach((val) => {
        if(val.data().mail == mail) {
            name = val.data().name;
        }
    })

    return name;
}