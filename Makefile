install:
	npm install

lint:
	node ./node_modules/.bin/eslint .

test:
	NODE_OPTIONS=--experimental-vm-modules npx jest --coverage

test-watch:
	npx jest --watch