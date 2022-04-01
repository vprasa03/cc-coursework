export type CreationType<T> = Omit<T, "_id" | "createTime">;
