const app = require('./app');
const databaseConnection = require('./config/database')
const dotenv = require('dotenv');

process.on('uncaughtException',err=>{
    console.error(`Error: ${err.message}`);
    console.log('Server is shutting down due to uncaught exception')
    process.exit(1)
})
//setting up config file
dotenv.config({path: "backend/config/config.env"})

//Connect DB
databaseConnection();

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is running at http://localhost:${process.env.PORT} in ${process.env.NODE_ENV}`)
});

process.on('unhandledRejection', err =>{
    console.log(`Error: ${err.message}`);
    console.log('Server is shutting down due to unhandled Promise rejection')
    server.close(()=>{
        process.exit(1)
    })
})