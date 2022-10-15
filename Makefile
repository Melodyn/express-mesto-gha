setup: install-dependencies mongo-run run
install-dependencies:
	npm ci

# app
run: mongo-run
	npm run dev
prod:
	chmod +x ./bin/index.js && npm run start

# dev
lint:
	npm run lint
mongo-run:
	docker run --rm -p 27017:27017 -d --name mongo mongo:latest || true
mongo-stop:
	docker stop mongo
