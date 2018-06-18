# Stolen from here:
# https://container-solutions.com/tagging-docker-images-the-right-way/

NAME   := mplauman/spent
TAG	   := $$(git log -1 --pretty=%h)
IMG	   := ${NAME}:${TAG}
LATEST := ${NAME}:latest

error:
	@echo "Please choose one of the following targets: build push login"
	@exit 2

image:
	@docker build -t ${IMG} . --build-arg GIT_COMMIT=${TAG}
	@docker tag ${IMG} ${LATEST}

push:
	@docker push ${NAME}

login:
	@docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}

