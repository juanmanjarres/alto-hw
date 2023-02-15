import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {
    AppBar,
    Box, Button,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Toolbar, Typography
} from "@mui/material";
import {
    Delete,
    Upcoming
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {firestore, auth} from "../firebase/clientApp";
import {BookingDiag} from "../components/bookingDialog";
import {collection, doc, getDocs, deleteDoc} from "@firebase/firestore";
import {useEffect, useState} from "react";
import {LoginDiag, SignupDiag} from "../components/authDialogs";
import { onAuthStateChanged, signOut } from "firebase/auth";

async function deleteEntry(id) {
    await deleteDoc(doc(firestore, 'bookings', id));
}

export default function Home() {

    const [bookings, setBookings] = useState([])
    const [user, setUser] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);

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

    const handleSignOut = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("Signed out successfully")
        }).catch((error) => {
            console.log("Error while logging out: " + error)
        });
    }

    useEffect(() => {
        getBookings();
        onAuthStateChanged(auth, (returnedUser) => {
            if(returnedUser){
                //User is signed in
                setUser(returnedUser)
                setLoggedIn(true)
                console.log("uid: " + JSON.stringify(returnedUser.uid))
            } else {
                setUser({})
                setLoggedIn(false)
                console.log("User signed out")
            }
        })
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
                                {
                                    loggedIn ?
                                        <Button color="secondary" onClick={handleSignOut}>Sign Out</Button> :
                                            <div style={{ display:"flex" }}>
                                                <LoginDiag /> <SignupDiag />
                                            </div>

                                }

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
