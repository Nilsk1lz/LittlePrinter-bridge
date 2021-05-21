class Response {
  constructor(res) {
    this.res = res;
  }

  status = (status) => {
    this.res.status(status);
  };

  send = (data) => {
    this.res.send(data);
  };
}
