import { ResourceType } from "../types/resources";

export const resourceTypes: ResourceType[] = [
  {
    category: "Clinical",
    typeName: "Patient",
    instancesCount: "1,234,567",
    size: "45.2",
    table: true,
    lastUpdated: "2 hours ago",
    status: "Active",
    description:
      "Demographics and administrative information about an individual",
    version: "5.0.0",
  },
  {
    category: "Clinical",
    typeName: "Observation",
    instancesCount: "5,678,901",
    size: "89.7",
    table: true,
    lastUpdated: "30 minutes ago",
    status: "Active",
    description: "Measurements and simple assertions",
    version: "5.0.0",
  },
  {
    category: "Medications",
    typeName: "MedicationRequest",
    instancesCount: "987,654",
    size: "23.4",
    table: true,
    lastUpdated: "1 hour ago",
    status: "Active",
    description: "Ordering of medication for patient",
    version: "5.0.0",
  },
  {
    category: "Clinical",
    typeName: "Condition",
    instancesCount: "2,345,678",
    size: "34.8",
    table: true,
    lastUpdated: "45 minutes ago",
    status: "Active",
    description: "Detailed information about conditions, problems or diagnoses",
    version: "5.0.0",
  },
  {
    category: "Clinical",
    typeName: "Procedure",
    instancesCount: "789,012",
    size: "19.5",
    table: true,
    lastUpdated: "3 hours ago",
    status: "Active",
    description: "Actions that were or will be performed on the patient",
    version: "5.0.0",
  },
  {
    category: "Clinical",
    typeName: "AllergyIntolerance",
    instancesCount: "456,789",
    size: "12.3",
    table: true,
    lastUpdated: "1 day ago",
    status: "Active",
    description: "Allergy or Intolerance (generally: risk of adverse reaction)",
    version: "5.0.0",
  },
  {
    category: "Workflow",
    typeName: "Appointment",
    instancesCount: "345,678",
    size: "8.9",
    table: true,
    lastUpdated: "4 hours ago",
    status: "Active",
    description: "A booking of a healthcare event",
    version: "5.0.0",
  },
  {
    category: "Clinical",
    typeName: "DiagnosticReport",
    instancesCount: "890,123",
    size: "67.8",
    table: true,
    lastUpdated: "2 days ago",
    status: "Active",
    description: "Findings and interpretation of diagnostic tests",
    version: "5.0.0",
  },
  {
    category: "Custom",
    typeName: "CustomPatientMetrics",
    instancesCount: "123,456",
    size: "5.6",
    table: true,
    lastUpdated: "1 week ago",
    status: "Draft",
    description: "Custom extension for patient metrics",
    version: "1.0.0",
  },
  {
    category: "System",
    typeName: "AuditEvent",
    instancesCount: "4,567,890",
    size: "156.7",
    table: true,
    lastUpdated: "5 minutes ago",
    status: "Active",
    description: "Record of security relevant events",
    version: "5.0.0",
  },
  {
    category: "Medications",
    typeName: "Medication",
    instancesCount: "234,567",
    size: "7.8",
    table: true,
    lastUpdated: "6 hours ago",
    status: "Outdated",
    description: "Definition of a medication",
    version: "4.0.1",
  },
  {
    category: "Clinical",
    typeName: "CarePlan",
    instancesCount: "567,890",
    size: "15.6",
    table: true,
    lastUpdated: "12 hours ago",
    status: "Active",
    description: "Healthcare plan for patient or group",
    version: "5.0.0",
  },
];
