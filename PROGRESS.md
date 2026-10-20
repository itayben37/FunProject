# Progress

What is done so far in the backend (`backend/src`). The plan is in `Desription.md`.

## Done

**Assignment engine (`core/`)**
- `main.ts`: pairs interceptors with targets for the lowest total cost. Targets nobody can reach are reported as unpaired.
- `quadtree.ts` / `quad.ts`: spatial index, used to skip interceptors that are far from a target.
- `hungarian.algo.ts`: Hungarian algorithm (optimal matching).
- `cost.ts`: cost of one pair (catch time, price, battery use, miss chance).
- `catch.time.ts`: earliest moment an interceptor can reach a target (launch delay, acceleration, radius, battery reserve).
- `threat.score.ts` (in `modules/target`): threat score from danger, asset importance, speed and time to impact.

**Domain model**
- `Interceptor` (with `Battery`, `pk`, `launchDelay`) and `Target`.
- `Drone extends Interceptor`, `TargetDrone extends Target`, so both go straight into the engine.
- `Vector3`, plus `Vector3Data` (plain `{x, y, z}`) with `fromData()` / `toData()` for request bodies and DB columns.

**REST API (Express, TypeORM, Postgres in Docker)**
- `POST /api/roles/create`
- `POST /api/drones/save` (`battery` is `{ level, secondsPerPercent }`, plus `pk` and `launchDelay`)
- `POST /api/target-drones/create` (`acceleration` is optional)
- `GET /api/target-drones/:id` (reads the id from the URL, returns 200)
- `POST /api/assignments` with `{ maxTime, assetImportancy, maxCost? }`. Loads all drones and targets, runs the engine, returns `pairs`, `unpairedTargetIds` and `totalCost`.

**Architecture**
- Controller, service, repository, mapper per module, wired in `container.ts`.
- General `InterceptorService` and `TargetService` collect the type-specific services (`InterceptorProvider` / `TargetProvider`). A new interceptor or target type is one more entry in `container.ts`.

## Not done yet

- Not tested against the real database (new Drone / TargetDrone columns have placeholder defaults).
- Unused stubs: `ifInOperationalRadius` in `drone.service.ts`, `ifMakeIt` in `drone.interceptor.ts`.
- Roles have no login or access control (`admin.ts` and `user.ts` are empty).
- No tests (Jest), ESLint / Prettier, or CI.
- Planned but not started: frontend and map, WebSockets / live telemetry, Strategy and Observer patterns, PostGIS queries, backend in Docker Compose.
