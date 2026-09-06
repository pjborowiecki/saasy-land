import "@tanstack/react-start/server-only"

import { AppError, ERROR_CODES } from "~/src/modules/_core/constants/errors"

import { APP_URL } from "~/src/presentation/branding"

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "[::1]"])
const APP_HOSTNAME = new URL(APP_URL).hostname
const WORKER_HOST_SUFFIX = ".pjborowiecki.workers.dev"

export const newsletterRequestOrigin = (request: Request): string => {
  const url = new URL(request.url)
  const isLocal = LOCAL_HOSTNAMES.has(url.hostname)
  const isDeployment =
    url.hostname === APP_HOSTNAME || url.hostname.endsWith(`.${APP_HOSTNAME}`) || url.hostname.endsWith(WORKER_HOST_SUFFIX)
  const isSecure = url.protocol === "https:" || (isLocal && url.protocol === "http:")

  if ((!isLocal && !isDeployment) || !isSecure) {
    throw new AppError(ERROR_CODES.FORBIDDEN)
  }

  return url.origin
}
