# Supermarket SaaS Backend

Express backend for the WeChat Mini Program cloud container.

## Endpoints

- `GET /`
- `POST /api/count`
- `GET /api/payment-config`
- `GET /api/orders`
- `POST /api/orders`
- `GET /api/orders/:id`

## Deploy To WeChat CloudRun / CloudBase

Use this folder as the Express service source:

```text
outputs/supermarket-saas-backend
```

Start command:

```bash
npm start
```

Container port:

```text
80
```

The Mini Program is configured to call:

```text
env: prod-d8g4z6n4f7fe2b1b4
service: express-p5da
```

## Notes

Orders are stored in memory for first deployment verification. They will reset when the service restarts.
For production, replace the `orders` array in `server.js` with CloudBase database or another persistent database.
