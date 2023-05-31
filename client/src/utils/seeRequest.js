

export const sendSeeRequest = (socket, data) => {
    return new Promise((resolve, reject) => {

        // request fails if no response within 5 seconds
        // const id = setTimeout(() => {
        //     console.log("req timed out");
        //     reject("Request timed out.")
        // }, 5000);

        socket.timeout(5000).emit("see-request", data, (err, response_code) => {
            console.log(response_code);
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
      });
}

export const sendYoloRequest = (socket) => {
  return new Promise((resolve, reject) => {

      socket.timeout(7000).emit("yolo-request", (err, files, response_code) => {
          console.log(response_code);
          if (err) {
              reject("Request timed out");
          }

          else if (response_code == 500) {
              reject("Could not process request");
          }

          else if (response_code == 200) {
              console.log("received response from SEE");
              resolve(files);
          }
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