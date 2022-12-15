const app = require('../server').app;
const io = require('../server').io;
const userClass = require('./classes/users') 
let usersRoom=[];
app.get('/',(req,res)=>{
 
    if(req.headers.host == "localhost:8040"){
        res.render('local');

    }
    else{
        res.render('hello');

    }
})

io.sockets.on('connection',(socket)=>{

    console.log("user coonects",usersRoom.length)
    user={}
 
    socket.emit('socketid',socket.id);
 
    socket.on('init',(data)=>{

        console.log("Ininit",data);

        let userdata = data;
        console.log("Ininituserdata",userdata);

        user = new userClass(socket.id,userdata.systemInfo,userdata.webSocketId,userdata.token);
        usersRoom.push(user);

        console.log("user",user)
        console.log("userroom",usersRoom)
    })

    socket.on('webLoggedInit',(data)=>{

        console.log("webLoggedInit",data)

        let userdata = data;
        user = new userClass(socket.id,userdata.systemInfo,userdata.webSocketId,userdata.token);
        usersRoom.push(user);


        //check if mobile socket is online
        // userObj = usersRoom.find((element)=>{
        //     return element.token == userdata.token && element.socketId!=socket.id;
        // })
        // console.log("userObj",userObj)
        // //if mob online
        // if(userObj){
        //     console.log("in if userObj")

        //     userObj.webSocketId = socket.id
        //     socket.emit('onOnline',true);
        // }
        // else{
        //     socket.emit('onOffline',true);
        // }
    })


    socket.on('mobLoggedInit',(data)=>{
        let userdata = data;
        user = new userClass(socket.id,userdata.systemInfo,userdata.webSocketId,userdata.token);
        usersRoom.push(user);


        //check if web socket is online
        // userObj = usersRoom.find((element)=>{
        //     return element.token == userdata.token && element.socketId!=socket.id;
        // })

        // //if web online
        // if(userObj){

        //     user.webSocketId = userObj.socketId
        //     io.to(userObj.socketId).emit('onOnline',true);

        // }
    })
    

     socket.on('disconnect', () => {
 
         console.log("dis",socket.id)
        console.log('user',user)
         //if its mobile then ack to browser disconnect
        //  if(user.webSocketId){
        //     if(io.sockets.sockets[user.webSocketId]!=undefined){
        //         io.to(user.webSocketId).emit('onOffline',true);
        //     }
        //  }

         usersRoom.forEach((data,i)=>{
            if(data.socketId == socket.id){
                usersRoom.splice(i,1); 
            }
         });
     })
 
     //when scan Qr code from mobile
     socket.on('onScanQr',(data)=>{

        console.log("inonScanQr",data)
        let companydata = data;
        console.log("companydata",companydata)


        //find web to set token
        userObj = usersRoom.find((element)=>{
            return element.socketId == companydata.webBrowsSocketId;
        })


        console.log("userObj",userObj)
        
        //set token
        userObj.token = companydata.companyInfo[2].auth

        //check if socket(web) is connect or not
        if(io.sockets.sockets[companydata.webBrowsSocketId]!=undefined){
            console.log("inIf")

            //set webBrowsSocketId
            user.webSocketId = companydata.webBrowsSocketId;

            //sent webBrowser to info(start web)
            let data = {
                'companyInfo':companydata.companyInfo,
                'mobileInfo':user,
                'isAdmin':companydata.isAdmin
            }
            io.to(companydata.webBrowsSocketId).emit('onConnectToApp',data);

            //sent mobile to info(set info)
            WebBrowsObj = usersRoom.find((element)=>{
                return element.socketId == companydata.webBrowsSocketId;
            })
            let data2 = {
                'browserInfo':WebBrowsObj
            }
            socket.emit('onConnectToBrowser',data2);



        }else{

            console.log("Socket not connected");
            socket.emit('onScanQrFailed',true);

        } 

     })
 })
 
