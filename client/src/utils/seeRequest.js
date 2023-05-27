

export const sendSeeRequest = (socket, data) => {
    return new Promise((resolve, reject) => {

        // request fails if no response within 5 seconds
        const id = setTimeout(() => {
            reject("Request timed out.")
        }, 5000);

        socket.emit("see-request", data);

        socket.on("see-response", (response) => {
            clearTimeout(id);
            resolve(response);
            socket.off('see-response');
        });
    
        socket.on('see-error', (error) => {
            clearTimeout(id);
            reject(error);
            socket.off('see-error');
        });
      });
}

export class SeeRequest {
    constructor(serviceName, commandName, newValue) {
        this.serviceName = serviceName;
        this.commandName = commandName;
        this.newValue = newValue;
    }
}