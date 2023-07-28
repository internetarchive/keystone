PYTHON_VERSION = 3.11

# where's the Makefile running? Valid options: LOCAL, CI
ENV ?= LOCAL
PYTEST_REPORT ?= pytest.xml
PYLINT_REPORT ?= pylint.json

venv:
	python3 -m venv venv --prompt . && . \
	venv/bin/activate && \
	pip install -U pip setuptools wheel pip-tools

requirements.txt: venv
	venv/bin/pip install -U pip setuptools wheel pip-tools
	venv/bin/pip-compile \
	--generate-hashes \
	--output-file requirements.txt \
	--strip-extras \
	pyproject.toml

requirements-dev.txt: requirements.txt
	echo "--constraint $$(pwd)/requirements.txt" | \
	venv/bin/pip-compile \
	--generate-hashes \
	--output-file requirements-dev.txt \
	--strip-extras \
	--extra dev \
	- \
	pyproject.toml

.PHONY: install
install:
	venv/bin/pip-sync requirements-dev.txt
	venv/bin/pip install --no-deps -e .

.PHONY: install-prod
install-prod:
	venv/bin/pip-sync requirements.txt
	venv/bin/pip install --no-deps -e .

.PHONY: test
test:
ifeq ($(ENV),LOCAL)
	@# pass extra params on to pytest: https://stackoverflow.com/a/6273809
	DJANGO_SETTINGS_MODULE=config.settings venv/bin/pytest $(filter-out $@,$(MAKECMDGOALS))
else ifeq ($(ENV),CI)
	DJANGO_SETTINGS_MODULE=config.settings \
	   venv/bin/pytest \
		--junit-xml=$(PYTEST_REPORT) \
		--cov=keystone \
		--cov=config \
		--cov-report=xml
endif

.PHONY: lint
lint:
ifeq ($(ENV),LOCAL)
	DJANGO_SETTINGS_MODULE=config.settings venv/bin/pylint keystone config
else ifeq ($(ENV),CI)
	DJANGO_SETTINGS_MODULE=config.settings \
		venv/bin/pylint keystone config \
		--output-format=pylint_gitlab.GitlabCodeClimateReporter \
		--reports=y > $(PYLINT_REPORT)
endif

.PHONY: format
format:
	venv/bin/black .

.PHONY: ck-format
ck-format:
	venv/bin/black --check .

.PHONY: run-prod-containers
run-prod-containers:
	# add BUILDKIT_PROGRESS=plain in front for debugging build issues
	docker-compose -f docker-compose.prod.yml up -d --build
