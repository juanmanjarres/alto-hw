import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {
    AppBar,
    Box,
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField, Toolbar, Typography
} from "@mui/material";
import {
    Add,
    Delete,
    Edit,
    Upcoming
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {firestore} from "../firebase/clientApp";
import {collection, doc, addDoc, getDocs, deleteDoc, updateDoc} from "@firebase/firestore";
import {useEffect, useState} from "react";

async function deleteEntry(id) {
    await deleteDoc(doc(firestore, 'bookings', id));
}

function BookingDiag(args) {
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

export default function Home() {

    const [bookings, setBookings] = useState([])

    const bookingsCollection = collection(firestore, 'bookings')

    const theme = createTheme({
        palette: {
            primary: {
                main: "#FFFFFF"
            },
            secondary: {
                // Light blue
                main: "#008BFF"
            }
        }
    });

    const getBookings = async () => {
        const bookingsQuery = await getDocs(bookingsCollection)
        const res = [];
        bookingsQuery.forEach((doc) => {
            res.push({data: doc.data(), id: doc.id})
        })
        console.log(JSON.stringify(res[0]))
        setBookings(res)
    }

    useEffect(() => {
        getBookings();
    }, [])

    return (
        <div className={styles.container}>
            <Head>
                <title>Bookings</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <header>
                <ThemeProvider theme={theme}>
                    <Box fontWeight="fontWeightBold" sx = {{ flexGrow: 1 }}>
                        <AppBar position="static">
                            <Toolbar>
                                <Upcoming fontSize="large" color="secondary" sx={{ mr: 2 }}/>
                                <Typography color="black" variant="h5" component="div" sx ={{ flexGrow :  1 }}>
                                    Bookings!
                                </Typography>
                                <BookingDiag refresh={getBookings} edit={false}/>
                                <Button color="secondary">Login</Button>
                                <Button color="secondary">Sign Up</Button>
                            </Toolbar>
                        </AppBar>
                    </Box>
                </ThemeProvider>
            </header>
            <main>
                <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell align={"right"}>Seeker</TableCell>
                                <TableCell align={"right"}>Giver</TableCell>
                                <TableCell align={"right"}>Date</TableCell>
                                <TableCell align={"right"}>Total Amount</TableCell>
                                <TableCell align={"right"}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                bookings.map((bk) => (
                                    <TableRow
                                        key={bk.id}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                        <TableCell component="th" scope="row">
                                            {bk.data.id}
                                        </TableCell>
                                        <TableCell align={"right"}>{bk.data.seeker}</TableCell>
                                        <TableCell align={"right"}>{bk.data.giver}</TableCell>
                                        <TableCell align={"right"}>{new Date(bk.data.date).toDateString()}</TableCell>
                                        <TableCell align={"right"}>{bk.data.totalamt}</TableCell>
                                        <TableCell align={"right"}>
                                            <Grid container spacing={2}>
                                                <Grid item xs ={4}/>
                                                <Grid item xs={4}>
                                                    <BookingDiag refresh={getBookings} edit={true} booking={bk}/>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <IconButton aria-label="delete" onClick={async () => {
                                                        await deleteEntry(bk.id).then(() => getBookings());
                                                    }}>
                                                        <Delete/>
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                </Grid>
            </main>

            <footer>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <img src="/vercel.svg" alt="Vercel" className={styles.logo}/>
                </a>
            </footer>

            <style jsx>{`
              main {
                padding: 4rem 0;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              }
              
              header{
                width: 100%;
              }

              footer {
                width: 100%;
                height: 100px;
                border-top: 1px solid #eaeaea;
                display: flex;
                justify-content: center;
                align-items: center;
              }

              footer img {
                margin-left: 0.5rem;
              }

              footer a {
                display: flex;
                justify-content: center;
                align-items: center;
                text-decoration: none;
                color: inherit;
              }
            `}</style>

            <style jsx global>{`
              html,
              body {
                padding: 0;
                margin: 0;
                font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
                Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
                sans-serif;
              }

              * {
                box-sizing: border-box;
              }
            `}</style>
        </div>
    )
}
