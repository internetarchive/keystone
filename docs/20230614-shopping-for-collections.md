# Shopping for Collections

Fetch AIT collection size from partner API (requires system user):
https://partner.archive-it.org/api/crawl_job?__group=collection&__sum=warc_content_bytes&exclude__type__in=TEST,TEST_DELETED,TEST_EXPIRED&limit=1&collection=194

Collection 94 lists 35 TB with the partner API query above, but I get 27 TB when summing warc_file.

