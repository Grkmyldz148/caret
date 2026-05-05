/**
 * @caret/registry — top-level barrel
 *
 *   import {
 *     caret,
 *     prompt, error, spinner,
 *     list, keyValue, banner, progress, step, table,
 *     tree, diff, link,
 *     info, success, warning,
 *     splash, logo, typewriter, reveal, boot,
 *     defaultTheme, useTheme, ThemeProvider, setTheme,
 *     type Theme, type PartialTheme,
 *   } from '@caret/registry'
 */

// === The caret namespace utility ===
export { caret } from './caret.js'

// === Components ===
export {
  prompt,
  CaretCancelled,
  error,
  spinner,
  list,
  keyValue,
  banner,
  progress,
  step,
  table,
  tree,
  diff,
  link,
  info,
  success,
  warning,
  splash,
  logo,
  typewriter,
  reveal,
  boot,
  divider,
  kbd,
  badge,
  paragraph,
  code,
  quote,
  clear,
  form,
  modal,
  toast,
  codeBlock,
  alert,
  checklist,
  sparkline,
  statusLine,
  breadcrumb,
  space,
  timestamp,
  timeAgo,
  debug,
  log,
  columns,
  pager,
  search,
  // Layout & containers
  panel,
  splitPane,
  scrollable,
  // Interactive controls
  tabs,
  toggle,
  accordion,
  slider,
  filePicker,
  commandPalette,
  contextMenu,
  virtualizedList,
  // Data display
  jsonViewer,
  snippet,
  calendar,
  heatmap,
  avatar,
  // Long-form / structured content
  chat,
  help,
  markdown,
  stats,
  timeline,
  // Visualisations
  brailleChart,
  waveform,
  gauge,
  radar,
  flamegraph,
  qrcode,
  dashboard,
  // Animations / effects
  smartTypewriter,
  brailleTransition,
  morph,
  gradient,
  countdown,
  skeleton,
  confetti,
  fireworks,
  celebrate,
  matrix,
  particles,
  gameOfLife,
} from './components/index.js'

// === Component option types ===
export type {
  PromptTextOptions,
  PromptPasswordOptions,
  PromptConfirmOptions,
  PromptSelectOptions,
  PromptMultiSelectOptions,
  PromptNumberOptions,
  PromptAutocompleteOptions,
  PromptEditorOptions,
  ErrorOptions,
  SpinnerOptions,
  SpinnerCallbackApi,
  SpinnerHandle,
  ListOptions,
  ListItem,
  ListVariant,
  KeyValueOptions,
  KeyValueRow,
  BannerOptions,
  ProgressOptions,
  StepOptions,
  Step,
  StepStatus,
  TableOptions,
  TableColumn,
  TableAlign,
  TreeOptions,
  TreeNode,
  DiffOptions,
  DiffLine,
  DiffKind,
  LinkInput,
  MessageOptions,
  SplashOptions,
  LogoOptions,
  TypewriterOptions,
  RevealOptions,
  BootOptions,
  BootStep,
  BootStepStatus,
  DividerOptions,
  KbdOptions,
  BadgeOptions,
  BadgeColor,
  ParagraphOptions,
  CodeOptions,
  QuoteOptions,
  QuoteColor,
  FormOptions,
  FormField,
  FormFieldType,
  FormSelectOption,
  FormResult,
  ModalOptions,
  ModalAction,
  ToastOptions,
  ToastKind,
  CodeBlockOptions,
  AlertOptions,
  AlertKind,
  ChecklistOptions,
  ChecklistItem,
  SparklineOptions,
  StatusLineOptions,
  StatusLineItem,
  StatusLineStatus,
  BreadcrumbOptions,
  TimestampOptions,
  TimeAgoOptions,
  TimestampFormat,
  LogOptions,
  LogBatchOptions,
  LogEntry,
  LogLevel,
  ColumnsOptions,
  ColumnItem,
  PagerOptions,
  SearchOptions,
  SearchItem,
  // Layout & container types
  PanelOptions,
  SplitPaneOptions,
  PaneContent,
  ScrollableOptions,
  // Interactive control types
  TabsOptions,
  TabItem,
  ToggleOptions,
  AccordionOptions,
  AccordionSection,
  SliderOptions,
  FilePickerOptions,
  CommandPaletteOptions,
  Command,
  ContextMenuOptions,
  ContextMenuItem,
  VirtualizedListOptions,
  VirtualizedItem,
  // Data display types
  JsonViewerOptions,
  SnippetOptions,
  CalendarOptions,
  GridHeatmapOptions,
  AvatarOptions,
  AvatarColor,
} from './components/index.js'

// === Theme ===
export {
  defaultTheme,
  mergeTheme,
  setTheme,
  getTheme,
  resetTheme,
  ThemeProvider,
  useTheme,
} from './theme/index.js'

export type {
  Theme,
  PartialTheme,
  ColorPalette,
  SemanticColor,
  AnsiColor,
  FgAttribute,
  MotionTokens,
  SymbolSet,
  SpacingScale,
  TypographyScale,
  ThemeProviderProps,
} from './theme/index.js'

// === Motion utilities ===
export { sleep, frameLoop, easing } from './lib/motion.js'
export type { EasingFn } from './lib/motion.js'

// === Typography utilities ===
export {
  tracking,
  trackingLength,
  dottedLeader,
  leaderAt,
} from './lib/typography.js'
export type { DottedLeaderOptions } from './lib/typography.js'

// === Text → ASCII art ===
export { textToArt } from './lib/text-to-art.js'
export type { TextToArtOptions } from './lib/text-to-art.js'

// === Image → ASCII / truecolor blocks ===
export { imageToArt } from './lib/image-to-art.js'
export type { ImageToArtOptions, ImageToArtMode } from './lib/image-to-art.js'

// === Splash logo input type ===
export type { SplashLogoText, LogoArtOptions, LogoTextOptions } from './components/index.js'
