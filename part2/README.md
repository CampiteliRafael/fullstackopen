# Part 2

Each exercise group is a separate Vite application:

- `courseinfo` contains exercises 2.1–2.5.
- `phonebook` contains exercises 2.6–2.17 and a JSON Server backend.
- `countries` contains exercises 2.18–2.20.

Install dependencies in each application directory with `npm install`, then start its frontend with `npm run dev`.

For the phonebook, start the backend in a second terminal from `part2/phonebook` with `npm run server`.

The countries weather report uses OpenWeatherMap. Copy `.env.example` to `.env.local`, add your own API key, and restart the development server. The key is exposed to the browser by Vite, so use a key intended for client-side development and do not commit it.
