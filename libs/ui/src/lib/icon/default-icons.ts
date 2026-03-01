/**
 * Default icon set for @glint-ng/core internal components.
 *
 * Imports from the `lucide` peer dependency and converts using
 * the public `mapIcons()` + `lucideToSvg()` utilities — the same
 * API consumers use to register their own icons.
 */
import {
  X,
  Check,
  Plus,
  Minus,
  Search,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  ChevronsDown,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  ArrowLeftRight,
  CircleCheck,
  Info,
  TriangleAlert,
  CircleX,
  Star,
  Eye,
  EyeOff,
  GripVertical,
  Menu,
  ExternalLink,
  EllipsisVertical,
  Maximize,
  LayoutGrid,
  Calendar,
} from 'lucide';
import { mapIcons, lucideToSvg } from './map-icons';

/**
 * ~35 Lucide icons used by library components.
 *
 * Registered automatically via `provideGlintUI()`.
 * Users can override any of these by providing their own
 * `provideGlintIcons({ x: '<svg>...' })` at a lower injector level.
 */
export const GLINT_DEFAULT_ICONS: Record<string, string> = mapIcons(
  {
    x: X,
    check: Check,
    plus: Plus,
    minus: Minus,
    search: Search,
    pencil: Pencil,
    trash: Trash2,
    chevronDown: ChevronDown,
    chevronUp: ChevronUp,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    chevronsLeft: ChevronsLeft,
    chevronsRight: ChevronsRight,
    chevronsUp: ChevronsUp,
    chevronsDown: ChevronsDown,
    arrowUp: ArrowUp,
    arrowDown: ArrowDown,
    arrowLeft: ArrowLeft,
    arrowRight: ArrowRight,
    arrowUpDown: ArrowUpDown,
    arrowLeftRight: ArrowLeftRight,
    circleCheck: CircleCheck,
    info: Info,
    triangleAlert: TriangleAlert,
    circleX: CircleX,
    star: Star,
    eye: Eye,
    eyeOff: EyeOff,
    gripVertical: GripVertical,
    menu: Menu,
    externalLink: ExternalLink,
    ellipsisVertical: EllipsisVertical,
    maximize: Maximize,
    layoutGrid: LayoutGrid,
    calendar: Calendar,
  },
  lucideToSvg,
);
