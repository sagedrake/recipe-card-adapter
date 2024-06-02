const promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log("hi 1");
      resolve('foo');
    }, 300);
  });

  const promise2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log("hi 2");
      resolve('foo');
    }, 3000);
  });

  const promise3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log("hi 3");
      throw err;
    }, 1000);
  });

  Promise.allSettled([promise1, promise2, promise3])
  .then((values) => {
      console.log("success!", values);
  })
  .catch((error) => {
      console.log("failure :( ", error);
  });