/**
 * Caret components — barrel export
 *
 *   import {
 *     prompt, error, spinner,
 *     list, keyValue, banner, progress, step, table,
 *     tree, diff, link,
 *     info, success, warning,
 *     splash, logo, typewriter, reveal, boot,
 *   } from '@caret/registry/components'
 */

// Interactive
export { prompt, CaretCancelled } from './prompt/index.js'
export { spinner } from './spinner.js'

// Display
export { error } from './error.js'
export { list } from './list.js'
export { keyValue } from './key-value.js'
export { banner } from './banner.js'
export { progress } from './progress.js'
export { step } from './step.js'
export { table } from './table.js'
export { tree } from './tree.js'
export { diff } from './diff.js'
export { link } from './link.js'

// Single-line messages
export { info, success, warning, debug } from './message.js'

// Opening / animation
export { splash } from './splash.js'
export { logo } from './logo.js'
export { typewriter } from './typewriter.js'
export { reveal } from './reveal.js'
export { boot } from './boot.js'

// Mini utilities
export { divider } from './divider.js'
export { kbd } from './kbd.js'
export { badge } from './badge.js'
export { paragraph } from './paragraph.js'
export { code } from './code.js'
export { quote } from './quote.js'
export { clear } from './clear.js'

// Big interactive / display
export { form } from './form.js'
export { modal } from './modal.js'
export { toast } from './toast.js'
export { codeBlock } from './code-block.js'

// Additional static elements
export { alert } from './alert.js'
export { checklist } from './checklist.js'
export { sparkline } from './sparkline.js'
export { statusLine } from './status-line.js'
export { breadcrumb } from './breadcrumb.js'
export { space } from './space.js'
export { timestamp, timeAgo } from './time.js'
export { chat } from './chat.js'
export { help } from './help.js'
export { markdown } from './markdown.js'
export { stats } from './stats.js'
export { timeline } from './timeline.js'

// Creative / visual effects
export { brailleChart } from './braille-chart.js'
export { skeleton } from './skeleton.js'
export { gradient } from './gradient.js'
export { brailleTransition } from './braille-transition.js'
export { morph } from './morph.js'
export { smartTypewriter } from './smart-typewriter.js'

// Celebration effects
export { confetti } from './confetti.js'
export { fireworks } from './fireworks.js'
export { celebrate } from './celebrate.js'

// Visual effects / animations
export { matrix } from './matrix.js'
export { particles } from './particles.js'
export { gameOfLife } from './game-of-life.js'

// Data visualization
export { gauge } from './gauge.js'
export { radar } from './radar.js'
export { waveform } from './waveform.js'
export { flamegraph } from './flamegraph.js'

// Utility
export { qrcode } from './qrcode.js'
export { countdown } from './countdown.js'
export { dashboard } from './dashboard.js'

// New core components
export { log } from './log.js'
export { columns } from './columns.js'
export { pager } from './pager.js'
export { search } from './search.js'

// Layout & containers
export { panel } from './panel.js'
export { splitPane } from './split-pane.js'
export { scrollable } from './scrollable.js'

// Interactive controls
export { tabs } from './tabs.js'
export { toggle } from './toggle.js'
export { accordion } from './accordion.js'
export { slider } from './slider.js'
export { filePicker } from './file-picker.js'
export { commandPalette } from './command-palette.js'
export { contextMenu } from './context-menu.js'
export { virtualizedList } from './virtualized-list.js'

// Data display
export { jsonViewer } from './json-viewer.js'
export { snippet } from './snippet.js'
export { calendar } from './calendar.js'
export { heatmap } from './heatmap.js'
export { avatar } from './avatar.js'

// === Type exports ===

export type {
  PromptTextOptions,
  PromptPasswordOptions,
  PromptConfirmOptions,
  PromptSelectOptions,
  PromptMultiSelectOptions,
  PromptNumberOptions,
  PromptAutocompleteOptions,
  PromptEditorOptions,
} from './prompt/index.js'

