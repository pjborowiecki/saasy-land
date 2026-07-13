import type { JSX } from "react"

import { TabsContent } from "~/src/components/shadcn/tabs"

import { UsersAllUsersTabView } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/all-users/_components/users-all-users-tab-view"
import { getAdminUsers } from "~/src/app/[locale]/(admin)/admin/users/_lib/users-data"

export async function UsersAllUsersTab(): Promise<JSX.Element> {
  const users = await getAdminUsers()

  return (
    <TabsContent value="allUsers" className="flex min-h-0 flex-1 flex-col overflow-hidden outline-none">
      <UsersAllUsersTabView initialUsers={users} />
    </TabsContent>
  )
}
