install:
	npm install

lint:
	node ./node_modules/.bin/eslint .

test:
	node --experimental-vm-modules ./node_modules/.bin/jest --coverage

test-watch:
	npx jest --watch