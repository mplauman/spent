# Stolen from here:
# https://container-solutions.com/tagging-docker-images-the-right-way/

export NAME   := mplauman/spent
export TAG	  := $(shell git log -1 --pretty=%h)
export IMG	  := ${NAME}:${TAG}
export LATEST := ${NAME}:latest

export BASE64_GOOGLE_APP_ID   := $(shell echo -n ${GOOGLE_APP_ID} | base64 --wrap=0)
export BASE64_LINKEDIN_APP_ID := $(shell echo -n ${LINKEDIN_APP_ID} | base64 --wrap=0)

CLI_TARGETS := image deploy login push
CI_TARGETS  := install script after_success

.PHONY: ${CLI_TARGETS} ${CI_TARGETS}

error:
	$(error Please select one of the default CLI targets: ${CLI_TARGETS})

image:
	@docker build -t ${IMG} . --build-arg GIT_COMMIT=${TAG}
	@docker tag ${IMG} ${LATEST}

deploy:
	cat kubernetes.yml | envsubst | kubectl apply -f -

login:
	@docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}

push:
	@docker push ${NAME}

# Called by the CI/CD framework to install dependencies
install:
	@npm ci

# Called by the CI/CD framework to perform the build
script:
	@npm test
	@npm run build

# Called by the CI/CD framework after 'script' has run successfully
after_success: image login push

