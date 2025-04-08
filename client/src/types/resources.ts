export interface ResourceType {
  category: string;
  typeName: string;
  instancesCount: string;
  size: string;
  table: boolean;
  lastUpdated: string;
  status: "Active" | "Outdated" | "Draft";
  description?: string;
  version?: string;
  [key: string]: string | boolean | undefined;
}

export type ResourceCategory =
  | "Categorised"
  | "Custom"
  | "Populated"
  | "System"
  | "Failed validation";

export interface ResourceAction {
  id: string;
  name: string;
  handler: (resourceId: string) => void;
}
