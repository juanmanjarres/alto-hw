import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {CalendarMonth} from "@mui/icons-material";


function createData(id, seeker, giver, date, totalamt){
  return {id, seeker, giver, date, totalamt}
}

const rows = [
    createData(1, 'John', 'Martha', (new Date(2020, 4, 2)).toDateString(), 1.99),
    createData(2, 'Michael', 'Sam', (new Date(2022, 7, 2)).toDateString(), 1.99),
    createData(3, 'Ty', 'Rob', (new Date(2019, 9, 30)).toDateString(), 1.99)
]

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Bookings</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
          Bookings!
        </h1>
        <p className={styles.description}>
          Add, edit or delete bookings <CalendarMonth></CalendarMonth>
        </p>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align={"right"}>Seeker</TableCell>
                            <TableCell align={"right"}>Giver</TableCell>
                            <TableCell align={"right"}>Date</TableCell>
                            <TableCell align={"right"}>Total Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{'&:last-child td, &:last-child th': { border: 0}}}>
                                    <TableCell component="th" scope="row">
                                        {row.id}
                                    </TableCell>
                                    <TableCell align={"right"}>{row.seeker}</TableCell>
                                    <TableCell align={"right"}>{row.giver}</TableCell>
                                    <TableCell align={"right"}>{row.date}</TableCell>
                                    <TableCell align={"right"}>{row.totalamt}</TableCell>
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
