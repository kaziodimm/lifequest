import {
  Accessibility, Activity, Apple, Badge, Bed, BookOpen, Box, Brain, Briefcase, CalendarDays,
  ChartPie, CircleDot, Compass, Coins, Crown, Droplet, Eye, Filter, Footprints, Gem,
  GraduationCap, Hand, Hammer, Heart, Lightbulb, Lock, MapPin, MessageCircle, Moon,
  NotebookPen, Palette, Pencil, PiggyBank, Radio, Receipt, Rocket, Search, Send,
  Shield, Sparkles, Sprout, Star, Target, Timer, Trophy, Users
} from "lucide-react";

const glyphs = {
  accessibility: Accessibility,
  activity: Activity,
  apple: Apple,
  badge: Badge,
  bed: Bed,
  book: BookOpen,
  box: Box,
  brain: Brain,
  briefcase: Briefcase,
  calendar: CalendarDays,
  chart: ChartPie,
  compass: Compass,
  coins: Coins,
  crown: Crown,
  droplet: Droplet,
  eye: Eye,
  filter: Filter,
  footprints: Footprints,
  gem: Gem,
  "graduation-cap": GraduationCap,
  hand: Hand,
  hammer: Hammer,
  heart: Heart,
  lightbulb: Lightbulb,
  lock: Lock,
  "map-pin": MapPin,
  message: MessageCircle,
  moon: Moon,
  notebook: NotebookPen,
  palette: Palette,
  pencil: Pencil,
  "piggy-bank": PiggyBank,
  radio: Radio,
  receipt: Receipt,
  rocket: Rocket,
  search: Search,
  send: Send,
  shield: Shield,
  sparkles: Sparkles,
  sprout: Sprout,
  star: Star,
  target: Target,
  timer: Timer,
  trophy: Trophy,
  users: Users
} as const;

export function TechnologyGlyph({ icon, size = 25, className }: { icon?: string; size?: number; className?: string }) {
  const Icon = glyphs[icon as keyof typeof glyphs] ?? CircleDot;
  return <Icon aria-hidden="true" className={className} size={size} strokeWidth={1.85} />;
}
