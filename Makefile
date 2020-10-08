BABEL = node_modules/.bin/babel
TSC = node_modules/.bin/tsc
ESLINT = node_modules/.bin/eslint
JEST = node_modules/.bin/jest
MARKDOWNLINT = node_modules/.bin/markdownlint

ESLINT_CONFIG = -c .eslintrc.cjs --ext .js,.jsx,.ts,.tsx

SRC = $(shell find src -name '*.ts')
DIST = $(SRC:src/%.ts=dist/%.js)

all: node_modules check-types lint dist

dist: $(DIST)

dist/%.js: src/%.ts .babelrc.js ${BABEL}
	mkdir -p $(@D)
	${BABEL} $< --out-file $@

check-types: ${SRC} tsconfig.json
	${TSC}

# Reinstall node modules when our deps are updated
node_modules: package.json
	yarn install

test: ${SRC} jest.config.mjs
	${JEST}

watch:
	${JEST} --watch

lint: lint-src lint-readme

lint-src: ${SRC} .eslintrc.cjs .eslintignore
	${ESLINT} src ${ESLINT_CONFIG}

lint-fix-src: ${SRC} .eslintrc.cjs .eslintignore
	${ESLINT} src --fix ${ESLINT_CONFIG}


lint-readme: README.md
	${MARKDOWNLINT} -f README.md

# Remove all build artifacts
clean:
	rm -rf dist

.PHONY: clean lint lint-src lint-fix-src lint-readme test watch check-types
