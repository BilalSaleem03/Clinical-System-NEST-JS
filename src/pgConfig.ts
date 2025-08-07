
import * as dotenv from 'dotenv'
dotenv.config()
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js'
// console.log(process.env.POSTGRE_URL)
export const pgConfig = (): PostgresConnectionOptions =>({
    type:'postgres',
    url:process.env.POSTGRE_URL,
    port:5432,
    entities:[__dirname+'/**/*.entity{.ts,.js}'],
    ssl:true,
    synchronize:true,
})