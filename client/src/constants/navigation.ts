import {
  Home,
  Mic,
  History,
  Code2,
  MessageSquare,
  Settings,
} from "lucide-react";

export const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: Home,
  },
  {
    label: "New Interview",
    path: "/create-interview",
    icon: Mic,
  },
  {
    label: "Interview History",
    path: "/history",
    icon: History,
  },
  {
    label: "Coding Practice",
    path: "#",
    icon: Code2,
    disabled: true,
  },
  {
    label: "Behavioral",
    path: "#",
    icon: MessageSquare,
    disabled: true,
  },
  {
    label: "Settings",
    path: "#",
    icon: Settings,
    disabled: true,
  },
];