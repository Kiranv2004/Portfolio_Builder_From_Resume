@echo off
echo Starting Resume Portfolio Demo...

echo Building and starting containers...
docker-compose up -d --build

echo Waiting for services to be ready...
timeout /t 30

echo Seeding database...
docker exec resume_portfolio_mongo mongosh resume_portfolio --eval "db.createCollection('users')"
docker exec resume_portfolio_mongo mongosh resume_portfolio --eval "db.users.createIndex({username: 1}, {unique: true})"

echo Demo is ready!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8080
pause
