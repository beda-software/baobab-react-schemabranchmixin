Examples for baobab react schemabranchmixin

Project structure:
- assets - Static and generated files
- server - Node lightweight server
- client - JS and Styles

Client structure:
```
+-- js/
   +-- routes/                      — Routing
   |   +-- containers/              — Inner page router
   |   |   +-- counter/
   |   |   |   +-- index.js         — Counter component
   |   |   |   +-- route.js         — Counter routes
   |   |   +-- greet/
   |   |       +-- index.js         — Greet component
   |   |       +-- route.js         — Greet routes
   |   +-- index.js                 — Root routing component
   |   +-- route.js                 — Root routes
   +-- tree.js                      — Initial Baobab tree
   +-- index.js                     — App component
+-- index.js                        — Entry point
```
