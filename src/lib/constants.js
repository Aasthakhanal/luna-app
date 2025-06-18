export const BASE_URL = "http://localhost:3000";

export const Role = {
  USER: "USER",
  ADMIN: "ADMIN",
};

export const OtpType = {
  REGISTRATION: "registration",
  RESET: "reset",
};

export const FlowLevel = {
  SPOTTING: "spotting",
  LIGHT: "light",
  MEDIUM: "medium",
  HEAVY: "heavy",
};

export const IrregularityType = {
  SHORT_CYCLE: "short_cycle",
  LONG_CYCLE: "long_cycle",
  MISSED_PERIOD: "missed_period",
  HEAVY_FLOW: "heavy_flow",
  LIGHT_FLOW: "light_flow",
  OTHER: "other",
};

export const roleOptions = [
  { value: Role.USER, label: "User" },
  { value: Role.ADMIN, label: "Admin" },
];

export const otpTypeOptions = [
  { value: OtpType.REGISTRATION, label: "Registration" },
  { value: OtpType.RESET, label: "Reset" },
];

export const flowLevelOptions = [
  { value: FlowLevel.SPOTTING, label: "Spotting" },
  { value: FlowLevel.LIGHT, label: "Light" },
  { value: FlowLevel.MEDIUM, label: "Medium" },
  { value: FlowLevel.HEAVY, label: "Heavy" },
];

export const irregularityOptions = [
  { value: IrregularityType.SHORT_CYCLE, label: "Short Cycle" },
  { value: IrregularityType.LONG_CYCLE, label: "Long Cycle" },
  { value: IrregularityType.MISSED_PERIOD, label: "Missed Period" },
  { value: IrregularityType.HEAVY_FLOW, label: "Heavy Flow" },
  { value: IrregularityType.LIGHT_FLOW, label: "Light Flow" },
  { value: IrregularityType.OTHER, label: "Other" },
];
