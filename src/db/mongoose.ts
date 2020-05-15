import mongoose, { Connection } from 'mongoose';
import { sysLog } from '../utils/winston';

class Database {
    private db: Connection = mongoose.connection;
    private _provider: string = 'MongoDB';
    private _username: string | undefined = process.env.MONGODB_USER;
    private _password: string | undefined = process.env.MONGODB_PASSWORD;
    private _dbName: string | undefined = process.env.MONGODB_DBNAME;
    private options: Object = {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    };

    constructor() { }

    async init() {

        mongoose.Promise = global.Promise;

        const url = `mongodb+srv://${this._username}:${this._password}@cluster0-ltgs3.mongodb.net/${this._dbName}?retryWrites=true&w=majority`;

        this.db.on('connecting', () => {});

        this.db.on('error', (err: Error) => {
            sysLog.error(`Something went wrong trying to connect to the database: ${this._provider}: ` + err);
        });

        this.db.on('connected', () => {});

        this.db.once('open', () => {
            sysLog.info(`MongoDB - Connection open`);
        });

        this.db.on('reconnected', () => {
        });

        this.db.on('disconnected', () => {
            sysLog.error('MongoDB disconnected!');
        });

        await this.connect(url);

    }

    async connect(url: string) {
        await mongoose.connect(url, this.options);
    }

}

export const database = new Database();