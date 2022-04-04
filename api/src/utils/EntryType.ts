/**
 * Custom type for objects before entry into MongoDB
 */
export type EntryType<T> = Omit<T, "_id" | "entryTime">;
