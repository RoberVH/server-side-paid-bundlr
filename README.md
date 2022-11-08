# Server-side paid Bundlr loader

### NOTE: as of 0.9.0   @bundlr-network/client object remoteBundlr.createTransaction(fileData, { tags }) method
### upload returns directly data object so change line in bundlr.js method upload (see comment in file)
  

## Github for medium article: https://medium.com/@rovicher.eth/server-side-paid-uploads-to-arweave-through-bundlr-762788049496

## A NextJS app
It shows how to paid with a server account for Clients content uploads 

Thanks to Jesse from Bundlr Discord (here at https://discord.gg/7PuzaDPR) for helping with server side uploading code

In a nutshell, this app allow to initiate a remote bundlr object at server and upload files from the client without client having to paid. 
A mechanism to filter which users could have their content paid for should be added to this basic code.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## To run it

Clone project, do npm install, and add your own keys to a .env.local file,
An .env.local.exampe file is provided as a model, then run the development server

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Bundlr Links

The Website [https://bundlr.network/](https://bundlr.network/)
The Docs [https://docs.bundlr.network/docs/overview](https://docs.bundlr.network/docs/overview)