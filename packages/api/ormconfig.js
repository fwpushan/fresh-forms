module.exports = {
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  database: process.env.POSTGRES_DB || "webapi",
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD,
  synchronize: true,
  cli: {
    entitiesDir: "src/modules/database/entities"
  },
  entities: ["dist/modules/database/entities/*.entity{.ts,.js}"],
  logging: ["info", "error", "warning"],
};