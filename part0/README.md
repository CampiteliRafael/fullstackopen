# Part 0

## 0.4: New note

```mermaid
sequenceDiagram
    participant browser
    participant server

    Note over browser: User enters a note and clicks Save
    browser->>server: POST /exampleapp/new_note (note content)
    activate server
    Note over server: Server saves the note
    server-->>browser: 302 Redirect to /exampleapp/notes
    deactivate server

    browser->>server: GET /exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET /exampleapp/main.css
    activate server
    server-->>browser: CSS file
    deactivate server

    browser->>server: GET /exampleapp/main.js
    activate server
    server-->>browser: JavaScript file
    deactivate server

    Note right of browser: Browser executes main.js and requests the notes
    browser->>server: GET /exampleapp/data.json
    activate server
    server-->>browser: Notes as JSON, including the new note
    deactivate server

    Note over browser: Browser renders the notes
```

## 0.5: Single page app

```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: GET /exampleapp/spa
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET /exampleapp/main.css
    activate server
    server-->>browser: CSS file
    deactivate server

    browser->>server: GET /exampleapp/spa.js
    activate server
    server-->>browser: JavaScript file
    deactivate server

    Note right of browser: Browser executes spa.js and requests the notes
    browser->>server: GET /exampleapp/data.json
    activate server
    server-->>browser: Notes as JSON
    deactivate server

    Note over browser: JavaScript renders the notes without reloading the page
```

## 0.6: New note in the single page app

```mermaid
sequenceDiagram
    participant browser
    participant server

    Note over browser: User enters a note and clicks Save
    Note right of browser: JavaScript prevents the default form submission
    Note right of browser: JavaScript creates the note and renders it on the page

    browser->>server: POST /exampleapp/new_note_spa (note as JSON)
    activate server
    Note over server: Server saves the note
    server-->>browser: 201 Created
    deactivate server

    Note over browser: Page remains loaded; no redirect or new GET request
```
