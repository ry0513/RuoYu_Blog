type PickArr<T, K extends keyof T> = { [P in K]: T[P][] };

type RequestGet = { [key: string]: any };
