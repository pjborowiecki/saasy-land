import type { JSX } from "react"

import { CreateCourseCurriculum } from "~/src/app/[locale]/(admin)/admin/courses/create/_components/create-course-curriculum"
import { CreateCourseGeneralSection } from "~/src/app/[locale]/(admin)/admin/courses/create/_components/create-course-general-section"
import { CreateCourseMediaSection } from "~/src/app/[locale]/(admin)/admin/courses/create/_components/create-course-media-section"
import { CreateCourseOrganizationSection } from "~/src/app/[locale]/(admin)/admin/courses/create/_components/create-course-organization-section"
import { CreateCoursePricingSection } from "~/src/app/[locale]/(admin)/admin/courses/create/_components/create-course-pricing-section"
import { CreateCourseStatusSection } from "~/src/app/[locale]/(admin)/admin/courses/create/_components/create-course-status-section"

export function CreateCourseForm(): JSX.Element {
  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
      <div className="space-y-6 lg:col-span-2">
        <CreateCourseGeneralSection />
        <CreateCourseCurriculum />
        <CreateCoursePricingSection />
      </div>

      <div className="space-y-6 lg:col-span-1">
        <CreateCourseStatusSection />
        <CreateCourseMediaSection />
        <CreateCourseOrganizationSection />
      </div>
    </div>
  )
}
