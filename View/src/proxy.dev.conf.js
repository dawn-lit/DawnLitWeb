const PROXY_CONFIG = [
  {
    context: [
      "/api",
      "/signalr"
    ],
    target: "https://localhost:7061",
    secure: false,
    ws: true,
    headers: {
      Connection: "Keep-Alive",
    },
  }
]

module.exports = PROXY_CONFIG;
