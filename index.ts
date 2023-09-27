import express from 'express'
import connectDB from "./config/db";
import env from "./config/env";
import seed from "./config/seed";
import books from "./routes/books";
import auth from "./routes/auth";

const app = express()

app.use(express.json())
app.use('/', auth)
app.use('/books', books)

app.get('*', (req, res) => {
    res.send('oopps')
})

app.listen(env.port, async () => {
    console.log(`🚀 Server ready at: http://localhost:${env.port}`)

    await connectDB();

    await seed();
})