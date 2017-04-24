const express = require( 'express' );
let app = express();

app.use( express.static( 'public' ) );

let server = app.listen( process.env.PORT || 3000, listen );

function listen() {
  let host = server.address().address;
  let port = server.address().port;

  console.log( 'App listening at http://' + host + ':' + port );
}
