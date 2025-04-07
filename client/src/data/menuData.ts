import { Category, MenuItem } from "../types/menu";

// Categories
export const categories: Category[] = [
  { id: "resources", name: "Resources", icon: "folder-open", order: 1 },
  { id: "notebooks", name: "Notebooks", icon: "book", order: 2 },
  { id: "api", name: "API", icon: "code", order: 3 },
  { id: "database", name: "Database", icon: "database", order: 4 },
  { id: "iam", name: "IAM", icon: "user-shield", order: 5 },
  { id: "far", name: "FAR", icon: "tasks", order: 6 },
  { id: "plugins", name: "Plugins & Modules", icon: "puzzle-piece", order: 7 },
];

// Menu Items
export const menuItems: MenuItem[] = [
  // Resources
  { id: "resources-parent", name: "Resources", icon: "folder-open", category: "resources", important: true, isParent: true },
  { id: "patient", name: "Patient", icon: "user-injured", category: "resources", important: true, parentId: "resources-parent" },
  { id: "observation", name: "Observation", icon: "notes-medical", category: "resources", important: false, parentId: "resources-parent" },
  { id: "medicationRequest", name: "MedicationRequest", icon: "prescription", category: "resources", important: false, parentId: "resources-parent" },
  { id: "encounter", name: "Encounter", icon: "clipboard-list", category: "resources", important: true, parentId: "resources-parent" },
  { id: "condition", name: "Condition", icon: "heartbeat", category: "resources", important: false, parentId: "resources-parent" },
  { id: "diagnosticReport", name: "DiagnosticReport", icon: "file-medical-alt", category: "resources", important: false, parentId: "resources-parent" },
  { id: "allergyIntolerance", name: "AllergyIntolerance", icon: "allergies", category: "resources", important: false, parentId: "resources-parent" },
  { id: "carePlan", name: "CarePlan", icon: "clipboard-check", category: "resources", important: false, parentId: "resources-parent" },
  { id: "appointment", name: "Appointment", icon: "calendar-check", category: "resources", important: false, parentId: "resources-parent" },
  { id: "immunization", name: "Immunization", icon: "syringe", category: "resources", important: false, parentId: "resources-parent" },
  { id: "goal", name: "Goal", icon: "bullseye", category: "resources", important: false, parentId: "resources-parent" },
  { id: "serviceRequest", name: "ServiceRequest", icon: "concierge-bell", category: "resources", important: false, parentId: "resources-parent" },
  { id: "referral", name: "Referral", icon: "exchange-alt", category: "resources", important: false, parentId: "resources-parent" },
  { id: "supplyRequest", name: "SupplyRequest", icon: "box", category: "resources", important: false, parentId: "resources-parent" },
  
  // Notebooks
  { id: "notebooks-parent", name: "Notebooks", icon: "book", category: "notebooks", important: true, isParent: true },
  { id: "createResource", name: "Create resource", icon: "plus-circle", category: "notebooks", important: true, parentId: "notebooks-parent" },
  { id: "sqlOnFhir", name: "SQL on FHIR", icon: "code", category: "notebooks", important: false, parentId: "notebooks-parent" },
  { id: "groups", name: "Groups", icon: "users", category: "notebooks", important: false, parentId: "notebooks-parent" },
  { id: "implementationGuides", name: "Implementation Guides", icon: "book-open", category: "notebooks", important: false, parentId: "notebooks-parent" },
  
  // API
  { id: "api-parent", name: "API", icon: "code", category: "api", important: true, isParent: true },
  { id: "bulkDataApi", name: "Bulk data API", icon: "database", category: "api", important: true, parentId: "api-parent" },
  { id: "graphQL", name: "GraphQL", icon: "project-diagram", category: "api", important: false, parentId: "api-parent" },
  { id: "compartmentApi", name: "Compartment API", icon: "layer-group", category: "api", important: false, parentId: "api-parent" },
  
  // Database
  { id: "database-parent", name: "Database", icon: "database", category: "database", important: true, isParent: true },
  { id: "runningQueries", name: "Running queries", icon: "running", category: "database", important: false, parentId: "database-parent" },
  { id: "tables", name: "Tables", icon: "table", category: "database", important: false, parentId: "database-parent" },
  { id: "viewDefinitions", name: "ViewDefinitions", icon: "eye", category: "database", important: false, parentId: "database-parent" },
  { id: "indexes", name: "Indexes", icon: "sort-alpha-down", category: "database", important: false, parentId: "database-parent" },
  
  // IAM
  { id: "iam-parent", name: "IAM", icon: "user-shield", category: "iam", important: true, isParent: true },
  { id: "overview", name: "Overview", icon: "th-large", category: "iam", important: false, parentId: "iam-parent" },
  { id: "users", name: "Users", icon: "users", category: "iam", important: false, parentId: "iam-parent" },
  { id: "apps", name: "Apps", icon: "mobile-alt", category: "iam", important: false, parentId: "iam-parent" },
  { id: "iamGroups", name: "Groups", icon: "users", category: "iam", important: false, parentId: "iam-parent" },
  { id: "accessPolicies", name: "Access Policies", icon: "lock", category: "iam", important: false, parentId: "iam-parent" },
  { id: "auditLogs", name: "Audit Logs", icon: "clipboard-list", category: "iam", important: false, parentId: "iam-parent" },
  { id: "idProviders", name: "ID Providers", icon: "id-card", category: "iam", important: false, parentId: "iam-parent" },
  { id: "tokenIntrospectors", name: "Token Introspectors", icon: "key", category: "iam", important: false, parentId: "iam-parent" },
  
  // FAR
  { id: "far-parent", name: "FAR", icon: "tasks", category: "far", important: true, isParent: true },
  { id: "structureDefs", name: "StructureDefs", icon: "cubes", category: "far", important: false, parentId: "far-parent" },
  { id: "searchParams", name: "SearchParams", icon: "search", category: "far", important: false, parentId: "far-parent" },
  { id: "farGroups", name: "Groups", icon: "users", category: "far", important: false, parentId: "far-parent" },
  { id: "farImplementationGuides", name: "Implementation Guides", icon: "book-open", category: "far", important: false, parentId: "far-parent" },
  
  // Plugins & Modules
  { id: "plugins-parent", name: "Plugins & Modules", icon: "puzzle-piece", category: "plugins", important: true, isParent: true },
  { id: "hl7v2", name: "HL7 v2", icon: "code", category: "plugins", important: false, parentId: "plugins-parent" },
  { id: "ccdaToFhir", name: "CCDA to FHIR", icon: "exchange-alt", category: "plugins", important: false, parentId: "plugins-parent" },
  { id: "aidboxForms", name: "Aidbox Forms", icon: "wpforms", category: "plugins", important: false, parentId: "plugins-parent" },
  { id: "masterPatientIndex", name: "Master Patient Index", icon: "id-card", category: "plugins", important: false, parentId: "plugins-parent" },
];

// Add category names to menu items for easier rendering
export const menuItemsWithCategoryNames = menuItems.map(item => {
  const category = categories.find(cat => cat.id === item.category);
  return {
    ...item,
    categoryName: category ? category.name : ''
  };
});
