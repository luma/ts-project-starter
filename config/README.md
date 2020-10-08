# Config assets

This directory contains private keys, certs, and other config assets that a real system needs.

You should generate your own keys/certs for non-local dev use. These ones were generated using the following command:

``` bash
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout localhost-privkey.pem -out localhost-cert.pem
```

For non-local dev use you could look at using something like [Lets Encrypt](https://letsencrypt.org/) to make your life easier.
