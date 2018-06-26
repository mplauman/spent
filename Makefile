# Stolen from here:
# https://container-solutions.com/tagging-docker-images-the-right-way/

export NAME   := mplauman/spent
export TAG	  := $(shell git log -1 --pretty=%h)
export IMG	  := ${NAME}:${TAG}
export LATEST := ${NAME}:latest

# The GOOGLE_APP_ID and LINKEDIN_APP_ID environment variables are stored on
# travis-ci. They're decrypted and provided as environment variables, which
# then need to be base64-encoded to appease k8s's requirements.
export BASE64_GOOGLE_APP_ID   := $(shell echo -n ${GOOGLE_APP_ID} | base64 --wrap=0)
export BASE64_LINKEDIN_APP_ID := $(shell echo -n ${LINKEDIN_APP_ID} | base64 --wrap=0)

# The CLOUDSDK_INSTALL_DIR and CLOUDSDK_CORE_DISABLE_PROMPTS variables instruct
# the curl-downloaded script where to place the binaries and to install without
# using any prompts.
export CLOUDSDK_CORE_DISABLE_PROMPTS := 1
export CLOUDSDK_INSTALL_DIR := ${HOME}/google-cloud-sdk
export KUBECTL_INSTALL_DIR := ${HOME}/kubectl

CLI_TARGETS := image deploy login push docker-login gcloud-login gcloud-install kubectl-install
CI_TARGETS  := install script after_success


.PHONY: ${CLI_TARGETS} ${CI_TARGETS}

error:
	$(error Please select one of the default CLI targets: ${CLI_TARGETS})

image:
	@docker build -t ${IMG} . --build-arg GIT_COMMIT=${TAG}
	@docker tag ${IMG} ${LATEST}

# The kubernetes.yml file checked into source control is a template that
# needs some values swapped into it. This is done via `envsubst` before 
# feeding it to kubectl.
deploy:
	@cat kubernetes.yml | envsubst | kubectl apply -f -

login: docker-login gcloud-login
	
# The DOCKER_USER and DOCKER_PASS environment variables are sensitive
# and should be stored securely on the CI/CD system.
docker-login:
	@docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}

# This GCLOUD_KEY_FILE environment variable is a base64-encoded JSON
# document containing the service account's information. Instructions
# on acquiring this can be found here, under 'Creating the credentials':
# https://cloud.google.com/solutions/continuous-delivery-with-travis-ci
#
# Once the file has been downloaded, base64-encode it via `base64 --wrap=0`
# and save the output in travis-ci as an encrypted environment variable.
#
# That'll get it saved securely on travis. At build-time it will be
# decrypted and provided as an environment variable, which is then
# base64 decoded back into the account JSON.
gcloud-login:
	@echo ${GCLOUD_KEY_FILE} | base64 --decode > gcloud_service_account.json
	@gcloud auth activate-service-account --key-file gcloud_service_account.json
	@gcloud config set project ${GCLOUD_PROJECT_ID}
	@gcloud config set container/cluster ${GCLOUD_CLUSTER_ID}
	@gcloud config set compute/zone ${GCLOUD_COMPUTE_ZONE}
	@gcloud components install kubectl
	@gcloud container clusters get-credentials ${GCLOUD_CLUSTER_ID}
	@kubectl config view
	@kubectl config current-context

gcloud-install:
	@if [ ! -d ${CLOUDSDK_INSTALL_DIR} ]; then curl https://sdk.cloud.google.com | bash; fi

kubectl-install:
	@if [ ! -f ${KUBECTL_INSTALL_DIR}/kubectl ]; then mkdir -pv ${KUBECTL_INSTALL_DIR} && curl https://storage.googleapis.com/kubernetes-release/release/v1.10.5/bin/linux/amd64/kubectl > ${KUBECTL_INSTALL_DIR}/kubectl; fi
	@chmod +x ${KUBECTL_INSTALL_DIR}/kubectl
	@export PATH=${PATH}:${KUBECTL_INSTALL_DIR}

push:
	@docker push ${NAME}

# Called by the CI/CD framework to install dependencies
install: kubectl-install gcloud-install
	@npm ci

# Called by the CI/CD framework to perform the build
script:
	@npm test
	@npm run build

# Called by the CI/CD framework after 'script' has run successfully
after_success: image login push deploy

