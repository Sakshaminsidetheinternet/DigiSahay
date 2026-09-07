# DigiSahay Spring Boot Backend

Backend aligned to the uploaded `DigiSahay-updated` React/Vite frontend and preserving the existing civic-platform backend modules.

## Frontend-compatible endpoints
- POST `/api/users/register` — accepts `name`, `email`, `password`, `role` (`CITIZEN`, `UNIVERSITIES`, `INDUSTRY`)
- POST `/api/users/login`
- GET `/api/users/profile` (citizen)
- PUT `/api/users/profile` (citizen)
- POST `/api/problems` multipart: `title`, `description`, `category`, `address`, `city`, optional `image`
- GET `/api/problems`
- GET `/api/problems/{id}`
- GET `/api/problems/my-problems`

## Added integration endpoints
- PATCH `/api/problems/{id}/status?status=OPEN|IN_PROGRESS|RESOLVED|REJECTED`
- POST `/api/problems/{id}/upvote`
- GET `/api/problems/heatmap`
- POST `/api/proposals/university` multipart
- GET `/api/proposals/university/{universityId}`
- GET `/api/proposals/problem/{problemId}`

## Run
1. Create MySQL database `digisahay`.
2. Set `DB_USERNAME` / `DB_PASSWORD` if needed.
3. Optional: set `GEMINI_API_KEY`; problem creation should still be made resilient in your final integration if AI is unavailable.
4. Use Java 21 and Maven wrapper: `mvnw.cmd spring-boot:run` on Windows.

Frontend base URL is `http://localhost:8080`.