export type { ErrorOptions } from './error.js'
export type { SpinnerOptions, SpinnerCallbackApi, SpinnerHandle } from './spinner.js'
export type { ListOptions, ListItem, ListVariant } from './list.js'
export type { KeyValueOptions, KeyValueRow } from './key-value.js'
export type { BannerOptions } from './banner.js'
export type { ProgressOptions } from './progress.js'
export type { StepOptions, Step, StepStatus } from './step.js'
export type { TableOptions, TableColumn, TableAlign } from './table.js'
export type { TreeOptions, TreeNode } from './tree.js'
export type { DiffOptions, DiffLine, DiffKind } from './diff.js'
export type { LinkInput } from './link.js'
export type { MessageOptions } from './message.js'
export type { SplashOptions, SplashLogoText } from './splash.js'
export type { LogoOptions, LogoArtOptions, LogoTextOptions } from './logo.js'
export type { TypewriterOptions } from './typewriter.js'
export type { RevealOptions } from './reveal.js'
export type { BootOptions, BootStep, BootStepStatus } from './boot.js'
export type { DividerOptions } from './divider.js'
export type { KbdOptions } from './kbd.js'
export type { BadgeOptions, BadgeColor } from './badge.js'
export type { ParagraphOptions } from './paragraph.js'
export type { CodeOptions } from './code.js'
export type { QuoteOptions, QuoteColor } from './quote.js'
export type {
  FormOptions,
  FormField,
  FormFieldType,
  FormSelectOption,
  FormResult,
} from './form.js'
export type { ModalOptions, ModalAction } from './modal.js'
export type { ToastOptions, ToastKind } from './toast.js'
export type { CodeBlockOptions } from './code-block.js'
export type { AlertOptions, AlertKind } from './alert.js'
export type { ChecklistOptions, ChecklistItem } from './checklist.js'
export type { SparklineOptions } from './sparkline.js'
export type { StatusLineOptions, StatusLineItem, StatusLineStatus } from './status-line.js'
export type { BreadcrumbOptions } from './breadcrumb.js'
export type { TimestampOptions, TimeAgoOptions, TimestampFormat } from './time.js'
export type { ChatOptions, ChatMessage, ChatRole } from './chat.js'
export type {
  HelpOptions,
  HelpCommand,
  HelpOption,
  HelpSection,
} from './help.js'
export type { MarkdownOptions } from './markdown.js'
export type { StatsOptions, StatItem, StatTrend } from './stats.js'
export type { TimelineOptions, TimelineEvent, TimelineEventKind } from './timeline.js'

// Creative / visual effects types
export type { BrailleChartOptions, HeatmapOptions, BarChartOptions } from './braille-chart.js'
export type { SkeletonOptions } from './skeleton.js'
export type { GradientOptions, GradientMode } from './gradient.js'
export type { BrailleTransitionOptions } from './braille-transition.js'
export type { MorphOptions } from './morph.js'
export type { SmartTypewriterOptions, SpeedProfile } from './smart-typewriter.js'
export type { ConfettiOptions } from './confetti.js'
export type { FireworksOptions } from './fireworks.js'
export type { CelebrateOptions } from './celebrate.js'
export type { MatrixOptions } from './matrix.js'
export type { ParticlesOptions } from './particles.js'
export type { GameOfLifeOptions } from './game-of-life.js'
export type { GaugeOptions } from './gauge.js'
export type { RadarOptions } from './radar.js'
export type { WaveformOptions } from './waveform.js'
export type { FlamegraphOptions, FlameStack } from './flamegraph.js'
export type { QRCodeOptions, QRCodeStyle } from './qrcode.js'
export type { CountdownOptions } from './countdown.js'
export type { DashboardOptions, DashboardCell } from './dashboard.js'

// New core component types
export type { LogOptions, LogBatchOptions, LogEntry, LogLevel } from './log.js'
export type { ColumnsOptions, ColumnItem } from './columns.js'
export type { PagerOptions } from './pager.js'
export type { SearchOptions, SearchItem } from './search.js'

// Layout & container types
export type { PanelOptions } from './panel.js'
export type { SplitPaneOptions, PaneContent } from './split-pane.js'
export type { ScrollableOptions } from './scrollable.js'

// Interactive control types
export type { TabsOptions, TabItem } from './tabs.js'
export type { ToggleOptions } from './toggle.js'
export type { AccordionOptions, AccordionSection } from './accordion.js'
export type { SliderOptions } from './slider.js'
export type { FilePickerOptions } from './file-picker.js'
export type { CommandPaletteOptions, Command } from './command-palette.js'
export type { ContextMenuOptions, ContextMenuItem } from './context-menu.js'
export type { VirtualizedListOptions, VirtualizedItem } from './virtualized-list.js'

// Data display types
export type { JsonViewerOptions } from './json-viewer.js'
export type { SnippetOptions } from './snippet.js'
export type { CalendarOptions } from './calendar.js'
export type { HeatmapOptions as GridHeatmapOptions } from './heatmap.js'
export type { AvatarOptions, AvatarColor } from './avatar.js'
