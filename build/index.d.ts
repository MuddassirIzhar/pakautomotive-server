declare global {
    var onlineUsers: Map<{
        userId: number;
        currentRoom: number | undefined;
    }, string>;
    var chatSocket: any;
}
export {};
