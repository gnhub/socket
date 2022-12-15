class users{

    constructor(socketId,systemInfo,webSocketId,token){
        this.socketId=socketId;
        this.systemInfo=systemInfo;
        this.webSocketId=webSocketId;
        this.token=token;
    }
}

module.exports = users;