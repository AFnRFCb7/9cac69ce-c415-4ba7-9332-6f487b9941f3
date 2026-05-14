## frontend

npm install
npm run dev -- --host
npm run lint

## backend

node server.js

## firewall

sudo iptables -D nixos-fw -p tcp --dport 3000 -j ACCEPT
sudo iptables -D nixos-fw -p tcp --dport 5173 -j ACCEPT
`sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 5173 -j ACCEPT`

## google auth
1. https://console.cloud.google.com/apis/credentials?utm_source=chatgpt.com
2. authorized redirect uri 