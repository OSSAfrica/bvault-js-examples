# bvault-js Examples

This repository contains simple example implementations demonstrating the usage of the bvault-js package in a basic management application.

## Examples

### example-without-encryption
A basic management app without any encryption.

### example-with-encryption-(manual)
A management app using bvault-js with manual key management. Encryption and decryption are handled manually, including managing salt and IV keys.

### example-with-encryption-(auto)
A management app using bvault-js with automatic encryption and key management. The package handles encryption, decryption, and key management (salt and IV) automatically.

## Getting Started

Each example is a separate directory with its own setup. Navigate to the desired example directory and follow the standard React/Vite setup:

```bash
cd <example-directory>
npm install
npm run dev
```

## License

See LICENSE file for details.