const http = require('http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const { Server } = require('socket.io');
const port = process.env.PORT || 5000; // Use the same port for both HTTP and WebSocket
const ParticipantSocket = require('./models/ParticipantSocket')
const Sessions = require("./models/Sessions");

const app = express();
app.use(express.json());
app.use(cookieParser());

// Configure CORS to allow requests from your frontend
app.use(cors({
    origin: 'https://project-sfa-frontend.onrender.com',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true
}));

// Connect to MongoDB
mongoose.set("strictQuery", false);
mongoose.connect('mongodb+srv://heerpatel291:m5KyN7OLLpObqPvY@cluster0.h8ra2k6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('Database connected');
    })
    .catch((err) => {
        console.error(`Error connecting to the database. \n${err}`);
    });

// Import and use routes
const generateLink = require('./routes/GenerateLink');
const { decode } = require('punycode');
app.use('/generate', generateLink);

// Create HTTP server and attach WebSocket server
const server = http.createServer(app);

// Configure Socket.io server with proper CORS settings
const io = new Server(server, {
    cors: {
        origin: 'https://project-sfa-frontend.onrender.com',
        methods: ["GET", "POST"],
        credentials: true
    }
});

let participantsReachedScreen11 = 0;
var totalParticipants = 0; 

// app.post('/updateparticipant', (req, res) => {
//     totalParticipants = req.body.participants;
//     return res.status(201).send({ msg: 'success', p: totalParticipants })
// })

async function getParticipants(token) {
    try {
        // Wrap jwt.verify in a Promise
        const decodedToken = await new Promise((resolve, reject) => {
            jwt.verify(token, "secretKey", (err, decodedToken) => {
                if (err) {
                    return reject("Access denied");
                }
                resolve(decodedToken);
            });
        });

        // Now decodedToken is available
        const link = decodedToken.link;
        const sessionObj = await Sessions.findOne({ link });
        return { totalParticipants: sessionObj.no_of_participants, msg: "positive" }; // Return the correct value
    } catch (e) {
        console.log('error: ', e);
        return { totalParticipants: undefined, msg: "error" }; // Return error response
    }
}

// Maintain a set of connected clients to avoid counting duplicates
const participants = new Set();

// Handle WebSocket connections
io.on('connection', (socket) => {
    // console.log('A user connected');

    // Add socket to the participants set
    participants.add(socket.id);
    socket.hasEmitted = false;
    socket.on('registerParticipant', async (participantId) => {
        try {
            const result = await ParticipantSocket.findOneAndUpdate(
                { participantId },
                { socketId: socket.id }, // Update to the latest socket ID
                { upsert: true, new: true }
            );
            console.log(`Participant ${participantId} registered with socket ${socket.id}`, result);
        } catch (error) {
            console.error('Error registering participant:', error);
        }
    });    

    // Listen for 'screen11-reached' event
    socket.on('screen11-reached', async(token) => {
        const result = await getParticipants(token.token);  
        const totalParticipants = result.totalParticipants;
        console.log(109, totalParticipants)
        console.log('screen11-reached event received');

        // Check if the participant is already counted
        // console.log(64, socket.hasEmitted)
        if (!socket.hasEmitted) {
            participantsReachedScreen11++;
            // socket.hasEmitted = true; // Mark this socket as having emitted the event
            
            console.log(69, participantsReachedScreen11, totalParticipants)
            io.emit('update-count', participantsReachedScreen11);

            // Check if the threshold is reached
            if (participantsReachedScreen11 >= totalParticipants) {
                participantsReachedScreen11 = 0;
                io.emit('threshold-reached');
            }
        }
    });
    socket.on('nextto15normal', async ({ participant }) => {
        try {
          const participantDoc = await ParticipantSocket.findOne({ participantId: participant });
          if (participantDoc) {
            const socketId = participantDoc.socketId;
            console.log(101, socketId)
            if (socketId) {
                // io.to(socketId).emit('moveto15', { participant });
                io.emit('moveto15', {participant, socketId})
            } else {
                console.log('Socket ID not found for participant:', participant);
            }

          } else {
            console.log('Participant not found');
          }
        } catch (error) {
          console.error('Error emitting to participant:', error);
        }
    });
    socket.on('nextto14', async(data) => {
        const { currentPnumber, participant } = data;
        const participantDoc = await ParticipantSocket.findOne({ participantId:  participant});
        if(participantDoc){
            const socketId = participantDoc.socketId;
            console.log(101, socketId)
            if(socketId){
                io.emit('movetoWaiting', { currentPnumber });
                io.emit('moveto14', { exceptPnumber: currentPnumber,participant, socketId });
            }else{
                console.log('Socket ID not found for participant:', participant);
            }
        }
        
    });

    socket.on('nextto15Pre', ()=>{
        io.emit('moveto12'); 
    })
    // socket.on('nextto15post',(data)=>{
    //     const { currentPnumber } = data;
    //     socket.emit('movetoWaiting', { currentPnumber });
    //     socket.broadcast.emit('moveto15Post', { exceptPnumber: currentPnumber });
    // })
    socket.on('nextto15post', async (data) => {
        const { currentPnumber, participant } = data;
        

        const participantDoc = await ParticipantSocket.findOne({ participantId:  participant});
        if(participantDoc){
            const socketId = participantDoc.socketId;
            console.log(101, socketId)
            if(socketId){
                io.emit('movetoWaiting', { currentPnumber });
                io.emit('moveto15Post', { exceptPnumber: currentPnumber,participant, socketId });
            }else{
                console.log('Socket ID not found for participant:', participant);
            }
        }
    });
    
    socket.on('nextto13',()=>{
        if (!socket.hasEmitted) {
            io.emit('moveto13')
        }
    })
    socket.on('nextto17',async({participant})=>{
        const participantDoc = await ParticipantSocket.findOne({ participantId: participant });
        if (participantDoc) {
          const socketId = participantDoc.socketId;
          console.log(101, socketId)
          if (socketId) {
              // io.to(socketId).emit('moveto15', { participant });
              io.emit('moveto17', {participant, socketId})
          } else {
              console.log('Socket ID not found for participant:', participant);
          }
        }
    })
    socket.on('nextto18',async({ participant })=>{
        const participantDoc = await ParticipantSocket.findOne({ participantId: participant });
        if (participantDoc) {
          const socketId = participantDoc.socketId;
          console.log(101, socketId)
          if (socketId) {
              // io.to(socketId).emit('moveto15', { participant });
              io.emit('moveto18', {participant, socketId})
          } else {
              console.log('Socket ID not found for participant:', participant);
          }
        }
    })
socket.on('disconnect', async () => {
    try {
      await ParticipantSocket.findOneAndDelete({ socketId: socket.id });
      console.log(`Socket ${socket.id} disconnected and removed from the database`);
    } catch (error) {
      console.error('Error handling disconnection:', error);
    }
  });
  
});
app.get('/', (req, res) => {
    res.send('Backend is working!');
});

// Start the server
server.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});
