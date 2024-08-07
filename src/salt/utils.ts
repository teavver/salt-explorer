import { BuildOrderBlockId, FailureData } from "./types.js"
import { ENV, Env } from "../environment.js"

export const to_decimal = (str: string) => parseInt(str, 10)
export const jstr = (json: object) => JSON.stringify(json, null, 4)
export const halt_unexpected_err = (err: unknown): FailureData => {
    return { type: "error", reason: `Unexpected error occurred. Err: ${(err as Error).message}` }
}
export const gen_map_id = (line_idx: number, block_id: BuildOrderBlockId) => `${line_idx}${block_id}`

export function is_err(data: unknown): data is FailureData {
    if (typeof data !== "object" || data === null) return false
    return "reason" in data && "type" in data &&
        (data as any).type === "warning" || (data as any).type === "error"
}

export const format_err = (err: unknown) => {
    console.log("======")
    if (err instanceof Error) {
        console.error(err.name, err.message)
        err.stack && console.error(err.stack)
    } else {
        console.error(err)
    }
    console.log("======")
}

export const create_logger = (module: string, debug?: true) => {
    return (msg: string, special?: "warn" | "error") => {
        if (debug && +ENV !== Env.DEBUG) return
        if (!special) {
            console.log(`[${module}]: ${msg}`)
        } else {
            if (special === "warn") {
                console.warn(`[${module}]: ${msg}`)
            }
            if (special === "error") {
                console.error(`[${module}]: ${msg}`)
            }
        }
    }
}

export const salt_symbol_from_val = <K, V>(m: Map<K, V>, v: V) => find_map_value(m, (x) => x === v)
export const find_map_value = <K, V>(m: Map<K, V>, predicate: (v: V) => boolean): [K, V] | null => {
    for (const [k, v] of m) {
        if (predicate(v)) {
            return [k, v]
        }
    }
    return null
}