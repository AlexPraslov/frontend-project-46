install:
	npm install

lint:
	npm run lint

test:
	NODE_OPTIONS=--experimental-vm-modules npx jest --coverage

test-watch:
	npx jest --watch