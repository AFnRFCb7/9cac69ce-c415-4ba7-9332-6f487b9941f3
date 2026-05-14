## frontend

npm install
npm run dev
npm run lint

## backend

node server.js

## firewall

sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 5173 -j ACCEPT