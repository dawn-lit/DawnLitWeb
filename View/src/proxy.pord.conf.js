const PROXY_CONFIG = [
  {
    context: [
      "/api",
      "/signalr"
    ],
    target: "https://be.dawnlit.com",
    secure: false,
    ws: true,
    headers: {
      Connection: "Keep-Alive",
    },
  }
]

module.exports = PROXY_CONFIG;
