const PROXY_CONFIG = [
  {
    context: [
      "/api",
      "/chat"
    ],
    target: "https://localhost:7061",
    secure: false,
    ws: true
  }
]

module.exports = PROXY_CONFIG;
