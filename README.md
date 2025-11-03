# CI API mínima
API demo para practicar CI/CD con DEV/QA/PROD, Jenkins, SonarQube y Postman.

## Ejecutar
1) npm install
2) DEV: npm run dev
3) PROD: npm start
4) Healthcheck: GET http://localhost:3000/health

## Endpoints
- GET /health
- GET /api/v1/tasks
- POST /api/v1/tasks   { "title": "Texto" }
- GET /api/v1/tasks/:id
- PUT /api/v1/tasks/:id  { "title": "...", "done": true }
- DELETE /api/v1/tasks/:id
