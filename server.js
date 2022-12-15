const express = require('express');
const cors = require('cors');
const app = express();
const port = 8040
const useragent = require('express-useragent');
app.use(useragent.express());
const server = app.listen(process.env.PORT || port,()=>{
    console.log(port)
});
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ["GET", "POST"]
    }
  });
app.set('view engine','ejs')


module.exports={
    app,
    io
}
