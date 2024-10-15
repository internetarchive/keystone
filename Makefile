# Read the current user's ID so that we can assign the same ID to "keystone" Docker user.
UID = $$(id -u)

# where's the Makefile running? Valid options: LOCAL, CI
ENV ?= LOCAL
PYTEST_REPORT ?= pytest.xml
PYLINT_REPORT ?= pylint.json
KEYSTONE_VENV_PATH ?= /opt/keystone/venv
PIP_PATH = $(KEYSTONE_VENV_PATH)/bin/pip

###############################################################################
# Setup and Install targets
###############################################################################

$(KEYSTONE_VENV_PATH):
	python3 -m venv $(KEYSTONE_VENV_PATH) --prompt .
	$(PIP_PATH) install -U pip setuptools wheel pip-tools

venv: $(KEYSTONE_VENV_PATH)

.PHONY: requirements.txt
requirements.txt: venv
	$(PIP_PATH)-compile \
	--output-file requirements.txt \
	--generate-hashes \
	--strip-extras \
	$(if $(upgrade_package), --upgrade-package $(upgrade_package)) \
	pyproject.toml

.PHONY: requirements-dev.txt
requirements-dev.txt: requirements.txt
	$(PIP_PATH)-compile \
	--constraint requirements.txt \
	--output-file requirements-dev.txt \
	--generate-hashes \
	--strip-extras \
	--extra dev \
	$(if $(upgrade_package), --upgrade-package $(upgrade_package)) \
	pyproject.toml

.PHONY: install-dev
install: venv
	$(PIP_PATH)-sync requirements-dev.txt
	$(PIP_PATH) install --no-deps -e .

.PHONY: install
install-prod:
	$(PIP_PATH)-sync requirements.txt
	$(PIP_PATH) install --no-deps -e .

###############################################################################
# Development targets
###############################################################################

.PHONY: test
test:
ifeq ($(ENV),LOCAL)
	@# pass extra params on to pytest: https://stackoverflow.com/a/6273809
	DJANGO_SETTINGS_MODULE=config.settings $(KEYSTONE_VENV_PATH)/bin/pytest $(filter-out $@,$(MAKECMDGOALS))
else ifeq ($(ENV),CI)
	DJANGO_SETTINGS_MODULE=config.settings \
	   $(KEYSTONE_VENV_PATH)/bin/pytest \
		--junit-xml=$(PYTEST_REPORT) \
		--cov=keystone \
		--cov=config \
		--cov-report=xml
endif

.PHONY: lint
lint:
ifeq ($(ENV),LOCAL)
	DJANGO_SETTINGS_MODULE=config.settings $(KEYSTONE_VENV_PATH)/bin/pylint keystone config
else ifeq ($(ENV),CI)
	DJANGO_SETTINGS_MODULE=config.settings \
		$(KEYSTONE_VENV_PATH)/bin/pylint keystone config \
		--output-format=pylint_gitlab.GitlabCodeClimateReporter \
		--reports=y > $(PYLINT_REPORT)
endif

.PHONY: format
format:
	$(KEYSTONE_VENV_PATH)/bin/black .

.PHONY: ck-format
ck-format:
	$(KEYSTONE_VENV_PATH)/bin/black --check .

###############################################################################
# Container targets
###############################################################################

.env:
	cp sample.env .env

arch-shared:
	mkdir -p arch-shared/in/collections;
	mkdir arch-shared/log;
	mkdir -p arch-shared/out/custom-collections;
	mkdir arch-shared/out/datasets;

dev/arch:
	git clone --branch=main git@github.com:internetarchive/arch dev/arch

.PHONY: build-images
build-images: .env dev/arch arch-shared
	docker compose build --build-arg UID=$(UID)
