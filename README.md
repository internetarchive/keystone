# Keystone

## About

Keystone is a web client for the [ARCH (Archives Research Compute Hub)](https://github.com/internetarchive/arch) job server.

### Run Keystone & ARCH using Docker

Note that the following features are only available in the hosted version at: https://arch.archive-it.org

- Google Colab integration
- Dataset publication to archive.org

#### Prerequisites

- [GNU Make](https://www.gnu.org/software/make/manual/make.html)
- [Docker](https://www.docker.com/)

#### Build and Run the Docker Image

##### 1. Build the images
```
make build-images
```

##### 2. Run the services
```
docker compose up
```

##### 3. Surf on over to [http://localhost:12342](http://localhost:12342)

##### 4. Log in

Log in as one of the three user types that `dev/entrypoint.py` created for you:

- **Superuser**: username: `system` password: `password`
- **Admin**: username: `admin` password: `password`
- **Normal**: username: `test` password: `password`

#### The "arch-shared" Directory

The `build-images` Make target will create a local `arch-shared` subdirectory that will be mounted
within both the running Keystone and ARCH containers to serve as the storage destination for ARCH outputs,
and as a place to add your own custom collections of WARCs for analysis.

The `arch-shared` directory has the structure:

```
arch-shared/
├── in
│   └── collections
├── log
└── out
    ├── custom-collections
    └── datasets
```

These subdirectories are utilized as follows:
- `log`
  - ARCH job logs
- `out/custom-collections`
  - ARCH Custom Collection output files
- `out/datasets`
  - ARCH Dataset output files
- `in/collections`
  - A place to make your own WARCs available to ARCH as inputs - see "Analyze Your WARCs" below

##### Analyze Your WARCs

For each group of WARCs that you'd like to analyze as a collection:

1. Create a new subdirectory within `arch-shared/in/collections` with a descriptive kebab-case style name like `my-test-collection` and copy your `*.warc.gz` into it, e.g.
```
arch-shared/
└── in
    └── collections
        └── my-test-collection
            └── ARCHIVEIT-22994-CRAWL_SELECTED_SEEDS-JOB1965703-SEED3267421-h3.warc.gz
```

2. Restart both the Keystone and ARCH containers

```
docker compose restart keystone arch
```

3. Your new collection will now be visibile in Keystone (e.g. as `My Test Collection`)
