import { MutationObserver, type MutationOptions, QueryClient } from "@tanstack/react-query"

export const executeMutation = <TData, TVariables>(
  options: MutationOptions<TData, Error, TVariables>,
  variables: TVariables,
): Promise<TData> => {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  return new MutationObserver(client, options).mutate(variables)
}

export const executeQuery: QueryClient["query"] = (options) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return client.query(options)
}
