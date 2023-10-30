const express = require( "express" );
const rotas = require( "./Rotas/contasRotas" );


const app = express();

app.use( express.json() );

app.use( rotas )


module.exports = app;
