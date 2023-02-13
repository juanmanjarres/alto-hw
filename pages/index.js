import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormLabel,
    IconButton, InputLabel,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField
} from "@mui/material";
import {Add, CalendarMonth, Delete, Edit} from "@mui/icons-material";
import {firestore} from "../firebase/clientApp";
import {collection,QueryDocumentSnapshot,DocumentData,query,where,limit,getDocs} from "@firebase/firestore";
import {useEffect, useState} from "react";

function deleteEntry(){

}

function editEntry(){

}

function AddEntryDiag(fsCollection){
    const [open, setOpen] = useState(false);
    const [booking, setBooking] = useState({});

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAdd = () => {

    };

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen}>
                <Add sx={{ mr:1 }}></Add>
                Add new booking
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>New Booking</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Create a new booking to manage here, and add it to the database
                    </DialogContentText>
                    <form onSubmit={handleAdd}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="id"
                        label="ID"
                        type="number"
                        fullWidth
                        required
                    />
                    <TextField
                        margin="dense"
                        id="seeker"
                        label="Seeker"
                        type="text"
                        fullWidth
                        required
                    />
                    <TextField
                        margin="dense"
                        id="giver"
                        label="Giver"
                        type="text"
                        fullWidth
                        required
                    />
                    <TextField
                        margin="dense"
                        id="date"
                        label="Date"
                        type="date"
                        fullWidth
                        required
                    />
                    <TextField
                        margin="dense"
                        id="totalamt"
                        label="Total Amount"
                        type="number"
                        fullWidth
                        required
                    />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default function Home() {

    const [bookings, setBookings] = useState([])

    const bookingsCollection = collection(firestore, 'bookings')

    const getBookings = async () => {
        const bookingsQuery = await getDocs(bookingsCollection)
        const res = [];
        bookingsQuery.forEach((doc) => {
            res.push(doc.data())
        })
        setBookings(res)
    }

    useEffect(() => {
        //getBookings();
    })

  return (
    <div className={styles.container}>
      <Head>
        <title>Bookings</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
          <p><CalendarMonth ></CalendarMonth></p>
        <h1 className={styles.title}>
            Bookings!
        </h1>
        <p className={styles.description}>
          Add, edit or delete bookings
        </p>
          <AddEntryDiag bookingsCollection/>
          <br></br>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                                    sx={{'&:last-child td, &:last-child th': { border: 0}}}>
                                    <TableCell component="th" scope="row">
                                        {bk.id}
                                    </TableCell>
                                    <TableCell align={"right"}>{bk.seeker}</TableCell>
                                    <TableCell align={"right"}>{bk.giver}</TableCell>
                                    <TableCell align={"right"}>{bk.date}</TableCell>
                                    <TableCell align={"right"}>{bk.totalamt}</TableCell>
                                    <TableCell align={"right"}>
                                        <IconButton aria-label="edit" onClick={editEntry}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton aria-label="delete" onClick={deleteEntry}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel" className={styles.logo} />
        </a>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
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
