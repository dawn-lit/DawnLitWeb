const PROXY_CONFIG = [
  {
    context: [
      "/api",
      "/chat"
    ],
    target: "http://dawnlit.com:7061",
    secure: false,
    ws: true,
    headers: {
      Connection: "Keep-Alive",
    },
  }
]

module.exports = PROXY_CONFIG;