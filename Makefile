setup: install-dependencies run
install-dependencies:
	npm ci

# run
run:
	npm run dev
prod:
	chmod +x ./bin/index.js && npm run start

# dev
lint:
	npm run lint
