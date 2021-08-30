# develop
3 consoles:
tsc -b -w .\server\
node .\server\out\server.js
cd .\client\ | npm run start
--> Launch Chrome task

# docker
docker build -t bratiano/server -f ./server/Dockerfile .
docker tag bratiano/server:latest registry.heroku.com/bratiano/web

# heroku
(heroku container:push web --app bratiano)
heroku login
heroku container:login
docker push registry.heroku.com/bratiano/web
heroku container:release web --app bratiano

# firebase
firebase login
(firebase init)
firebase deploy