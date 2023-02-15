import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import {auth} from "../firebase/clientApp";

export function LoginDiag(args){
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleClose = () => {
        setOpen(false);
    };

    const login = event => {
        event.preventDefault();
        signInWithEmailAndPassword(auth, email, password).then(() =>
            {
                handleClose();
                args.refresh();
            }).catch((error) => {
                console.log("An error occurred while logging in: " + error)
        })
    }

    return (
        <div>
            <Button color="secondary" onClick={() => setOpen(true)}>Log In</Button>
            <Dialog open={open} onClose={handleClose}>
                <form onSubmit={login}>
                    <DialogTitle>Log in</DialogTitle>
                    <DialogContent>
                        <TextField
                            color="secondary"
                            margin="dense"
                            id="email"
                            label="Email"
                            type="email"
                            required
                            fullWidth
                            onChange={
                                event => setEmail(event.target.value)
                            }
                        />
                        <TextField
                            color="secondary"
                            margin="dense"
                            id="password"
                            label="Password"
                            type="password"
                            required
                            fullWidth
                            onChange={
                                event => setPassword(event.target.value)
                            }
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={handleClose}>Cancel</Button>
                        <Button color="secondary" type="submit">Log In</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
}

export function SignupDiag(args){
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');

    const handleClose = () => {
        setOpen(false);
    };

    const signup = event => {
        event.preventDefault();
        if(!(password === confPassword)){
            return;
        }
        createUserWithEmailAndPassword(auth, email, password).then(() => {
            handleClose();
            args.refresh();
        }).catch((error) => {
            console.log("An error occurred while signing up: " + error)
        })
    }

    return (
        <div>
            <Button color="secondary" onClick={() => setOpen(true)}>Sign Up</Button>
            <Dialog open={open} onClose={handleClose}>
                <form onSubmit={signup}>
                    <DialogTitle>Create Account</DialogTitle>
                    <DialogContent>
                    <TextField
                        color="secondary"
                        margin="dense"
                        id="email"
                        label="Email"
                        type="email"
                        required
                        fullWidth
                        onChange={
                            event => setEmail(event.target.value)
                        }
                    />
                    <TextField
                        color="secondary"
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        required
                        fullWidth
                        onChange={
                            event => setPassword(event.target.value)
                        }
                    />
                    <TextField
                        color="secondary"
                        margin="dense"
                        id="confirmpassword"
                        label="Confirm Password"
                        type="password"
                        required
                        fullWidth
                        onChange={
                            event => setConfPassword(event.target.value)
                        }
                        error={confPassword !== password}
                        helperText={(confPassword !== password) ? "Passwords must match" : ''}
                    />
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={handleClose}>Cancel</Button>
                        <Button color="secondary" type="submit">Sign Up</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
}