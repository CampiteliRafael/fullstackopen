# Part 2

Each exercise group is a separate Vite application:

- `part2.1-2.5` contains the course information exercises.
- `part2.6-2.17` contains the phonebook exercises and a JSON Server backend.
- `part2.18-2.20` contains the countries exercises.

Install dependencies in each exercise directory with `npm install`, then start its frontend with `npm run dev`.

For the phonebook, start the backend in a second terminal from `part2/part2.6-2.17` with `npm run server`.

The countries weather report uses OpenWeatherMap. In `part2.18-2.20`, copy `.env.example` to `.env.local`, add your own API key, and restart the development server. The key is exposed to the browser by Vite, so use a key intended for client-side development and do not commit it.
