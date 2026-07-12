## frontend

npm install
npm run dev -- --host
npm run lint

## backend

node server.js

## firewall

`sudo iptables -D nixos-fw -p tcp --dport 3000 -j ACCEPT
sudo iptables -D nixos-fw -p tcp --dport 5173 -j ACCEPT`
`sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 5173 -j ACCEPT`

## google auth
1. https://console.cloud.google.com/apis/credentials?utm_source=chatgpt.com
2. authorized redirect uri 

## Development URLs

When running the application locally, **do not** access the frontend using `http://localhost:5173`.

Instead, use:

```
http://frontend.<HOST_IP>.sslip.io:5173
```

For example:

```
http://frontend.192.168.1.135.sslip.io:5173
```

The backend CORS configuration and authentication are configured to trust the `sslip.io` hostname. Accessing the frontend via `http://localhost:5173` sends an origin of `http://localhost:5173`, which is rejected by the backend with an error similar to:

```
Origin http://localhost:5173 not allowed
```

If you encounter this error, verify that you are using the `frontend.<HOST_IP>.sslip.io` URL rather than `localhost`.




# TODO
1. https
2. 