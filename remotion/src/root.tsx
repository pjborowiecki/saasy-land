import { Composition } from "remotion"

import { AppTour } from "./compositions/app-tour"
import { CostCurve } from "./compositions/cost-curve"
import { CoverageRun } from "./compositions/coverage-run"
import { LocaleFormat } from "./compositions/locale-format"
import { MergeGate } from "./compositions/merge-gate"
import { PageDesigner } from "./compositions/page-designer"
import { RecordAudit } from "./compositions/record-audit"
import { ScaffoldCli } from "./compositions/scaffold-cli"
import { BAND, BAND_DURATION, FPS, SURFACE, SURFACE_DURATION, TERMINAL, TERMINAL_DURATION } from "./theme"

/**
 * Five loops, rendered to video and embedded on the landing page.
 *
 * Four of them are 10:3 bands that sit at the head of the four cells in "The line"; the fifth
 * fills the terminal card in "Quality control". Every one is drawn on the page's own `--card`
 * colour so the video edge is invisible, and every one begins and ends on that flat colour so
 * the `loop` attribute has no seam to show.
 */
export const RemotionRoot: React.FC = () =>
  (
    <>
      <Composition
        component={AppTour}
        durationInFrames={SURFACE_DURATION}
        fps={FPS}
        height={SURFACE.height}
        id="app-tour"
        width={SURFACE.width}
      />
      <Composition
        component={CostCurve}
        durationInFrames={BAND_DURATION}
        fps={FPS}
        height={BAND.height}
        id="cost-curve"
        width={BAND.width}
      />
      <Composition
        component={MergeGate}
        durationInFrames={BAND_DURATION}
        fps={FPS}
        height={BAND.height}
        id="merge-gate"
        width={BAND.width}
      />
      <Composition
        component={LocaleFormat}
        durationInFrames={BAND_DURATION}
        fps={FPS}
        height={BAND.height}
        id="locale-format"
        width={BAND.width}
      />
      <Composition
        component={ScaffoldCli}
        durationInFrames={BAND_DURATION}
        fps={FPS}
        height={BAND.height}
        id="scaffold-cli"
        width={BAND.width}
      />
      <Composition
        component={PageDesigner}
        durationInFrames={SURFACE_DURATION}
        fps={FPS}
        height={SURFACE.height}
        id="page-designer"
        width={SURFACE.width}
      />
      <Composition component={RecordAudit} durationInFrames={8 * FPS} fps={FPS} height={BAND.height} id="record-audit" width={BAND.width} />
      <Composition
        component={CoverageRun}
        durationInFrames={TERMINAL_DURATION}
        fps={FPS}
        height={TERMINAL.height}
        id="coverage-run"
        width={TERMINAL.width}
      />
    </>
  )
