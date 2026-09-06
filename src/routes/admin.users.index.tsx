import { createFileRoute, redirect } from "@tanstack/react-router"
export const Route = createFileRoute("/admin/users/")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/users/all" })
  },
})
