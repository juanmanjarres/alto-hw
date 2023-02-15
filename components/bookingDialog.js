import {useState} from "react";
import {addDoc, collection, doc, updateDoc} from "@firebase/firestore";
import {firestore} from "../firebase/clientApp";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    TextField
} from "@mui/material";
import {Add, Edit} from "@mui/icons-material";

export function BookingDiag(args) {
    const [open, setOpen] = useState(false);


    const [booking, setBooking] = args.edit ? useState({
        data:{
            id: args.booking.data.id,
            seeker: args.booking.data.seeker,
            giver: args.booking.data.giver,
            date: args.booking.data.date,
            totalamt: args.booking.data.totalamt
        },
        id: args.booking.id
    }) : useState({
        data: {
            id: null,
            seeker: null,
            giver: null,
            date: null,
            totalamt: null,
        },
        id: null
    });

    const bookingsCollection = collection(firestore, 'bookings')

    const theme = createTheme({
        palette: {
            primary: {
                //Light blue
                main: "#008BFF"
            },
            secondary: {
                main: "#FFFFFF"
            }
        }
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = async () => {
        setOpen(false);
        await args.refresh();
    };

    const handleEdit = event => {
        event.preventDefault();
        editToDB().then(() => handleClose());
    }
    const handleAdd = event => {
        event.preventDefault();
        addToDB().then(() => handleClose());
    };

    const editToDB = async () => {
        console.log("Obj before DB edit: " + JSON.stringify(booking))
        try{
            await updateDoc(doc(firestore, 'bookings', booking.id),{
                id: booking.data.id,
                seeker: booking.data.seeker,
                giver: booking.data.giver,
                date: booking.data.date,
                totalamt: booking.data.totalamt
            });
            console.log("Edited entry successfully")
        } catch (e){
            console.error("An error occurred while editing to DB: " + e);
            console.log("The booking to add: " + JSON.stringify(booking));
        }
    }

    const addToDB = async () => {
        console.log("Obj before DB add: " + JSON.stringify(booking))
        try {
            const docRef = await addDoc(bookingsCollection, {
                id: booking.data.id,
                seeker: booking.data.seeker,
                giver: booking.data.giver,
                date: booking.data.date,
                totalamt: booking.data.totalamt

            });
            console.log("Added to database successfully with ID " + JSON.stringify(docRef.id))
            setBooking({
                ...booking,
                id: docRef.id
            });
        } catch (e) {
            console.error("Some error occurred while adding to DB: " + e);
            console.log("The booking to add: " + JSON.stringify(booking))
        }
    };

    return (
        <div>
            <ThemeProvider theme={theme}>
                {args.edit ?
                    (<IconButton aria-label="edit" onClick={handleClickOpen}>
                        <Edit/>
                    </IconButton>) :
                    (<Button sx={{ mr: 4 }} variant="contained" onClick={handleClickOpen}>
                        <Add sx={{mr: 1}}></Add>
                        Add new booking
                    </Button>)
                }
                <Dialog open={open} onClose={handleClose}>
                    <form onSubmit={args.edit ? handleEdit : handleAdd}>
                        <DialogTitle>{args.edit ? "Edit Booking" : "New Booking"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>{args.edit ? "Edit an existing booking here" :
                                "Create a new booking to manage here, and add it to the database"}
                            </DialogContentText>
                            <br/>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="id"
                                label="ID"
                                type="number"
                                value={booking.data.id ?? ''}
                                fullWidth
                                required
                                onChange={e => {
                                    setBooking({
                                        ...booking,
                                        data: {
                                            ...booking.data,
                                            id: parseInt(e.target.value)
                                        }
                                    });
                                }}
                            />
                            <TextField
                                margin="dense"
                                id="seeker"
                                label="Seeker"
                                type="text"
                                value={booking.data.seeker ?? ''}
                                fullWidth
                                required
                                onChange={e => {
                                    setBooking({
                                        ...booking,
                                        data: {
                                            ...booking.data,
                                            seeker: e.target.value
                                        }
                                    });
                                }}
                            />
                            <TextField
                                margin="dense"
                                id="giver"
                                label="Giver"
                                type="text"
                                value={booking.data.giver ?? ''}
                                fullWidth
                                required
                                onChange={e => {
                                    setBooking({
                                        ...booking,
                                        data: {
                                            ...booking.data,
                                            giver: e.target.value
                                        }
                                    });
                                }}
                            />
                            <TextField
                                margin="dense"
                                id="date"
                                label="Date"
                                type="date"
                                value={booking.data.date ?? ''}
                                fullWidth
                                required
                                onChange={e => {
                                    setBooking({
                                        ...booking,
                                        data: {
                                            ...booking.data,
                                            date: e.target.value
                                        }
                                    });
                                }}
                            />
                            <TextField
                                margin="dense"
                                id="totalamt"
                                label="Total Amount"
                                type="number"
                                value={booking.data.totalamt ?? ''}
                                fullWidth
                                required
                                // Had to do it like this, apparently the built-in step isn't working?
                                InputProps={{inputProps: {step: 'any'}}}
                                onChange={e => {
                                    setBooking({
                                        ...booking,
                                        data: {
                                            ...booking.data,
                                            totalamt: parseFloat(e.target.value)
                                        }
                                    });
                                }}
                            />

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button type="submit">{args.edit ? "Edit" :"Add"}</Button>
                        </DialogActions>
                    </form>
                </Dialog>
            </ThemeProvider>
        </div>
    )
}