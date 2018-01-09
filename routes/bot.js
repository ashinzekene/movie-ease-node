const http = require("http") 
const apiai = require('apiai');
const path = require("path")
const excuse = require("huh")
const express = require("express")
const AI = apiai(process.env.CLIENT_ACCESS_TOKEN);
const sessionId = Math.random * 10000000
const app = express()

const server = http.createServer(app)


const io = require("socket.io").listen(server)
server.listen(80)
const PORT = process.env.PORT || 3999

app.use(express.static(path.join(__dirname, 'client/build')));
app.use((req, res) => {
  console.log(req.ip)
  res.sendFile(`${__dirname}/client/build/index.html`)
})

app.listen(PORT, (err) => {
  console.log("Listeneing on ", PORT)
})

io.listen(5000, (err) => {
  console.log("listening on 5000")
});

io.on("connection", client => {
  console.log("Client connected")
  
  client.on("userMessage", message => {
    console.log("Recieved message ", message)
      var apiaiReq = AI.textRequest(message, {
        sessionId
      });
      console.log("Waiting for response")
    
      apiaiReq.on('response', (response) => {
        let aiText = response.result.fulfillment.speech || excuse.get('en')
        console.log("responding with ", aiText )
        client.emit('AIMessage', aiText); // Send the result back to the browser!
      });
      
      apiaiReq.on('error', (error) => {
        console.log("Error", error);
        client.emit('AIMessage', "I don't know. Ask me later"); // Send the result back to the browser!
      });

      apiaiReq.end()
  })
})
