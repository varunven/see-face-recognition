    // generates a delay of x ms
    export const delay = (ms) => {
      return new Promise(resolve => setTimeout(resolve, ms));
  }