

export const sendSeeRequest = (socket, data) => {
    return new Promise((resolve, reject) => {

        // request fails if no response within 5 seconds
        // const id = setTimeout(() => {
        //     console.log("req timed out");
        //     reject("Request timed out.")
        // }, 5000);

        socket.timeout(5000).emit("see-request", data, (err, response_code) => {

            if (err) {
                reject("Request timed out");
            }

            else if (response_code == 500) {
                reject("Could not process request");
            }

            else if (response_code == 200) {
                console.log("received response from SEE");
                resolve();
            }
        });

        // socket.on("see-response", (response) => {
        //     console.log("received response from see");
        //     clearTimeout(id);
        //     resolve(response);
        //     socket.off('see-response');
        // });
    
        // socket.on('see-error', (error) => {
        //     clearTimeout(id);
        //     reject(error);
        //     socket.off('see-error');
        // });
      });
}

export class SeeRequest {
    constructor(serviceName, commandName, newValue) {
        this.serviceName = serviceName;
        this.commandName = commandName;
        this.newValue = newValue;
    }
}