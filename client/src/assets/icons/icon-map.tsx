import React from "react";
import ResourcesIcon from "./svg/folder-open.svg";
import NotebooksIcon from "./svg/book.svg";
import ApiIcon from "./svg/code.svg";
import DatabaseIcon from "./svg/database.svg";
import IamIcon from "./svg/user-shield.svg";
import FarIcon from "./svg/tasks.svg";
import PluginsIcon from "./svg/puzzle-piece.svg";
import SearchIcon from "./svg/search.svg";
import PinIcon from "./svg/thumbtack.svg";
import PinFilledIcon from "./svg/thumbtack-filled.svg";
import ClockIcon from "./svg/clock.svg";
import LogoIcon from "./svg/logo.svg";
import MenuIcon from "./svg/menu.svg";
import CloseMenuIcon from "./svg/close-menu.svg";
import LayerGroupIcon from "./svg/layer-group.svg";
import GettingStartedIcon from "./svg/gettingstarted.svg";
import UserIcon from "./svg/user-shield.svg";
import ProfileIcon from "./svg/profile.svg";
import ConsoleIcon from "./svg/console.svg";

// Константы имен иконок
export const ICON_RESOURCES = "icon-resources";
export const ICON_NOTEBOOKS = "icon-notebooks";
export const ICON_API = "icon-api";
export const ICON_DATABASE = "icon-database";
export const ICON_IAM = "icon-iam";
export const ICON_FAR = "icon-far";
export const ICON_PLUGINS = "icon-plugins";
export const ICON_SEARCH = "icon-search";
export const ICON_PIN = "icon-pin";
export const ICON_PIN_FILLED = "icon-pin-filled";
export const ICON_CLOCK = "icon-clock";
export const ICON_LAYER_GROUP = "icon-layer-group";
export const ICON_LOGO = "icon-logo";
export const ICON_MENU = "icon-menu";
export const ICON_CLOSE_MENU = "icon-close-menu";
export const ICON_GETTING_STARTED = "icon-getting-started";
export const ICON_USER = "icon-user";
export const ICON_PROFILE = "icon-profile";
export const ICON_CONSOLE = "icon-console";

// Карта соответствия имен иконок и компонентов React
export const ICON_MAP: Record<string, any> = {
  [ICON_RESOURCES]: ResourcesIcon,
  [ICON_NOTEBOOKS]: NotebooksIcon,
  [ICON_API]: ApiIcon,
  [ICON_DATABASE]: DatabaseIcon,
  [ICON_IAM]: IamIcon,
  [ICON_FAR]: FarIcon,
  [ICON_PLUGINS]: PluginsIcon,
  [ICON_SEARCH]: SearchIcon,
  [ICON_PIN]: PinIcon,
  [ICON_PIN_FILLED]: PinFilledIcon,
  [ICON_CLOCK]: ClockIcon,
  [ICON_LAYER_GROUP]: LayerGroupIcon,
  [ICON_LOGO]: LogoIcon,
  [ICON_MENU]: MenuIcon,
  [ICON_CLOSE_MENU]: CloseMenuIcon,
  [ICON_GETTING_STARTED]: GettingStartedIcon,
  [ICON_USER]: UserIcon,
  [ICON_PROFILE]: ProfileIcon,
  [ICON_CONSOLE]: ConsoleIcon,
};
