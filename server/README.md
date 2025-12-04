Det här är backend-delen av vår meetup-applikation.
Den är byggd i Express.js och kopplad till en PostgreSQL-databas som ligger på Render.
Backendet hanterar allt som har med användare, meetups och anmälningar att göra.

Målet har varit att bygga ett enkelt, tydligt och stabilt API som vår frontend kan prata med.

🧱 Hur backend är uppbyggt

Backendet består av några få delar:

server.js – startar Express och kopplar ihop alla routes

db.js – kopplar till databasen, skapar tabeller och lägger in seed-data

routes/ – alla endpoints för users, meetups och health-check

PostgreSQL – lagrar användare, meetups och anmälningar

Mappstrukturen:

server/
  routes/
    health.js
    meetups.js
    users.js
  db.js
  server.js

🗄 Databasen

Vi använder tre tabeller som täcker allt vi behöver:

users

id

username

email

password_hash (sparas som plain text i uppgiften)

created_at

meetups

id

title

description

date

location

signups

id

meetup_id

name

email

created_at

Vid första körningen lägger backend in några exempelmeetups automatiskt så det alltid finns data att jobba med.

📡 API Endpoints

Här är alla endpoints som frontend kan använda.

Health

GET /health – ser om API:et lever

GET /db-test – testar databasanslutningen

Users

POST /api/users/register – skapa användare

POST /api/users/login – logga in

GET /api/users/:email/meetups – visar vilka meetups användaren är anmäld till

Meetups

GET /api/meetups – lista alla meetups

GET /api/meetups/search?q=... – sök i meetups

GET /api/meetups/:id – detaljer om en specifik meetup

POST /api/meetups/:id/signup – anmäl dig

DELETE /api/meetups/:id/signup – avanmäl dig

Alla svar skickas som JSON.

⚙️ Miljövariabler (.env)

Backendet behöver bara några få miljövariabler:

DATABASE_URL=<Render-URL-till-databasen>
FRONTEND_ORIGIN=http://localhost:5173
PORT=3000

▶️ Köra backend lokalt

Installera:

cd server
npm install


Starta utvecklingsserver:

npm run dev


Servern kör på:

http://localhost:3000

✔ User Stories (Backend – klart för G)

Backendet täcker alla user stories som krävs för Godkänt:

Registrera användare

Logga in

Lista meetups

Söka meetups

Visa detaljer

Anmäla sig

Avanmäla sig

Profilvy (mina meetups)

📝 Kort sammanfattning

Backendet är en enkel men komplett REST-tjänst som sköter all logik bakom användare och meetups.
Det är kopplat till en molndatabas, seedar data automatiskt och innehåller alla endpoints som frontend behöver för att fungera.