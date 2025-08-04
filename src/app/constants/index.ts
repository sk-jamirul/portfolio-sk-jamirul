import {
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { IconType } from "react-icons/lib";
export const socials = [
  "facebook",
  "youtube",
  "twitter",
  "linkedin",
  "whatsApp",
] as const;
type SocialNames = (typeof socials)[number];
type SocialUrlType = { name: SocialNames; icon: IconType; tailwind: string };
export const socialsUrl: SocialUrlType[] = [
  {
    name: "facebook",
    icon: FaFacebook,
    tailwind: "text-blue-600",
  },
  {
    name: "twitter",
    icon: FaTwitter,
    tailwind: "text-sky-500",
  },
  {
    name: "youtube",
    icon: FaYoutube,
    tailwind: "text-red-600",
  },
  {
    name: "whatsApp",
    icon: FaWhatsapp,
    tailwind: "text-emerald-600",
  },
  {
    name: "linkedin",
    icon: FaLinkedin,
    tailwind: "text-blue-500",
  },
];
