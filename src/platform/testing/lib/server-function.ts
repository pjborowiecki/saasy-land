import type { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { runWithStartContext } from "@tanstack/start-storage-context"

type Builder = ReturnType<typeof createServerFn>
interface ServerExecution {
  __executeServer: (options: unknown) => Promise<unknown>
}

const context = () => ({
  contextAfterGlobalMiddlewares: {},
  executedRequestMiddlewares: new Set(),
  getRouter: () => {
    throw new Error("This test exercises a server function, not route rendering")
  },
  handlerType: "serverFn" as const,
  request: getRequest(),
  startOptions: {},
})

/** Supply the compiler's RPC bridge while retaining TanStack's real validation and middleware pipeline. */
export const withTestRpc = (builder: Builder): Builder =>
  new Proxy(builder, {
    get(target, property, receiver) {
      const value: unknown = Reflect.get(target, property, receiver)
      if (typeof value !== "function") {
        return value
      }
      if (property === "handler") {
        return (handler: unknown) => {
          const rpc = (options: unknown) => runWithStartContext(context(), () => serverFunction.__executeServer(options))
          // TanStack adds this callable RPC method to the builder result at compilation.
          // oxlint-disable-next-line typescript/no-unsafe-type-assertion
          const serverFunction = Reflect.apply(value, target, [rpc, handler]) as ServerExecution & ((options: unknown) => Promise<unknown>)
          return Object.assign((options: unknown) => runWithStartContext(context(), () => serverFunction(options)), serverFunction)
        }
      }
      if (property === "validator" || property === "inputValidator" || property === "middleware") {
        // Builder methods preserve the original generic builder contract.
        // oxlint-disable-next-line typescript/no-unsafe-type-assertion
        return (...args: unknown[]) => withTestRpc(Reflect.apply(value, target, args) as Builder)
      }
      return value
    },
  })
