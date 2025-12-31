import { SchoolLevel } from "@prisma/client";
import { Dice1, Dice2, Dice3 } from "lucide-react";

export const schoolLevelsArray = [
  {
    value: SchoolLevel.ELEMENTARY,
    url: "/elementary",
    label: "Elementary",
    icon: Dice1,
  },
  {
    value: SchoolLevel.MIDDLE,
    url: "/middle",
    label: "Middle",
    icon: Dice2,
  },
  {
    value: SchoolLevel.HIGH,
    url: "/high",
    label: "High",
    icon: Dice3,
  },
];
